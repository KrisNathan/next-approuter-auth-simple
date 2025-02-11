import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("huh", request.url)
  const credJSON = request.cookies.get('cred');
  if (!credJSON) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const cred = JSON.parse(credJSON.value);
  const credSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const { data: parsedCred, success } = credSchema.safeParse(cred)
  if (!success) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const result = await fetch(new URL('/api/check_login', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedCred)
    });
    if (!result.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (e) {
    console.error(e);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/app/:path*',
  ],
}