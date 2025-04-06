import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth.middleware';
import { validateRegister, validateLogin } from '../middleware/validators.middleware';
import { IUser } from '../models/User';

const router = express.Router();

// Basic auth routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req: express.Request & { user?: IUser }, res: express.Response) => {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/auth/error`);
    }

    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

export default router;