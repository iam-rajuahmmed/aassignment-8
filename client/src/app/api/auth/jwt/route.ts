import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await req.json();
    if (!user || !user.email) {
      return NextResponse.json({ message: 'User email is required to issue token' }, { status: 400 });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name || 'Library Member' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ success: true, token });
  } catch (err: any) {
    return NextResponse.json({ message: 'Error creating token', error: err.message }, { status: 500 });
  }
}
