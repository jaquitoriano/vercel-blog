'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { uploadToBlob } from '@/lib/blob/blob-client';

interface MediaImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface MediaGalleryProps {
  onSelect?: (imageUrl: string) => void;
  selectMode?: boolean;
}

export default function MediaGallery({ onSelect, selectMode = false }: MediaGalleryProps) {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [blobConfigured, setBlobConfigured] = useState(true);
  
  // Check blob configuration and fetch images on component mount
  useEffect(() => {
    // Check blob configuration via API endpoint
    const checkBlobConfig = async () => {
      try {
        const response = await fetch('/api/admin/blob-config');
        if (!response.ok) {
          throw new Error('Failed to check blob configuration');
        }
        
        const data = await response.json();
        setBlobConfigured(data.isConfigured);
        
        if (!data.isConfigured) {
          let errorMessage = 'Image upload functionality is not available';
          if (!data.hasToken) errorMessage += ': BLOB_READ_WRITE_TOKEN environment variable is not set';
          if (!data.hasStoreId) errorMessage += (data.hasToken ? ' and ' : ': ') + 'NEXT_PUBLIC_STORE_ID environment variable is not set';
          
          setError(errorMessage);
          setIsLoading(false);
          return;
        }
        
        // Only fetch images if blob is properly configured
        fetchImages();
      } catch (err: any) {
        console.error('Error checking blob configuration:', err);
        setBlobConfigured(false);
        setError('Failed to check image upload configuration: ' + (err.message || 'Unknown error'));
        setIsLoading(false);
      }
    };
    
    checkBlobConfig();
  }, []);
  
  // Function to fetch images from the API
  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/uploads');
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      setImages(data.images || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching images');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    await uploadFiles(Array.from(files));
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };
  
  // Handle file drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  // Upload files to the server using API route
  const uploadFiles = async (files: File[]) => {
    // Check blob config before proceeding
    if (!blobConfigured) {
      setError('Image upload is not available: Vercel Blob is not properly configured');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed');
          continue;
        }
        
        // Create form data for the API request
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('folder', 'uploads');
        
        // Upload the file using the API endpoint
        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload file');
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Refresh the image list
      fetchImages();
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle image selection
  const handleImageSelect = (url: string) => {
    if (onSelect) {
      onSelect(url);
    }
  };
  
  // Filter images based on search term
  const filteredImages = searchTerm 
    ? images.filter(image => image.pathname.toLowerCase().includes(searchTerm.toLowerCase()))
    : images;
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          !blobConfigured ? 'border-red-300 bg-red-50' : 
          dragActive ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragEnter={blobConfigured ? handleDrag : undefined}
        onDragOver={blobConfigured ? handleDrag : undefined}
        onDragLeave={blobConfigured ? handleDrag : undefined}
        onDrop={blobConfigured ? handleDrop : undefined}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg className="h-12 w-12 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium">Upload Images</h3>
          {!blobConfigured ? (
            <p className="text-red-500 font-medium">Image upload is not available due to configuration issues</p>
          ) : (
            <p className="text-muted-foreground">Drag and drop files or click to browse</p>
          )}
          
          <div>
            <label 
              htmlFor="file-upload" 
              className={`${blobConfigured 
                ? 'cursor-pointer bg-primary text-white hover:bg-primary/90' 
                : 'cursor-not-allowed bg-gray-400'} px-4 py-2 rounded-md transition-colors inline-block`}
            >
              Choose Files
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={blobConfigured ? handleFileChange : undefined}
              disabled={!blobConfigured}
              className="hidden"
            />
          </div>
          
          {isUploading && (
            <div className="w-full mt-4">
              <div className="w-full bg-border rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p className="text-sm mt-1 text-muted-foreground">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground pl-10"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Image gallery */}
      <div>
        <h3 className="font-medium mb-4">Media Gallery</h3>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-background-soft border border-border rounded-md p-12 text-center">
            <p className="text-muted-foreground">No images found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <div 
                key={image.url} 
                className={`group relative border border-border rounded-md overflow-hidden h-40 cursor-pointer hover:border-primary transition-colors ${
                  selectMode ? 'hover:shadow-md' : ''
                }`}
                onClick={() => selectMode && handleImageSelect(image.url)}
              >
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                  <div className="text-white text-center p-2">
                    {selectMode ? (
                      <button 
                        className="bg-primary text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleImageSelect(image.url)}
                      >
                        Select
                      </button>
                    ) : (
                      <>
                        <button 
                          className="bg-primary text-white px-3 py-1 rounded-md text-sm mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(image.url);
                            alert('URL copied to clipboard!');
                          }}
                        >
                          Copy URL
                        </button>
                        <button 
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this image?')) {
                              try {
                                const response = await fetch(`/api/admin/uploads?url=${encodeURIComponent(image.url)}`, {
                                  method: 'DELETE',
                                });
                                if (response.ok) {
                                  fetchImages();
                                } else {
                                  setError('Failed to delete image');
                                }
                              } catch (err) {
                                setError('An error occurred while deleting');
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <Image
                  src={image.url}
                  alt="Media gallery image"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}