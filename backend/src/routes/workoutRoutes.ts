import express from 'express';
import { createWorkout, getWorkouts, toggleLike } from '../controllers/workoutController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createWorkout);
router.get('/', getWorkouts);
router.post('/:id/like', auth, toggleLike);

export default router;