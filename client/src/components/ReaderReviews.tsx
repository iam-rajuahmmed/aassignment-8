'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  bookTitle: string;
  content: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Elena Rostova",
    role: "Literature Teacher & Avid Reader",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    bookTitle: "To Kill a Mockingbird",
    content: "BookNook has completely reinvigorated our book club. The borrowing process is frictionless, and being able to check availability before reserving saves so much time."
  },
  {
    id: 2,
    name: "Marcus Sterling",
    role: "Astrophysics Graduate Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    bookTitle: "A Brief History of Time",
    content: "Finding rare science and astrophysics books without spending a fortune was a challenge until I found BookNook. The community curation is genuinely top-notch."
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Parent & Community Volunteer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    bookTitle: "The Little Prince",
    content: "My kids and I borrow books every weekend. The automated return system and clear due dates make it so rewarding to teach young readers responsibility."
  }
];

export default function ReaderReviews() {
  return (
    <section className="py-16 my-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
          Community Voice
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">
          What Our Readers Are Saying
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
          Stories, insights, and heartfelt reflections from our worldwide reading community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-7 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Star Rating & Quote Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>

              {/* Borrowed Book Reference */}
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
                Read: <span className="italic font-serif">{rev.bookTitle}</span>
              </p>

              {/* Review Text */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{rev.content}"
              </p>
            </div>

            {/* Author Meta */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-11 h-11 rounded-full object-cover border border-amber-300 shadow-xs"
              />
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  {rev.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {rev.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

