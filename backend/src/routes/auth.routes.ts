import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login, verify } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middleware/validators.middleware';
import { User } from '../models/user.model';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secure_jwt_secret';

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/success?token=${token}`);
  }
);

// Verify token and return user data
router.get('/verify', verify);

export default router;