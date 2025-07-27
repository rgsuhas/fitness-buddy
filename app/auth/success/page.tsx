"use client"

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/hooks/use-user';
import { Loader2 } from 'lucide-react';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // In a real application, you would verify this token with your backend
      // and fetch user details. For this example, we'll just set the token.
      setUser({ token }); // Assuming setUser can handle just a token for now
      router.push('/dashboard');
    } else {
      // If no token is present, redirect to login or show an error
      router.push('/auth/login');
    }
  }, [router, searchParams, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-4 text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-lg">Authenticating...</p>
      </div>
    </div>
  );
}