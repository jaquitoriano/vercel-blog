'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImageGallery from './ImageGallery';

interface ImageManagerProps {
  onImageSelected: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
  folder?: string;
}

export default function ImageManager({
  onImageSelected,
  currentImageUrl,
  label = 'Upload Image',
  folder = 'uploads',
}: ImageManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');
  
  const handleImageUploaded = (url: string) => {
    onImageSelected(url);
  };
  
  const handleGalleryImageSelected = (url: string) => {
    onImageSelected(url);
    setActiveTab('upload'); // Switch back to upload tab to show preview
  };
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Tab navigation */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'upload'
              ? 'bg-background-soft text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Upload New
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'gallery'
              ? 'bg-background-soft text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Image Gallery
        </button>
      </div>
      
      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'upload' ? (
          <ImageUploader
            onImageUploaded={handleImageUploaded}
            existingImageUrl={currentImageUrl}
            label={label}
            folder={folder}
          />
        ) : (
          <ImageGallery 
            onImageSelect={handleGalleryImageSelected}
            folder={folder}
          />
        )}
      </div>
    </div>
  );
}