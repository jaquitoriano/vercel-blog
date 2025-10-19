"use client";

import { ImageWithFallback } from './ImageWithFallback';

export function TestImageFallback() {
  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold">Image Fallback Test</h2>
      
      <div className="flex flex-col gap-4 items-center">
        <h3 className="text-xl">Working Images (Fallbacks)</h3>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col items-center">
            <p>Avatar</p>
            <ImageWithFallback 
              src="/images/fallbacks/avatar.svg" 
              alt="Working Avatar" 
              type="avatar"
              name="Test Author"
              className="w-16 h-16 rounded-full"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <p>Thumbnail</p>
            <ImageWithFallback 
              src="/images/fallbacks/thumbnail.svg" 
              alt="Working Thumbnail" 
              type="thumbnail"
              name="Test Post"
              className="w-40 h-24 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 items-center">
        <h3 className="text-xl">Broken Images (Should Show Fallbacks)</h3>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col items-center">
            <p>Avatar Fallback</p>
            <ImageWithFallback 
              src="/non-existent-avatar.jpg" 
              alt="Broken Avatar" 
              type="avatar"
              name="Missing Author"
              className="w-16 h-16 rounded-full"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <p>Thumbnail Fallback</p>
            <ImageWithFallback 
              src="/non-existent-thumbnail.jpg" 
              alt="Broken Thumbnail" 
              type="thumbnail"
              name="Missing Post"
              className="w-40 h-24 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}