'use client';

import { useState } from 'react';
import ImageGallery from '@/components/admin/ImageGallery';
import ImageUploader from '@/components/admin/ImageUploader';

export default function MediaGalleryClient() {
  const [activeFolder, setActiveFolder] = useState<string>('uploads');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<'gallery' | 'upload'>('gallery');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelected = (url: string) => {
    setSelectedImage(url);
  };

  const handleImageUploaded = (url: string) => {
    // Trigger refresh of the gallery
    setRefreshTrigger(prev => prev + 1);
    setSelectedTab('gallery'); // Switch to gallery tab after upload
  };

  const folders = [
    { name: 'All Images', value: 'uploads' },
    { name: 'Cover Images', value: 'uploads/cover-images' },
    { name: 'Avatars', value: 'uploads/avatars' },
    { name: 'Site Assets', value: 'uploads/site-assets' },
  ];

  return (
    <div>
      <div className="flex flex-wrap md:flex-nowrap gap-6">
        <div className="w-full md:w-64">
          <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="font-medium">Folders</h3>
            </div>
            <div className="p-2">
              {folders.map(folder => (
                <button
                  key={folder.value}
                  onClick={() => setActiveFolder(folder.value)}
                  className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                    activeFolder === folder.value
                      ? 'bg-primary text-white'
                      : 'hover:bg-background-soft text-foreground'
                  }`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {folder.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-background-soft border border-border rounded-lg overflow-hidden mt-6">
            <div className="p-3 border-b border-border">
              <h3 className="font-medium">Actions</h3>
            </div>
            <div className="p-4">
              <button
                onClick={() => setSelectedTab('upload')}
                className="w-full mb-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload New Image
              </button>
              <button
                onClick={() => setSelectedTab('gallery')}
                className="w-full px-4 py-2 bg-background border border-border rounded-md hover:bg-background-soft transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                View Gallery
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full md:flex-1">
          <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="font-medium">
                {selectedTab === 'gallery' ? 'Image Gallery' : 'Upload New Image'}
              </h3>
            </div>
            <div className="p-4">
              {selectedTab === 'gallery' ? (
                <ImageGallery 
                  onImageSelect={handleImageSelected} 
                  folder={activeFolder} 
                  key={refreshTrigger} // Force re-render when refreshTrigger changes
                />
              ) : (
                <ImageUploader 
                  onImageUploaded={handleImageUploaded}
                  folder={activeFolder}
                  label="Upload new image"
                />
              )}
            </div>
          </div>

          {/* Selected Image Details (shown when an image is selected) */}
          {selectedImage && (
            <div className="bg-background-soft border border-border rounded-lg overflow-hidden mt-6">
              <div className="p-3 border-b border-border">
                <h3 className="font-medium">Selected Image</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <img 
                    src={selectedImage} 
                    alt="Selected image" 
                    className="max-h-48 max-w-full rounded-md" 
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Image URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={selectedImage}
                      readOnly
                      className="w-full px-3 py-2 border border-border rounded-l-md bg-background text-foreground"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedImage);
                        alert('Image URL copied to clipboard');
                      }}
                      className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-primary-hover transition-colors"
                      title="Copy URL"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Markdown Format
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={`![Alt text](${selectedImage})`}
                      readOnly
                      className="w-full px-3 py-2 border border-border rounded-l-md bg-background text-foreground"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`![Alt text](${selectedImage})`);
                        alert('Markdown code copied to clipboard');
                      }}
                      className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-primary-hover transition-colors"
                      title="Copy Markdown"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    HTML Format
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={`<img src="${selectedImage}" alt="Image" />`}
                      readOnly
                      className="w-full px-3 py-2 border border-border rounded-l-md bg-background text-foreground"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`<img src="${selectedImage}" alt="Image" />`);
                        alert('HTML code copied to clipboard');
                      }}
                      className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-primary-hover transition-colors"
                      title="Copy HTML"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}