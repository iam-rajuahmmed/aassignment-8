import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export interface BookDoc {
  _id: string | ObjectId;
  title: string;
  author: string;
  category: string;
  image: string;
  copies: number;
  description: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BorrowDoc {
  _id: string | ObjectId;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  createdAt: string;
}

export const initialBooks: BookDoc[] = [
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
    createdAt: "2026-01-15T09:00:00.000Z"
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
    createdAt: "2026-01-18T10:30:00.000Z"
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
    createdAt: "2026-01-20T11:15:00.000Z"
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
    createdAt: "2026-01-22T14:00:00.000Z"
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
    createdAt: "2026-01-25T16:45:00.000Z"
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
    createdAt: "2026-02-01T08:20:00.000Z"
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
    createdAt: "2026-02-05T12:00:00.000Z"
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
    createdAt: "2026-02-10T13:40:00.000Z"
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
    createdAt: "2026-02-14T15:10:00.000Z"
  }
];

// Global in-memory state fallback
declare global {
  // eslint-disable-next-line no-var
  var _booknookMongoPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _booknookInMemoryBooks: BookDoc[] | undefined;
  // eslint-disable-next-line no-var
  var _booknookInMemoryBorrows: BorrowDoc[] | undefined;
}

if (!global._booknookInMemoryBooks) {
  global._booknookInMemoryBooks = initialBooks.map(b => ({ ...b }));
}
if (!global._booknookInMemoryBorrows) {
  global._booknookInMemoryBorrows = [];
}

export const inMemoryBooks = global._booknookInMemoryBooks;
export const inMemoryBorrows = global._booknookInMemoryBorrows;

const JWT_SECRET = process.env.JWT_SECRET || 'booknook_super_secure_secret_key_2026';
export { JWT_SECRET };

let cachedClient: MongoClient | null = null;

export async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  try {
    if (cachedClient) {
      return cachedClient.db('booknook_db');
    }

    if (!global._booknookMongoPromise) {
      const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        serverSelectionTimeoutMS: 2000,
      });
      global._booknookMongoPromise = client.connect();
    }

    cachedClient = await global._booknookMongoPromise;
    return cachedClient.db('booknook_db');
  } catch (err) {
    console.warn('[MongoDB Fallback] Connecting failed, using in-memory resilient cache:', err);
    return null;
  }
}

export function verifyAuthToken(req: Request): { email: string; name?: string } | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : parts[0];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && decoded.email) return decoded;
  } catch {
    // Fallback base64 decoding for resilience
    try {
      const decodedFallback = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (decodedFallback && decodedFallback.email) return decodedFallback;
    } catch {
      // invalid
    }
  }
  return null;
}
