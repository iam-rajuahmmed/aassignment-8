'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?callbackUrl=${returnUrl}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <LoadingSpinner message="Checking authentication status..." />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

