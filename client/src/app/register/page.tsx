'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, User, Mail, Image as ImageIcon, Lock, ArrowRight, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, socialLoginGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | Create Account';
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  // Password validation checks:
  // 1. Must have an Uppercase letter
  // 2. Must have a Lowercase letter
  // 3. Length must be at least 6 characters
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict Password Validation check
    if (!hasUpperCase) {
      const err = 'Password must include at least one uppercase letter (A-Z).';
      setErrorMessage(err);
      toast.error(err);
      return;
    }
    if (!hasLowerCase) {
      const err = 'Password must include at least one lowercase letter (a-z).';
      setErrorMessage(err);
      toast.error(err);
      return;
    }
    if (!hasMinLength) {
      const err = 'Password must be at least 6 characters in length.';
      setErrorMessage(err);
      toast.error(err);
      return;
    }

    setSubmitting(true);
    const success = await register(name, email, password, photoURL);
    setSubmitting(false);

    if (success) {
      // Per assignment requirement: navigate them to their Login page
      router.push('/login');
    } else {
      setErrorMessage('Registration failed. This email may already be in use.');
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    const success = await socialLoginGoogle();
    setSubmitting(false);
    if (success) {
      // Per requirement: On Google signup -> navigate the user to the Home page
      router.push('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl p-7 sm:p-9 space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-600/20">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Join the BookNook reader network and start borrowing books
          </p>
        </div>

        {/* Inline Error Message (if any) */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form with required fields: Name, Email, Photo-URL, Password & Register Button */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@booknook.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Photo-URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Photo URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Criteria Indicators */}
            <div className="mt-2.5 space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-xs">
              <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {hasUpperCase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {hasLowerCase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>At least one lowercase letter (a-z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>Minimum 6 characters long</span>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md shadow-amber-600/25 hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-medium">
              Or register with
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

        {/* Link for Login */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5"
          >
            <span>Login here</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </p>

      </div>
    </div>
  );
}

