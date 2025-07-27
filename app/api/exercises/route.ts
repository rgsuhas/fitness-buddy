import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Exercise from '@/lib/models/Exercise';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get all exercises with filtering
export async function GET(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const muscleGroup = searchParams.get('muscleGroup');
    const difficulty = searchParams.get('difficulty');
    const equipment = searchParams.get('equipment');
    const category = searchParams.get('category');

    const filter: any = {};
    if (muscleGroup) filter.muscleGroups = muscleGroup;
    if (difficulty) filter.difficulty = difficulty;
    if (equipment) filter.equipment = equipment;
    if (category) filter.category = category;

    const exercises = await Exercise.find(filter);
    return NextResponse.json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching exercises' }, { status: 500 });
  }
}

// Create exercise
export async function POST(req: Request) {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const exercise = await Exercise.create(body);
    return NextResponse.json({
      success: true,
      data: exercise,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating exercise' }, { status: 500 });
  }
}
