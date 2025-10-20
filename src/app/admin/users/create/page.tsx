import UserForm from '@/components/admin/users/UserForm';

export const metadata = {
  title: 'Create User - Admin Dashboard',
};

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create User</h1>
      <UserForm mode="create" />
    </div>
  );
}