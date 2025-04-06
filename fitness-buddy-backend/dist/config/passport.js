"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already exists in the database
        let user = await User_1.default.findOne({ email: profile.emails?.[0].value });
        if (!user) {
            // If the user doesn't exist, create a new one
            user = new User_1.default({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0].value,
                role: "user",
                fitnessGoals: [], // Default empty fitness goals
            });
            await user.save();
        }
        return done(null, user);
    }
    catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        return done(error, false);
    }
}));
exports.default = passport_1.default;
