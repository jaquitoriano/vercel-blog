import { prisma } from '@/lib/db/prisma';
import AdminDashboardContent from '@/components/admin/DashboardContent';

async function getStats() {
  try {
    const postCount = await prisma.post.count();
    const authorCount = await prisma.author.count();
    const categoryCount = await prisma.category.count();
    const tagCount = await prisma.tag.count();
    const commentCount = await prisma.comment.count();
    
    // Get posts without including author
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { date: 'desc' }
    });
    
    // Get posts without including author
    const topPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { views: 'desc' }
    });
    
    return {
      counts: {
        posts: postCount,
        authors: authorCount,
        categories: categoryCount,
        tags: tagCount,
        comments: commentCount,
      },
      recentPosts,
      topPosts,
    };
  } catch (error) {
    console.error('Database error in getStats:', error);
    
    // Return empty data for graceful fallback
    return {
      counts: {
        posts: 0,
        authors: 0,
        categories: 0,
        tags: 0,
        comments: 0,
      },
      recentPosts: [],
      topPosts: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();
  
  return <AdminDashboardContent stats={stats} />;
}