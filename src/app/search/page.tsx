'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { highlightText, createExcerptWithHighlights } from '@/lib/utils/highlight';
import ImageHandler from '@/components/ImageHandler';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/Card';
import { FilterBar } from '@/components/search/FilterBar';
import { Pagination } from '@/components/search/Pagination';
import { SortBar, type SortOption } from '@/components/search/SortBar';
import { HighlightedText } from '@/components/search/HighlightedText';

// Types
interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  date: string;
  author: Author | null;
  category: Category | null;
  tags: Tag[];
}

// Main component
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  
  const currentSort = (searchParams?.get('sort') || 'relevance') as SortOption;
  const currentPage = searchParams ? parseInt(searchParams.get('page') || '1') : 1;
  const category = searchParams?.get('category') || '';
  const tag = searchParams?.get('tag') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          q: query,
          page: currentPage.toString(),
          sort: currentSort
        });
        
        if (category) params.set('category', category);
        if (tag) params.set('tag', tag);
        
        const response = await fetch(`/api/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        setResults(data.posts);
        setTotalResults(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while searching');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchResults();
  }, [query, currentPage, category, tag, currentSort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchInput.trim();
    
    if (trimmedQuery) {
      const params = new URLSearchParams(searchParams?.toString());
      params.set('q', trimmedQuery);
      params.set('page', '1'); // Reset to first page on new search
      router.push(`/search?${params.toString()}`);
    }
  };

  const updateSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('sort', sort);
    router.push(`/search?${params.toString()}`);
  };

  const renderSearchForm = () => (
    <form onSubmit={handleSearch} className="max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for posts, tags, or keywords..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-grow px-4 py-2 rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  );

  const renderResultCard = (post: SearchResult) => (
    <Card key={post.id} hover>
      <Link href={`/posts/${post.slug}`} className="block h-full">
        <div className="flex flex-col md:flex-row gap-6">
          {post.coverImage && (
            <div className="md:w-48 h-48">
              <ImageHandler
                src={post.coverImage}
                alt={post.title}
                name={post.title}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
          )}
          <div className="flex-1 p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-xl mb-2">
                <HighlightedText segments={highlightText(post.title, query)} />
              </CardTitle>
              {post.category && (
                <Link
                  href={`/categories/${post.category.slug}`}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {post.category.name}
                </Link>
              )}
            </CardHeader>
            <CardContent className="p-0 my-4">
              <HighlightedText
                segments={createExcerptWithHighlights(post.content, query, 300)}
                className="text-muted-foreground line-clamp-3"
              />
            </CardContent>
            <CardFooter className="p-0 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {post.author && <span>By {post.author.name}</span>}
              <span>{formatDate(new Date(post.date))}</span>
              <span>{calculateReadTime(post.content)} min read</span>
            </CardFooter>
          </div>
        </div>
      </Link>
    </Card>
  );

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold mb-2">Searching...</h3>
          <p className="text-muted-foreground">Looking for posts matching your query</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button asChild>
            <Link href="/posts">Browse All Posts Instead</Link>
          </Button>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-8">
            No posts found matching "{query}".
            <br />
            Try different keywords or browse our content using these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/posts">All Posts</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/categories">Categories</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tags">Tags</Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid gap-6">
          {results.map(renderResultCard)}
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set('page', page.toString());
            router.push(`/search?${params.toString()}`);
          }}
        />
      </div>
    );
  };

  return (
    <div className="content-standard">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-serif mb-6">Search</h1>
        {renderSearchForm()}
      </header>

      {query && (
        <div className="space-y-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Search Results</h2>
            <p className="text-muted-foreground mb-6">
              Showing results for "<strong>{query}</strong>"
              {totalResults > 0 && ` (${totalResults} ${totalResults === 1 ? 'result' : 'results'})`}
            </p>
            
            <div className="space-y-4">
              <FilterBar
                onFilterChange={({ category: newCategory, tag: newTag }) => {
                  const params = new URLSearchParams(searchParams?.toString());
                  if (newCategory) params.set('category', newCategory);
                  else params.delete('category');
                  if (newTag) params.set('tag', newTag);
                  else params.delete('tag');
                  params.set('page', '1');
                  router.push(`/search?${params.toString()}`);
                }}
              />
              
              <SortBar
                currentSort={currentSort}
                onSortChange={updateSort}
              />
            </div>
          </div>

          {renderSearchResults()}
        </div>
      )}
      
      {!query && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-6">
            Enter a search term above to find posts, topics, and more.
          </p>
          <p className="text-muted-foreground mb-8">
            Or browse our content using these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/posts">All Posts</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/categories">Categories</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tags">Tags</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}