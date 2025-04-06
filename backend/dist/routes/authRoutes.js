"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authController_1 = require("../controllers/authController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validators_middleware_1 = require("../middleware/validators.middleware");
const router = express_1.default.Router();
// Basic auth routes
router.post('/register', validators_middleware_1.validateRegister, authController_1.register);
router.post('/login', validators_middleware_1.validateLogin, authController_1.login);
router.get('/me', auth_middleware_1.protect, authController_1.getMe);
// Google OAuth routes
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => {
    if (!req.user) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/error`);
    }
    const token = jsonwebtoken_1.default.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
});
exports.default = router;
