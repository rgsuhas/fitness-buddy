"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = exports.getWorkouts = exports.createWorkout = void 0;
const Workout_1 = __importDefault(require("../models/Workout"));
const errorHandler_1 = require("../utils/errorHandler");
const createWorkout = async (req, res, next) => {
    try {
        const workout = await Workout_1.default.create({
            ...req.body,
            creator: req.user.id,
        });
        await workout.populate('exercises.exercise');
        res.status(201).json({
            success: true,
            data: workout,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createWorkout = createWorkout;
const getWorkouts = async (req, res, next) => {
    try {
        const { difficulty, category, isPublic } = req.query;
        const filter = {};
        if (difficulty)
            filter.difficulty = difficulty;
        if (category)
            filter.category = category;
        if (isPublic !== undefined)
            filter.isPublic = isPublic === 'true';
        const workouts = await Workout_1.default.find(filter)
            .populate('exercises.exercise')
            .populate('creator', 'name');
        res.json({
            success: true,
            data: workouts,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getWorkouts = getWorkouts;
const toggleLike = async (req, res, next) => {
    try {
        const workout = await Workout_1.default.findById(req.params.id);
        if (!workout) {
            throw new errorHandler_1.ApiError(404, 'Workout not found');
        }
        const likeIndex = workout.likes.indexOf(req.user.id);
        if (likeIndex === -1) {
            workout.likes.push(req.user.id);
        }
        else {
            workout.likes.splice(likeIndex, 1);
        }
        await workout.save();
        res.json({
            success: true,
            data: workout,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleLike = toggleLike;
