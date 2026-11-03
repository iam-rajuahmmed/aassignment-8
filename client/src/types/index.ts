export interface Book {
  _id: string;
  title: string;
  author: string;
  category: 'Fiction' | 'Science' | 'History' | 'Kids' | 'Others' | string;
  image: string;
  copies: number;
  description: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider?: string;
}

