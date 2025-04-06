"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
// Google OAuth route
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Google OAuth callback route
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    // Successful authentication
    res.json({ success: true, user: req.user });
});
exports.default = router;
