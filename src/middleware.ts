import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/phantom';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Only apply to API routes that need protection
  if (request.nextUrl.pathname.startsWith('/api/protected')) {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid token' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }
    
    // Add the wallet address to the request headers for use in the API route
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-Wallet-Address', decoded.walletAddress);
    
    // Return the response with the modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // Continue for non-protected routes
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/api/protected/:path*'],
};
