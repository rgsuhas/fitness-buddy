import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errorHandler';
import User, { IUser } from '../models/User';
import express from "express";
import passport from "passport";

// Update the type declaration to extend Express User
declare global {
  namespace Express {
    interface User extends IUser {}  // Extend the base User interface
    interface Request {
      user?: User;  // Now using the extended User type
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Please authenticate'));
  }
};

const router = express.Router();

// Google OAuth route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Successful authentication
    res.json({ success: true, user: req.user });
  }
);

export default router;