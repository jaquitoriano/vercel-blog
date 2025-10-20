'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  
  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Redirect to login page regardless of response
        router.push('/admin/login');
      } catch (error) {
        console.error('Error signing out:', error);
        router.push('/admin/login');
      }
    };
    
    logout();
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Signing out...</h1>
        <p>You are being redirected to the login page.</p>
      </div>
    </div>
  );
}