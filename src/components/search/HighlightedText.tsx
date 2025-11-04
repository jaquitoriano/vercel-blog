'use client';

import { type HighlightResult } from '@/lib/utils/highlight';

interface HighlightedTextProps {
  segments: HighlightResult[];
  className?: string;
  highlightClassName?: string;
}

export function HighlightedText({
  segments,
  className = '',
  highlightClassName = 'bg-yellow-200 dark:bg-yellow-900 rounded px-0.5'
}: HighlightedTextProps) {
  return (
    <span className={className}>
      {segments.map((segment, i) => (
        segment.highlight ? (
          <mark key={i} className={highlightClassName}>
            {segment.text}
          </mark>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      ))}
    </span>
  );
}