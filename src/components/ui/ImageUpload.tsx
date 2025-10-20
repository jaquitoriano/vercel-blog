'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadToBlob, validateImage } from '@/lib/blob';

interface ImageUploadProps {
  currentImageUrl: string;
  onImageUpload: (url: string) => void;
  folder?: string;
  className?: string;
  buttonText?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUpload,
  folder = 'uploads',
  className = '',
  buttonText = 'Upload Image'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Vercel Blob
      const result = await uploadToBlob(file, folder);
      
      // Call the callback with the URL
      onImageUpload(result.url);
      
      // Clean up the preview URL
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(result.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      // Revert to previous image if there was one
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {previewUrl && (
        <div className="mb-3 relative w-full h-32 border border-border rounded-md overflow-hidden">
          <Image
            src={previewUrl}
            alt="Image preview"
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="px-4 py-2 border border-border rounded-md text-sm bg-background hover:bg-background-soft transition-colors"
        >
          {isUploading ? 'Uploading...' : buttonText}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}