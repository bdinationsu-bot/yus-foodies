import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('admin_auth')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const isLoginPage = request.nextUrl.pathname === '/yu-panel-2026/login';

  if (!isLoginPage && auth !== adminPassword) {
    return NextResponse.redirect(new URL('/yu-panel-2026/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/yu-panel-2026/:path*'],
};
