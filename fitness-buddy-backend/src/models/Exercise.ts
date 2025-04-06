import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  description: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'hiit';
}

const exerciseSchema = new Schema({
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

export default mongoose.model<IExercise>('Exercise', exerciseSchema);