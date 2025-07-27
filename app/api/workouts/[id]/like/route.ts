import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Workout from '@/lib/models/Workout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Toggle workout like
export async function POST(req: Request, { params }: { params: { id: string } }) {
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

    const workout = await Workout.findById(params.id);
    if (!workout) {
      return NextResponse.json({ message: 'Workout not found' }, { status: 404 });
    }

    const likeIndex = workout.likes.indexOf(user.id);
    if (likeIndex === -1) {
      workout.likes.push(user.id);
    } else {
      workout.likes.splice(likeIndex, 1);
    }

    await workout.save();
    return NextResponse.json({
      success: true,
      data: workout,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error toggling like' }, { status: 500 });
  }
}
