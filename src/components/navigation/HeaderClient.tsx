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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 md:h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-start">
            <Link
              href="/"
              className="group flex items-center gap-2.5 md:gap-3"
            >
              {siteLogo && (
                <div className="flex-shrink-0 overflow-hidden rounded-md border border-border/50 flex items-center">
                  <Image
                    src={siteLogo}
                    alt={siteTitle}
                    width={36}
                    height={36}
                    className="h-[36px] w-[36px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center -mt-0.5">
                <h1 className="font-serif text-lg md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover leading-none mb-0 mt-6">
                  {siteTitle}
                </h1>
                <p className="text-[11px] md:text-xs text-muted-foreground/75 leading-none">
                  {siteDescription}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:flex-1 items-center justify-center">
            <div className="flex space-x-1">
              <Link href="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Home
              </Link>
              <Link href="/posts" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Posts
              </Link>
              <Link href="/categories" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Categories
              </Link>
              <Link href="/tags" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Tags
              </Link>
              <Link href="/authors" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Authors
              </Link>
            </div>
          </nav>

          {/* Right section with search and admin */}
          <div className="flex items-center justify-end space-x-2">
            <Link 
              href="/search" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="sr-only">Search</span>
            </Link>

            <Link 
              href="/admin/dashboard" 
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 ${
                isAdmin 
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900' 
                  : 'hover:bg-accent hover:text-accent-foreground'
              } transition-colors`}
            >
              {isAdmin && (
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 pulse-admin-dot"></span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{isAdmin ? 'Admin' : isLoggedIn ? 'Account' : 'Login'}</span>
            </Link>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <nav className="fixed inset-x-0 top-[64px] z-50 h-[calc(100vh-4rem)] bg-background border-t border-border px-4 pb-12 overflow-y-auto">
              <div className="grid grid-flow-row auto-rows-max py-6 text-base">
                {[
                  { href: "/", label: "Home" },
                  { href: "/posts", label: "Posts" },
                  { href: "/categories", label: "Categories" },
                  { href: "/tags", label: "Tags" },
                  { href: "/authors", label: "Authors" },
                  { href: "/search", label: "Search" }
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-border">
                  <Link 
                    href="/admin/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center py-3 px-3 text-sm font-medium rounded-md transition-colors ${
                      isAdmin 
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {isAdmin && (
                      <span className="w-2 h-2 mr-2 rounded-full bg-red-500 pulse-admin-dot"></span>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{isAdmin ? 'Admin Panel' : isLoggedIn ? 'Account' : 'Login'}</span>
                    {isAdmin && (
                      <span className="ml-2 text-xs font-medium bg-red-100 dark:bg-red-900 rounded-md px-1.5 py-0.5">
                        ADMIN
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}