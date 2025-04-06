import { Request, Response, NextFunction } from 'express';
import Workout from '../models/Workout';
import { ApiError } from '../utils/errorHandler';

export const createWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workout = await Workout.create({
      ...req.body,
      creator: req.user!.id,
    });
    
    await workout.populate('exercises.exercise');
    res.status(201).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkouts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { difficulty, category, isPublic } = req.query;
    
    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true';

    const workouts = await Workout.find(filter)
      .populate('exercises.exercise')
      .populate('creator', 'name');
      
    res.json({
      success: true,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      throw new ApiError(404, 'Workout not found');
    }

    const likeIndex = workout.likes.indexOf(req.user!.id);
    if (likeIndex === -1) {
      workout.likes.push(req.user!.id);
    } else {
      workout.likes.splice(likeIndex, 1);
    }

    await workout.save();
    res.json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};