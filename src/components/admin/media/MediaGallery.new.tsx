'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { uploadToBlob } from '@/lib/blob/blob-client';

interface MediaImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  type?: string;
}

interface MediaGalleryProps {
  onSelect?: (imageUrl: string) => void;
  selectMode?: boolean;
  acceptTypes?: string;
}

export default function MediaGallery({ onSelect, selectMode = false, acceptTypes = 'image/*' }: MediaGalleryProps) {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [blobConfigured, setBlobConfigured] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  const fetchImages = useCallback(async (forceUpdate = false) => {
    try {
      console.log('[MediaGallery] Fetching images in', selectMode ? 'select mode' : 'normal mode');
      
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/uploads', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[MediaGallery] API Response:', data);
      
      if (!data || !Array.isArray(data.images)) {
        throw new Error('Invalid data format from server');
      }
      
      const sortedImages = data.images.sort((a: MediaImage, b: MediaImage) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      
      setImages(sortedImages);
    } catch (err: any) {
      console.error('[MediaGallery] Error:', err);
      setError(err.message || 'Failed to load images');
    } finally {
      setIsLoading(false);
    }
  }, [selectMode]);
  
  useEffect(() => {
    const loadImages = async () => {
      if (selectMode) {
        await fetchImages(true);
      } else {
        try {
          const response = await fetch('/api/admin/blob-config', {
            credentials: 'include'
          });
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
          
          await fetchImages();
        } catch (err: any) {
          console.error('Error checking blob configuration:', err);
          setBlobConfigured(false);
          setError('Failed to check image upload configuration: ' + (err.message || 'Unknown error'));
          setIsLoading(false);
        }
      }
    };
    
    loadImages();
  }, [selectMode, lastUpdateTime, fetchImages]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    await uploadFiles(Array.from(files));
    
    e.target.value = '';
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const uploadFiles = async (files: File[]) => {
    if (!blobConfigured) {
      setError('Image upload is not available: Vercel Blob is not properly configured');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    let uploadSuccessful = false;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const acceptedTypes = acceptTypes.split(',').map(type => type.trim());
        const isAccepted = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const baseType = type.split('/')[0];
            return file.type.startsWith(`${baseType}/`);
          }
          return type === file.type;
        });

        if (!isAccepted) {
          setError(`Only ${acceptTypes} files are allowed`);
          continue;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('folder', 'uploads');
        
        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload file');
        }
        
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        uploadSuccessful = true;
      }
      
      if (uploadSuccessful) {
        setLastUpdateTime(Date.now());
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleImageSelect = (url: string) => {
    if (onSelect) {
      onSelect(url);
    }
  };
  
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
              accept={acceptTypes}
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
                {image.type?.startsWith('video/') && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs z-10">
                    Video
                  </div>
                )}
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
                                  credentials: 'include'
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
                {image.type?.startsWith('video/') ? (
                  <video
                    src={image.url}
                    className="object-cover w-full h-full"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <Image
                    src={image.url}
                    alt="Media gallery image"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}