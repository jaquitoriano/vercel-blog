import { CategoryForm } from '@/components/CategoryForm';
import { Metadata } from 'next';
import { requireAdminPage } from '@/lib/auth/requireAdminPage';

export const metadata: Metadata = {
  title: 'New Category - Admin',
  description: 'Create a new blog category',
};

export default async function NewCategoryPage() {
  await requireAdminPage();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">New Category</h1>
      <CategoryForm />
    </div>
  );
}