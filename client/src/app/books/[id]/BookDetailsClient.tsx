'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book } from '@/types';
import { getBookById, borrowBook } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  Layers, 
  Calendar, 
  User as UserIcon, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function BookDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const bookId = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowSubmitting, setBorrowSubmitting] = useState(false);

  // Return date state (defaults to 14 days from today)
  const defaultReturn = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState(defaultReturn);

  // Fetch book details
  useEffect(() => {
    async function loadBook() {
      if (!bookId) return;
      try {
        const data = await getBookById(bookId);
        if (data) {
          setBook(data);
          document.title = `BookNook | ${data.title}`;
        }
      } catch (err) {
        console.error('Failed to load book details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [bookId]);

  // Handle Borrow button click
  const handleBorrowClick = () => {
    if (!user) {
      toast.error('Please sign in to borrow books from BookNook.');
      const currentUrl = encodeURIComponent(`/books/${bookId}`);
      router.push(`/login?callbackUrl=${currentUrl}`);
      return;
    }

    if (book && book.copies <= 0) {
      toast.error('This book is currently out of stock.');
      return;
    }

    setBorrowModalOpen(true);
  };

  // Confirm Borrow Submit
  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !user) return;

    setBorrowSubmitting(true);
    try {
      const response = await borrowBook(
        {
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image,
          returnDate: returnDate,
        },
        token
      );

      toast.success(response.message || 'Book borrowed successfully! Happy reading.');
      setBorrowModalOpen(false);

      // Decrement copies locally in UI
      setBook((prev) => (prev ? { ...prev, copies: Math.max(0, prev.copies - 1) } : prev));
    } catch (err: any) {
      // Handles "No Double Borrow" challenge error toast
      toast.error(err.message || 'Failed to borrow book.');
    } finally {
      setBorrowSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <LoadingSpinner message="Fetching book details..." />;
  }

  if (!book) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
        <h2 className="font-serif text-2xl font-bold text-slate-800 dark:text-slate-200">
          Book Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested book could not be found in our database.
        </p>
        <a
          href="/books"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Books</span>
        </a>
      </div>
    );
  }

  const isAvailable = book.copies > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Back button */}
      <a
        href="/books"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Books</span>
      </a>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
          
          {/* Book Image */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/30">
                {book.category}
              </span>
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                <Layers className="w-4 h-4" />
                <span>Book Catalog #{book._id.toString().slice(-6)}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {book.title}
              </h1>

              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 font-medium">
                by <span className="text-amber-700 dark:text-amber-400 font-semibold">{book.author}</span>
              </p>

              {/* Stock / Availability Badge */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  {isAvailable ? `${book.copies} Copies Available` : 'Currently Out of Stock'}
                </span>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Genre: <strong className="text-slate-700 dark:text-slate-300">{book.category}</strong>
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/60">
                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-base mb-2">
                  About this Book
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {book.description || 'No detailed synopsis provided for this book.'}
                </p>
              </div>

              {/* Submitter Info */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Added by: <strong className="text-slate-700 dark:text-slate-300">{book.userName}</strong></span>
                </div>
                {book.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBorrowClick}
                disabled={!isAvailable}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                  isAvailable
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 hover:scale-[1.02] cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>{isAvailable ? 'Borrow This Book' : 'Out of Stock (Unavailable)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Confirmation Modal */}
      {borrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl relative animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Free 14-Day Library Loan
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  Confirm Borrowing
                </h3>
              </div>
              <button
                onClick={() => setBorrowModalOpen(false)}
                disabled={borrowSubmitting}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmBorrow} className="mt-6 space-y-4">
              {/* Book Summary Card */}
              <div className="flex items-center gap-3 p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded-lg shadow-xs"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {book.title}
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    by {book.author}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Remaining Copies: {book.copies}
                  </p>
                </div>
              </div>

              {/* Read-Only User Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Borrower Name (Read-Only)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-sm cursor-not-allowed"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              {/* Read-Only User Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Borrower Email (Read-Only)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-sm cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              {/* Return Date Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Return Due Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Standard loan period is 14 days. You can return anytime before.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBorrowModalOpen(false)}
                  disabled={borrowSubmitting}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={borrowSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all disabled:opacity-70"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{borrowSubmitting ? 'Confirming...' : 'Confirm Borrow'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

