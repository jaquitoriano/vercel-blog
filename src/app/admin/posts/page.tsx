import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { postRepository } from '@/lib/repositories/post.repository';
import { prisma } from '@/lib/db/prisma';

async function getPosts() {
  // Get posts directly from Prisma without trying to include relations
  const posts = await prisma.post.findMany({
    orderBy: { date: 'desc' },
  });
  
  // Manually fetch related data
  const authorIds = Array.from(new Set(posts.map(post => post.authorId)));
  const categoryIds = Array.from(new Set(posts.map(post => post.categoryId)));
  const postIds = posts.map(post => post.id);
  
  // Fetch all authors and categories in parallel
  const [authors, categories] = await Promise.all([
    prisma.author.findMany({
      where: { id: { in: authorIds } },
    }),
    prisma.category.findMany({
      where: { id: { in: categoryIds } },
    }),
  ]);
  
  // Create maps for quick lookup
  const authorsMap = new Map(authors.map(author => [author.id, author]));
  const categoriesMap = new Map(categories.map(category => [category.id, category]));
  
  // Count tags and comments for each post
  const [tagCounts, commentCounts] = await Promise.all([
    Promise.all(
      posts.map(async post => {
        const count = await prisma.postTag.count({ where: { postId: post.id } });
        return { postId: post.id, count };
      })
    ),
    Promise.all(
      posts.map(async post => {
        const count = await prisma.comment.count({ where: { postId: post.id } });
        return { postId: post.id, count };
      })
    ),
  ]);
  
  // Create maps for tag and comment counts
  const tagCountMap = new Map(tagCounts.map(item => [item.postId, item.count]));
  const commentCountMap = new Map(commentCounts.map(item => [item.postId, item.count]));
  
  // Combine all data
  return posts.map(post => ({
    ...post,
    author: authorsMap.get(post.authorId),
    category: categoriesMap.get(post.categoryId),
    _count: {
      tags: tagCountMap.get(post.id) || 0,
      comments: commentCountMap.get(post.id) || 0
    }
  }));
}

export default async function AdminPosts({ searchParams }: { searchParams: { status?: string } }) {
  const statusFilter = searchParams.status?.toUpperCase();
  const posts = await getPosts();

  // Filter posts based on status if filter is provided
  const filteredPosts = statusFilter 
    ? posts.filter(post => post.status === statusFilter)
    : posts;

  // Count posts by status
  const statusCounts = {
    ALL: posts.length,
    PUBLISHED: posts.filter(post => post.status === 'PUBLISHED').length,
    DRAFT: posts.filter(post => post.status === 'DRAFT').length,
    UNPUBLISHED: posts.filter(post => post.status === 'UNPUBLISHED').length,
    CORRECTED: posts.filter(post => post.status === 'CORRECTED').length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/admin/posts/create"
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Add New Post
        </Link>
      </div>

      <div className="flex mb-6 overflow-x-auto">
        <Link
          href="/admin/posts"
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${!statusFilter ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
        >
          All ({statusCounts.ALL})
        </Link>
        <Link
          href="/admin/posts?status=published"
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${statusFilter === 'PUBLISHED' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
        >
          Published ({statusCounts.PUBLISHED})
        </Link>
        <Link
          href="/admin/posts?status=draft"
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${statusFilter === 'DRAFT' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
        >
          Drafts ({statusCounts.DRAFT})
        </Link>
        <Link
          href="/admin/posts?status=unpublished"
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${statusFilter === 'UNPUBLISHED' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
        >
          Unpublished ({statusCounts.UNPUBLISHED})
        </Link>
        <Link
          href="/admin/posts?status=corrected"
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${statusFilter === 'CORRECTED' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
        >
          Corrected ({statusCounts.CORRECTED})
        </Link>
      </div>
      
      <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Tags</th>
                <th className="px-6 py-3">Comments</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">
                    No posts found
                    {statusFilter && (
                      <>
                        <span> with status </span>
                        <span className="font-semibold">{statusFilter}</span>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-secondary/20">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <Link href={`/admin/posts/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">
                      <span>{post.views} views</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.author ? (
                      <Link href={`/admin/authors/${post.author.id}`} className="hover:underline">
                        {post.author.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Unknown author</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {post.category ? (
                      <Link href={`/admin/categories/${post.category.id}`} className="hover:underline">
                        {post.category.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Uncategorized</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{post._count.tags}</td>
                  <td className="px-6 py-4">{post._count.comments}</td>
                  <td className="px-6 py-4">{formatDate(post.date.toString())}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        post.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                        post.status === 'UNPUBLISHED' ? 'bg-red-100 text-red-800' :
                        post.status === 'CORRECTED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status === 'PUBLISHED' && '✓ '}
                        {post.status === 'DRAFT' && '✎ '}
                        {post.status === 'UNPUBLISHED' && '✕ '}
                        {post.status === 'CORRECTED' && '↻ '}
                        {post.status}
                      </span>
                      {post.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          ★ Featured
                        </span>
                      )}
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