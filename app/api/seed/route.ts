import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { createDummyPosts } from '@/lib/data/dummyPosts';


export async function GET() {
  try {
    await connectToDB();
    await createDummyPosts();

    return NextResponse.json({ message: 'Data seeded successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error seeding data' }, { status: 500 });
  }
}
