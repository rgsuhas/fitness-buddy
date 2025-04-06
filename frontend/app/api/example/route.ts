import { NextRequest, NextResponse } from 'next/server';
import { withApiLogging } from '@/lib/with-api-logging';

/**
 * Example API route with automatic logging
 * This demonstrates how to use the withApiLogging wrapper
 */
export const GET = withApiLogging(async (req: NextRequest) => {
  // Your API logic here
  return NextResponse.json({ 
    success: true,
    message: 'This is an example API endpoint with automatic logging',
    timestamp: new Date().toISOString()
  });
});

export const POST = withApiLogging(async (req: NextRequest) => {
  try {
    // Parse request body
    const body = await req.json();
    
    // Process the data (example)
    const { name } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Return successful response
    return NextResponse.json({
      success: true,
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Error handling is done in the withApiLogging wrapper
    // but you can also handle specific errors here if needed
    throw error;
  }
});
