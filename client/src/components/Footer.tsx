'use client';

import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Clock, Github, Linkedin, Facebook } from 'lucide-react';

// Modern X Logo SVG Component (per requirement: Use new X logo instead of old Twitter bird)
function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-600/30">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  BookNook
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-amber-400 -mt-1">
                  Community Library
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              BookNook is your community-powered digital library. Discover timeless classics, modern bestsellers, and share the joy of reading. Simple idea: “Add a book, borrow a book, return a book.”
            </p>

            {/* Social Icons with New X Logo */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white tracking-wider text-sm uppercase mb-4 border-l-2 border-amber-500 pl-2">
              Explore Library
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/" className="hover:text-amber-400 transition-colors">
                  Home Library
                </a>
              </li>
              <li>
                <a href="/books" className="hover:text-amber-400 transition-colors">
                  All Catalog Books
                </a>
              </li>
              <li>
                <a href="/add-book" className="hover:text-amber-400 transition-colors">
                  Add New Book
                </a>
              </li>
              <li>
                <a href="/my-borrows" className="hover:text-amber-400 transition-colors">
                  My Active Borrows
                </a>
              </li>
              <li>
                <a href="/my-books" className="hover:text-amber-400 transition-colors">
                  My Contributed Books
                </a>
              </li>
            </ul>
          </div>

          {/* Top Genres / Categories */}
          <div>
            <h3 className="font-semibold text-white tracking-wider text-sm uppercase mb-4 border-l-2 border-amber-500 pl-2">
              Featured Genres
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/books?category=Fiction" className="hover:text-amber-400 transition-colors">
                  Literary & Modern Fiction
                </a>
              </li>
              <li>
                <a href="/books?category=Science" className="hover:text-amber-400 transition-colors">
                  Astrophysics & Science
                </a>
              </li>
              <li>
                <a href="/books?category=History" className="hover:text-amber-400 transition-colors">
                  World History & Civilizations
                </a>
              </li>
              <li>
                <a href="/books?category=Kids" className="hover:text-amber-400 transition-colors">
                  Children's Illustrated Books
                </a>
              </li>
              <li>
                <a href="/books?category=Others" className="hover:text-amber-400 transition-colors">
                  Personal Growth & Habit Building
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info & Hours */}
          <div>
            <h3 className="font-semibold text-white tracking-wider text-sm uppercase mb-4 border-l-2 border-amber-500 pl-2">
              Contact & Hours
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>42 Bibliophile Boulevard, Reading District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (800) 555-NOOK (6665)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>support@booknooklibrary.org</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Open Daily: 8:00 AM – 10:00 PM EST</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Copyright Line */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BookNook Library. All rights reserved. Designed for readers and book lovers worldwide.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Fair Lending Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

