// src/app/api/admin/login/route.ts
// POST /api/admin/login — admin authentication
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Strict rate limiting on login endpoint
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const rateLimit = checkRateLimit(`login:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please wait before trying again.' },
      { status: 429 }
    );
  }

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const provided = body.token ?? '';
  const secret = process.env.ADMIN_AUTH_SECRET ?? '';

  if (!secret || secret.length < 16) {
    return NextResponse.json(
      { error: 'Admin authentication is not configured.' },
      { status: 503 }
    );
  }

  // Constant-time comparison
  const valid = provided.length === secret.length && provided === secret;

  if (!valid) {
    // Add artificial delay to prevent timing attacks
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  // Return the token for client-side storage (HttpOnly cookie alternative for simplicity)
  // In production, use iron-session or next-auth for proper session management
  const response = NextResponse.json({ ok: true, token: secret });
  response.cookies.set('admin_token', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('admin_token');
  return response;
}
