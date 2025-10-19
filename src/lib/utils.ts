/**
 * Format a date string
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculate read time for content
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readTime);
}

/**
 * Create excerpt from content if not provided
 */
export function createExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown and HTML
  const plainText = content
    .replace(/#+\s+(.*)/g, '$1') // Remove headings
    .replace(/!\[(.*?)\]\((.*?)\)/g, '') // Remove images
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Replace links with just text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with one
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * Slugify a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Generate a color from a string (consistent for the same string)
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (hash % 20); // Between 65-85%
  const lightness = 45 + (hash % 10);  // Between 45-55%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generate initials from a name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Generate a placeholder image for an avatar
 */
export function generateAvatarPlaceholder(name: string): string {
  // Use consistent brand colors for our BLACKPINK theme
  const bgColor = "#0a0a0a"; // Dark background
  const primaryColor = "#ff5fa2"; // Rose pink
  const accentColor = "#222222"; // Dark gray accent
  const initials = getInitials(name);
  
  // Create a data URL for a SVG image with styling
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="avatarGradient-${name.replace(/\s+/g, '-').toLowerCase()}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor}" />
          <stop offset="100%" stop-color="#151515" />
        </linearGradient>
        <filter id="glow-avatar-${name.replace(/\s+/g, '-').toLowerCase()}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="100" height="100" fill="url(#avatarGradient-${name.replace(/\s+/g, '-').toLowerCase()})" />
      <circle cx="50" cy="50" r="48" stroke="${primaryColor}" stroke-width="2" fill="none" opacity="0.8" />
      <text 
        x="50" 
        y="50" 
        font-size="38" 
        font-family="Arial, sans-serif" 
        font-weight="bold"
        fill="${primaryColor}" 
        text-anchor="middle" 
        dominant-baseline="central"
        filter="url(#glow-avatar-${name.replace(/\s+/g, '-').toLowerCase()})"
      >
        ${initials}
      </text>
      <circle cx="50" cy="50" r="35" stroke="${primaryColor}" stroke-width="1" fill="none" opacity="0.3" />
    </svg>
  `;
  
  try {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  } catch (error) {
    // Provide a simple colored square as ultimate fallback
    console.error('Error generating avatar placeholder:', error);
    return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ff5fa2"/></svg>`;
  }
}

/**
 * Generate a placeholder image for a post thumbnail
 */
export function generateThumbnailPlaceholder(title: string): string {
  // Use consistent brand colors for our BLACKPINK theme
  const bgColor = "#0a0a0a"; // Dark background
  const primaryColor = "#ff5fa2"; // Rose pink
  const accentColor = "#222222"; // Dark gray accent
  
  // Get first letter and shortened title for design element
  const firstLetter = title.charAt(0).toUpperCase();
  // Get a short version of the title (first word or first 2 characters if one word)
  const shortTitle = title.split(' ')[0].length > 3 ? 
    title.split(' ')[0].substring(0, 3) : 
    title.substring(0, 2).toUpperCase();
  
  // Create a data URL for a SVG image with styling
  const cleanTitle = title.replace(/\s+/g, '-').toLowerCase().substring(0, 10);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="thumbGradient-${cleanTitle}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor}" />
          <stop offset="100%" stop-color="#151515" />
        </linearGradient>
        <linearGradient id="pinkGradient-${cleanTitle}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="100%" stop-color="#ff8dc7" />
        </linearGradient>
        <filter id="thumbGlow-${cleanTitle}" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <!-- Background -->
      <rect width="800" height="450" fill="url(#thumbGradient-${cleanTitle})" />
      
      <!-- Decorative elements -->
      <rect x="20" y="20" width="760" height="410" stroke="${primaryColor}" stroke-width="2" fill="none" opacity="0.3" />
      <path d="M20,225 L780,225" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="10,10" opacity="0.5" />
      <path d="M400,20 L400,430" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="10,10" opacity="0.5" />
      
      <!-- Circle with first letter -->
      <circle cx="400" cy="225" r="100" fill="none" stroke="url(#pinkGradient-${cleanTitle})" stroke-width="4" opacity="0.7" />
      <text 
        x="400" 
        y="225" 
        font-size="100" 
        font-family="Arial, sans-serif" 
        font-weight="bold"
        fill="${primaryColor}" 
        text-anchor="middle" 
        dominant-baseline="central"
        filter="url(#thumbGlow-${cleanTitle})"
        opacity="0.8"
      >
        ${firstLetter}
      </text>
      <text
        x="400"
        y="275"
        font-size="24"
        font-family="Arial, sans-serif"
        font-weight="light"
        fill="${primaryColor}" 
        text-anchor="middle"
        opacity="0.6"
      >
        content
      </text>
      
      <!-- Decorative element at the bottom -->
      <rect x="300" y="350" width="200" height="3" fill="${primaryColor}" opacity="0.9" />
      <circle cx="400" cy="350" r="8" fill="${primaryColor}" opacity="0.9" />
    </svg>
  `;
  
  try {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  } catch (error) {
    // Provide a simple colored rectangle as ultimate fallback
    console.error('Error generating thumbnail placeholder:', error);
    return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><rect width="800" height="450" fill="%23ff5fa2"/></svg>`;
  }
}