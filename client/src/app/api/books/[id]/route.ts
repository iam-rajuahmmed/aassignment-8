import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMongoDb, inMemoryBooks, verifyAuthToken } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const db = await getMongoDb();
    if (db && ObjectId.isValid(id)) {
      const book = await db.collection('books').findOne({ _id: new ObjectId(id) });
      if (book) return NextResponse.json(book);
    }

    const match = inMemoryBooks.find(b => String(b._id) === id);
    if (!match) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }
    return NextResponse.json(match);
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to retrieve book', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = verifyAuthToken(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = params;
    const updateData = await req.json();

    const db = await getMongoDb();
    if (db && ObjectId.isValid(id)) {
      const existingBook = await db.collection('books').findOne({ _id: new ObjectId(id) });
      if (!existingBook) return NextResponse.json({ message: 'Book not found' }, { status: 404 });
      if (existingBook.userEmail && existingBook.userEmail !== user.email) {
        return NextResponse.json({ message: 'You are not authorized to update this book.' }, { status: 403 });
      }

      const updateFields: any = {};
      if (updateData.title !== undefined) updateFields.title = updateData.title.trim();
      if (updateData.author !== undefined) updateFields.author = updateData.author.trim();
      if (updateData.category !== undefined) updateFields.category = updateData.category;
      if (updateData.image !== undefined) updateFields.image = updateData.image;
      if (updateData.copies !== undefined) updateFields.copies = parseInt(updateData.copies);
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      updateFields.updatedAt = new Date().toISOString();

      await db.collection('books').updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
      return NextResponse.json({ success: true, message: 'Book updated successfully!' });
    }

    const index = inMemoryBooks.findIndex(b => String(b._id) === id);
    if (index === -1) return NextResponse.json({ message: 'Book not found' }, { status: 404 });

    if (inMemoryBooks[index].userEmail && inMemoryBooks[index].userEmail !== user.email) {
      return NextResponse.json({ message: 'You are not authorized to update this book.' }, { status: 403 });
    }

    inMemoryBooks[index] = { ...inMemoryBooks[index], ...updateData, updatedAt: new Date().toISOString() };
    return NextResponse.json({ success: true, message: 'Book updated successfully!' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update book', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = verifyAuthToken(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = params;
    const db = await getMongoDb();
    if (db && ObjectId.isValid(id)) {
      const existing = await db.collection('books').findOne({ _id: new ObjectId(id) });
      if (!existing) return NextResponse.json({ message: 'Book not found' }, { status: 404 });
      if (existing.userEmail && existing.userEmail !== user.email) {
        return NextResponse.json({ message: 'You are not authorized to delete this book.' }, { status: 403 });
      }
      await db.collection('books').deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ success: true, message: 'Book deleted successfully from library!' });
    }

    const index = inMemoryBooks.findIndex(b => String(b._id) === id);
    if (index === -1) return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    if (inMemoryBooks[index].userEmail && inMemoryBooks[index].userEmail !== user.email) {
      return NextResponse.json({ message: 'You are not authorized to delete this book.' }, { status: 403 });
    }

    inMemoryBooks.splice(index, 1);
    return NextResponse.json({ success: true, message: 'Book deleted successfully from library!' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete book', error: error.message }, { status: 500 });
  }
}
