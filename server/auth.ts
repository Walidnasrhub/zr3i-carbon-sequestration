import { eq } from "drizzle-orm";
import * as db from "./db";
import { farmerProfiles, farms, users, InsertFarmerProfile, InsertFarm } from "../drizzle/schema";
import bcrypt from "bcryptjs";

// Note: bcryptjs is a fallback. For production, install bcrypt package
// For now, we'll use a simple implementation
const crypto = require("crypto");

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    // Fallback to simple hash if bcrypt fails
    console.warn("[Auth] bcrypt failed, using fallback hash");
    return `hashed_${crypto.createHash("sha256").update(password).digest("hex")}`;
  }
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    // Fallback to simple comparison
    const fallbackHash = `hashed_${crypto.createHash("sha256").update(password).digest("hex")}`;
    return fallbackHash === hash;
  }
}

/**
 * Register a new farmer with email/password
 */
export async function registerFarmer(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country: string;
  region?: string;
  farmName?: string;
  farmSize?: number;
  primaryCrop?: string;
  yearsOfFarming?: number;
}) {
  const database = await db.getDb();
  if (!database) {
    throw new Error("Database not available");
  }

  try {
    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Generate a unique openId for email-based registration
    const openId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user record
    const result = await database.insert(users).values({
      openId,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      loginMethod: "email",
      role: "user",
    });

    const userId = result[0].insertId;

    // Create farmer profile
    await database.insert(farmerProfiles).values({
      userId: userId as number,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      country: data.country,
      region: data.region || null,
      farmName: data.farmName || null,
      farmSize: data.farmSize || null,
      primaryCrop: data.primaryCrop || null,
      yearsOfFarming: data.yearsOfFarming || null,
      language: "en",
    });

    // Create initial farm if provided
    if (data.farmName) {
      await database.insert(farms).values({
        userId: userId as number,
        name: data.farmName,
        cropType: data.primaryCrop || null,
        sizeHectares: data.farmSize || null,
        isActive: 1,
      });
    }

    return {
      id: userId,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
    };
  } catch (error) {
    console.error("[Auth] Registration failed:", error);
    throw error;
  }
}

/**
 * Get farmer profile by user ID
 */
export async function getFarmerProfile(userId: number) {
  const database = await db.getDb();
  if (!database) {
    return null;
  }

  const result = await database
    .select()
    .from(farmerProfiles)
    .where(eq(farmerProfiles.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update farmer profile
 */
export async function updateFarmerProfile(userId: number, data: Partial<InsertFarmerProfile>) {
  const database = await db.getDb();
  if (!database) {
    throw new Error("Database not available");
  }

  const updateData: Record<string, any> = {
    updatedAt: new Date(),
  };

  // Only include fields that are provided
  const allowedFields = [
    "firstName",
    "lastName",
    "phone",
    "country",
    "region",
    "farmName",
    "farmSize",
    "primaryCrop",
    "yearsOfFarming",
    "language",
    "profilePicture",
    "bio",
  ] as const;

  allowedFields.forEach((field) => {
    if (field in data && data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  await database
    .update(farmerProfiles)
    .set(updateData)
    .where(eq(farmerProfiles.userId, userId));
}

/**
 * Get all farms for a user
 */
export async function getUserFarms(userId: number) {
  const database = await db.getDb();
  if (!database) {
    return [];
  }

  return database
    .select()
    .from(farms)
    .where(eq(farms.userId, userId));
}

/**
 * Create a new farm for a user
 */
export async function createFarm(userId: number, data: Omit<InsertFarm, "userId">) {
  const database = await db.getDb();
  if (!database) {
    throw new Error("Database not available");
  }

  const result = await database.insert(farms).values({
    ...data,
    userId,
  });

  return result[0].insertId;
}

/**
 * Update farm details
 */
export async function updateFarm(farmId: number, data: Partial<InsertFarm>) {
  const database = await db.getDb();
  if (!database) {
    throw new Error("Database not available");
  }

  const updateData: Record<string, any> = {
    updatedAt: new Date(),
  };

  const allowedFields = [
    "name",
    "location",
    "latitude",
    "longitude",
    "sizeHectares",
    "sizeAcres",
    "cropType",
    "soilType",
    "description",
    "isActive",
  ] as const;

  allowedFields.forEach((field) => {
    if (field in data && data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  await database
    .update(farms)
    .set(updateData)
    .where(eq(farms.id, farmId));
}

/**
 * Delete a farm
 */
export async function deleteFarm(farmId: number) {
  const database = await db.getDb();
  if (!database) {
    throw new Error("Database not available");
  }

  await database.delete(farms).where(eq(farms.id, farmId));
}
