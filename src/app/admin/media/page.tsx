import { Metadata } from 'next';
import MediaGalleryClient from './media-gallery-client';
import { requireAdminPage } from '@/lib/auth/requireAdminPage';

export const metadata: Metadata = {
  title: 'Media Gallery - Admin Dashboard'
};

export default async function MediaGalleryPage() {
  await requireAdminPage();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Media Gallery</h1>
        <p className="text-muted-foreground">
          Manage uploaded images for your blog
        </p>
      </div>
      
      <MediaGalleryClient />
    </div>
  );
}