"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../utils/errorHandler");
const User_1 = __importDefault(require("../models/User"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new errorHandler_1.ApiError(401, 'Authentication required');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            throw new errorHandler_1.ApiError(401, 'User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new errorHandler_1.ApiError(401, 'Please authenticate'));
    }
};
exports.auth = auth;
const router = express_1.default.Router();
// Google OAuth route
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Google OAuth callback route
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    // Successful authentication
    res.json({ success: true, user: req.user });
});
exports.default = router;
