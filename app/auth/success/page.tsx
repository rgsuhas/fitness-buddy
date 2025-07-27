"use client"

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/hooks/use-user';
import { Loader2 } from 'lucide-react';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else if (!loading) {
      // If not loading and no user, redirect to login
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-4 text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-lg">Authenticating...</p>
      </div>
    </div>
  );
}