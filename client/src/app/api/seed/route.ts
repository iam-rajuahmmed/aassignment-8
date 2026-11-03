import { NextResponse } from 'next/server';
import { getMongoDb, inMemoryBooks, initialBooks } from '@/lib/db';

export async function GET() {
  try {
    const db = await getMongoDb();
    if (db) {
      const booksCollection = db.collection('books');
      const count = await booksCollection.countDocuments();
      if (count > 0) {
        return NextResponse.json({ message: `Database contains ${count} books.` });
      }

      const toInsert = initialBooks.map(b => {
        const { _id, ...rest } = b;
        return rest;
      });

      const result = await booksCollection.insertMany(toInsert);
      return NextResponse.json({ message: 'Books seeded successfully!', insertedCount: result.insertedCount });
    }

    inMemoryBooks.length = 0;
    initialBooks.forEach(b => inMemoryBooks.push({ ...b }));
    return NextResponse.json({ message: 'In-memory books reset successfully!', count: inMemoryBooks.length });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to seed database', error: error.message }, { status: 500 });
  }
}
