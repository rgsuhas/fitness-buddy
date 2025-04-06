import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, activityLevel = 'moderate' } = await request.json();
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 400 });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user with valid activity level
    const newUser = {
      _id: new ObjectId(),
      name,
      email,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      fitnessGoal: 'general_fitness',
      activityLevel: activityLevel || 'moderate', // Default to moderate if not provided
      bio: '',
      role: 'user',
      createdAt: new Date()
    };
    
    await db.collection("users").insertOne(newUser);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      token: "mock_jwt_token" // In a real app, generate a JWT token here
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 500 });
  }
}
