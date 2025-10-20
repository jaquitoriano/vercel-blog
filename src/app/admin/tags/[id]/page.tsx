import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { formatDate } from '@/lib/utils';

export default async function TagDetail({ params }: { params: { id: string } }) {
  const tagId = params.id;
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });
  
  if (!tag) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Tag Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The tag you are looking for does not exist or has been removed.
        </p>
        <Link href="/admin/tags" className="mt-6 inline-block text-primary hover:underline">
          Back to Tags
        </Link>
      </div>
    );
  }
  
  // Get post ids for this tag
  const postTags = await prisma.postTag.findMany({
    where: { tagId: tag.id },
  });
  
  const postIds = postTags.map(postTag => postTag.postId);
  
  // Get posts data
  const posts = await prisma.post.findMany({
    where: { 
      id: { 
        in: postIds 
      } 
    },
    orderBy: { date: 'desc' },
    include: {
      author: true,
    },
    take: 20, // Limit to recent posts
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{tag.name}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/admin/tags/${tag.id}/edit`}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Edit Tag
          </Link>
          <Link
            href={`/tags/${tag.slug}`}
            target="_blank"
            className="border border-border hover:bg-secondary px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View on Site
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-5 bg-background-soft border border-border rounded-lg">
          <h2 className="text-lg font-medium mb-2">Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slug:</span>
              <span className="font-medium">{tag.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Posts:</span>
              <span className="font-medium">{posts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{formatDate(tag.createdAt.toString())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium">{formatDate(tag.updatedAt.toString())}</span>
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Posts with this Tag</h2>
      
      <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No posts found with this tag
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
                    {post.author?.name}
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