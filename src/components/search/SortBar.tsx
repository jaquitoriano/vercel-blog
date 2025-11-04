'use client';

import { useCallback } from 'react';
import { Button } from '@/components/Button';

export type SortOption = 'relevance' | 'date' | 'title';

interface SortBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortBar({ currentSort, onSortChange }: SortBarProps) {
  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'date', label: 'Latest' },
    { value: 'title', label: 'Title' }
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <div className="flex gap-2">
        {sortOptions.map(({ value, label }) => (
          <Button
            key={value}
            variant={currentSort === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange(value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}