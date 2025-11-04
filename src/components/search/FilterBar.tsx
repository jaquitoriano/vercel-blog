'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';

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

interface FilterBarProps {
  onFilterChange: (filters: { category?: string; tag?: string }) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current filter values from URL
  const selectedCategory = searchParams?.get('category') || '';
  const selectedTag = searchParams?.get('tag') || '';

  // Fetch categories and tags
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags')
        ]);

        if (categoriesRes.ok && tagsRes.ok) {
          const [categoriesData, tagsData] = await Promise.all([
            categoriesRes.json(),
            tagsRes.json()
          ]);

          setCategories(categoriesData);
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilters();
  }, []);

  // Update URL and notify parent when filters change
  const updateFilters = useCallback((type: 'category' | 'tag', value: string) => {
    const currentQuery = searchParams?.get('q') || '';
    const newParams = new URLSearchParams(searchParams?.toString());
    
    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }
    
    // Keep the search query
    if (currentQuery) {
      newParams.set('q', currentQuery);
    }
    
    // Update URL
    router.push(`/search?${newParams.toString()}`);
    
    // Notify parent
    onFilterChange({
      category: type === 'category' ? value : selectedCategory,
      tag: type === 'tag' ? value : selectedTag
    });
  }, [router, searchParams, onFilterChange, selectedCategory, selectedTag]);

  if (loading) {
    return <div className="h-12 animate-pulse bg-muted rounded-md" />;
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => updateFilters('category', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-border bg-background"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Tag</label>
        <select
          value={selectedTag}
          onChange={(e) => updateFilters('tag', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-border bg-background"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {(selectedCategory || selectedTag) && (
        <div className="w-full flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              updateFilters('category', '');
              updateFilters('tag', '');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}