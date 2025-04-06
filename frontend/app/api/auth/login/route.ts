import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Find user by email
    const user = await db.collection("users").findOne({ email });
    
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }
    
    // Check if password is already hashed (starts with $2a$ or $2b$)
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Password is hashed, use bcrypt compare
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Password is not hashed, do direct comparison (for seed data)
      isMatch = password === user.password;
    }
    
    if (!isMatch) {
      console.log(`Password mismatch for user: ${user.email}`);
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        image: user.avatar
      },
      token: "jwt_token_would_be_generated_here" // In a real app, generate a JWT token
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Failed to login. Please try again." }, { status: 500 });
  }
}
