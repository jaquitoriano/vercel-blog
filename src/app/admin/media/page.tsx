import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import MediaGalleryClient from './media-gallery-client';

export const metadata: Metadata = {
  title: 'Media Gallery - Admin Dashboard',
  robots: 'noindex, nofollow',
};

export default async function MediaGalleryPage() {
  const session = await auth();
  
  // Redirect if not authenticated or not an admin
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  const userRole = session.user.role?.toUpperCase();
  if (userRole !== 'ADMIN') {
    redirect('/admin/login');
  }
  
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