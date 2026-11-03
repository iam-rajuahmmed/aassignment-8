'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading BookNook...' }: { message?: string }) {
  return (
    <div className="min-h-[350px] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-amber-600 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}

