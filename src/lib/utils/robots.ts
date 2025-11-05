/**
 * Get robots meta tags based on the page type and content status
 */
export function getRobotsMeta(options: {
  isAdminPage?: boolean;
  isPreview?: boolean;
  isDraft?: boolean;
  isError?: boolean;
}): {
  index: boolean;
  follow: boolean;
} {
  const { isAdminPage, isPreview, isDraft, isError } = options;

  // Admin pages should never be indexed
  if (isAdminPage) {
    return { index: false, follow: false };
  }

  // Preview or draft content should not be indexed
  if (isPreview || isDraft) {
    return { index: false, follow: false };
  }

  // Error pages should not be indexed but can be followed
  if (isError) {
    return { index: false, follow: true };
  }

  // Default to indexable and followable
  return { index: true, follow: true };
}