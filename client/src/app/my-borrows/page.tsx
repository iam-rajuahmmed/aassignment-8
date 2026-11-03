'use client';

import React, { useEffect, useState } from 'react';
import { Borrow } from '@/types';
import { getUserBorrows, returnBook } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';
import toast from 'react-hot-toast';
import { BookmarkCheck, RotateCcw, Calendar, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default function MyBorrowsPage() {
  const { user, token } = useAuth();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  // Return modal state
  const [selectedBorrowForReturn, setSelectedBorrowForReturn] = useState<Borrow | null>(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnSubmitting, setReturnSubmitting] = useState(false);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const data = await getUserBorrows(token);
      setBorrows(data);
    } catch (err) {
      console.error('Failed to load borrowed books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'BookNook | My Borrowed Books';
    if (token) {
      fetchBorrows();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Open Return Confirmation Modal
  const handleOpenReturn = (borrow: Borrow) => {
    setSelectedBorrowForReturn(borrow);
    setReturnModalOpen(true);
  };

  // Confirm Return Action
  const handleConfirmReturn = async () => {
    if (!selectedBorrowForReturn) return;
    setReturnSubmitting(true);
    try {
      await returnBook(selectedBorrowForReturn._id, token);
      toast.success('Book returned successfully! Thank you for sharing knowledge.');
      setReturnModalOpen(false);
      // Remove from list
      setBorrows((prev) => prev.filter((b) => b._id !== selectedBorrowForReturn._id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to return book.');
    } finally {
      setReturnSubmitting(false);
    }
  };

  // Calculate days remaining until return date
  const getDaysRemaining = (dueDateStr: string) => {
    const due = new Date(dueDateStr).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900 mb-2">
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Active Lending</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">
              My Borrowed Books
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Keep track of your borrowed library books, due dates, and return them when finished.
            </p>
          </div>

          <a
            href="/books"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse More Books</span>
          </a>
        </div>

        {/* Content Table */}
        {loading ? (
          <LoadingSpinner message="Retrieving your borrowed books..." />
        ) : borrows.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-6">Book Image & Title</th>
                    <th className="py-4 px-6">Borrow Date</th>
                    <th className="py-4 px-6">Return Due Date</th>
                    <th className="py-4 px-6">Status / Timeline</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                  {borrows.map((borrow) => {
                    const daysRemaining = getDaysRemaining(borrow.returnDate);
                    const isOverdue = daysRemaining < 0;

                    return (
                      <tr key={borrow._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors">
                        
                        {/* Book Image & Title */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={borrow.bookImage}
                              alt={borrow.bookTitle}
                              className="w-12 h-16 object-cover rounded-lg shadow-2xs shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div>
                              <h4 className="font-serif font-bold text-slate-900 dark:text-white line-clamp-1">
                                {borrow.bookTitle}
                              </h4>
                              <p className="text-xs text-slate-400">
                                ID: {borrow.bookId.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Borrow Date */}
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>{borrow.borrowDate}</span>
                          </div>
                        </td>

                        {/* Return Due Date */}
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{borrow.returnDate}</span>
                          </div>
                        </td>

                        {/* Status / Days Remaining */}
                        <td className="py-4 px-6">
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200">
                              <AlertCircle className="w-3 h-3" />
                              Overdue by {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'day' : 'days'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                              <BookmarkCheck className="w-3 h-3" />
                              {daysRemaining === 0 ? 'Due today' : `${daysRemaining} days left`}
                            </span>
                          )}
                        </td>

                        {/* Return Book Button */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleOpenReturn(borrow)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all border border-rose-200 dark:border-rose-900"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Return Book</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <BookmarkCheck className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-slate-200">
              No Books Currently Borrowed
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              Your borrowing shelf is empty. Explore our collection of titles and borrow a book to start reading.
            </p>
            <a
              href="/books"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-md shadow-amber-600/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Books</span>
            </a>
          </div>
        )}

        {/* Return Book Confirmation Modal */}
        <ConfirmModal
          isOpen={returnModalOpen}
          title="Return Book to Library"
          message={`Are you ready to return "${selectedBorrowForReturn?.bookTitle}"? This will return the book to the shelves and increment the available copies for other members.`}
          confirmLabel="Return Book"
          cancelLabel="Keep Reading"
          isDestructive={false}
          isLoading={returnSubmitting}
          onConfirm={handleConfirmReturn}
          onCancel={() => setReturnModalOpen(false)}
        />

      </div>
    </ProtectedRoute>
  );
}

