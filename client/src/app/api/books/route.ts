import { NextResponse } from 'next/server';
import { getMongoDb, inMemoryBooks, verifyAuthToken } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const email = searchParams.get('email');

    const db = await getMongoDb();
    if (db) {
      const booksCollection = db.collection('books');
      const query: any = {};
      if (email) query.userEmail = email;
      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ];
      }

      let cursor = booksCollection.find(query);
      if (sort === 'copies') cursor = cursor.sort({ copies: -1 });
      else if (sort === 'title') cursor = cursor.sort({ title: 1 });
      else cursor = cursor.sort({ createdAt: -1 });

      if (limit) cursor = cursor.limit(parseInt(limit));
      const books = await cursor.toArray();
      return NextResponse.json(books);
    }

    // In-memory resilient fallback
    let result = [...inMemoryBooks];
    if (email) result = result.filter(b => b.userEmail?.toLowerCase() === email.toLowerCase());
    if (category && category !== 'All') {
      result = result.filter(b => b.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q));
    }
    if (sort === 'copies') result.sort((a, b) => b.copies - a.copies);
    else if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) result = result.slice(0, parseInt(limit));
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to retrieve books', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = verifyAuthToken(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access: Missing or invalid token' }, { status: 401 });
    }

    const newBook = await req.json();
    if (!newBook.title || !newBook.author || !newBook.category) {
      return NextResponse.json({ message: 'Title, Author, and Category are required.' }, { status: 400 });
    }

    const copies = parseInt(newBook.copies) || 1;
    const doc = {
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      category: newBook.category,
      image: newBook.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      copies: copies,
      description: newBook.description || '',
      userName: user.name || newBook.userName || 'Library Member',
      userEmail: user.email,
      createdAt: new Date().toISOString()
    };

    const db = await getMongoDb();
    if (db) {
      const result = await db.collection('books').insertOne(doc);
      return NextResponse.json({
        success: true,
        message: 'Book added successfully!',
        insertedId: result.insertedId,
        book: { ...doc, _id: result.insertedId }
      }, { status: 201 });
    }

    const mockId = 'bk_' + Date.now();
    const created = { ...doc, _id: mockId };
    inMemoryBooks.unshift(created);

    return NextResponse.json({
      success: true,
      message: 'Book added successfully!',
      insertedId: mockId,
      book: created
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to add book', error: error.message }, { status: 500 });
  }
}
