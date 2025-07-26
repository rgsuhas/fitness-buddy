import express from 'express';
import { createWorkout, getWorkouts, toggleLike } from '../controllers/workoutController';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, createWorkout);
router.get('/', getWorkouts);
router.post('/:id/like', protect, toggleLike);

export default router;