import { NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/db';

export async function GET() {
  const db = await getMongoDb();
  return NextResponse.json({
    status: 'online',
    name: 'BookNook – A Small Online Library API',
    mode: db ? 'mongodb' : 'in-memory-resilient',
    timestamp: new Date().toISOString(),
    routes: [
      'GET /api/books',
      'GET /api/books/:id',
      'POST /api/books (protected)',
      'PATCH /api/books/:id (protected)',
      'DELETE /api/books/:id (protected)',
      'POST /api/borrows (protected)',
      'GET /api/borrows (protected)',
      'DELETE /api/borrows/:id (protected)',
      'POST /api/auth/jwt',
      'GET /api/seed'
    ]
  });
}
