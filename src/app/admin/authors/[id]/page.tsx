import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { formatDate } from '@/lib/utils';

export default async function AuthorDetail({ params }: { params: { id: string } }) {
  const authorId = params.id;
  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: {
      posts: true
    }
  });
  
  if (!author) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Author Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The author you are looking for does not exist or has been removed.
        </p>
        <Link href="/admin/authors" className="mt-6 inline-block text-primary hover:underline">
          Back to Authors
        </Link>
      </div>
    );
  }
  
  // Get posts for this author
  const posts = await prisma.post.findMany({
    where: { authorId: author.id },
    orderBy: { date: 'desc' },
    include: {
      category: true,
    },
    take: 20, // Limit to recent posts
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{author.name}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/admin/authors/${author.id}/edit`}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Edit Author
          </Link>
          <Link
            href={`/authors/${author.id}`}
            target="_blank"
            className="border border-border hover:bg-secondary px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View on Site
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-1">
          {author.avatar && (
            <img 
              src={author.avatar} 
              alt={author.name}
              className="w-full h-auto rounded-lg object-cover mb-4 max-h-64"
            />
          )}
          <div className="p-5 bg-background-soft border border-border rounded-lg">
            <h2 className="text-lg font-medium mb-2">Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posts:</span>
                <span className="font-medium">{posts.length}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="p-5 bg-background-soft border border-border rounded-lg">
            <h2 className="text-lg font-medium mb-3">Biography</h2>
            {author.bio ? (
              <p className="text-muted-foreground">{author.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">No biography provided</p>
            )}
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Posts by this Author</h2>
      
      <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No posts found by this author
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                <tr key={post.id} className="hover:bg-secondary/20">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <Link href={`/admin/posts/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {post.category?.name}
                  </td>
                  <td className="px-6 py-4">{formatDate(post.date.toString())}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      post.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      post.status === 'UNPUBLISHED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/posts/${post.slug}`}
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