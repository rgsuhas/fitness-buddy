import { NextRequest, NextResponse } from 'next/server';

/**
 * Higher-order function to wrap API route handlers with logging functionality
 * This provides consistent logging for all API requests and responses
 */
export function withApiLogging<T extends (req: NextRequest, ...args: any[]) => Promise<NextResponse>>(
  handler: T
) {
  return async function(req: NextRequest, ...args: any[]): Promise<NextResponse> {
    const startTime = Date.now();
    const method = req.method;
    const url = req.nextUrl.pathname;
    
    // Log the request
    console.log(`${method} ${url} - Request received`);
    
    try {
      // Execute the original handler
      const response = await handler(req, ...args);
      
      // Calculate duration
      const duration = Date.now() - startTime;
      
      // Log the response
      console.log(`${method} ${url} ${response.status} in ${duration}ms`);
      
      return response;
    } catch (error) {
      // Calculate duration
      const duration = Date.now() - startTime;
      
      // Log the error
      console.error(`${method} ${url} ERROR in ${duration}ms:`, error);
      
      // Return a 500 error response
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Example usage:
 * 
 * import { withApiLogging } from '@/lib/with-api-logging';
 * 
 * export const GET = withApiLogging(async (req) => {
 *   // Your handler code here
 *   return NextResponse.json({ data: 'example' });
 * });
 */
