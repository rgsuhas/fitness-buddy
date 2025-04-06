import express from "express";
import passport from "passport";

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
    console.log("Google OAuth callback hit");
    console.log("Authenticated user:", req.user);
    res.json({ success: true, user: req.user });
  }
);

export default router;