"use client";

import { useState, useEffect, useRef } from 'react';

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
  type: 'avatar' | 'thumbnail';
  name: string; // Author name for avatar or post title for thumbnail
};

// Regular expression to check if a URL points to a valid image file
const IMAGE_PATTERN = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i;

// Helper function to clear a specific failed image entry
const clearFailedImage = (src: string): void => {
  if (!src || typeof window === 'undefined') return;
  
  try {
    const failedImages = JSON.parse(localStorage.getItem('failedImages') || '{}');
    if (failedImages[src]) {
      delete failedImages[src];
      localStorage.setItem('failedImages', JSON.stringify(failedImages));
    }
  } catch (e) {
    console.error('Failed to clear failed image from localStorage', e);
  }
};

// Helper function to check localStorage for previously failed images
const hasFailedPreviously = (src: string): boolean => {
  if (!src || typeof window === 'undefined') return false;
  if (src.includes('/fallbacks/')) return false; // Don't check fallbacks
  
  try {
    const failedImages = JSON.parse(localStorage.getItem('failedImages') || '{}');
    return !!failedImages[src];
  } catch (e) {
    return false;
  }
};

// Helper function to mark image as failed in localStorage
const markImageAsFailed = (src: string): void => {
  if (!src || typeof window === 'undefined') return;
  if (src.includes('/fallbacks/')) return; // Don't mark fallbacks as failed
  
  try {
    const failedImages = JSON.parse(localStorage.getItem('failedImages') || '{}');
    failedImages[src] = true;
    localStorage.setItem('failedImages', JSON.stringify(failedImages));
  } catch (e) {
    console.error('Failed to save failed image to localStorage', e);
  }
};

export function ImageWithFallback({ 
  src, 
  alt, 
  className = "", 
  type,
  name
}: ImageWithFallbackProps) {
  // Store the error state in a ref to persist across renders
  const hasErrorRef = useRef<boolean>(false);
  const isFallbackRef = useRef<boolean>(false);
  
  // Determine fallback source based on type
  const fallbackSrc = type === 'avatar' 
    ? '/images/fallbacks/avatar.svg' 
    : '/images/fallbacks/thumbnail.svg';
    
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // Check if URL looks like a valid image path
    const seemsValid = src && IMAGE_PATTERN.test(src);
    
    // Check localStorage for previously failed images
    const hasFailed = hasFailedPreviously(src);
    
    // If the URL doesn't look like a valid image, is empty, or previously failed
    // immediately use fallback
    if (!seemsValid || hasFailed) {
      hasErrorRef.current = true;
      isFallbackRef.current = true;
      return fallbackSrc;
    }
    
    // Otherwise start with the provided src
    return src;
  });
  
  // Create a safe alt text
  const safeAlt = alt || (type === 'avatar' ? `${name}'s avatar` : `Thumbnail for ${name}`);

  // Reset image source if src prop changes
  useEffect(() => {
    // If we receive a new source that's different from both current and fallback
    if (src !== imgSrc && src !== fallbackSrc) {
      // Check if the new source seems valid and hasn't failed before
      const seemsValid = src && IMAGE_PATTERN.test(src);
      const hasFailed = hasFailedPreviously(src);
      
      if (seemsValid && !hasFailed) {
        setImgSrc(src);
        hasErrorRef.current = false;
        isFallbackRef.current = false;
      } else if (!isFallbackRef.current) {
        // If invalid but we're not showing fallback yet, switch to fallback
        setImgSrc(fallbackSrc);
        hasErrorRef.current = true;
        isFallbackRef.current = true;
      }
    }
  }, [src, imgSrc, fallbackSrc]);
  
  // Cache fallback images to ensure they're loaded and occasionally retry original images
  useEffect(() => {
    // Preload the fallback images so they're ready if needed
    const avatarPreload = new Image();
    avatarPreload.src = '/images/fallbacks/avatar.svg';
    
    const thumbnailPreload = new Image();
    thumbnailPreload.src = '/images/fallbacks/thumbnail.svg';
    
    // If we're showing a fallback, occasionally retry the original image 
    // in case it becomes available again
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    
    if (isFallbackRef.current && src && src !== fallbackSrc) {
      retryTimer = setTimeout(() => {
        // Create a hidden image element to test if the original source now works
        const testImg = new Image();
        testImg.onload = () => {
          // If it loads, clear the failed status and switch back
          clearFailedImage(src);
          if (isFallbackRef.current) {
            setImgSrc(src);
            hasErrorRef.current = false;
            isFallbackRef.current = false;
          }
        };
        testImg.src = src;
      }, 60000); // Try again after 60 seconds
    }
    
    // Return cleanup function
    return () => {
      // Clean up references to avoid memory leaks
      avatarPreload.onload = null;
      thumbnailPreload.onload = null;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [src, fallbackSrc]);

  // Handle image loading error
  const handleImageError = () => {
    // Only handle errors if we're not already showing a fallback
    // and the current source is not already a fallback
    if (!hasErrorRef.current && imgSrc !== fallbackSrc) {
      console.warn(`Image failed to load: ${imgSrc}, using fallback for "${name}"`);
      
      // Mark that we've had an error
      hasErrorRef.current = true;
      isFallbackRef.current = true;
      
      // Remember this failed image in localStorage to persist across page reloads
      if (src && src !== fallbackSrc) {
        markImageAsFailed(src);
      }
      
      // Use the appropriate fallback
      setImgSrc(fallbackSrc);
    }
  };
  
  return (
    <img
      src={imgSrc}
      alt={safeAlt}
      className={`${className} ${type === 'avatar' ? 'object-cover w-full h-full' : 'thumbnail-image'}`}
      onError={imgSrc.includes('/fallbacks/') ? undefined : handleImageError}
      loading="lazy"
      style={type === 'avatar' ? { objectFit: 'cover', aspectRatio: '1' } : undefined}
    />
  );
}
