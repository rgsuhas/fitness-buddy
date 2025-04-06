"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercise = exports.getExercises = exports.createExercise = void 0;
const Exercise_1 = __importDefault(require("../models/Exercise"));
const errorHandler_1 = require("../utils/errorHandler");
const createExercise = async (req, res, next) => {
    try {
        const exercise = await Exercise_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: exercise,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createExercise = createExercise;
const getExercises = async (req, res, next) => {
    try {
        const { muscleGroup, difficulty, equipment, category } = req.query;
        const filter = {};
        if (muscleGroup)
            filter.muscleGroups = muscleGroup;
        if (difficulty)
            filter.difficulty = difficulty;
        if (equipment)
            filter.equipment = equipment;
        if (category)
            filter.category = category;
        const exercises = await Exercise_1.default.find(filter);
        res.json({
            success: true,
            count: exercises.length,
            data: exercises,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getExercises = getExercises;
const getExercise = async (req, res, next) => {
    try {
        const exercise = await Exercise_1.default.findById(req.params.id);
        if (!exercise) {
            throw new errorHandler_1.ApiError(404, 'Exercise not found');
        }
        res.json({
            success: true,
            data: exercise,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getExercise = getExercise;
