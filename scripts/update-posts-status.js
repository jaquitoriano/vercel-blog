// Script to update all existing posts to PUBLISHED status
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePostsStatus() {
  try {
    // Update all posts to PUBLISHED status
    const result = await prisma.post.updateMany({
      where: {
        status: {
          not: 'PUBLISHED'
        }
      },
      data: {
        status: 'PUBLISHED'
      }
    });

    console.log(`Successfully updated ${result.count} posts to PUBLISHED status`);
  } catch (error) {
    console.error('Error updating posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePostsStatus();