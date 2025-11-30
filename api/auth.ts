import { VercelRequest, VercelResponse } from "@vercel/node";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

// Simple in-memory user store for demo (replace with database in production)
const users: Map<string, any> = new Map();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  country: string;
  phone?: string;
  region?: string;
  farmName?: string;
  farmSize?: number;
  primaryCrop?: string;
  yearsOfFarming?: number;
  createdAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  phone?: string;
  region?: string;
  farmName?: string;
  farmSize?: number;
  primaryCrop?: string;
  yearsOfFarming?: number;
}

// Hash password using simple crypto (for demo)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Verify password
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate JWT token
function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token
function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  if (req.method === "POST") {
    if (action === "register") {
      return handleRegister(req, res);
    } else if (action === "login") {
      return handleLogin(req, res);
    } else if (action === "logout") {
      return handleLogout(req, res);
    }
  } else if (req.method === "GET") {
    if (action === "me") {
      return handleGetCurrentUser(req, res);
    }
  }

  res.status(404).json({ error: "Not found" });
}

async function handleRegister(req: VercelRequest, res: VercelResponse) {
  try {
    const data: RegisterRequest = req.body;

    // Validation
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.country) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    if (data.password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find((u) => u.email === data.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already exists",
      });
    }

    // Create new user
    const userId = crypto.randomUUID();
    const user: User = {
      id: userId,
      email: data.email,
      password: hashPassword(data.password),
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      country: data.country,
      phone: data.phone,
      region: data.region,
      farmName: data.farmName,
      farmSize: data.farmSize,
      primaryCrop: data.primaryCrop,
      yearsOfFarming: data.yearsOfFarming,
      createdAt: new Date().toISOString(),
    };

    users.set(userId, user);

    // Generate JWT token
    const token = generateToken(userId, data.email);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
      },
    });
  } catch (error) {
    console.error("[Auth Register] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = Array.from(users.values()).find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
      },
    });
  } catch (error) {
    console.error("[Auth Login] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
}

async function handleLogout(req: VercelRequest, res: VercelResponse) {
  // Logout is handled client-side by removing the token
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

async function handleGetCurrentUser(req: VercelRequest, res: VercelResponse) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    const user = users.get(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
      },
    });
  } catch (error) {
    console.error("[Auth GetMe] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get user",
    });
  }
}
