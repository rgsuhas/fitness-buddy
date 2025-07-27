import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Exercise from '@/lib/models/Exercise';

// Get single exercise
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const exercise = await Exercise.findById(params.id);
    if (!exercise) {
      return NextResponse.json({ message: 'Exercise not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching exercise' }, { status: 500 });
  }
}
