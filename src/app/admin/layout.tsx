import type { Metadata } from 'next';
import AdminTemplate from '@/components/admin/AdminTemplate';

export const metadata: Metadata = {
  robots: 'noindex, nofollow', // Prevent all search engines from indexing and following links
  title: 'Admin Dashboard',
  description: 'Blog administration area',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminTemplate>{children}</AdminTemplate>;
}