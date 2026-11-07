import { CategoryForm } from '@/components/CategoryForm';
import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { requireAdminPage } from '@/lib/auth/requireAdminPage';

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
  await requireAdminPage();

  const category = await getCategory(params.id);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Category</h1>
      <CategoryForm initialData={category} isEditing={true} />
    </div>
  );
}