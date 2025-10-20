#!/usr/bin/env node

/**
 * This script migrates data from SQLite to Vercel Postgres
 * It's designed to be used as a one-time migration tool
 */

const { PrismaClient: SourcePrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production.local' });

console.log('Starting migration from SQLite to Vercel Postgres...');

// Source client (SQLite)
const sourceClient = new SourcePrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
    }
  }
});

async function main() {
  try {
    console.log('Step 1: Backing up SQLite data...');
    
    // Fetch all data from SQLite
    const authors = await sourceClient.author.findMany();
    console.log(`Fetched ${authors.length} authors`);
    
    const categories = await sourceClient.category.findMany();
    console.log(`Fetched ${categories.length} categories`);
    
    const tags = await sourceClient.tag.findMany();
    console.log(`Fetched ${tags.length} tags`);
    
    const posts = await sourceClient.post.findMany();
    console.log(`Fetched ${posts.length} posts`);
    
    const postTags = await sourceClient.postTag.findMany();
    console.log(`Fetched ${postTags.length} post tags`);
    
    const comments = await sourceClient.comment.findMany();
    console.log(`Fetched ${comments.length} comments`);
    
    const users = await sourceClient.user.findMany();
    console.log(`Fetched ${users.length} users`);

    // Backup data as JSON
    const backupDir = path.join(__dirname, 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(backupDir, 'authors.json'),
      JSON.stringify(authors, null, 2)
    );
    
    fs.writeFileSync(
      path.join(backupDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    );
    
    fs.writeFileSync(
      path.join(backupDir, 'tags.json'),
      JSON.stringify(tags, null, 2)
    );
    
    fs.writeFileSync(
      path.join(backupDir, 'posts.json'),
      JSON.stringify(posts, null, 2)
    );
    
    fs.writeFileSync(
      path.join(backupDir, 'postTags.json'),
      JSON.stringify(postTags, null, 2)
    );
    
    fs.writeFileSync(
      path.join(backupDir, 'comments.json'),
      JSON.stringify(comments, null, 2)
    );
    
    fs.writeFileSync(
      path.join(backupDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    
    console.log('Data backup completed and saved to ./backup directory');

    console.log('\nStep 2: Using existing Postgres schema...');
    // Schema is already set up as postgres
    
    console.log('\nStep 3: Using existing database structure...');
    // Migration has already been applied as baseline

    // Generate a new Prisma client with the Postgres schema
    console.log('\nStep 4: Generating the Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Dynamically import the newly generated client
    console.log('\nStep 5: Reloading the Prisma client...');
    // Clear the require cache for prisma
    Object.keys(require.cache).forEach(key => {
      if (key.includes('@prisma/client')) {
        delete require.cache[key];
      }
    });

    // Create a new client with the fresh schema
    const { PrismaClient: DestPrismaClient } = require('@prisma/client');
    const destinationClient = new DestPrismaClient();

    console.log('\nStep 6: Migrating data to Postgres...');

    // Insert data in correct order (respecting foreign keys)
    
    // 1. Authors
    console.log('Migrating authors...');
    for (const author of authors) {
      await destinationClient.author.upsert({
        where: { id: author.id },
        update: { ...author },
        create: { ...author }
      });
    }
    
    // 2. Categories
    console.log('Migrating categories...');
    for (const category of categories) {
      await destinationClient.category.upsert({
        where: { id: category.id },
        update: { ...category },
        create: { ...category }
      });
    }
    
    // 3. Tags
    console.log('Migrating tags...');
    for (const tag of tags) {
      await destinationClient.tag.upsert({
        where: { id: tag.id },
        update: { ...tag },
        create: { ...tag }
      });
    }
    
    // 4. Posts
    console.log('Migrating posts...');
    for (const post of posts) {
      // Format dates properly
      const formattedPost = {
        ...post,
        date: new Date(post.date),
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt)
      };
      
      await destinationClient.post.upsert({
        where: { id: post.id },
        update: formattedPost,
        create: formattedPost
      });
    }
    
    // 5. PostTags
    console.log('Migrating post tags...');
    for (const postTag of postTags) {
      await destinationClient.postTag.upsert({
        where: { 
          postId_tagId: { 
            postId: postTag.postId, 
            tagId: postTag.tagId 
          } 
        },
        update: { 
          ...postTag,
          createdAt: new Date(postTag.createdAt)
        },
        create: { 
          ...postTag,
          createdAt: new Date(postTag.createdAt)
        }
      });
    }
    
    // 6. Comments
    console.log('Migrating comments...');
    for (const comment of comments) {
      await destinationClient.comment.upsert({
        where: { id: comment.id },
        update: {
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt)
        },
        create: {
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt)
        }
      });
    }
    
    // 7. Users
    console.log('Migrating users...');
    for (const user of users) {
      await destinationClient.user.upsert({
        where: { id: user.id },
        update: {
          ...user,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        },
        create: {
          ...user,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }
      });
    }
    
    console.log('\nMigration completed successfully!');
    
    console.log('\nStep 7: Verifying the migration...');
    const authorCount = await destinationClient.author.count();
    const categoryCount = await destinationClient.category.count();
    const tagCount = await destinationClient.tag.count();
    const postCount = await destinationClient.post.count();
    const postTagCount = await destinationClient.postTag.count();
    const commentCount = await destinationClient.comment.count();
    const userCount = await destinationClient.user.count();
    
    console.log('Data verification:');
    console.log(`- Authors: ${authorCount}/${authors.length}`);
    console.log(`- Categories: ${categoryCount}/${categories.length}`);
    console.log(`- Tags: ${tagCount}/${tags.length}`);
    console.log(`- Posts: ${postCount}/${posts.length}`);
    console.log(`- PostTags: ${postTagCount}/${postTags.length}`);
    console.log(`- Comments: ${commentCount}/${comments.length}`);
    console.log(`- Users: ${userCount}/${users.length}`);
    
    // Clean up
    await sourceClient.$disconnect();
    await destinationClient.$disconnect();
    
    console.log('\nMigration process completed! Your data has been successfully migrated to Vercel Postgres.');
    console.log('\nPlease make sure to update your environment variables to use the Postgres database URL.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });