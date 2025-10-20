#!/usr/bin/env node

/**
 * This script seeds mock data directly into Vercel Postgres
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('Starting seeding of mock data into Vercel Postgres...');

// Create Prisma client with Postgres connection
const prisma = new PrismaClient();

// Import mock data
const mockDataPath = path.join(__dirname, '../src/data');

// Function to load JSON data or use default if file doesn't exist
function loadData(filename, defaultData = []) {
  const filePath = path.join(mockDataPath, filename);
  if (fs.existsSync(filePath)) {
    return require(filePath);
  }
  return defaultData;
}

// Default mock data if files aren't found
const defaultAuthors = [
  {
    id: "author-1",
    name: "John Doe",
    avatar: "/images/authors/john-doe.jpg",
    bio: "Senior tech writer with over 10 years of experience in the industry.",
    social: {
      twitter: "johndoe",
      linkedin: "johndoe"
    }
  },
  {
    id: "author-2",
    name: "Jane Smith",
    avatar: "/images/authors/jane-smith.jpg",
    bio: "Editor and tech enthusiast passionate about emerging technologies.",
    social: {
      twitter: "janesmith",
      linkedin: "janesmith"
    }
  }
];

const defaultCategories = [
  {
    id: "category-1",
    name: "Technology",
    slug: "technology"
  },
  {
    id: "category-2",
    name: "Design",
    slug: "design"
  },
  {
    id: "category-3",
    name: "Development",
    slug: "development"
  }
];

const defaultTags = [
  {
    id: "tag-1",
    name: "JavaScript",
    slug: "javascript"
  },
  {
    id: "tag-2",
    name: "React",
    slug: "react"
  },
  {
    id: "tag-3",
    name: "Next.js",
    slug: "nextjs"
  },
  {
    id: "tag-4",
    name: "TypeScript",
    slug: "typescript"
  },
  {
    id: "tag-5",
    name: "CSS",
    slug: "css"
  }
];

// Try to load mock data or use defaults
const mockAuthors = loadData('authors.js', defaultAuthors);
const mockCategories = loadData('categories.js', defaultCategories);
const mockTags = loadData('tags.js', defaultTags);

// Function to generate mock posts if needed
function generateMockPosts() {
  return [
    {
      id: "post-1",
      title: "Getting Started with Next.js",
      slug: "getting-started-with-nextjs",
      excerpt: "Learn how to build a blog with Next.js and deploy it to Vercel.",
      content: "## Getting Started with Next.js\n\nNext.js is a powerful React framework that makes building web applications easy and efficient. In this post, we'll explore how to create a blog using Next.js and deploy it to Vercel.\n\n### Features of Next.js\n\n- Server-side rendering\n- Static site generation\n- API routes\n- File-based routing\n\n### Getting Started\n\nFirst, let's create a new Next.js project:\n\n```bash\nnpx create-next-app my-blog\ncd my-blog\nnpm run dev\n```\n\nThis will set up a new Next.js project with all the necessary configurations.",
      coverImage: "/images/posts/nextjs-cover.jpg",
      date: new Date("2023-06-15"),
      authorId: "author-1",
      categoryId: "category-3",
      featured: true
    },
    {
      id: "post-2",
      title: "Mastering CSS Grid Layout",
      slug: "mastering-css-grid-layout",
      excerpt: "A comprehensive guide to using CSS Grid for modern layouts.",
      content: "## Mastering CSS Grid Layout\n\nCSS Grid Layout is a powerful system for creating two-dimensional layouts on the web. In this guide, we'll explore how to use CSS Grid to create complex layouts with ease.\n\n### Basic Grid Concepts\n\nTo create a grid container, you use `display: grid` on a parent element:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-gap: 20px;\n}\n```\n\nThis creates a three-column grid with equal-width columns and 20px gaps.",
      coverImage: "/images/posts/css-grid-cover.jpg",
      date: new Date("2023-07-10"),
      authorId: "author-2",
      categoryId: "category-2",
      featured: false
    }
  ];
}

// Function to generate mock post tags
function generatePostTags() {
  return [
    {
      postId: "post-1",
      tagId: "tag-3"
    },
    {
      postId: "post-1",
      tagId: "tag-2"
    },
    {
      postId: "post-2",
      tagId: "tag-5"
    }
  ];
}

// Function to generate mock comments
function generateComments() {
  return [
    {
      id: "comment-1",
      content: "Great article! This helped me understand Next.js better.",
      authorName: "Mark Wilson",
      authorEmail: "mark@example.com",
      postId: "post-1",
      createdAt: new Date("2023-06-16"),
      updatedAt: new Date("2023-06-16")
    },
    {
      id: "comment-2",
      content: "Thanks for the clear explanation of CSS Grid. I'll be using these techniques in my next project.",
      authorName: "Sarah Johnson",
      authorEmail: "sarah@example.com",
      postId: "post-2",
      createdAt: new Date("2023-07-12"),
      updatedAt: new Date("2023-07-12")
    }
  ];
}

// Function to generate mock users
function generateUsers() {
  return [
    {
      id: "user-1",
      name: "Admin User",
      email: "admin@example.com",
      password: "$2b$10$GmDc.cY9FYrcIqewrCkPYudSdnA5AfI4H7lr9fZ0uMdLbPiDkMKl.", // hashed version of "Admin@123"
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
}

// Create a backup directory for our mock data
async function createBackupData() {
  const backupDir = path.join(__dirname, 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const mockPosts = generateMockPosts();
  const mockPostTags = generatePostTags();
  const mockComments = generateComments();
  const mockUsers = generateUsers();
  
  fs.writeFileSync(
    path.join(backupDir, 'authors.json'),
    JSON.stringify(mockAuthors, null, 2)
  );
  
  fs.writeFileSync(
    path.join(backupDir, 'categories.json'),
    JSON.stringify(mockCategories, null, 2)
  );
  
  fs.writeFileSync(
    path.join(backupDir, 'tags.json'),
    JSON.stringify(mockTags, null, 2)
  );
  
  fs.writeFileSync(
    path.join(backupDir, 'posts.json'),
    JSON.stringify(mockPosts, null, 2)
  );
  
  fs.writeFileSync(
    path.join(backupDir, 'postTags.json'),
    JSON.stringify(mockPostTags, null, 2)
  );
  
  fs.writeFileSync(
    path.join(backupDir, 'comments.json'),
    JSON.stringify(mockComments, null, 2)
  );
  
  fs.writeFileSync(
    path.join(backupDir, 'users.json'),
    JSON.stringify(mockUsers, null, 2)
  );
  
  return {
    authors: mockAuthors,
    categories: mockCategories,
    tags: mockTags,
    posts: mockPosts,
    postTags: mockPostTags,
    comments: mockComments,
    users: mockUsers
  };
}

async function main() {
  try {
    console.log('Step 1: Preparing mock data...');
    const mockData = await createBackupData();
    console.log('Mock data prepared and saved to ./backup directory');
    
    console.log('\nStep 2: Seeding data to Postgres...');
    
    // Insert data in correct order (respecting foreign keys)
    
    // 1. Authors
    console.log('Seeding authors...');
    for (const author of mockData.authors) {
      await prisma.author.upsert({
        where: { id: author.id },
        update: {
          name: author.name,
          avatar: author.avatar,
          bio: author.bio,
          social: author.social || {}
        },
        create: {
          id: author.id,
          name: author.name,
          avatar: author.avatar,
          bio: author.bio,
          social: author.social || {}
        }
      });
    }
    
    // 2. Categories
    console.log('Seeding categories...');
    for (const category of mockData.categories) {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {
          name: category.name,
          slug: category.slug
        },
        create: {
          id: category.id,
          name: category.name,
          slug: category.slug
        }
      });
    }
    
    // 3. Tags
    console.log('Seeding tags...');
    for (const tag of mockData.tags) {
      await prisma.tag.upsert({
        where: { id: tag.id },
        update: {
          name: tag.name,
          slug: tag.slug
        },
        create: {
          id: tag.id,
          name: tag.name,
          slug: tag.slug
        }
      });
    }
    
    // 4. Posts
    console.log('Seeding posts...');
    for (const post of mockData.posts) {
      await prisma.post.upsert({
        where: { id: post.id },
        update: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          date: new Date(post.date),
          featured: post.featured,
          authorId: post.authorId,
          categoryId: post.categoryId
        },
        create: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          date: new Date(post.date),
          featured: post.featured,
          authorId: post.authorId,
          categoryId: post.categoryId
        }
      });
    }
    
    // 5. PostTags
    console.log('Seeding post tags...');
    for (const postTag of mockData.postTags) {
      try {
        await prisma.postTag.upsert({
          where: { 
            postId_tagId: { 
              postId: postTag.postId, 
              tagId: postTag.tagId 
            } 
          },
          update: {},
          create: { 
            postId: postTag.postId,
            tagId: postTag.tagId
          }
        });
      } catch (e) {
        console.log(`Error seeding post tag (${postTag.postId}, ${postTag.tagId}): ${e.message}`);
      }
    }
    
    // 6. Comments
    console.log('Seeding comments...');
    for (const comment of mockData.comments) {
      await prisma.comment.upsert({
        where: { id: comment.id },
        update: {
          content: comment.content,
          authorName: comment.authorName,
          authorEmail: comment.authorEmail,
          postId: comment.postId,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt)
        },
        create: {
          id: comment.id,
          content: comment.content,
          authorName: comment.authorName,
          authorEmail: comment.authorEmail,
          postId: comment.postId,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt)
        }
      });
    }
    
    // 7. Users
    console.log('Seeding users...');
    for (const user of mockData.users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          emailVerified: null,
          image: user.image
        },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          emailVerified: null,
          image: user.image
        }
      });
    }
    
    console.log('\nSeeding completed successfully!');
    
    // Verify the data was seeded correctly
    console.log('\nVerifying seeded data...');
    const authorCount = await prisma.author.count();
    const categoryCount = await prisma.category.count();
    const tagCount = await prisma.tag.count();
    const postCount = await prisma.post.count();
    const postTagCount = await prisma.postTag.count();
    const commentCount = await prisma.comment.count();
    const userCount = await prisma.user.count();
    
    console.log('Data verification:');
    console.log(`- Authors: ${authorCount}/${mockData.authors.length}`);
    console.log(`- Categories: ${categoryCount}/${mockData.categories.length}`);
    console.log(`- Tags: ${tagCount}/${mockData.tags.length}`);
    console.log(`- Posts: ${postCount}/${mockData.posts.length}`);
    console.log(`- PostTags: ${postTagCount}/${mockData.postTags.length}`);
    console.log(`- Comments: ${commentCount}/${mockData.comments.length}`);
    console.log(`- Users: ${userCount}/${mockData.users.length}`);

    // Clean up
    await prisma.$disconnect();
    
    console.log('\nMock data seeding process completed! Your Vercel Postgres database is now populated with sample data.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });