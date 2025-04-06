"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User")); // Changed import to use default export
const errorHandler_1 = require("../utils/errorHandler");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            throw new errorHandler_1.ApiError(401, 'Not authorized to access this route');
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            throw new errorHandler_1.ApiError(401, 'User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new errorHandler_1.ApiError(401, 'Not authorized to access this route'));
    }
};
exports.protect = protect;
