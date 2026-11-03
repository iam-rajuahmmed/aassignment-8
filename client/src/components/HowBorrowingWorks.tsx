'use client';

import React from 'react';
import { Search, BookmarkPlus, BookOpenCheck, RotateCcw } from 'lucide-react';

export default function HowBorrowingWorks() {
  const steps = [
    {
      step: '01',
      title: 'Discover & Search',
      description: 'Explore hundreds of titles across Fiction, Science, History, and more with instant keyword search and category filtering.',
      icon: Search,
      badge: 'Step One',
      color: 'from-amber-500 to-amber-600',
    },
    {
      step: '02',
      title: 'One-Click Borrow',
      description: 'Select your preferred return date and confirm your borrow instantly. Real-time inventory automatically updates available copies.',
      icon: BookmarkPlus,
      badge: 'Step Two',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      step: '03',
      title: 'Immersive Reading',
      description: 'Track all your active loans in your personalized My Borrows dashboard with clear due-date reminders.',
      icon: BookOpenCheck,
      badge: 'Step Three',
      color: 'from-blue-500 to-blue-600',
    },
    {
      step: '04',
      title: 'Effortless Return',
      description: 'Done reading? Click "Return Book" with one tap. Copies automatically replenish so another fellow reader can enjoy the title.',
      icon: RotateCcw,
      badge: 'Step Four',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <section className="py-16 my-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-900">
          Seamless Circulation
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">
          How Borrowing Works
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
          BookNook makes sharing literature effortless. Borrow what you love, treat books with care, and return them for the next reader.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="relative p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="font-mono text-3xl font-extrabold text-slate-200 dark:text-slate-700">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>{item.badge}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

