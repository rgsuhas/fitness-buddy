"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
            ...(err.errors && { errors: err.errors })
        }
    });
};
exports.errorHandler = errorHandler;
class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
