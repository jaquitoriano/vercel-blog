'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}

interface ImageGalleryProps {
  onImageSelect: (url: string) => void;
  folder?: string;
}

export default function ImageGallery({
  onImageSelect,
  folder = 'uploads',
}: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/uploads?folder=${folder}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch images');
      }

      const data = await response.json();
      // Sort images by upload date, newest first
      setImages(data.images.sort((a: GalleryImage, b: GalleryImage) => {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }));
    } catch (err: any) {
      console.error('Error fetching images:', err);
      setError(err.message || 'Failed to fetch images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [folder]);

  const handleDeleteClick = (url: string) => {
    setDeleteUrl(url);
  };

  const confirmDelete = async () => {
    if (!deleteUrl) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/uploads?url=${encodeURIComponent(deleteUrl)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image');
      }
      
      // Remove the image from the state
      setImages(images.filter(img => img.url !== deleteUrl));
      setDeleteUrl(null);
    } catch (err: any) {
      console.error('Error deleting image:', err);
      alert(err.message || 'Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteUrl(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Image Gallery</h2>
        <button
          onClick={loadImages}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center gap-1 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          <span>Refresh</span>
        </button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && images.length === 0 && (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No images found. Upload images to see them here.</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.url} className="border border-border rounded-lg overflow-hidden group relative">
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt="Uploaded image"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onImageSelect(image.url)}
              />
            </div>
            <div className="p-2 bg-background-soft text-xs">
              <div className="truncate text-muted-foreground">
                {image.pathname.split('/').pop()}
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{formatFileSize(image.size)}</span>
                <span>{formatDate(image.uploadedAt)}</span>
              </div>
            </div>
            <button
              onClick={() => handleDeleteClick(image.url)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              title="Delete image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {/* Delete confirmation dialog */}
      {deleteUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isDeleting ? 'Deleting...' : 'Delete Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}