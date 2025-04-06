"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../utils/errorHandler");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};
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
        const token = generateToken(user.id);
        res.status(201).json({
            success: true,
            data: {
                user,
                token,
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
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new errorHandler_1.ApiError(401, 'Invalid credentials');
        }
        const token = generateToken(user.id);
        res.json({
            success: true,
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user.id);
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
