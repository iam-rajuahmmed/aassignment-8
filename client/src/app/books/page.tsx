'use client';

import React, { useEffect, useState } from 'react';
import { Book } from '@/types';
import { getBooks } from '@/lib/api';
import BookCard from '@/components/BookCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, Filter, BookOpen, SlidersHorizontal } from 'lucide-react';

const categories = ['All', 'Fiction', 'Science', 'History', 'Kids', 'Others'];

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Load books on filters change
  const fetchFilteredBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks({
        category: selectedCategory,
        search: searchTerm,
        sort: sortBy,
      });
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'BookNook | All Books';
    fetchFilteredBooks();
  }, [selectedCategory, sortBy]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredBooks();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto pt-4 pb-2">
        <span className="text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-900">
          Complete Catalog
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-4">
          All Library Books
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
          Browse through our curated collection of books. Discover classics, check real-time availability, and borrow in one click.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </form>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="copies">Sort: Available Copies</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-700/60 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Genre:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Books Grid: 3 cards per row on desktop as required */}
      {loading ? (
        <LoadingSpinner message="Loading catalog books..." />
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
          <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-slate-200">
            No Books Match Your Criteria
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or selecting another category to discover other books in the library.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}

