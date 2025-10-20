import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { prisma } from '@/lib/db/prisma';

async function getTagsWithPostCount() {
  // Get all tags
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  // Get post counts for each tag using PostTag junction table
  const tagCounts = await Promise.all(
    tags.map(async (tag) => {
      const count = await prisma.postTag.count({
        where: { tagId: tag.id }
      });
      return { tagId: tag.id, count };
    })
  );

  // Create a map for easy lookup
  const tagCountMap = new Map(tagCounts.map(item => [item.tagId, item.count]));

  // Combine the data
  return tags.map(tag => ({
    ...tag,
    postCount: tagCountMap.get(tag.id) || 0
  }));
}

export default async function AdminTags() {
  const tagsWithCounts = await getTagsWithPostCount();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Link
          href="/admin/tags/create"
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Add New Tag
        </Link>
      </div>
      
      <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Posts</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tagsWithCounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No tags found
                  </td>
                </tr>
              ) : (
                tagsWithCounts.map((tag) => (
                <tr key={tag.id} className="hover:bg-secondary/20">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <Link href={`/admin/tags/${tag.id}`} className="hover:underline">
                      {tag.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {tag.slug}
                  </td>
                  <td className="px-6 py-4">
                    {tag.postCount}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(tag.createdAt.toString())}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/tags/${tag.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/tags/${tag.slug}`}
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