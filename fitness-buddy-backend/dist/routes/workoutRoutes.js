"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workoutController_1 = require("../controllers/workoutController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.auth, workoutController_1.createWorkout);
router.get('/', workoutController_1.getWorkouts);
router.post('/:id/like', auth_1.auth, workoutController_1.toggleLike);
exports.default = router;
