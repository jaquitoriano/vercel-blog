import { auth } from '@/auth';
import { CategoryForm } from '@/components/CategoryForm';
import { prisma } from '@/lib/db/prisma';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Category - Admin',
  description: 'Edit blog category',
};

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    notFound();
  }

  return {
    name: category.name,
    slug: category.slug
  } as const;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const session = await auth();
  
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const category = await getCategory(params.id);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Category</h1>
      <CategoryForm initialData={category} isEditing={true} />
    </div>
  );
}