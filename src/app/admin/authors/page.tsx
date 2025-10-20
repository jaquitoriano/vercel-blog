import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';

async function getAuthorsWithPostCount() {
  // Get all authors
  const authors = await prisma.author.findMany({
    orderBy: { name: 'asc' },
  });

  // Get post counts for each author
  const authorPostCounts = await Promise.all(
    authors.map(async (author) => {
      const count = await prisma.post.count({
        where: { authorId: author.id }
      });
      return { authorId: author.id, count };
    })
  );

  // Create a map for easy lookup
  const authorPostCountMap = new Map(authorPostCounts.map(item => [item.authorId, item.count]));

  // Combine the data
  return authors.map(author => ({
    ...author,
    postCount: authorPostCountMap.get(author.id) || 0
  }));
}

export default async function AdminAuthors() {
  const authorsWithCounts = await getAuthorsWithPostCount();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Authors</h1>
        <Link
          href="/admin/authors/create"
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Add New Author
        </Link>
      </div>
      
      <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Posts</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {authorsWithCounts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                    No authors found
                  </td>
                </tr>
              ) : (
                authorsWithCounts.map((author) => (
                <tr key={author.id} className="hover:bg-secondary/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {author.avatar && (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={author.avatar}
                            alt={author.name}
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <Link href={`/admin/authors/${author.id}`} className="font-medium text-foreground hover:underline">
                          {author.name}
                        </Link>
                        {author.bio && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {author.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {author.postCount}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/authors/${author.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/authors/${author.id}`}
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