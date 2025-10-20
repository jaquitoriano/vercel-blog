import { prisma } from '@/lib/db/prisma';
import UsersList from '@/components/admin/users/UsersList';

export const metadata = {
  title: 'Manage Users - Admin Dashboard',
};

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password field for security
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>
      
      <UsersList users={users} />
    </div>
  );
}