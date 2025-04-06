import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: 'user' | 'admin';
  fitnessGoals?: FitnessGoal[];
  activityLevel?: ActivityLevel;
  createdAt: Date;
  updatedAt: Date;
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}

export interface UserDocument extends Omit<Document, keyof IUser>, IUser {
  _id: Types.ObjectId;
}

export interface AuthRequest extends Omit<Request, 'user'> {
  user?: UserDocument;
}
