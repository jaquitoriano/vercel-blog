import { auth } from '@/auth';
import { CategoryForm } from '@/components/CategoryForm';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Category - Admin',
  description: 'Create a new blog category',
};

export default async function NewCategoryPage() {
  const session = await auth();
  
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">New Category</h1>
      <CategoryForm />
    </div>
  );
}