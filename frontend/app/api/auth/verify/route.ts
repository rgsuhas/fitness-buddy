import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would verify the JWT token here
    // For now, we'll simulate token verification
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    // In a real app, you would decode and verify the JWT token
    // For now, we'll just check if it's one of our mock tokens
    // This is just for demonstration purposes
    
    // Get user from database (in a real app, you'd get the user ID from the token)
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // For demo purposes, just return the first user
    const user = await db.collection("users").findOne({});
    
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      image: user.avatar
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ success: false, error: "Failed to verify token" }, { status: 500 });
  }
}
