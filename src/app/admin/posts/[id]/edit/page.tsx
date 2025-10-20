import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { postRepository } from '@/lib/repositories/post.repository';
import { prisma } from '@/lib/db/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Post - Admin Dashboard',
};

interface EditPostPageProps {
  params: {
    id: string;
  };
}

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

export default async function EditPostPage({ params }: EditPostPageProps) {
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
  
  const { authors, categories, tags } = await getOptions();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground">
          Edit the post details and content
        </p>
      </div>
      
      <PostForm 
        action="edit" 
        post={post}
        authors={authors}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}