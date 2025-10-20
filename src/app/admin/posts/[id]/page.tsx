import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { postRepository } from '@/lib/repositories/post.repository';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import DeletePostButton from '@/components/admin/DeletePostButton';

export const metadata: Metadata = {
  title: 'Post Details - Admin Dashboard',
};

interface ViewPostPageProps {
  params: {
    id: string;
  };
}

export default async function ViewPostPage({ params }: ViewPostPageProps) {
  const session = await auth();
  
  // Redirect if not authenticated or not an admin
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  const userRole = session.user.role?.toUpperCase();
  if (userRole !== 'ADMIN') {
    redirect('/admin/login');
  }
  
  // Get the post
  const post = await postRepository.findById(params.id);
  
  // If post not found, show 404 page
  if (!post) {
    notFound();
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Post Details</h1>
        <div className="space-x-2 flex">
          <Link 
            href={`/admin/posts/${post.id}/edit`} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Post
          </Link>
          <DeletePostButton postId={post.id} postTitle={post.title} />
          <Link
            href="/admin/posts"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Posts
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-background rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-muted-foreground">Slug: {post.slug}</p>
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium">Excerpt</h3>
              <p>{post.excerpt}</p>
              
              <h3 className="text-lg font-medium mt-4">Content</h3>
              <pre className="p-4 bg-gray-100 rounded-md overflow-auto whitespace-pre-wrap">
                {post.content}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-background rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium mb-2">Cover Image</h3>
            <div className="relative aspect-video overflow-hidden rounded-md">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                  No image
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Status</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-block w-3 h-3 rounded-full ${post.featured ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                <span>{post.featured ? 'Featured Post' : 'Regular Post'}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-1">Author</h3>
              <p>{post.author.name}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-1">Category</h3>
              <p>{post.category.name}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-1">Tags</h3>
              {post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: any) => (
                    <span 
                      key={tag.id}
                      className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No tags</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-1">Dates</h3>
              <div className="text-sm space-y-1">
                <p>Created: {formatDate(post.createdAt)}</p>
                <p>Updated: {formatDate(post.updatedAt)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-1">Stats</h3>
              <p>{post.views} views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}