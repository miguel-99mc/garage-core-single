import { NextRequest, NextResponse } from 'next/server';

export function guestGuard(req: NextRequest) {
  const session = req.cookies.get('access_token')?.value;

  if (session) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}
