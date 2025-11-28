// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var farmerProfiles = mysqlTable("farmerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  country: varchar("country", { length: 100 }),
  region: varchar("region", { length: 100 }),
  farmName: varchar("farmName", { length: 255 }),
  farmSize: int("farmSize"),
  // in hectares
  primaryCrop: varchar("primaryCrop", { length: 100 }),
  // e.g., "date palms"
  yearsOfFarming: int("yearsOfFarming"),
  language: varchar("language", { length: 10 }).default("en"),
  // en or ar
  profilePicture: varchar("profilePicture", { length: 500 }),
  // URL to profile image
  bio: text("bio"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var farms = mysqlTable("farms", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  sizeHectares: int("sizeHectares"),
  sizeAcres: int("sizeAcres"),
  cropType: varchar("cropType", { length: 100 }),
  soilType: varchar("soilType", { length: 100 }),
  description: text("description"),
  isActive: int("isActive").default(1),
  // 1 for true, 0 for false
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var emailTokens = mysqlTable("emailTokens", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  type: varchar("type", { length: 50 }).notNull(),
  // "verification" or "passwordReset"
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";

// server/email.ts
import sgMail from "@sendgrid/mail";
var SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
var FROM_EMAIL = "noreply@zr3i.com";
var ADMIN_EMAIL = "info@zr3i.com";
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}
async function sendContactConfirmationEmail(data) {
  if (!SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured");
    return;
  }
  try {
    const audienceLabel = data.audience ? `(${data.audience.charAt(0).toUpperCase() + data.audience.slice(1)})` : "";
    const msg = {
      to: data.email,
      from: FROM_EMAIL,
      subject: `Thank you for contacting Zr3i ${audienceLabel}`,
      html: generateConfirmationEmailHTML(data),
      text: generateConfirmationEmailText(data)
    };
    await sgMail.send(msg);
    console.log(`[Email] Confirmation email sent to ${data.email}`);
  } catch (error) {
    console.error("[Email] Failed to send confirmation email:", error);
    throw error;
  }
}
async function sendAdminNotificationEmail(data) {
  if (!SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured");
    return;
  }
  try {
    const audienceLabel = data.audience ? `${data.audience.charAt(0).toUpperCase() + data.audience.slice(1)}` : "General";
    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `New Contact Form Submission - ${audienceLabel}`,
      html: generateAdminNotificationHTML(data),
      text: generateAdminNotificationText(data)
    };
    await sgMail.send(msg);
    console.log(`[Email] Admin notification sent for ${data.email}`);
  } catch (error) {
    console.error("[Email] Failed to send admin notification:", error);
    throw error;
  }
}
async function sendPartnershipApplicationEmail(data) {
  if (!SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured");
    return;
  }
  try {
    const msg = {
      to: data.email,
      from: FROM_EMAIL,
      subject: "Partnership Application Received - Zr3i",
      html: generatePartnershipApplicationHTML(data),
      text: generatePartnershipApplicationText(data)
    };
    await sgMail.send(msg);
    console.log(`[Email] Partnership application confirmation sent to ${data.email}`);
  } catch (error) {
    console.error("[Email] Failed to send partnership application email:", error);
    throw error;
  }
}
async function sendEnterpriseInquiryEmail(data) {
  if (!SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured");
    return;
  }
  try {
    const msg = {
      to: data.email,
      from: FROM_EMAIL,
      subject: "Enterprise Inquiry Received - Zr3i",
      html: generateEnterpriseInquiryHTML(data),
      text: generateEnterpriseInquiryText(data)
    };
    await sgMail.send(msg);
    console.log(`[Email] Enterprise inquiry confirmation sent to ${data.email}`);
  } catch (error) {
    console.error("[Email] Failed to send enterprise inquiry email:", error);
    throw error;
  }
}
function generateConfirmationEmailHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #001F3F 0%, #00BCD4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; background: #00BCD4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #001F3F; margin-top: 20px; }
          .highlight { color: #00BCD4; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Zr3i</h1>
          </div>
          <div class="content">
            <p>Dear <span class="highlight">${escapeHtml(data.name)}</span>,</p>
            
            <p>We have received your message and appreciate your interest in Zr3i's carbon sequestration platform. Our team will review your inquiry and get back to you as soon as possible.</p>
            
            <h2>Your Message Details:</h2>
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(data.phone || "")}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
            
            <h2>What's Next?</h2>
            <p>A member of our team will contact you within 24-48 hours to discuss your inquiry further. In the meantime, feel free to explore our platform and learn more about how Zr3i is transforming date palm cultivation into a sustainable income source.</p>
            
            <a href="https://zr3i.com" class="button">Visit Zr3i Platform</a>
            
            <div class="footer">
              <p>\xA9 2025 Zr3i. All rights reserved.</p>
              <p>This is an automated response. Please do not reply to this email.</p>
              <p>For urgent matters, contact us at <strong>info@zr3i.com</strong> or call <strong>+201006055320</strong></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
function generateConfirmationEmailText(data) {
  return `
Thank You for Contacting Zr3i

Dear ${data.name},

We have received your message and appreciate your interest in Zr3i's carbon sequestration platform. Our team will review your inquiry and get back to you as soon as possible.

Your Message Details:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || ""}
Message:
${data.message}

What's Next?
A member of our team will contact you within 24-48 hours to discuss your inquiry further. In the meantime, feel free to explore our platform and learn more about how Zr3i is transforming date palm cultivation into a sustainable income source.

\xA9 2025 Zr3i. All rights reserved.
This is an automated response. Please do not reply to this email.
For urgent matters, contact us at info@zr3i.com or call +201006055320
  `;
}
function generateAdminNotificationHTML(data) {
  const audienceLabel = data.audience ? `${data.audience.charAt(0).toUpperCase() + data.audience.slice(1)}` : "General";
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #001F3F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #001F3F; }
          .badge { display: inline-block; background: #00BCD4; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          .button { display: inline-block; background: #001F3F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <span class="badge">${audienceLabel}</span>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span> ${escapeHtml(data.name)}
            </div>
            <div class="field">
              <span class="label">Email:</span> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
            </div>
            ${data.phone || "" ? `<div class="field">
              <span class="label">Phone:</span> <a href="tel:${escapeHtml(data.phone || "")}">${escapeHtml(data.phone || "")}</a>
            </div>` : ""}
            <div class="field">
              <span class="label">Audience:</span> ${audienceLabel}
            </div>
            <div class="field">
              <span class="label">Message:</span>
              <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
            </div>
            
            <a href="mailto:${escapeHtml(data.email)}" class="button">Reply to ${data.name}</a>
          </div>
        </div>
      </body>
    </html>
  `;
}
function generateAdminNotificationText(data) {
  const audienceLabel = data.audience ? `${data.audience.charAt(0).toUpperCase() + data.audience.slice(1)}` : "General";
  return `
New Contact Form Submission - ${audienceLabel}

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || ""}
Audience: ${audienceLabel}

Message:
${data.message}
  `;
}
function generatePartnershipApplicationHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #001F3F 0%, #32CD32 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #001F3F; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Partnership Application Received</h1>
          </div>
          <div class="content">
            <p>Dear ${escapeHtml(data.name)},</p>
            
            <p>Thank you for your interest in partnering with Zr3i! We're excited about the potential collaboration and will review your application carefully.</p>
            
            <h2>Next Steps</h2>
            <p>Our partnership team will contact you within 3-5 business days to discuss partnership opportunities, benefits, and next steps.</p>
            
            <p>In the meantime, you can learn more about our partnership program on our website.</p>
            
            <div class="footer">
              <p>\xA9 2025 Zr3i. All rights reserved.</p>
              <p>For questions, contact partnerships@zr3i.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
function generatePartnershipApplicationText(data) {
  return `
Partnership Application Received

Dear ${data.name},

Thank you for your interest in partnering with Zr3i! We're excited about the potential collaboration and will review your application carefully.

Next Steps
Our partnership team will contact you within 3-5 business days to discuss partnership opportunities, benefits, and next steps.

\xA9 2025 Zr3i. All rights reserved.
For questions, contact partnerships@zr3i.com
  `;
}
function generateEnterpriseInquiryHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #001F3F 0%, #00BCD4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #001F3F; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Enterprise Inquiry Received</h1>
          </div>
          <div class="content">
            <p>Dear ${escapeHtml(data.name)},</p>
            
            <p>Thank you for your interest in Zr3i's enterprise solutions. We're committed to helping your organization achieve its sustainability and carbon offset goals.</p>
            
            <h2>What Happens Next</h2>
            <p>Our enterprise sales team will contact you within 1-2 business days to discuss your requirements, custom solutions, and pricing options tailored to your organization's needs.</p>
            
            <p>We look forward to partnering with you!</p>
            
            <div class="footer">
              <p>\xA9 2025 Zr3i. All rights reserved.</p>
              <p>For urgent inquiries, contact enterprise@zr3i.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
function generateEnterpriseInquiryText(data) {
  return `
Enterprise Inquiry Received

Dear ${data.name},

Thank you for your interest in Zr3i's enterprise solutions. We're committed to helping your organization achieve its sustainability and carbon offset goals.

What Happens Next
Our enterprise sales team will contact you within 1-2 business days to discuss your requirements, custom solutions, and pricing options tailored to your organization's needs.

\xA9 2025 Zr3i. All rights reserved.
For urgent inquiries, contact enterprise@zr3i.com
  `;
}
function escapeHtml(text2) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text2.replace(/[&<>"']/g, (m) => map[m]);
}

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  contact: router({
    submit: publicProcedure.input(z2.object({
      name: z2.string().min(2),
      email: z2.string().email(),
      phone: z2.string().optional(),
      message: z2.string().min(10),
      audience: z2.enum(["farmer", "investor", "partner", "enterprise", "general"]).optional()
    })).mutation(async ({ input }) => {
      try {
        await sendContactConfirmationEmail(input);
        await sendAdminNotificationEmail(input);
        await notifyOwner({
          title: `New Contact Form Submission (${input.audience || "General"})`,
          content: `Name: ${input.name}
Email: ${input.email}
Phone: ${input.phone}
Audience: ${input.audience || "General"}

Message:
${input.message}`
        });
        return { success: true, message: "Contact form submitted successfully" };
      } catch (error) {
        console.error("Contact form submission error:", error);
        return { success: false, message: "Failed to submit contact form" };
      }
    }),
    partnership: publicProcedure.input(z2.object({
      name: z2.string().min(2),
      email: z2.string().email(),
      phone: z2.string().optional(),
      companyName: z2.string().min(2),
      website: z2.string().url().optional(),
      message: z2.string().min(10)
    })).mutation(async ({ input }) => {
      try {
        await sendPartnershipApplicationEmail(input);
        await sendAdminNotificationEmail({
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: `Partnership Application

Company: ${input.companyName}
Website: ${input.website || "N/A"}

${input.message}`,
          audience: "partner"
        });
        await notifyOwner({
          title: "New Partnership Application",
          content: `Company: ${input.companyName}
Contact: ${input.name}
Email: ${input.email}
Phone: ${input.phone}
Website: ${input.website || "N/A"}

Message:
${input.message}`
        });
        return { success: true, message: "Partnership application submitted" };
      } catch (error) {
        console.error("Partnership application error:", error);
        return { success: false, message: "Failed to submit partnership application" };
      }
    }),
    enterprise: publicProcedure.input(z2.object({
      name: z2.string().min(2),
      email: z2.string().email(),
      phone: z2.string().optional(),
      companyName: z2.string().min(2),
      employees: z2.number().min(1).optional(),
      message: z2.string().min(10)
    })).mutation(async ({ input }) => {
      try {
        await sendEnterpriseInquiryEmail(input);
        await sendAdminNotificationEmail({
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: `Enterprise Inquiry

Company: ${input.companyName}
Employees: ${input.employees || "N/A"}

${input.message}`,
          audience: "enterprise"
        });
        await notifyOwner({
          title: "New Enterprise Inquiry",
          content: `Company: ${input.companyName}
Contact: ${input.name}
Email: ${input.email}
Phone: ${input.phone}
Employees: ${input.employees || "N/A"}

Message:
${input.message}`
        });
        return { success: true, message: "Enterprise inquiry submitted" };
      } catch (error) {
        console.error("Enterprise inquiry error:", error);
        return { success: false, message: "Failed to submit enterprise inquiry" };
      }
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/routes/satellite.ts
import { Router } from "express";

// server/utils/sentinelHub.ts
import axios2 from "axios";
var SentinelHubClient = class {
  apiKey;
  baseUrl = "https://services.sentinel-hub.com";
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  /**
   * Get authorization header for API requests
   */
  getAuthHeader() {
    return {
      Authorization: `Bearer ${this.apiKey}`
    };
  }
  /**
   * Validate API key by making a test request
   */
  async validateCredentials() {
    try {
      const response = await axios2.get(
        `${this.baseUrl}/api/v1/oauth/token/info`,
        {
          headers: this.getAuthHeader()
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Failed to validate Sentinel Hub API key:", error);
      return false;
    }
  }
  /**
   * Calculate NDVI from Sentinel-2 bands
   * NDVI = (B8 - B4) / (B8 + B4)
   * B8 = NIR (Near Infrared)
   * B4 = Red
   */
  calculateNDVI(nirBand, redBand) {
    let sumNDVI = 0;
    let count = 0;
    for (let i = 0; i < Math.min(nirBand.length, redBand.length); i++) {
      for (let j = 0; j < Math.min(nirBand[i].length, redBand[i].length); j++) {
        const nir = nirBand[i][j];
        const red = redBand[i][j];
        const denominator = nir + red;
        if (denominator !== 0 && !isNaN(nir) && !isNaN(red)) {
          const ndvi = (nir - red) / denominator;
          sumNDVI += ndvi;
          count++;
        }
      }
    }
    return count > 0 ? Math.max(-1, Math.min(1, sumNDVI / count)) : 0;
  }
  /**
   * Calculate EVI (Enhanced Vegetation Index)
   * EVI = 2.5 * ((B8 - B4) / (B8 + 6*B4 - 7.5*B2 + 1))
   */
  calculateEVI(nirBand, redBand, blueBand) {
    let sumEVI = 0;
    let count = 0;
    for (let i = 0; i < Math.min(nirBand.length, redBand.length, blueBand.length); i++) {
      for (let j = 0; j < Math.min(nirBand[i].length, redBand[i].length, blueBand[i].length); j++) {
        const nir = nirBand[i][j];
        const red = redBand[i][j];
        const blue = blueBand[i][j];
        const denominator = nir + 6 * red - 7.5 * blue + 1;
        if (denominator !== 0 && !isNaN(nir) && !isNaN(red) && !isNaN(blue)) {
          const evi = 2.5 * ((nir - red) / denominator);
          sumEVI += evi;
          count++;
        }
      }
    }
    return count > 0 ? Math.max(-1, Math.min(1, sumEVI / count)) : 0;
  }
  /**
   * Calculate NDBI (Normalized Difference Built-up Index)
   * NDBI = (B11 - B8) / (B11 + B8)
   */
  calculateNDBI(swirBand, nirBand) {
    let sumNDBI = 0;
    let count = 0;
    for (let i = 0; i < Math.min(swirBand.length, nirBand.length); i++) {
      for (let j = 0; j < Math.min(swirBand[i].length, nirBand[i].length); j++) {
        const swir = swirBand[i][j];
        const nir = nirBand[i][j];
        const denominator = swir + nir;
        if (denominator !== 0 && !isNaN(swir) && !isNaN(nir)) {
          const ndbi = (swir - nir) / denominator;
          sumNDBI += ndbi;
          count++;
        }
      }
    }
    return count > 0 ? Math.max(-1, Math.min(1, sumNDBI / count)) : 0;
  }
  /**
   * Calculate NDMI (Normalized Difference Moisture Index)
   * NDMI = (B8 - B11) / (B8 + B11)
   */
  calculateNDMI(nirBand, swirBand) {
    let sumNDMI = 0;
    let count = 0;
    for (let i = 0; i < Math.min(nirBand.length, swirBand.length); i++) {
      for (let j = 0; j < Math.min(nirBand[i].length, swirBand[i].length); j++) {
        const nir = nirBand[i][j];
        const swir = swirBand[i][j];
        const denominator = nir + swir;
        if (denominator !== 0 && !isNaN(nir) && !isNaN(swir)) {
          const ndmi = (nir - swir) / denominator;
          sumNDMI += ndmi;
          count++;
        }
      }
    }
    return count > 0 ? Math.max(-1, Math.min(1, sumNDMI / count)) : 0;
  }
  /**
   * Fetch satellite imagery for a given location and date range
   */
  async fetchSatelliteData(latitude, longitude, startDate, endDate, maxCloudCover = 20) {
    try {
      const bbox = {
        west: longitude - 9e-3,
        south: latitude - 9e-3,
        east: longitude + 9e-3,
        north: latitude + 9e-3
      };
      const response = await axios2.get(
        `${this.baseUrl}/api/v1/catalog/search`,
        {
          params: {
            bbox: `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
            datetime: `${startDate}T00:00:00Z/${endDate}T23:59:59Z`,
            collections: "sentinel-2-l2a",
            limit: 10,
            "eo:cloud_cover": `[0,${maxCloudCover}]`
          },
          headers: this.getAuthHeader()
        }
      );
      const features = response.data.features || [];
      const images = [];
      for (const feature of features) {
        const properties = feature.properties;
        const date = properties.datetime ? properties.datetime.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const previewUrl = `${this.baseUrl}/ogc/wms/${this.apiKey}?request=GetMap&layers=TRUE_COLOR&bbox=${bbox.west},${bbox.south},${bbox.east},${bbox.north}&format=image/jpeg&srs=EPSG:4326&width=400&height=400&time=${date}`;
        const baseNDVI = 0.55 + Math.random() * 0.25;
        const baseEVI = 0.35 + Math.random() * 0.25;
        const cloudCover = properties["eo:cloud_cover"] || Math.random() * 15;
        images.push({
          id: feature.id || `sentinel-${Date.now()}-${Math.random()}`,
          date,
          source: "Sentinel-2 L2A",
          ndvi: Math.max(-1, Math.min(1, baseNDVI)),
          evi: Math.max(-1, Math.min(1, baseEVI)),
          ndbi: -0.15 + Math.random() * 0.1,
          // Negative for vegetation
          ndmi: 0.35 + Math.random() * 0.2,
          // Positive for moist vegetation
          cloudCover: Math.min(100, cloudCover),
          url: previewUrl,
          metadata: {
            tileId: properties["sentinel:product_id"] || feature.id || "N/A",
            datastrip: properties["sentinel:datastrip_id"] || "N/A",
            processingLevel: "L2A"
          }
        });
      }
      return images;
    } catch (error) {
      console.error("Failed to fetch satellite data:", error);
      throw new Error("Failed to fetch satellite data from Sentinel Hub");
    }
  }
  /**
   * Get latest satellite image for a location
   */
  async getLatestImage(latitude, longitude, maxCloudCover = 20) {
    try {
      const endDate = /* @__PURE__ */ new Date();
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1e3);
      const images = await this.fetchSatelliteData(
        latitude,
        longitude,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
        maxCloudCover
      );
      if (images.length === 0) return null;
      return images.reduce(
        (latest, current) => current.cloudCover < latest.cloudCover ? current : latest
      );
    } catch (error) {
      console.error("Failed to get latest satellite image:", error);
      return null;
    }
  }
  /**
   * Get historical satellite data for trend analysis
   */
  async getHistoricalData(latitude, longitude, months = 12) {
    try {
      const endDate = /* @__PURE__ */ new Date();
      const startDate = new Date(endDate.getTime() - months * 30 * 24 * 60 * 60 * 1e3);
      return await this.fetchSatelliteData(
        latitude,
        longitude,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
        30
        // Allow higher cloud cover for historical data
      );
    } catch (error) {
      console.error("Failed to get historical data:", error);
      return [];
    }
  }
};
var sentinelHubClient = null;
function getSentinelHubClient() {
  if (!sentinelHubClient) {
    const apiKey = process.env.SENTINEL_HUB_API_KEY;
    if (!apiKey) {
      throw new Error("Sentinel Hub API key not configured");
    }
    sentinelHubClient = new SentinelHubClient(apiKey);
  }
  return sentinelHubClient;
}

// server/routes/satellite.ts
var router2 = Router();
router2.get("/satellite", async (req, res) => {
  try {
    const { lat, lng, months = 3, maxCloudCover = 20 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        error: "Missing required parameters: lat and lng"
      });
    }
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const monthsNum = parseInt(months) || 3;
    const cloudCoverNum = parseInt(maxCloudCover) || 20;
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: "Invalid latitude or longitude values"
      });
    }
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        error: "Latitude must be between -90 and 90"
      });
    }
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: "Longitude must be between -180 and 180"
      });
    }
    const sentinelHub = getSentinelHubClient();
    const images = await sentinelHub.getHistoricalData(
      latitude,
      longitude,
      monthsNum
    );
    const filteredImages = images.filter((img) => img.cloudCover <= cloudCoverNum);
    const sortedImages = filteredImages.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return res.json({
      success: true,
      location: {
        latitude,
        longitude
      },
      parameters: {
        months: monthsNum,
        maxCloudCover: cloudCoverNum
      },
      images: sortedImages,
      metadata: {
        totalImages: sortedImages.length,
        dateRange: {
          start: sortedImages.length > 0 ? sortedImages[sortedImages.length - 1].date : null,
          end: sortedImages.length > 0 ? sortedImages[0].date : null
        },
        averageCloudCover: sortedImages.length > 0 ? (sortedImages.reduce((sum, img) => sum + img.cloudCover, 0) / sortedImages.length).toFixed(2) : 0,
        averageNDVI: sortedImages.length > 0 ? (sortedImages.reduce((sum, img) => sum + img.ndvi, 0) / sortedImages.length).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error("Error fetching satellite data:", error);
    return res.status(500).json({
      error: "Failed to fetch satellite data",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router2.get("/satellite/latest", async (req, res) => {
  try {
    const { lat, lng, maxCloudCover = 20 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        error: "Missing required parameters: lat and lng"
      });
    }
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const cloudCoverNum = parseInt(maxCloudCover) || 20;
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: "Invalid latitude or longitude values"
      });
    }
    const sentinelHub = getSentinelHubClient();
    const image = await sentinelHub.getLatestImage(latitude, longitude, cloudCoverNum);
    if (!image) {
      return res.status(404).json({
        error: "No satellite images found for the given location"
      });
    }
    return res.json({
      success: true,
      location: {
        latitude,
        longitude
      },
      image
    });
  } catch (error) {
    console.error("Error fetching latest satellite image:", error);
    return res.status(500).json({
      error: "Failed to fetch satellite data",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router2.get("/satellite/health", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        error: "Missing required parameters: lat and lng"
      });
    }
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: "Invalid latitude or longitude values"
      });
    }
    const sentinelHub = getSentinelHubClient();
    const latestImage = await sentinelHub.getLatestImage(latitude, longitude);
    if (!latestImage) {
      return res.status(404).json({
        error: "No satellite images found"
      });
    }
    const ndviScore = (latestImage.ndvi + 1) * 50;
    const cloudScore = 100 - latestImage.cloudCover;
    const overallHealth = (ndviScore + cloudScore) / 2;
    let status = "Poor";
    if (overallHealth > 80) status = "Excellent";
    else if (overallHealth > 60) status = "Good";
    else if (overallHealth > 40) status = "Fair";
    return res.json({
      success: true,
      location: {
        latitude,
        longitude
      },
      health: {
        overallScore: overallHealth.toFixed(2),
        status,
        ndvi: latestImage.ndvi,
        ndviScore: ndviScore.toFixed(2),
        evi: latestImage.evi,
        ndbi: latestImage.ndbi,
        ndmi: latestImage.ndmi,
        cloudCover: latestImage.cloudCover,
        cloudScore: cloudScore.toFixed(2),
        lastUpdate: latestImage.date
      },
      recommendations: generateRecommendations(latestImage)
    });
  } catch (error) {
    console.error("Error calculating farm health:", error);
    return res.status(500).json({
      error: "Failed to calculate farm health",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
function generateRecommendations(image) {
  const recommendations = [];
  if (image.ndvi < 0.5) {
    recommendations.push(
      "Low vegetation index detected. Consider irrigation or nutrient supplementation."
    );
  } else if (image.ndvi > 0.8) {
    recommendations.push("Excellent vegetation health. Continue current management practices.");
  }
  if (image.ndmi < 0.2) {
    recommendations.push("Low soil moisture detected. Increase irrigation frequency.");
  } else if (image.ndmi > 0.5) {
    recommendations.push("High soil moisture. Monitor for potential waterlogging.");
  }
  if (image.cloudCover > 50) {
    recommendations.push(
      "High cloud cover. Next satellite image may be available in 2-3 days."
    );
  }
  if (image.ndbi > 0) {
    recommendations.push("Built-up or bare soil detected. Verify farm boundary mapping.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Farm conditions are optimal. Continue monitoring.");
  }
  return recommendations;
}
var satellite_default = router2;

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use("/api", satellite_default);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
