import { TagForm } from '@/components/TagForm';
import { Metadata } from 'next';
import { requireAdminPage } from '@/lib/auth/requireAdminPage';

export const metadata: Metadata = {
  title: 'Create Tag - Admin',
  description: 'Create a new blog tag',
};

export default async function CreateTagPage() {
  await requireAdminPage();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Tag</h1>
      <TagForm />
    </div>
  );
}