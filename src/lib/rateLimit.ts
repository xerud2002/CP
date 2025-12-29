import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  message?: string;
  keyPrefix?: string;
}

/**
 * Simple in-memory rate limiter for Next.js API routes
 * For production with multiple servers, use Redis or external service
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Prea multe cereri. Te rugăm să încerci din nou mai târziu.',
    keyPrefix = 'rl',
  } = config;

  return async (req: NextRequest): Promise<NextResponse | null> => {
    // Get IP address from request
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    
    const now = Date.now();
    const record = rateLimitStore[key];

    // Clean up old entries (optional, prevents memory leak)
    if (record && record.resetTime < now) {
      delete rateLimitStore[key];
    }

    if (!record || record.resetTime < now) {
      // Create new record
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return null; // Allow request
    }

    if (record.count >= maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      
      return NextResponse.json(
        { 
          error: message,
          retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': record.resetTime.toString(),
          },
        }
      );
    }

    // Increment counter
    record.count += 1;
    return null; // Allow request
  };
}

/**
 * Middleware wrapper for rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const rateLimitResult = await rateLimit(config)(req);
    
    if (rateLimitResult) {
      return rateLimitResult; // Return 429 response
    }
    
    return handler(req); // Proceed with handler
  };
}

// Cleanup function to run periodically
export function cleanupRateLimitStore() {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}

// Run cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000);
}
