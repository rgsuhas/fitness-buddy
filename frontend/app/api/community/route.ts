import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/community - Get all posts with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("fitness-buddy");

    const total = await db.collection("posts").countDocuments();
    const posts = await db.collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ 
      posts: JSON.parse(JSON.stringify(posts)), 
      total, 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST /api/community - Create a new post
export async function POST(request: NextRequest) {
  try {
    const { title, content, imageUrl, tags, userId } = await request.json();

    if (!title || !content || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("fitness-buddy");

    // Get user info
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newPost = {
      _id: new ObjectId(),
      title,
      content,
      author: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
      imageUrl,
      tags: tags || [],
      likes: [],
      comments: [],
      createdAt: new Date(),
    };

    await db.collection("posts").insertOne(newPost);

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
