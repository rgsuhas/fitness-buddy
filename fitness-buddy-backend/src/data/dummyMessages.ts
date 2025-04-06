import { Types } from 'mongoose';
import User from '../models/User';
import Message from '../models/Message';

export const createDummyMessages = async () => {
  try {
    // First, check if we already have dummy messages
    const existingMessages = await Message.countDocuments();
    if (existingMessages > 0) {
      console.log('Dummy messages already exist');
      return;
    }

    // Create some dummy users first (if they don't exist)
    const dummyUsers = [
      {
        name: 'John Fitness',
        email: 'john.fitness@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnFitness',
      },
      {
        name: 'Emma Trainer',
        email: 'emma.trainer@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaTrainer',
      },
      {
        name: 'Mike Coach',
        email: 'mike.coach@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeCoach',
      }
    ];

    const createdUsers = await Promise.all(
      dummyUsers.map(user => User.findOneAndUpdate(
        { email: user.email },
        user,
        { upsert: true, new: true }
      ))
    );

    // Create dummy messages
    const dummyMessages = [
      {
        sender: createdUsers[0]._id,
        receiver: createdUsers[1]._id,
        content: "Hey Emma, I'm struggling with my weight loss goals. Any advice?",
        timestamp: new Date(Date.now() - 3600000 * 24),
        read: false,
      },
      {
        sender: createdUsers[1]._id,
        receiver: createdUsers[0]._id,
        content: "Hi John! Let's schedule a consultation to discuss your goals in detail.",
        timestamp: new Date(Date.now() - 3600000 * 23),
        read: false,
      },
      {
        sender: createdUsers[2]._id,
        receiver: createdUsers[0]._id,
        content: "I noticed you've been consistent with your workouts. Great job!",
        timestamp: new Date(Date.now() - 3600000 * 12),
        read: true,
      },
      {
        sender: createdUsers[0]._id,
        receiver: createdUsers[2]._id,
        content: "Thanks, Mike! Your motivation helps a lot.",
        timestamp: new Date(Date.now() - 3600000 * 11),
        read: true,
      }
    ];

    await Message.insertMany(dummyMessages);
    console.log('Dummy messages created successfully');
  } catch (error) {
    console.error('Error creating dummy messages:', error);
  }
};
