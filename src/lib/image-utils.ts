import { slugify } from './utils';

/**
 * Generate a placeholder avatar image based on a name or ID
 * @param name - The name or ID to generate an avatar for
 * @param size - The size of the avatar (default: 200)
 * @returns - URL to a placeholder avatar
 */
export function generatePlaceholderAvatar(name: string, size: number = 200): string {
  // If the name is empty, use a default avatar
  if (!name) {
    return `https://ui-avatars.com/api/?background=random&size=${size}&name=User`;
  }
  
  // Create a consistent background color based on the name
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['0D8ABC', '6B5B95', '88B04B', 'F7CAC9', '92A8D1', '955251', 'B565A7', 'DD4124', '009B77'];
  const colorIndex = nameHash % colors.length;
  const bgColor = colors[colorIndex];
  
  // Get initials from the name (up to 2 characters)
  const nameParts = name.split(' ');
  let initials = '';
  
  if (nameParts.length >= 2) {
    initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  } else if (name.length > 0) {
    initials = name.substring(0, 2).toUpperCase();
  } else {
    initials = 'NA';
  }
  
  return `https://ui-avatars.com/api/?background=${bgColor}&color=fff&size=${size}&name=${encodeURIComponent(initials)}`;
}

/**
 * Generate a placeholder image for a post or content
 * @param title - The title or description for the image
 * @param width - The width of the image
 * @param height - The height of the image
 * @returns - URL to a placeholder image
 */
export function generatePlaceholderImage(title: string, width: number = 800, height: number = 450): string {
  // If title is empty, use a default placeholder
  if (!title) {
    return `https://placehold.co/${width}x${height}/F2F2F2/A0A0A0?text=No+Image`;
  }
  
  // Create a slug from the title for the text
  const slug = slugify(title).substring(0, 30);
  
  // Create a consistent background color based on the title
  const titleHash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate a color palette for various content types
  const bgColors = ['E6F7FF', 'FFF2E6', 'F5F0FF', 'E6FFFA', 'FFF1F2', 'F0F4F8', 'FFF5EA', 'EDF2FF'];
  const textColors = ['0D8ABC', 'DD6B20', '6B46C1', '00A3C4', 'E53E3E', '2D3748', 'DD6B20', '3182CE'];
  
  const colorIndex = titleHash % bgColors.length;
  const bgColor = bgColors[colorIndex];
  const textColor = textColors[colorIndex];
  
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(slug)}`;
}

/**
 * Handle image load error by replacing with a placeholder
 * @param event - The error event
 * @param isAvatar - Whether the image is an avatar
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>, 
  isAvatar: boolean = false,
  name: string = ''
): void {
  const target = event.target as HTMLImageElement;
  
  if (isAvatar) {
    target.src = generatePlaceholderAvatar(name);
  } else {
    target.src = generatePlaceholderImage(name || 'Content Image');
  }
  
  // Prevent infinite error loop
  target.onerror = null;
}