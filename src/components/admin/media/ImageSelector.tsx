'use client';

import { useState } from 'react';
import Image from 'next/image';
import MediaGallery from './MediaGallery';

interface ImageSelectorProps {
  currentImageUrl: string;
  onImageSelect: (url: string) => void;
  aspectRatio?: 'square' | 'wide' | 'avatar';
}

export default function ImageSelector({
  currentImageUrl,
  onImageSelect,
  aspectRatio = 'wide',
}: ImageSelectorProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const aspectRatioClasses = {
    square: 'aspect-square',
    wide: 'aspect-video',
    avatar: 'aspect-square rounded-full',
  };
  
  return (
    <div className="space-y-3">
      {/* Image preview */}
      <div className={`relative border border-border rounded-md overflow-hidden ${aspectRatioClasses[aspectRatio]}`}>
        {currentImageUrl ? (
          <Image
            src={currentImageUrl}
            alt="Selected image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-background-soft flex items-center justify-center text-muted-foreground">
            <span>No image selected</span>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIsGalleryOpen(true)}
          className="px-3 py-1.5 border border-border rounded-md text-sm bg-background hover:bg-background-soft transition-colors"
        >
          Select from Media
        </button>
        
        <button
          type="button"
          onClick={() => onImageSelect('')}
          className="px-3 py-1.5 border border-red-200 text-red-500 rounded-md text-sm hover:bg-red-50 transition-colors"
          disabled={!currentImageUrl}
        >
          Remove
        </button>
      </div>
      
      {/* Media gallery modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-border p-4">
              <h2 className="text-lg font-medium">Select an Image</h2>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}>
              <MediaGallery
                onSelect={(url) => {
                  onImageSelect(url);
                  setIsGalleryOpen(false);
                }}
                selectMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}