import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Import mock data
import { authors } from '../src/data/authors';
import { categories } from '../src/data/categories';
import { tags } from '../src/data/tags';
import { posts } from '../src/data/posts';
import { comments } from '../src/data/comments';

// Initialize Prisma client
const prisma = new PrismaClient();

// Seed function
async function seed() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clean database (careful in production!)
    console.log('Cleaning existing data...');
    await prisma.postTag.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    
    // Seed Authors
    console.log('Seeding authors...');
    for (const author of authors) {
      await prisma.author.create({
        data: {
          id: author.id,
          name: author.name,
          avatar: author.avatar,
          bio: author.bio,
          social: author.social,
        },
      });
    }
    
    // Seed Categories
    console.log('Seeding categories...');
    for (const category of categories) {
      await prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      });
    }
    
    // Seed Tags
    console.log('Seeding tags...');
    for (const tag of tags) {
      await prisma.tag.create({
        data: {
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        },
      });
    }
    
    // Seed Posts with Tags
    console.log('Seeding posts...');
    for (const post of posts) {
      await prisma.post.create({
        data: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          date: new Date(post.date),
          featured: post.featured || false,
          views: post.views || 0,
          authorId: post.authorId,
          categoryId: post.categoryId,
          tags: {
            create: post.tags.map(tagId => ({
              tag: {
                connect: {
                  id: tagId,
                },
              },
            })),
          },
        },
      });
    }
    
    // Seed Comments
    console.log('Seeding comments...');
    for (const comment of comments) {
      await prisma.comment.create({
        data: {
          id: comment.id,
          content: comment.content,
          authorName: comment.name,
          authorEmail: comment.email || null,
          postId: comment.postId,
        },
      });
    }
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute seed function
seed();