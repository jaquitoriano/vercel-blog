'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function UserAuthStatus() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) setIsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // If loading
  if (session.status === "loading") {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  // If not authenticated
  if (session.status !== "authenticated") {
    return (
      <Link 
        href="/admin/login" 
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Sign In
      </Link>
    );
  }

  // If authenticated
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
      >
        <div className="relative">
          <span className="flex items-center space-x-1">
            <span>{session.data.user?.name || session.data.user?.email}</span>
            
            {/* Admin indicator */}
            {session.data?.user?.role === 'admin' && (
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 pulse-admin-dot ml-1"></span>
                <span className="ml-2 text-xs uppercase bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 px-2 py-0.5 rounded">ADMIN MODE</span>
              </div>
            )}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-border">
              <p className="font-medium text-sm">{session.data.user?.name || session.data.user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{session.data.user?.role || 'user'}</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 text-sm hover:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}