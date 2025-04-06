import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// POST /api/community/[id]/comment - Add a comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { content, userId } = await request.json();
    
    if (!content || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Get post
    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Get user info
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const newComment = {
      _id: new ObjectId(),
      content,
      author: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
      likes: [],
      createdAt: new Date(),
    };
    
    await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { comments: newComment } }
    );
    
    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
