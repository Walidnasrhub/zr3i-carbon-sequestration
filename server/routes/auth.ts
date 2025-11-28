import { Router, Request, Response } from "express";
import { registerFarmer, verifyPassword, hashPassword } from "../auth";
import { z } from "zod";

const authRouter = Router();

// Validation schema for registration
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().optional(),
  region: z.string().optional(),
  farmName: z.string().optional(),
  farmSize: z.number().optional(),
  primaryCrop: z.string().optional(),
  yearsOfFarming: z.number().optional(),
});

/**
 * POST /api/auth/register
 * Register a new farmer account
 */
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const data = registrationSchema.parse(req.body);

    // Register the farmer
    const user = await registerFarmer(data);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.flatten(),
      });
      return;
    }

    console.error("[Auth] Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // TODO: Implement login logic
    // 1. Find user by email
    // 2. Verify password
    // 3. Create JWT token
    // 4. Set session cookie
    // 5. Return user data

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("[Auth] Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
authRouter.post("/logout", (req: Request, res: Response) => {
  // Clear session cookie
  res.clearCookie("session");
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * GET /api/auth/me
 * Get current user info
 */
authRouter.get("/me", (req: Request, res: Response) => {
  // TODO: Implement middleware to check authentication
  // Return current user from session/JWT

  res.status(401).json({
    success: false,
    message: "Not authenticated",
  });
});

export default authRouter;
