"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import type { UserStatus } from '@/lib/auth/getCurrentUser';

type HeaderProps = {
  userStatus: UserStatus;
  siteTitle: string;
  siteDescription: string;
  siteLogo: string;
};

export default function HeaderClient({ userStatus, siteTitle, siteDescription, siteLogo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoggedIn = userStatus.isLoggedIn;
  const user = userStatus.user;
  const isAdmin = user?.role === 'ADMIN';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-6 md:py-10 border-b border-border mb-10">
      <div className="flex flex-wrap items-center justify-between">
        <div className="mr-6">
          <Link
            href="/"
            className="font-serif text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover flex items-center"
          >
            {siteLogo && (
              <Image
                src={siteLogo}
                alt={siteTitle}
                width={40}
                height={40}
                className="mr-2"
              />
            )}
            {siteTitle}
          </Link>
          <p className="text-sm text-muted-foreground">
            A Next.js Ikira
          </p>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className={`hidden md:flex items-center space-x-6`}>
          <Link href="/" className="font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/posts" className="font-medium hover:text-primary">
            Posts
          </Link>
          <Link href="/categories" className="font-medium hover:text-primary">
            Categories
          </Link>
          <Link href="/tags" className="font-medium hover:text-primary">
            Tags
          </Link>
          <Link href="/authors" className="font-medium hover:text-primary">
            Authors
          </Link>
          <Link href="/search" className="font-medium hover:text-primary flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search</span>
          </Link>
          <Link 
            href="/admin/dashboard" 
            className={`font-medium px-3 py-1 border hover:bg-primary hover:text-white rounded-md transition-colors flex items-center gap-1 ${
              isAdmin ? 'border-red-500 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200' : 'border-primary'
            }`}
          >
            {isAdmin && (
              <span className="w-2 h-2 rounded-full bg-red-500 pulse-admin-dot"></span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{isAdmin ? 'Admin' : isLoggedIn ? 'Account' : 'Login'}</span>
            {isAdmin && (
              <span className="text-xs uppercase ml-1">ADMIN MODE</span>
            )}
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 space-y-3 py-3 border-t border-border">
          <div className="block">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
          </div>
          <div className="block">
            <Link 
              href="/posts" 
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 font-medium hover:text-primary transition-colors"
            >
              Posts
            </Link>
          </div>
          <div className="block">
            <Link 
              href="/categories" 
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 font-medium hover:text-primary transition-colors"
            >
              Categories
            </Link>
          </div>
          <div className="block">
            <Link 
              href="/tags" 
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 font-medium hover:text-primary transition-colors"
            >
              Tags
            </Link>
          </div>
          <div className="block">
            <Link 
              href="/authors" 
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 font-medium hover:text-primary transition-colors"
            >
              Authors
            </Link>
          </div>
          <div className="block">
            <Link 
              href="/search" 
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 font-medium hover:text-primary transition-colors"
            >
              Search
            </Link>
          </div>
          <div className="block pt-1 mt-2 border-t border-border">
            <Link 
              href="/admin/dashboard" 
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center py-2 font-medium hover:text-primary-hover transition-colors ${
                isAdmin ? 'text-red-600' : 'text-primary'
              }`}
            >
              {isAdmin && (
                <span className="w-2 h-2 mr-2 rounded-full bg-red-500 pulse-admin-dot"></span>
              )}
              <span>{isAdmin ? 'Admin Panel' : isLoggedIn ? 'Account' : 'Login'}</span>
              {isAdmin && (
                <span className="text-xs uppercase ml-1 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 px-2 py-0.5 rounded">ADMIN MODE</span>
              )}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}