"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../utils/errorHandler");
const validateResults = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errorHandler_1.ApiError(400, 'Validation Error', errors.array());
    }
    next();
};
exports.validateRegister = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .trim(),
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .escape(),
    validateResults
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim(),
    validateResults
];
