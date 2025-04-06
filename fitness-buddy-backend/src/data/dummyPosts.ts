import { Types } from 'mongoose';
import Post from '../models/Post';
import User from '../models/User';

export const createDummyPosts = async () => {
  try {
    // First, check if we already have dummy posts
    const existingPosts = await Post.countDocuments();
    if (existingPosts > 0) {
      console.log('Dummy posts already exist');
      return;
    }

    // Create some dummy users first
    const dummyUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      }
    ];

    const createdUsers = await Promise.all(
      dummyUsers.map(user => User.create(user))
    );

    // Create dummy posts
    const dummyPosts = [
      {
        title: 'My Weight Loss Journey',
        content: 'Started at 200lbs, now at 170lbs! Here\'s what worked for me...',
        author: createdUsers[0]._id,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8',
        tags: ['weight-loss', 'motivation', 'success-story'],
        likes: [createdUsers[1]._id, createdUsers[2]._id],
        comments: [
          {
            content: 'Amazing progress! Keep it up! 💪',
            author: createdUsers[1]._id,
            likes: [createdUsers[0]._id],
          }
        ]
      },
      {
        title: 'Best Pre-Workout Meals',
        content: 'Here are my top 5 pre-workout meal ideas that provide sustained energy...',
        author: createdUsers[1]._id,
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
        tags: ['nutrition', 'pre-workout', 'meals'],
        likes: [createdUsers[0]._id],
        comments: [
          {
            content: 'Great suggestions! I\'ll try these tomorrow.',
            author: createdUsers[2]._id,
            likes: [createdUsers[0]._id, createdUsers[1]._id],
          }
        ]
      },
      {
        title: 'My First Marathon Experience',
        content: 'Just completed my first marathon! Here\'s how I trained and what I learned...',
        author: createdUsers[2]._id,
        imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3',
        tags: ['running', 'marathon', 'training'],
        likes: [createdUsers[0]._id, createdUsers[1]._id],
        comments: [
          {
            content: 'Congratulations! This is inspiring!',
            author: createdUsers[0]._id,
            likes: [createdUsers[2]._id],
          }
        ]
      }
    ];

    await Post.insertMany(dummyPosts);
    console.log('Dummy posts created successfully');
  } catch (error) {
    console.error('Error creating dummy posts:', error);
  }
};
