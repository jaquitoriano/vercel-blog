export interface HighlightResult {
  text: string;
  highlight: boolean;
}

export function highlightText(text: string, query: string): HighlightResult[] {
  if (!query.trim() || !text) {
    return [{ text, highlight: false }];
  }

  const searchTerms = query.trim().toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();
  const results: HighlightResult[] = [];
  let lastIndex = 0;

  // Find all matches for all search terms
  const matches: { start: number; end: number }[] = [];
  searchTerms.forEach(term => {
    let index = textLower.indexOf(term);
    while (index !== -1) {
      matches.push({
        start: index,
        end: index + term.length
      });
      index = textLower.indexOf(term, index + 1);
    }
  });

  // Sort matches by start index and merge overlapping matches
  matches.sort((a, b) => a.start - b.start);
  const mergedMatches: { start: number; end: number }[] = [];
  
  matches.forEach(match => {
    const lastMerged = mergedMatches[mergedMatches.length - 1];
    if (lastMerged && match.start <= lastMerged.end) {
      lastMerged.end = Math.max(lastMerged.end, match.end);
    } else {
      mergedMatches.push({ ...match });
    }
  });

  // Create highlighted segments
  mergedMatches.forEach(match => {
    // Add non-highlighted text before match
    if (match.start > lastIndex) {
      results.push({
        text: text.slice(lastIndex, match.start),
        highlight: false
      });
    }
    // Add highlighted text
    results.push({
      text: text.slice(match.start, match.end),
      highlight: true
    });
    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    results.push({
      text: text.slice(lastIndex),
      highlight: false
    });
  }

  return results;
}

export function createExcerptWithHighlights(content: string, query: string, maxLength = 200): HighlightResult[] {
  if (!query.trim() || !content) {
    return [{ 
      text: content.length > maxLength ? `${content.slice(0, maxLength)}...` : content,
      highlight: false 
    }];
  }

  const searchTerms = query.trim().toLowerCase().split(/\s+/);
  const contentLower = content.toLowerCase();

  // Find the first match position
  let firstMatchIndex = -1;
  for (const term of searchTerms) {
    const index = contentLower.indexOf(term);
    if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
      firstMatchIndex = index;
    }
  }

  // If no match found, return the start of the content
  if (firstMatchIndex === -1) {
    return [{ 
      text: content.length > maxLength ? `${content.slice(0, maxLength)}...` : content,
      highlight: false 
    }];
  }

  // Calculate excerpt range
  let start = Math.max(0, firstMatchIndex - 60);
  let end = Math.min(content.length, start + maxLength);
  start = Math.max(0, end - maxLength); // Adjust start if end was capped

  // Add ellipsis if needed
  const prefix = start > 0 ? '...' : '';
  const suffix = end < content.length ? '...' : '';

  // Get the excerpt and highlight matches
  const excerpt = content.slice(start, end);
  const highlights = highlightText(excerpt, query);

  // Add prefix/suffix if needed
  return [
    ...(prefix ? [{ text: prefix, highlight: false }] : []),
    ...highlights,
    ...(suffix ? [{ text: suffix, highlight: false }] : [])
  ];
}