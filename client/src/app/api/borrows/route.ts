import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMongoDb, inMemoryBooks, inMemoryBorrows, verifyAuthToken } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = verifyAuthToken(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || user.email;

    const db = await getMongoDb();
    if (db) {
      const borrows = await db.collection('borrows').find({ userEmail: email }).sort({ createdAt: -1 }).toArray();
      return NextResponse.json(borrows);
    }

    const userBorrows = inMemoryBorrows.filter(b => b.userEmail === email);
    return NextResponse.json(userBorrows);
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch user borrows', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = verifyAuthToken(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { bookId, bookTitle, bookImage, returnDate } = await req.json();
    const userEmail = user.email;
    const userName = user.name || 'Library Member';

    if (!bookId) {
      return NextResponse.json({ message: 'Book ID is required to borrow.' }, { status: 400 });
    }

    const db = await getMongoDb();
    if (db && ObjectId.isValid(bookId)) {
      const borrowsCollection = db.collection('borrows');
      const booksCollection = db.collection('books');

      // Check duplicate borrow
      const existingBorrow = await borrowsCollection.findOne({ bookId, userEmail });
      if (existingBorrow) {
        return NextResponse.json({
          message: 'You have already borrowed this book! Please return your current copy before borrowing again.'
        }, { status: 400 });
      }

      // Check available copies
      const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });
      if (!book) return NextResponse.json({ message: 'The book you are trying to borrow does not exist.' }, { status: 404 });
      if (book.copies <= 0) return NextResponse.json({ message: 'This book is currently out of stock (Not Available).' }, { status: 400 });

      await booksCollection.updateOne({ _id: new ObjectId(bookId) }, { $inc: { copies: -1 } });

      const borrowRecord = {
        bookId,
        bookTitle: bookTitle || book.title,
        bookImage: bookImage || book.image,
        userEmail,
        userName,
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: returnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      const result = await borrowsCollection.insertOne(borrowRecord);
      return NextResponse.json({
        success: true,
        message: 'Book borrowed successfully! Enjoy your reading.',
        insertedId: result.insertedId,
        borrow: { ...borrowRecord, _id: result.insertedId }
      }, { status: 201 });
    }

    // In-memory fallback
    const existingBorrow = inMemoryBorrows.find(b => b.bookId === bookId && b.userEmail === userEmail);
    if (existingBorrow) {
      return NextResponse.json({
        message: 'You have already borrowed this book! Please return your current copy before borrowing again.'
      }, { status: 400 });
    }

    const book = inMemoryBooks.find(b => String(b._id) === bookId);
    if (!book) return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    if (book.copies <= 0) return NextResponse.json({ message: 'This book is currently out of stock (Not Available).' }, { status: 400 });

    book.copies = Math.max(0, book.copies - 1);

    const borrowRecord = {
      _id: 'br_' + Date.now(),
      bookId,
      bookTitle: bookTitle || book.title,
      bookImage: bookImage || book.image,
      userEmail,
      userName,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: returnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    inMemoryBorrows.unshift(borrowRecord);
    return NextResponse.json({
      success: true,
      message: 'Book borrowed successfully! Enjoy your reading.',
      insertedId: borrowRecord._id,
      borrow: borrowRecord
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to borrow book', error: error.message }, { status: 500 });
  }
}
