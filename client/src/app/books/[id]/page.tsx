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

export default function BookDetailsPage() {
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
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 backdrop-blur-xs">
                  {book.category}
                </span>
              </div>
            </div>
          </div>

          {/* Book Info Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {book.author}
              </p>

              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 leading-tight">
                {book.title}
              </h1>

              {/* Status and Copies Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available ({book.copies} {book.copies === 1 ? 'copy' : 'copies'} remaining)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Not Available
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5" />
                  Added {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Book Synopsis
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {book.description || 'No synopsis provided for this book.'}
                </p>
              </div>

              {/* Contributor / Added By Card */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
                  {book.userName ? book.userName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <p className="text-xs text-slate-400">Added to Library by</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {book.userName || 'Library Curator'}
                  </p>
                  <p className="text-xs text-slate-500">{book.userEmail}</p>
                </div>
              </div>
            </div>

            {/* Borrow Action Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleBorrowClick}
                disabled={!isAvailable}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all ${
                  isAvailable
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/30 hover:scale-105'
                    : 'bg-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>{isAvailable ? 'Borrow This Book' : 'Not Available'}</span>
              </button>

              {!user && (
                <p className="text-xs text-slate-500 text-center sm:text-left">
                  Sign in required to confirm book loan.
                </p>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Borrow Modal Form (Private Requirement) */}
      {borrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                    Confirm Book Borrow
                  </h3>
                  <p className="text-xs text-slate-500">14-day free library lending</p>
                </div>
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

