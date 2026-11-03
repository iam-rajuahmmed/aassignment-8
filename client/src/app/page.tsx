'use client';

import React, { useEffect, useState } from 'react';
import { Book } from '@/types';
import { getBooks } from '@/lib/api';
import BannerSlider from '@/components/BannerSlider';
import BookCard from '@/components/BookCard';
import HowBorrowingWorks from '@/components/HowBorrowingWorks';
import TopCategories from '@/components/TopCategories';
import ReaderReviews from '@/components/ReaderReviews';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BookOpen, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'BookNook | Home - A Small Online Library';

    async function fetchNewArrivals() {
      try {
        // Load latest 6 books from database with sort=newest and limit=6
        const latestBooks = await getBooks({ limit: 6, sort: 'newest' });
        setBooks(latestBooks);
      } catch (err) {
        console.error('Failed to load new arrivals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      
      {/* 1. Banner / Slider with Swiper.js (Minimum 3 slides) */}
      <BannerSlider />

      {/* 2. New Arrivals (Dynamic: Latest 6 books from MongoDB) */}
      <section className="py-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just Added to Library</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              New Arrivals
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-xl">
              Fresh additions from classic literature to modern scientific breakthroughs, ready to borrow.
            </p>
          </div>

          <a
            href="/books"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 group"
          >
            <span>View Complete Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <LoadingSpinner message="Fetching newest books from the library shelves..." />
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.slice(0, 6).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              No new arrivals found at the moment.
            </p>
          </div>
        )}

        {/* "See All Books" Button below cards */}
        <div className="mt-12 text-center">
          <a
            href="/books"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/25 hover:scale-105 transition-all duration-200"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 3. Static Section 1: Top Categories */}
      <TopCategories />

      {/* 4. Static Section 2: How Borrowing Works */}
      <HowBorrowingWorks />

      {/* 5. Static Section 3: Reader Reviews / Community Voices */}
      <ReaderReviews />

      {/* Extra Trust Highlights */}
      <section className="py-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl text-white px-8 md:px-16 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg">100% Free Borrowing</h4>
              <p className="text-xs text-amber-100 mt-1">Zero hidden subscription fees or late penalties.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg">Real-Time Copies</h4>
              <p className="text-xs text-amber-100 mt-1">Instant stock decrement & automated restock.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg">Community Powered</h4>
              <p className="text-xs text-amber-100 mt-1">Add your favorite books and share with readers.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

