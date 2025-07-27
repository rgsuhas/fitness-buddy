import mongoose, { Document, Schema, Types } from 'mongoose';
import { IExercise } from './Exercise';

interface WorkoutExercise {
  exercise: IExercise['_id'];
  sets: number;
  reps: number;
  duration?: number;
  rest: number;
  notes?: string;
}

export interface IWorkout extends Document {
  name: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  exercises: WorkoutExercise[];
  creator: Types.ObjectId;
  isPublic: boolean;
  likes: Types.ObjectId[];
  tags: string[];
}

const workoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'hiit'],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  exercises: [{
    exercise: {
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    duration: Number,
    rest: {
      type: Number,
      required: true,
    },
    notes: String,
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);
