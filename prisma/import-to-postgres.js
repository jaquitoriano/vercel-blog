#!/usr/bin/env node

/**
 * This script imports data from JSON backups to Vercel Postgres
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

console.log('Importing data to Vercel Postgres...');

// Create Postgres client with environment variables
const client = new PrismaClient();

async function main() {
  try {
    console.log('Reading data from backup files...');
    
    // Read backup files
    const backupDir = path.join(__dirname, 'backup');
    
    if (!fs.existsSync(backupDir)) {
      console.error('Backup directory not found. Run backup-sqlite.js first.');
      process.exit(1);
    }
    
    const authorsFile = path.join(backupDir, 'authors.json');
    const categoriesFile = path.join(backupDir, 'categories.json');
    const tagsFile = path.join(backupDir, 'tags.json');
    const postsFile = path.join(backupDir, 'posts.json');
    const postTagsFile = path.join(backupDir, 'postTags.json');
    const commentsFile = path.join(backupDir, 'comments.json');
    const usersFile = path.join(backupDir, 'users.json');
    
    if (!fs.existsSync(authorsFile) || !fs.existsSync(categoriesFile) || 
        !fs.existsSync(tagsFile) || !fs.existsSync(postsFile) || 
        !fs.existsSync(postTagsFile) || !fs.existsSync(commentsFile) ||
        !fs.existsSync(usersFile)) {
      console.error('One or more backup files are missing.');
      process.exit(1);
    }
    
    const authors = JSON.parse(fs.readFileSync(authorsFile, 'utf8'));
    const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
    const tags = JSON.parse(fs.readFileSync(tagsFile, 'utf8'));
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    const postTags = JSON.parse(fs.readFileSync(postTagsFile, 'utf8'));
    const comments = JSON.parse(fs.readFileSync(commentsFile, 'utf8'));
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    
    console.log('Importing data to Postgres...');

    // Insert data in correct order (respecting foreign keys)
    
    // 1. Authors
    console.log('Importing authors...');
    for (const author of authors) {
      await client.author.upsert({
        where: { id: author.id },
        update: { ...author },
        create: { ...author }
      });
    }
    
    // 2. Categories
    console.log('Importing categories...');
    for (const category of categories) {
      await client.category.upsert({
        where: { id: category.id },
        update: { ...category },
        create: { ...category }
      });
    }
    
    // 3. Tags
    console.log('Importing tags...');
    for (const tag of tags) {
      await client.tag.upsert({
        where: { id: tag.id },
        update: { ...tag },
        create: { ...tag }
      });
    }
    
    // 4. Posts
    console.log('Importing posts...');
    for (const post of posts) {
      // Format dates properly
      const formattedPost = {
        ...post,
        date: new Date(post.date),
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt)
      };
      
      await client.post.upsert({
        where: { id: post.id },
        update: formattedPost,
        create: formattedPost
      });
    }
    
    // 5. PostTags
    console.log('Importing post tags...');
    for (const postTag of postTags) {
      await client.postTag.upsert({
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
    console.log('Importing comments...');
    for (const comment of comments) {
      await client.comment.upsert({
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
    console.log('Importing users...');
    for (const user of users) {
      await client.user.upsert({
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
    
    console.log('\nImport completed successfully!');
    
    console.log('\nVerifying the import...');
    const authorCount = await client.author.count();
    const categoryCount = await client.category.count();
    const tagCount = await client.tag.count();
    const postCount = await client.post.count();
    const postTagCount = await client.postTag.count();
    const commentCount = await client.comment.count();
    const userCount = await client.user.count();
    
    console.log('Data verification:');
    console.log(`- Authors: ${authorCount}/${authors.length}`);
    console.log(`- Categories: ${categoryCount}/${categories.length}`);
    console.log(`- Tags: ${tagCount}/${tags.length}`);
    console.log(`- Posts: ${postCount}/${posts.length}`);
    console.log(`- PostTags: ${postTagCount}/${postTags.length}`);
    console.log(`- Comments: ${commentCount}/${comments.length}`);
    console.log(`- Users: ${userCount}/${users.length}`);
    
    // Clean up
    await client.$disconnect();
    
    console.log('\nImport process completed! Your data has been successfully imported to Vercel Postgres.');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });