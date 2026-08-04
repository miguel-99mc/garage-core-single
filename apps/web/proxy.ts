import { NextRequest } from 'next/server';
import { adminGuard } from './middlewares/admin.guard';
import { guestGuard } from './middlewares/guest.guard';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // admin area
  if (pathname.startsWith('/admin')) {
    return adminGuard(req);
  }

  // login / register pages
  if (pathname.startsWith('/login')) {
    return guestGuard(req);
  }

  return;
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
