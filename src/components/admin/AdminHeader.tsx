'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = { name: 'Admin', email: 'admin@example.com', image: undefined as string | null | undefined };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/admin/login';
    }
  };

  // Get current date for header
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-pink-300 hidden md:block">{currentDate}</div>
        
        {/* Quick actions dropdown */}
        <div className="relative ml-2">
          <button 
            className="inline-flex items-center px-3 py-1 border border-pink-700 text-sm font-medium rounded-md text-white bg-zinc-800 hover:bg-zinc-700 hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Quick Actions
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notification bell */}
        <button className="text-zinc-400 hover:text-pink-300 focus:outline-none transition-colors">
          <span className="sr-only">View notifications</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>

        {/* Help button */}
        <Link href="/admin/diagnostics" className="text-zinc-400 hover:text-pink-300 transition-colors">
          <span className="sr-only">Help</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </Link>
        
        {/* User profile dropdown */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 text-white focus:outline-none group"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center text-white shadow-sm">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-sm font-medium block text-white">{user.name || 'Admin'}</span>
              <span className="text-xs text-pink-300 block">Administrator</span>
            </div>
            <svg 
              className="w-5 h-5 text-zinc-400 group-hover:text-pink-300"
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
          
          {/* User dropdown menu */}
          {isDropdownOpen && (
            <div 
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-zinc-800 ring-1 ring-zinc-700 z-50 divide-y divide-zinc-700"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div className="py-1" role="none">
                <Link
                  href="/admin/profile"
                  className="flex items-center px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 hover:text-pink-300 transition-colors"
                  role="menuitem"
                >
                  <svg className="mr-3 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Your Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 hover:text-pink-300 transition-colors"
                  role="menuitem"
                >
                  <svg className="mr-3 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Settings
                </Link>
                <Link
                  href="/admin/diagnostics"
                  className="flex items-center px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 hover:text-pink-300 transition-colors"
                  role="menuitem"
                >
                  <svg className="mr-3 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Diagnostics
                </Link>
              </div>
              <div className="py-1" role="none">
                <button 
                  onClick={handleSignOut}
                  className="flex w-full items-center px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 hover:text-pink-300 transition-colors"
                  role="menuitem"
                >
                  <svg className="mr-3 h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}