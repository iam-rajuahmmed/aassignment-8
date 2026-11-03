'use client';

import React from 'react';
import { Book } from '@/types';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const isAvailable = book.copies > 0;

  // Category badge colors
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'fiction':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-800';
      case 'science':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'history':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'kids':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      
      {/* Uniform Book Image Container */}
      <div className="relative w-full h-64 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xs backdrop-blur-xs ${getCategoryColor(book.category)}`}>
            {book.category}
          </span>
        </div>

        {/* Stock Status Tag */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {book.copies} {book.copies === 1 ? 'Copy' : 'Copies'}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-rose-600/90 text-white backdrop-blur-xs shadow-xs">
              Not Available
            </span>
          )}
        </div>
      </div>

      {/* Card Content - flex-grow ensures equal height */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Author */}
          <p className="text-xs uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 mb-1">
            {book.author}
          </p>

          {/* Book Title */}
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {book.title}
          </h3>

          {/* Description snippet */}
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {book.description || 'Delve into this captivating volume available for members of the BookNook community.'}
          </p>
        </div>

        {/* Card Footer: View Details Button */}
        <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            {isAvailable ? 'Ready to borrow' : 'Waitlist only'}
          </span>

          <a
            href={`/books/${book._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-all duration-200 group-hover:gap-2 shadow-2xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
}

