import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
}
