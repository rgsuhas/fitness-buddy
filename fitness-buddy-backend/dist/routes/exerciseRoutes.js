"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exerciseController_1 = require("../controllers/exerciseController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .post(auth_middleware_1.protect, exerciseController_1.createExercise)
    .get(exerciseController_1.getExercises);
exports.default = router;
