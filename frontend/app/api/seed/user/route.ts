import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// Add a specific user for testing
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: "johndoe@gmail.com" });
    
    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: "Test user already exists", 
        userId: existingUser._id.toString() 
      });
    }
    
    // Create a new test user with hashed password
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const newUser = {
      _id: new ObjectId(),
      name: 'John Doe (Test)',
      email: 'johndoe@gmail.com',
      password: hashedPassword,
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      fitnessGoal: 'Build muscle',
      activityLevel: 'moderate',
      bio: 'Test user for login functionality.',
      createdAt: new Date(),
    };
    
    await db.collection("users").insertOne(newUser);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test user created successfully", 
      userId: newUser._id.toString(),
      credentials: {
        email: "johndoe@gmail.com",
        password: "password123" // Only returning this for testing purposes
      }
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create test user" 
    }, { status: 500 });
  }
}
