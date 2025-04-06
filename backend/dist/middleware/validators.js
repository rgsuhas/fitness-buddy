"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = exports.ApiError = void 0;
const express_validator_1 = require("express-validator");
class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.ApiError = ApiError;
const validateResults = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        next(new ApiError(400, 'Validation Error', errors.array()));
        return;
    }
    next();
};
exports.validateRegister = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    validateResults,
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    validateResults,
];
