'use client';

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleLogin() {
  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
      console.log('Redirecting to:', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2"
    >
      <FcGoogle className="h-5 w-5" />
      Sign in with Google
    </Button>
  );
}