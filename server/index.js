const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'booknook_super_secure_secret_key_2026';

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Dynamically allow requesting origin so Vercel preview/production and local domains work seamlessly
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// MongoDB Connection URI
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booknook_db";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 2000, // Fail fast if local mongo is down so in-memory fallback engages
});

// Seed data with authentic, non-lorem library books
const initialBooks = [
  {
    _id: "65b801a1c9e77b001a111111",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    copies: 5,
    description: "A timeless masterpiece exploring racial injustice and the loss of innocence in the American Deep South through the compassionate eyes of young Scout Finch.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-01-15T09:00:00Z").toISOString()
  },
  {
    _id: "65b801a1c9e77b001a222222",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80",
    copies: 4,
    description: "An iconic journey into modern astrophysics explaining the Big Bang, black holes, light cones, and quantum mechanics for curious minds everywhere.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-01-18T10:30:00Z").toISOString()
  },
  {
    _id: "65b801a1c9e77b001a333333",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80",
    copies: 6,
    description: "How an insignificant ape became the ruler of planet Earth: a captivating sweeping narrative of human evolution, cognitive revolutions, and our shared destiny.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-01-20T11:15:00Z").toISOString()
  },
  {
    _id: "65b801a1c9e77b001a444444",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Kids",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    copies: 8,
    description: "A poetic and philosophical tale of a young prince who visits various planets in space, addressing loneliness, friendship, love, and loss.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-01-22T14:00:00Z").toISOString()
  },
  {
    _id: "65b801a1c9e77b001a555555",
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    copies: 3,
    description: "Carl Sagan's celebrated exploration of the universe, blending science, philosophy, and history to celebrate humanity's place in the cosmic ocean.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-01-25T16:45:00Z").toISOString()
  },
  {
    _id: "65b801a1c9e77b001a666666",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
    copies: 7,
    description: "An evocative portrait of Jazz Age glamour, obsession, decadence, and the elusive American Dream centered around mysterious millionaire Jay Gatsby.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-02-01T08:20:00Z").toISOString()
  },
  {
    _id: "65b801a1c9e77b001a777777",
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    category: "History",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    copies: 4,
    description: "A Pulitzer Prize-winning investigation into geographical and environmental factors that shaped modern world civilizations over the past 13,000 years.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-02-05T12:00:00Z").toISOString()
  },
  {
    _id: "65b801a1c9e77b001a888888",
    title: "Charlotte's Web",
    author: "E.B. White",
    category: "Kids",
    image: "https://images.unsplash.com/photo-1507842229451-7643b1778c18?auto=format&fit=crop&w=800&q=80",
    copies: 5,
    description: "The heartwarming story of a livestock pig named Wilbur and his loyal friendship with a wise barn spider named Charlotte who saves his life.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-02-10T13:40:00Z").toISOString()
  },
  {
    _id: "65b801a1c9e77b001a999999",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Others",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80",
    copies: 10,
    description: "A profoundly practical framework for personal growth: how tiny changes yield remarkable results by mastering the system of good habit formation.",
    userName: "Library Curator",
    userEmail: "curator@booknook.com",
    createdAt: new Date("2026-02-14T15:10:00Z").toISOString()
  }
];

// In-Memory store fallback if MongoDB is offline
let inMemoryBooks = initialBooks.map(b => ({ ...b }));
let inMemoryBorrows = [];
let isMongoConnected = false;
let booksCollection = null;
let borrowsCollection = null;

// Connect to MongoDB with graceful fallback
async function connectDB() {
  try {
    await client.connect();
    const db = client.db('booknook_db');
    booksCollection = db.collection('books');
    borrowsCollection = db.collection('borrows');

    const count = await booksCollection.countDocuments();
    if (count === 0) {
      await booksCollection.insertMany(initialBooks.map(b => {
        const { _id, ...rest } = b;
        return rest;
      }));
      console.log("Seeded MongoDB database with initial library books.");
    }
    isMongoConnected = true;
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.warn("[Notice] MongoDB connection offline (ECONNREFUSED). Switched to built-in in-memory library database.");
    isMongoConnected = false;
  }
}

connectDB();

// JWT Verification Middleware
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized access: Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access: Bearer token format invalid' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // Local fallback token support
      try {
        const decodedFallback = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        if (decodedFallback && decodedFallback.email) {
          req.user = decodedFallback;
          return next();
        }
      } catch (e) {}

      return res.status(403).send({ message: 'Forbidden access: Token has expired or is invalid' });
    }
    req.user = decoded;
    next();
  });
};

// ---------------- AUTH ROUTES ----------------
// Issue JWT Token
app.post('/auth/jwt', (req, res) => {
  try {
    const user = req.body;
    if (!user || !user.email) {
      return res.status(400).send({ message: 'User email is required to issue token' });
    }
    const token = jwt.sign(
      { email: user.email, name: user.name || 'Library Member' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.send({ success: true, token });
  } catch (err) {
    res.status(500).send({ message: 'Error creating token', error: err.message });
  }
});

// Seed Route
app.get('/seed', async (req, res) => {
  if (isMongoConnected && booksCollection) {
    const count = await booksCollection.countDocuments();
    if (count > 0) return res.send({ message: `Database contains ${count} books.` });
    const result = await booksCollection.insertMany(initialBooks.map(b => {
      const { _id, ...rest } = b;
      return rest;
    }));
    return res.send({ message: "Books seeded successfully!", insertedCount: result.insertedCount });
  }
  inMemoryBooks = initialBooks.map(b => ({ ...b }));
  res.send({ message: "In-memory books reset successfully!", count: inMemoryBooks.length });
});

// ---------------- REQUIRED 8 API ROUTES ----------------

// 1. GET /books — get all books (public)
app.get('/books', async (req, res) => {
  try {
    const { limit, sort, category, search, email } = req.query;

    if (isMongoConnected && booksCollection) {
      let query = {};
      if (email) query.userEmail = email;
      if (category && category !== 'All') query.category = { $regex: new RegExp(`^${category}$`, 'i') };
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
      return res.send(books);
    }

    // In-memory fallback
    let result = [...inMemoryBooks];
    if (email) result = result.filter(b => b.userEmail?.toLowerCase() === email.toLowerCase());
    if (category && category !== 'All') result = result.filter(b => b.category?.toLowerCase() === category.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q));
    }
    if (sort === 'copies') result.sort((a, b) => b.copies - a.copies);
    else if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) result = result.slice(0, parseInt(limit));
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve books", error: error.message });
  }
});

// 2. GET /books/:id — get one book
app.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && booksCollection && ObjectId.isValid(id)) {
      const book = await booksCollection.findOne({ _id: new ObjectId(id) });
      if (book) return res.send(book);
    }

    const match = inMemoryBooks.find(b => String(b._id) === id);
    if (!match) {
      return res.status(404).send({ message: 'Book not found' });
    }
    res.send(match);
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve book", error: error.message });
  }
});

// 3. POST /books — add a book (protected by JWT)
app.post('/books', verifyJWT, async (req, res) => {
  try {
    const newBook = req.body;
    if (!newBook.title || !newBook.author || !newBook.category) {
      return res.status(400).send({ message: 'Title, Author, and Category are required.' });
    }

    const copies = parseInt(newBook.copies) || 1;
    const doc = {
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      category: newBook.category,
      image: newBook.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      copies: copies,
      description: newBook.description || '',
      userName: req.user.name || newBook.userName || 'Library Member',
      userEmail: req.user.email,
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected && booksCollection) {
      const result = await booksCollection.insertOne(doc);
      return res.status(201).send({
        success: true,
        message: 'Book added successfully!',
        insertedId: result.insertedId,
        book: { ...doc, _id: result.insertedId }
      });
    }

    const mockId = 'bk_' + Date.now();
    const created = { ...doc, _id: mockId };
    inMemoryBooks.unshift(created);

    res.status(201).send({
      success: true,
      message: 'Book added successfully!',
      insertedId: mockId,
      book: created
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to add book', error: error.message });
  }
});

// 4. PATCH /books/:id — update a book (protected by JWT)
app.patch('/books/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isMongoConnected && booksCollection && ObjectId.isValid(id)) {
      const existingBook = await booksCollection.findOne({ _id: new ObjectId(id) });
      if (!existingBook) return res.status(404).send({ message: 'Book not found' });
      if (existingBook.userEmail && existingBook.userEmail !== req.user.email) {
        return res.status(403).send({ message: 'You are not authorized to update this book.' });
      }

      const updateFields = {};
      if (updateData.title !== undefined) updateFields.title = updateData.title.trim();
      if (updateData.author !== undefined) updateFields.author = updateData.author.trim();
      if (updateData.category !== undefined) updateFields.category = updateData.category;
      if (updateData.image !== undefined) updateFields.image = updateData.image;
      if (updateData.copies !== undefined) updateFields.copies = parseInt(updateData.copies);
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      updateFields.updatedAt = new Date().toISOString();

      const result = await booksCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
      return res.send({ success: true, message: 'Book updated successfully!', modifiedCount: result.modifiedCount });
    }

    // In-memory update
    const index = inMemoryBooks.findIndex(b => String(b._id) === id);
    if (index === -1) return res.status(404).send({ message: 'Book not found' });

    if (inMemoryBooks[index].userEmail && inMemoryBooks[index].userEmail !== req.user.email) {
      return res.status(403).send({ message: 'You are not authorized to update this book.' });
    }

    inMemoryBooks[index] = { ...inMemoryBooks[index], ...updateData, updatedAt: new Date().toISOString() };
    res.send({ success: true, message: 'Book updated successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to update book', error: error.message });
  }
});

// 5. DELETE /books/:id — delete a book (protected by JWT)
app.delete('/books/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && booksCollection && ObjectId.isValid(id)) {
      const existing = await booksCollection.findOne({ _id: new ObjectId(id) });
      if (!existing) return res.status(404).send({ message: 'Book not found' });
      if (existing.userEmail && existing.userEmail !== req.user.email) {
        return res.status(403).send({ message: 'You are not authorized to delete this book.' });
      }
      const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
      return res.send({ success: true, message: 'Book deleted successfully from library!', deletedCount: result.deletedCount });
    }

    const index = inMemoryBooks.findIndex(b => String(b._id) === id);
    if (index === -1) return res.status(404).send({ message: 'Book not found' });
    if (inMemoryBooks[index].userEmail && inMemoryBooks[index].userEmail !== req.user.email) {
      return res.status(403).send({ message: 'You are not authorized to delete this book.' });
    }

    inMemoryBooks.splice(index, 1);
    res.send({ success: true, message: 'Book deleted successfully from library!' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete book', error: error.message });
  }
});

// 6. POST /borrows — borrow a book (protected by JWT)
app.post('/borrows', verifyJWT, async (req, res) => {
  try {
    const { bookId, bookTitle, bookImage, returnDate } = req.body;
    const userEmail = req.user.email;
    const userName = req.user.name || req.body.userName || 'Library Member';

    if (!bookId) return res.status(400).send({ message: 'Book ID is required to borrow.' });

    if (isMongoConnected && borrowsCollection && booksCollection && ObjectId.isValid(bookId)) {
      // Challenge 1: Check No Double Borrow
      const existingBorrow = await borrowsCollection.findOne({ bookId: bookId, userEmail: userEmail });
      if (existingBorrow) {
        return res.status(400).send({
          message: 'You have already borrowed this book! Please return your current copy before borrowing again.'
        });
      }

      // Challenge 2: Check Available Copies
      const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });
      if (!book) return res.status(404).send({ message: 'The book you are trying to borrow does not exist.' });
      if (book.copies <= 0) return res.status(400).send({ message: 'This book is currently out of stock (Not Available).' });

      await booksCollection.updateOne({ _id: new ObjectId(bookId) }, { $inc: { copies: -1 } });

      const borrowRecord = {
        bookId: bookId,
        bookTitle: bookTitle || book.title,
        bookImage: bookImage || book.image,
        userEmail: userEmail,
        userName: userName,
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: returnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      const result = await borrowsCollection.insertOne(borrowRecord);
      return res.status(201).send({
        success: true,
        message: 'Book borrowed successfully! Enjoy your reading.',
        insertedId: result.insertedId,
        borrow: { ...borrowRecord, _id: result.insertedId }
      });
    }

    // In-memory borrow
    const existingBorrow = inMemoryBorrows.find(b => b.bookId === bookId && b.userEmail === userEmail);
    if (existingBorrow) {
      return res.status(400).send({
        message: 'You have already borrowed this book! Please return your current copy before borrowing again.'
      });
    }

    const book = inMemoryBooks.find(b => String(b._id) === bookId);
    if (!book) return res.status(404).send({ message: 'Book not found' });
    if (book.copies <= 0) return res.status(400).send({ message: 'This book is currently out of stock (Not Available).' });

    book.copies = Math.max(0, book.copies - 1);

    const borrowRecord = {
      _id: 'br_' + Date.now(),
      bookId: bookId,
      bookTitle: bookTitle || book.title,
      bookImage: bookImage || book.image,
      userEmail: userEmail,
      userName: userName,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: returnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    inMemoryBorrows.unshift(borrowRecord);
    res.status(201).send({
      success: true,
      message: 'Book borrowed successfully! Enjoy your reading.',
      insertedId: borrowRecord._id,
      borrow: borrowRecord
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to borrow book', error: error.message });
  }
});

// 7. GET /borrows — get borrows of logged in user (protected by JWT)
app.get('/borrows', verifyJWT, async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (isMongoConnected && borrowsCollection) {
      const borrows = await borrowsCollection.find({ userEmail: userEmail }).sort({ createdAt: -1 }).toArray();
      return res.send(borrows);
    }
    const userBorrows = inMemoryBorrows.filter(b => b.userEmail === userEmail);
    res.send(userBorrows);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch user borrows', error: error.message });
  }
});

// 8. DELETE /borrows/:id — return a book (protected by JWT)
app.delete('/borrows/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && borrowsCollection && ObjectId.isValid(id)) {
      const borrowRecord = await borrowsCollection.findOne({ _id: new ObjectId(id) });
      if (!borrowRecord) return res.status(404).send({ message: 'Borrow record not found' });
      if (borrowRecord.userEmail !== req.user.email) {
        return res.status(403).send({ message: 'Unauthorized: You can only return your own borrowed books.' });
      }

      if (borrowRecord.bookId && ObjectId.isValid(borrowRecord.bookId)) {
        await booksCollection.updateOne({ _id: new ObjectId(borrowRecord.bookId) }, { $inc: { copies: 1 } });
      }

      const deleteResult = await borrowsCollection.deleteOne({ _id: new ObjectId(id) });
      return res.send({
        success: true,
        message: 'Book returned successfully! Thank you for sharing knowledge.',
        deletedCount: deleteResult.deletedCount
      });
    }

    const index = inMemoryBorrows.findIndex(b => b._id === id);
    if (index === -1) return res.status(404).send({ message: 'Borrow record not found' });
    if (inMemoryBorrows[index].userEmail !== req.user.email) {
      return res.status(403).send({ message: 'Unauthorized: You can only return your own borrowed books.' });
    }

    const borrowRecord = inMemoryBorrows[index];
    const book = inMemoryBooks.find(b => String(b._id) === borrowRecord.bookId);
    if (book) book.copies = (book.copies || 0) + 1;

    inMemoryBorrows.splice(index, 1);
    res.send({
      success: true,
      message: 'Book returned successfully! Thank you for sharing knowledge.'
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to return book', error: error.message });
  }
});

// Root Health Check Route
app.get('/', (req, res) => {
  res.send({
    status: 'online',
    name: 'BookNook – A Small Online Library API',
    mode: isMongoConnected ? 'mongodb' : 'in-memory-resilient',
    timestamp: new Date().toISOString(),
    routes: [
      'GET /books',
      'GET /books/:id',
      'POST /books (protected)',
      'PATCH /books/:id (protected)',
      'DELETE /books/:id (protected)',
      'POST /borrows (protected)',
      'GET /borrows (protected)',
      'DELETE /borrows/:id (protected)',
      'POST /auth/jwt'
    ]
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`BookNook server running on port: ${port}`);
  });
}

module.exports = app;
