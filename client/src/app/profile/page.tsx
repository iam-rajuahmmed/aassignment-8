'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User, Mail, ShieldCheck, BookOpen, BookmarkCheck, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'BookNook | My Profile';
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto py-8 animate-in fade-in duration-300">
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 relative" />

          {/* User Details */}
          <div className="px-6 sm:px-10 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-14 mb-6 gap-4">
              
              {/* Avatar */}
              <div className="w-28 h-28 rounded-3xl border-4 border-white dark:border-slate-800 overflow-hidden shadow-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 text-3xl font-bold">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  Active Library Member
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {user?.name || 'Library Member'}
                </h1>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>{user?.email}</span>
                </p>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <a
                  href="/my-borrows"
                  className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 hover:scale-[1.02] transition-transform"
                >
                  <BookmarkCheck className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="text-xs uppercase font-semibold text-slate-500">
                    Active Loans
                  </h4>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Manage Borrows
                  </p>
                </a>

                <a
                  href="/my-books"
                  className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 hover:scale-[1.02] transition-transform"
                >
                  <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="text-xs uppercase font-semibold text-slate-500">
                    Contributions
                  </h4>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    My Added Books
                  </p>
                </a>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <Calendar className="w-6 h-6 text-slate-500 mb-2" />
                  <h4 className="text-xs uppercase font-semibold text-slate-500">
                    Membership Tier
                  </h4>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Free Reader
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}

