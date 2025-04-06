"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../utils/errorHandler");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            throw new errorHandler_1.ApiError(400, 'Email already registered');
        }
        const user = await User_1.default.create({
            email,
            password,
            name,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            throw new errorHandler_1.ApiError(401, 'Invalid credentials');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new errorHandler_1.ApiError(401, 'Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
