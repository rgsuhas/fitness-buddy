import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Workout from '@/lib/models/Workout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get all workouts with filtering
export async function GET(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');

    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (isPublic !== null) filter.isPublic = isPublic === 'true';

    const workouts = await Workout.find(filter)
      .populate('exercises.exercise')
      .populate('creator', 'name');
      
    return NextResponse.json({
      success: true,
      data: workouts,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching workouts' }, { status: 500 });
  }
}

// Create workout
export async function POST(req: Request) {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const workout = await Workout.create({
      ...body,
      creator: user.id,
    });
    
    await workout.populate('exercises.exercise');
    return NextResponse.json({
      success: true,
      data: workout,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating workout' }, { status: 500 });
  }
}
