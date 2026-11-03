'use client';

import React, { useEffect } from 'react';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'BookNook | 404 - Page Not Found';
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-lg">
          <BookOpen className="w-12 h-12" />
        </div>
        <span className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
          404
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
        Lost in the Stacks?
      </h1>

      <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
        The book chapter or shelf you are searching for does not seem to exist in our library archives.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </a>
        <a
          href="/books"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Books</span>
        </a>
      </div>
    </div>
  );
}

