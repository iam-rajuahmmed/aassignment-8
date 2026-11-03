import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMongoDb, inMemoryBooks, inMemoryBorrows, verifyAuthToken } from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = verifyAuthToken(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = params;
    const db = await getMongoDb();
    if (db && ObjectId.isValid(id)) {
      const borrowsCollection = db.collection('borrows');
      const booksCollection = db.collection('books');

      const borrowRecord = await borrowsCollection.findOne({ _id: new ObjectId(id) });
      if (!borrowRecord) return NextResponse.json({ message: 'Borrow record not found' }, { status: 404 });
      if (borrowRecord.userEmail !== user.email) {
        return NextResponse.json({ message: 'Unauthorized: You can only return your own borrowed books.' }, { status: 403 });
      }

      if (borrowRecord.bookId && ObjectId.isValid(borrowRecord.bookId)) {
        await booksCollection.updateOne({ _id: new ObjectId(borrowRecord.bookId) }, { $inc: { copies: 1 } });
      }

      await borrowsCollection.deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({
        success: true,
        message: 'Book returned successfully! Thank you for sharing knowledge.'
      });
    }

    const index = inMemoryBorrows.findIndex(b => String(b._id) === id);
    if (index === -1) return NextResponse.json({ message: 'Borrow record not found' }, { status: 404 });
    if (inMemoryBorrows[index].userEmail !== user.email) {
      return NextResponse.json({ message: 'Unauthorized: You can only return your own borrowed books.' }, { status: 403 });
    }

    const borrowRecord = inMemoryBorrows[index];
    const book = inMemoryBooks.find(b => String(b._id) === borrowRecord.bookId);
    if (book) book.copies = (book.copies || 0) + 1;

    inMemoryBorrows.splice(index, 1);
    return NextResponse.json({
      success: true,
      message: 'Book returned successfully! Thank you for sharing knowledge.'
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to return book', error: error.message }, { status: 500 });
  }
}
