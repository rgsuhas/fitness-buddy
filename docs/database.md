# FitnessBuddy Database Documentation

This document provides detailed information about the database schema, relationships, and implementation details for the FitnessBuddy application.

## Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Collections](#collections)
  - [Users](#users)
  - [Workouts](#workouts)
  - [Exercises](#exercises)
  - [Community Posts](#community-posts)
  - [Comments](#comments)
  - [Conversations](#conversations)
  - [Messages](#messages)
  - [Nutrition Logs](#nutrition-logs)
  - [Wearable Data](#wearable-data)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Data Validation](#data-validation)
- [Database Connection](#database-connection)
- [Seeding Data](#seeding-data)

## Overview

FitnessBuddy uses MongoDB as its primary database. MongoDB is a NoSQL document database that provides high performance, high availability, and easy scalability. The database is hosted on MongoDB Atlas, a fully-managed cloud database service.

## Database Schema

The database consists of several collections that store different types of data. Each collection has a specific schema that defines the structure of the documents it contains.

## Collections

### Users

The `users` collection stores information about registered users.

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string; // Hashed
  profilePicture?: string;
  fitnessGoals?: string[];
  activityLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  height?: number; // in cm
  weight?: number; // in kg
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  createdAt: Date;
  updatedAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("67f26565743a8bb3b1d0518c"),
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "$2b$10$X7Jy6xM4lA8jS5J5n8XYZ.5UvD8Z2J5tQv4H6Gx3YZ5tQv4H6Gx3Y",
  "profilePicture": "https://example.com/profile.jpg",
  "fitnessGoals": ["Weight Loss", "Muscle Gain"],
  "activityLevel": "Intermediate",
  "height": 180,
  "weight": 75,
  "dateOfBirth": ISODate("1990-01-15T00:00:00Z"),
  "gender": "Male",
  "createdAt": ISODate("2025-01-15T12:00:00Z"),
  "updatedAt": ISODate("2025-03-20T15:30:00Z")
}
```

### Workouts

The `workouts` collection stores workout plans created by users.

```typescript
interface Workout {
  _id: ObjectId;
  title: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'HIIT';
  description?: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    notes?: string;
  }[];
  duration?: number; // in minutes
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  isPublic: boolean;
  likes: ObjectId[]; // User IDs who liked this workout
  createdBy: ObjectId; // User ID
  createdAt: Date;
  updatedAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("workout123"),
  "title": "Full Body Strength",
  "type": "strength",
  "description": "Complete full body workout targeting all major muscle groups",
  "exercises": [
    {
      "name": "Squats",
      "sets": 3,
      "reps": 12,
      "weight": 50,
      "notes": "Focus on form"
    },
    {
      "name": "Push-ups",
      "sets": 3,
      "reps": 15,
      "weight": 0
    }
  ],
  "duration": 45,
  "difficulty": "Intermediate",
  "tags": ["strength", "full body", "compound movements"],
  "isPublic": true,
  "likes": [
    ObjectId("user456"),
    ObjectId("user789")
  ],
  "createdBy": ObjectId("67f26565743a8bb3b1d0518c"),
  "createdAt": ISODate("2025-03-15T10:30:00Z"),
  "updatedAt": ISODate("2025-03-15T10:30:00Z")
}
```

### Exercises

The `exercises` collection stores a library of exercises that users can add to their workouts.

```typescript
interface Exercise {
  _id: ObjectId;
  name: string;
  description: string;
  muscleGroups: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment?: string[];
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("exercise123"),
  "name": "Barbell Squat",
  "description": "A compound exercise that targets the quadriceps, hamstrings, and glutes",
  "muscleGroups": ["Quadriceps", "Hamstrings", "Glutes", "Lower Back"],
  "difficulty": "Intermediate",
  "equipment": ["Barbell", "Squat Rack"],
  "instructions": [
    "Stand with feet shoulder-width apart",
    "Place the barbell on your upper back",
    "Bend your knees and lower your hips until your thighs are parallel to the ground",
    "Push through your heels to return to the starting position"
  ],
  "videoUrl": "https://example.com/barbell-squat.mp4",
  "imageUrl": "https://example.com/barbell-squat.jpg",
  "createdAt": ISODate("2025-01-10T09:00:00Z"),
  "updatedAt": ISODate("2025-01-10T09:00:00Z")
}
```

### Community Posts

The `posts` collection stores posts created by users in the community feed.

```typescript
interface Post {
  _id: ObjectId;
  content: string;
  media?: string[]; // URLs to images or videos
  likes: ObjectId[]; // User IDs who liked this post
  comments: ObjectId[]; // Comment IDs
  author: ObjectId; // User ID
  createdAt: Date;
  updatedAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("post123"),
  "content": "Just completed my first 5K run!",
  "media": ["https://example.com/run.jpg"],
  "likes": [
    ObjectId("user456"),
    ObjectId("user789")
  ],
  "comments": [
    ObjectId("comment123"),
    ObjectId("comment456")
  ],
  "author": ObjectId("67f26565743a8bb3b1d0518c"),
  "createdAt": ISODate("2025-04-05T09:30:00Z"),
  "updatedAt": ISODate("2025-04-05T09:30:00Z")
}
```

### Comments

The `comments` collection stores comments on community posts.

```typescript
interface Comment {
  _id: ObjectId;
  content: string;
  likes: ObjectId[]; // User IDs who liked this comment
  post: ObjectId; // Post ID
  author: ObjectId; // User ID
  createdAt: Date;
  updatedAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("comment123"),
  "content": "Congratulations! That's a great achievement!",
  "likes": [
    ObjectId("user123")
  ],
  "post": ObjectId("post123"),
  "author": ObjectId("user456"),
  "createdAt": ISODate("2025-04-05T10:00:00Z"),
  "updatedAt": ISODate("2025-04-05T10:00:00Z")
}
```

### Conversations

The `conversations` collection stores chat conversations between users.

```typescript
interface Conversation {
  _id: ObjectId;
  participants: ObjectId[]; // User IDs
  lastMessage: {
    content: string;
    sender: ObjectId; // User ID
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("conv123"),
  "participants": [
    ObjectId("67f26565743a8bb3b1d0518c"),
    ObjectId("user456")
  ],
  "lastMessage": {
    "content": "Are you going to the gym today?",
    "sender": ObjectId("user456"),
    "timestamp": ISODate("2025-04-06T14:30:00Z")
  },
  "createdAt": ISODate("2025-04-01T09:00:00Z"),
  "updatedAt": ISODate("2025-04-06T14:30:00Z")
}
```

### Messages

The `messages` collection stores individual messages within conversations.

```typescript
interface Message {
  _id: ObjectId;
  conversation: ObjectId; // Conversation ID
  content: string;
  sender: ObjectId; // User ID
  read: boolean;
  createdAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("msg123"),
  "conversation": ObjectId("conv123"),
  "content": "Hey, how's your training going?",
  "sender": ObjectId("67f26565743a8bb3b1d0518c"),
  "read": true,
  "createdAt": ISODate("2025-04-06T14:15:00Z")
}
```

### Nutrition Logs

The `nutritionLogs` collection stores users' daily nutrition information.

```typescript
interface NutritionLog {
  _id: ObjectId;
  user: ObjectId; // User ID
  date: Date;
  meals: {
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    foods: {
      name: string;
      calories: number;
      protein: number; // in grams
      carbs: number; // in grams
      fat: number; // in grams
      quantity: number;
    }[];
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntake: number; // in ml
  createdAt: Date;
  updatedAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("nutrition123"),
  "user": ObjectId("67f26565743a8bb3b1d0518c"),
  "date": ISODate("2025-04-06T00:00:00Z"),
  "meals": [
    {
      "type": "Breakfast",
      "foods": [
        {
          "name": "Oatmeal",
          "calories": 150,
          "protein": 5,
          "carbs": 27,
          "fat": 3,
          "quantity": 1
        },
        {
          "name": "Banana",
          "calories": 105,
          "protein": 1.3,
          "carbs": 27,
          "fat": 0.4,
          "quantity": 1
        }
      ]
    },
    {
      "type": "Lunch",
      "foods": [
        {
          "name": "Chicken Breast",
          "calories": 165,
          "protein": 31,
          "carbs": 0,
          "fat": 3.6,
          "quantity": 1
        },
        {
          "name": "Brown Rice",
          "calories": 216,
          "protein": 5,
          "carbs": 45,
          "fat": 1.8,
          "quantity": 1
        }
      ]
    }
  ],
  "totalCalories": 636,
  "totalProtein": 42.3,
  "totalCarbs": 99,
  "totalFat": 8.8,
  "waterIntake": 2000,
  "createdAt": ISODate("2025-04-06T20:00:00Z"),
  "updatedAt": ISODate("2025-04-06T20:00:00Z")
}
```

### Wearable Data

The `wearableData` collection stores fitness data from wearable devices.

```typescript
interface WearableData {
  _id: ObjectId;
  user: ObjectId; // User ID
  date: Date;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  heartRate: {
    average: number;
    min: number;
    max: number;
  };
  sleep: {
    duration: number; // in minutes
    quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  };
  source: string; // e.g., 'Fitbit', 'Apple Watch', 'Garmin'
  createdAt: Date;
  updatedAt: Date;
}
```

Example document:

```json
{
  "_id": ObjectId("wearable123"),
  "user": ObjectId("67f26565743a8bb3b1d0518c"),
  "date": ISODate("2025-04-06T00:00:00Z"),
  "steps": 8500,
  "caloriesBurned": 2200,
  "activeMinutes": 45,
  "heartRate": {
    "average": 72,
    "min": 55,
    "max": 140
  },
  "sleep": {
    "duration": 420,
    "quality": "Good"
  },
  "source": "Fitbit",
  "createdAt": ISODate("2025-04-07T00:05:00Z"),
  "updatedAt": ISODate("2025-04-07T00:05:00Z")
}
```

## Relationships

The database uses references to establish relationships between collections:

1. **User to Workouts**: One-to-many relationship
   - A user can create multiple workouts
   - Each workout is created by one user

2. **User to Posts**: One-to-many relationship
   - A user can create multiple posts
   - Each post is created by one user

3. **Post to Comments**: One-to-many relationship
   - A post can have multiple comments
   - Each comment belongs to one post

4. **User to Conversations**: Many-to-many relationship
   - A user can participate in multiple conversations
   - Each conversation can have multiple participants

5. **Conversation to Messages**: One-to-many relationship
   - A conversation can have multiple messages
   - Each message belongs to one conversation

## Indexes

The following indexes are created to optimize query performance:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });

// Workouts collection
db.workouts.createIndex({ createdBy: 1 });
db.workouts.createIndex({ type: 1 });
db.workouts.createIndex({ "exercises.name": 1 });

// Posts collection
db.posts.createIndex({ author: 1 });
db.posts.createIndex({ createdAt: -1 });

// Comments collection
db.comments.createIndex({ post: 1 });

// Conversations collection
db.conversations.createIndex({ participants: 1 });

// Messages collection
db.messages.createIndex({ conversation: 1, createdAt: 1 });

// Nutrition logs collection
db.nutritionLogs.createIndex({ user: 1, date: -1 });

// Wearable data collection
db.wearableData.createIndex({ user: 1, date: -1 });
```

## Data Validation

MongoDB schema validation is used to ensure data integrity:

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "createdAt"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email address and is required"
        },
        // Additional validation rules...
      }
    }
  }
});
```

Similar validation rules are applied to other collections.

## Database Connection

The application connects to MongoDB using the MongoDB Node.js driver:

```typescript
// lib/db.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db('fitness-buddy');
  return db;
}
```

## Seeding Data

The application includes seed scripts to populate the database with initial data for testing and development:

```typescript
// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await db.collection('users').insertMany([
      {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: hashedPassword,
        profilePicture: '/images/avatars/john.jpg',
        fitnessGoals: ['Weight Loss', 'Muscle Gain'],
        activityLevel: 'Intermediate',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Additional seed users...
    ]);
    
    // Seed workouts, posts, etc.
    // ...
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully'
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to seed database' } },
      { status: 500 }
    );
  }
}
```

To seed the database, navigate to `/api/seed` in your browser or make a GET request to that endpoint.
