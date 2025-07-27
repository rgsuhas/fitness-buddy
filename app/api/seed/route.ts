import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { createDummyPosts } from '@/lib/data/dummyPosts';
import { createDummyMessages } from '@/lib/data/dummyMessages';

export async function GET() {
  try {
    await connectToDB();
    await createDummyPosts();
    await createDummyMessages();
    return NextResponse.json({ message: 'Data seeded successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error seeding data' }, { status: 500 });
  }
}
