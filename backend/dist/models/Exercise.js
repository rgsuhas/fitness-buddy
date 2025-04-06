"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const exerciseSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    muscleGroups: [{
            type: String,
            enum: ['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'full-body'],
            required: true,
        }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
    },
    equipment: [{
            type: String,
            enum: ['none', 'dumbbells', 'barbell', 'kettlebell', 'resistance-bands', 'machine'],
            required: true,
        }],
    videoUrl: String,
    thumbnailUrl: String,
    instructions: [{
            type: String,
            required: true,
        }],
    category: {
        type: String,
        enum: ['strength', 'cardio', 'flexibility', 'balance', 'hiit'],
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Exercise', exerciseSchema);
