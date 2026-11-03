'use client';

import React from 'react';
import { BookOpen, Atom, Landmark, Baby, Sparkles, ArrowRight } from 'lucide-react';

export default function TopCategories() {
  const categories = [
    {
      name: 'Fiction',
      count: '42+ Titles',
      desc: 'Compelling classic novels and contemporary narratives.',
      icon: BookOpen,
      href: '/books?category=Fiction',
      color: 'text-violet-600 bg-violet-100 dark:bg-violet-950/60 dark:text-violet-300'
    },
    {
      name: 'Science',
      count: '30+ Titles',
      desc: 'Physics, biology, cosmos, and scientific explorations.',
      icon: Atom,
      href: '/books?category=Science',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300'
    },
    {
      name: 'History',
      count: '28+ Titles',
      desc: 'Chronicles of ancient eras, empires, and revolutions.',
      icon: Landmark,
      href: '/books?category=History',
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300'
    },
    {
      name: 'Kids',
      count: '24+ Titles',
      desc: 'Illustrated stories, tales, and wonder for young minds.',
      icon: Baby,
      href: '/books?category=Kids',
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
    },
    {
      name: 'Others',
      count: '18+ Titles',
      desc: 'Personal growth, productivity, philosophy, and art.',
      icon: Sparkles,
      href: '/books?category=Others',
      color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300'
    }
  ];

  return (
    <section className="py-16 my-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-900">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">
            Top Categories
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-xl">
            Browse our carefully organized library catalog by your favorite literary genre.
          </p>
        </div>

        <a
          href="/books"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 group"
        >
          <span>Explore All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <a
              key={i}
              href={cat.href}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{cat.count}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

