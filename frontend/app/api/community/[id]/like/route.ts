import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// POST /api/community/[id]/like - Toggle like on a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Get post
    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Check if user already liked the post
    const userIdStr = userId.toString();
    const userLiked = post.likes.some((id: string) => id === userIdStr);
    
    if (userLiked) {
      // Remove like
      await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $pull: { likes: userIdStr } }
      );
    } else {
      // Add like
      await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $addToSet: { likes: userIdStr } }
      );
    }
    
    // Get updated likes
    const updatedPost = await db.collection("posts").findOne(
      { _id: new ObjectId(postId) },
      { projection: { likes: 1 } }
    );
    
    return NextResponse.json({ likes: updatedPost?.likes || [] });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
