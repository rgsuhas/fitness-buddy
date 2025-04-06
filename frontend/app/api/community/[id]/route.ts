import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/community/[id] - Get a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// PUT /api/community/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { title, content, imageUrl, tags, userId } = await request.json();
    
    if (!title || !content || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Verify post exists and belongs to the user
    const post = await db.collection("posts").findOne({ 
      _id: new ObjectId(id),
      "author._id": new ObjectId(userId)
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }
    
    const updatedPost = {
      title,
      content,
      imageUrl,
      tags: tags || post.tags,
      updatedAt: new Date()
    };
    
    await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPost }
    );
    
    return NextResponse.json({ ...post, ...updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE /api/community/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Verify post exists and belongs to the user
    const post = await db.collection("posts").findOne({ 
      _id: new ObjectId(id),
      "author._id": new ObjectId(userId)
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }
    
    await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
