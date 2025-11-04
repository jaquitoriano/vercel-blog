/**
 * Strip HTML tags from a string and create a clean excerpt
 */
export function createCleanExcerpt(html: string, length = 200): string {
  // Remove all HTML tags
  const text = html.replace(/<\/?[^>]+(>|$)/g, ' ')
    // Replace multiple spaces and newlines with a single space
    .replace(/\s+/g, ' ')
    // Remove leading/trailing whitespace
    .trim();
  
  // Create excerpt of specified length, trying to break at word boundaries
  if (text.length <= length) return text;
  
  const truncated = text.slice(0, length);
  // Find the last space before the truncation point
  const lastSpace = truncated.lastIndexOf(' ');
  
  // If no space found or space is too early in the text, just truncate at length
  if (lastSpace === -1 || lastSpace < length * 0.8) {
    return truncated + '...';
  }
  
  // Otherwise truncate at the last space
  return truncated.slice(0, lastSpace) + '...';
}