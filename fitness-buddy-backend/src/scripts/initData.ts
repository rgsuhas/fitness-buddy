import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createDummyPosts } from '../data/dummyPosts';
import { createDummyMessages } from '../data/dummyMessages';

dotenv.config();

const initializeData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    await createDummyPosts();
    await createDummyMessages();
    console.log('Data initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
};

initializeData();
