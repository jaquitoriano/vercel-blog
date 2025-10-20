import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { postRepository } from '@/lib/repositories/post.repository';
import { prisma } from '@/lib/db/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Post - Admin Dashboard',
};

async function getOptions() {
  const [authorsPromise, categoriesPromise, tagsPromise] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);
  
  return {
    authors: authorsPromise,
    categories: categoriesPromise,
    tags: tagsPromise,
  };
}

export default async function CreatePostPage() {
  const session = await auth();
  
  // Redirect if not authenticated or not an admin
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  const userRole = session.user.role?.toUpperCase();
  if (userRole !== 'ADMIN') {
    redirect('/admin/login');
  }
  
  const { authors, categories, tags } = await getOptions();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">
          Create a new blog post with markdown content
        </p>
      </div>
      
      <PostForm 
        action="create" 
        authors={authors}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}