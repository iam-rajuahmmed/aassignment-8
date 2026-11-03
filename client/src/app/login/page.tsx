'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Mail, Lock, LogIn, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

// Google Icon SVG
function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, socialLoginGoogle } = useAuth();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | Sign In';
    if (user) {
      router.replace(callbackUrl);
    }
  }, [user, callbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);

    if (success) {
      router.push(callbackUrl);
    } else {
      setErrorMessage('Invalid credentials. Please verify your email & password or use demo quick-login.');
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    const success = await socialLoginGoogle();
    setSubmitting(false);
    if (success) {
      router.push(callbackUrl);
    }
  };

  const handleDemoLogin = async (demoRole: 'curator' | 'reader') => {
    const demoEmail = demoRole === 'curator' ? 'curator@booknook.com' : 'reader@booknook.com';
    const demoPass = 'BookNook2026!';
    setEmail(demoEmail);
    setPassword(demoPass);
    setSubmitting(true);
    const success = await login(demoEmail, demoPass);
    setSubmitting(false);
    if (success) {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl p-7 sm:p-9 space-y-6">
      {/* Title & Branding */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-600/20">
          <BookOpen className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Sign in to access your borrowed books and library features
        </p>
      </div>

      {/* Inline Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@booknook.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Password & Forget Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => toast('Password reset is disabled for evaluation per assignment guideline.', { icon: 'ℹ️' })}
              className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md shadow-amber-600/25 hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Button (Google only) */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={submitting}
        className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2.5 shadow-2xs transition-all hover:scale-[1.01]"
      >
        <GoogleIcon className="w-5 h-5" />
        <span>Continue with Google</span>
      </button>

      {/* Quick Demo Login Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            1-Click Demo Login:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('curator')}
            className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
          >
            Demo Curator
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('reader')}
            className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
          >
            Demo Reader
          </button>
        </div>
      </div>

      {/* Link for Register */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account yet?{' '}
        <a
          href="/register"
          className="font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5"
        >
          <span>Register here</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4 animate-in fade-in duration-300">
      <Suspense fallback={<LoadingSpinner message="Loading login form..." />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
