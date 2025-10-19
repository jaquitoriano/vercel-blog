"use client";

import { ImageWithFallback } from './ImageWithFallback';

interface ImageHandlerProps {
  src: string;
  alt: string;
  className?: string;
  isAvatar?: boolean;
  name: string; // Author name or post title
}

export default function ImageHandler({ 
  src, 
  alt, 
  className = "",
  isAvatar = false,
  name
}: ImageHandlerProps) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={className}
      type={isAvatar ? 'avatar' : 'thumbnail'}
      name={name}
    />
  );
}