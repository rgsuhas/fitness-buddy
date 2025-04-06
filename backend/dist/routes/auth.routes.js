"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validators_1 = require("../middleware/validators");
const router = (0, express_1.Router)();
router.post('/register', validators_1.validateRegister, auth_controller_1.register);
router.post('/login', validators_1.validateLogin, auth_controller_1.login);
exports.default = router;
