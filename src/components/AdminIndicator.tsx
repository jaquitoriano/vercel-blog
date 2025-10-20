'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserStatus } from '@/lib/auth/getCurrentUser';

export default function AdminIndicator({ userStatus }: { userStatus: UserStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Don't show on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  
  // Not logged in, don't show anything
  if (!userStatus.isLoggedIn || !userStatus.user) {
    return null;
  }
  
  const { user } = userStatus;
  const isAdmin = user.role === 'ADMIN';
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md shadow-lg ${
            isAdmin ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-medium flex items-center gap-2">
            {isAdmin && (
              <span className="ml-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 pulse-admin-dot"></span>
                <span className="text-xs uppercase bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 px-2 py-0.5 rounded">ADMIN MODE</span>
              </span>
            )}
            <span>{user.name || user.email}</span>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute bottom-full mb-2 right-0 w-48 bg-background rounded-md shadow-lg py-1 border border-border">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <p className="text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded bg-secondary">
                {user.role}
              </p>
            </div>
            
            <div className="py-1">
              <Link
                href="/admin/dashboard"
                className="block px-4 py-2 text-sm hover:bg-secondary"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 text-sm hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Manage Users
                </Link>
              )}
              <Link
                href="/admin/logout"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => setIsOpen(false)}
              >
                Sign Out
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}