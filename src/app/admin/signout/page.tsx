'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SignOutPage() {
  useEffect(() => {
    const performSignOut = async () => {
      await signOut({ callbackUrl: '/admin/login' });
    };
    
    performSignOut();
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg text-foreground">Signing out...</p>
      </div>
    </div>
  );
}