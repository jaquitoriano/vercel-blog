import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { categoryRepository } from '@/lib/repositories/category.repository';

export default async function AdminCategories() {
  const categoriesWithCounts = await categoryRepository.findAll();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/create"
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Add New Category
        </Link>
      </div>
      
      <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Posts</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categoriesWithCounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No categories found
                  </td>
                </tr>
              ) : (
                categoriesWithCounts.map((category) => (
                <tr key={category.id} className="hover:bg-secondary/20">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <Link href={`/admin/categories/${category.id}`} className="hover:underline">
                      {category.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {category.description || <em>No description</em>}
                  </td>
                  <td className="px-6 py-4">
                    {category.postCount}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/categories/${category.slug}`}
                        target="_blank"
                        className="text-green-600 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}