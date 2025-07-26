import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

// Add debug logging
console.log('Google OAuth Configuration:');
console.log('Client ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('Client Secret exists:', !!process.env.GOOGLE_CLIENT_SECRET);

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing required environment variables:');
  console.error('GOOGLE_CLIENT_ID:', !process.env.GOOGLE_CLIENT_ID ? 'missing' : 'present');
  console.error('GOOGLE_CLIENT_SECRET:', !process.env.GOOGLE_CLIENT_SECRET ? 'missing' : 'present');
  process.exit(1);
}

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        let user = await User.findOne({
          $or: [
            { email },
            { googleId: profile.id }
          ]
        });

        if (user) {
          // Update existing user's information
          user.googleId = profile.id;
          user.name = profile.displayName || 'User';
          user.email = email;
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || 'User',
            email,
            role: "user",
            fitnessGoals: [],
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        return done(error, false);
      }
    }
  )
);

export default passport;