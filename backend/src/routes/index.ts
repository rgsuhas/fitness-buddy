import express from 'express';
import authRoutes from './auth.routes';
import exerciseRoutes from './exerciseRoutes';
import workoutRoutes from './workoutRoutes';
import communityRoutes from './communityRoutes';
import messageRoutes from './messageRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/workouts', workoutRoutes);
router.use('/community', communityRoutes);
router.use('/messages', messageRoutes);

export default router;