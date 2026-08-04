import { NextRequest, NextResponse } from 'next/server';

export function adminGuard(req: NextRequest) {
  const session = req.cookies.get('access_token')?.value;

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
