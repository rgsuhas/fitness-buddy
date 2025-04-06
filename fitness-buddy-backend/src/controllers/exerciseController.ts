import { Request, Response, NextFunction } from 'express';
import Exercise from '../models/Exercise';
import { ApiError } from '../utils/errorHandler';

export const createExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(201).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

export const getExercises = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { muscleGroup, difficulty, equipment, category } = req.query;
    
    const filter: any = {};
    if (muscleGroup) filter.muscleGroups = muscleGroup;
    if (difficulty) filter.difficulty = difficulty;
    if (equipment) filter.equipment = equipment;
    if (category) filter.category = category;

    const exercises = await Exercise.find(filter);
    res.json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

export const getExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      throw new ApiError(404, 'Exercise not found');
    }
    res.json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};