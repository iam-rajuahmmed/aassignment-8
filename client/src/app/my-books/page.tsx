'use client';

import React, { useEffect, useState } from 'react';
import { Book } from '@/types';
import { getBooks, updateBook, deleteBook } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';
import EditBookModal from '@/components/EditBookModal';
import toast from 'react-hot-toast';
import { Library, Edit3, Trash2, Plus, Eye, Layers } from 'lucide-react';

export default function MyBooksPage() {
  const { user, token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete Modal State
  const [selectedBookForDelete, setSelectedBookForDelete] = useState<Book | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchMyBooks = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      // Filter books by logged-in user email
      const data = await getBooks({ email: user.email });
      setBooks(data);
    } catch (err) {
      console.error('Failed to load user books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'BookNook | My Added Books';
    if (user?.email) {
      fetchMyBooks();
    }
  }, [user?.email]);

  // Handle Edit Action
  const handleOpenEdit = (book: Book) => {
    setSelectedBookForEdit(book);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData: Partial<Book>) => {
    if (!selectedBookForEdit) return;
    setEditSubmitting(true);
    try {
      await updateBook(selectedBookForEdit._id, updatedData, token);
      toast.success('Book updated successfully!');
      setEditModalOpen(false);
      // Update local state
      setBooks((prev) =>
        prev.map((b) => (b._id === selectedBookForEdit._id ? { ...b, ...updatedData } : b))
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update book.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle Delete Action with Custom Confirm Modal
  const handleOpenDelete = (book: Book) => {
    setSelectedBookForDelete(book);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBookForDelete) return;
    setDeleteSubmitting(true);
    try {
      await deleteBook(selectedBookForDelete._id, token);
      toast.success('Book removed from library!');
      setDeleteModalOpen(false);
      // Remove from UI
      setBooks((prev) => prev.filter((b) => b._id !== selectedBookForDelete._id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete book.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900 mb-2">
              <Library className="w-3.5 h-3.5" />
              <span>Catalog Management</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">
              My Contributed Books
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Manage, update, and track copies of books you have contributed to BookNook.
            </p>
          </div>

          <a
            href="/add-book"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Book</span>
          </a>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <LoadingSpinner message="Loading your contributed books..." />
        ) : books.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-6">Book</th>
                    <th className="py-4 px-6">Author</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Copies</th>
                    <th className="py-4 px-6">Date Added</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors">
                      {/* Book Thumbnail & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded-lg shadow-2xs shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div>
                            <a
                              href={`/books/${book._id}`}
                              className="font-serif font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
                            >
                              {book.title}
                            </a>
                            <span className="text-xs text-slate-400 block line-clamp-1">
                              {book.description || 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                        {book.author}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {book.category}
                        </span>
                      </td>

                      {/* Copies */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                          <Layers className="w-3.5 h-3.5 text-amber-600" />
                          {book.copies}
                        </span>
                      </td>

                      {/* Date Added */}
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Action Buttons: Edit & Delete */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/books/${book._id}`}
                            title="View Book"
                            className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleOpenEdit(book)}
                            title="Edit Book Information"
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenDelete(book)}
                            title="Delete Book"
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <Library className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-slate-200">
              You Haven't Contributed Any Books Yet
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              Share your favorite books with the community and let others borrow and enjoy them.
            </p>
            <a
              href="/add-book"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-md shadow-amber-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Book</span>
            </a>
          </div>
        )}

        {/* Edit Modal (Pre-filled form) */}
        <EditBookModal
          isOpen={editModalOpen}
          book={selectedBookForEdit}
          isLoading={editSubmitting}
          onSave={handleSaveEdit}
          onClose={() => setEditModalOpen(false)}
        />

        {/* Custom Delete Confirmation Modal (NOT window.confirm) */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Book from Library"
          message={`Are you sure you want to permanently remove "${selectedBookForDelete?.title}" from the library catalog? This action cannot be undone.`}
          confirmLabel="Delete Book"
          cancelLabel="Keep Book"
          isDestructive={true}
          isLoading={deleteSubmitting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />

      </div>
    </ProtectedRoute>
  );
}

