import express from 'express';
import { createExercise, getExercises } from '../controllers/exerciseController';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .post(protect, createExercise)
  .get(getExercises);

export default router;