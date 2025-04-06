import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const url = request.nextUrl.pathname;
  const method = request.method;
  
  // Only log API routes
  if (url.startsWith('/api/')) {
    // Create a response object to pass through
    const response = NextResponse.next();
    
    // Add a response listener to log after the request completes
    response.headers.append('x-middleware-cache', 'no-cache');
    
    // Log the request details
    console.log(`${method} ${url} - Request received`);
    
    // Use a custom header to track the start time
    response.headers.set('x-request-start-time', startTime.toString());
    
    return response;
  }
  
  return NextResponse.next();
}

// Add a matcher for API routes only
export const config = {
  matcher: '/api/:path*',
};
