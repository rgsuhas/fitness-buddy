import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string; // Make password optional
  name: string;
  role: 'user' | 'admin';
  fitnessGoals: ('weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness')[];
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extremely_active';
  googleId?: string; // Google OAuth ID
  avatar?: string; // Profile picture URL
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String, // No longer required
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  fitnessGoals: [{
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'],
  }],
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'very_active', 'extremely_active'],
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
}, {
  timestamps: true,
});

// Add the comparePassword method to the schema
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;