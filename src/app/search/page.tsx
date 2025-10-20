"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate, calculateReadTime } from '@/lib/utils';
import ImageHandler from '@/components/ImageHandler';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/Card';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('q') || '' : '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <div className="content-standard">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-serif mb-6">Search</h1>
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for posts, tags, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-2 rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button type="submit">
              Search
            </Button>
          </div>
        </form>
      </header>

      {query ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">
              Search Results
            </h2>
            <p className="text-muted-foreground">
              Showing results for "<strong>{query}</strong>"
            </p>
          </div>

          <div className="text-center py-16">
            <h3 className="text-xl font-bold mb-2">
              Loading results from server...
            </h3>
            <p className="text-muted-foreground mb-8">
              When connected to a real database, this page will display search results.
              <br />
              For now, you can browse content using the navigation links.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/posts">
                  All Posts
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/categories">
                  Categories
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tags">
                  Tags
                </Link>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-6">
            Enter a search term above to find posts, topics, and more.
          </p>
          <p className="text-muted-foreground mb-8">
            Or browse our content using these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/posts">
                All Posts
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/categories">
                Categories
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tags">
                Tags
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}