import { prisma } from '@/lib/db/prisma';
import UserForm from '@/components/admin/users/UserForm';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit User - Admin Dashboard',
};

interface EditUserPageProps {
  params: {
    id: string;
  };
}

async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // Don't include password
      },
    });
    
    return user;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const user = await getUser(params.id);
  
  if (!user) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <UserForm user={user} mode="edit" />
    </div>
  );
}