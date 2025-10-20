#!/usr/bin/env node

/**
 * This script backs up data from SQLite
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { execSync } = require('child_process');

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

console.log('Backing up SQLite data...');

// First, generate a client with SQLite schema
console.log('Generating SQLite client...');
// Save current schema
fs.copyFileSync(
  path.join(__dirname, 'schema.prisma'),
  path.join(__dirname, 'schema.temp.prisma')
);

// Use SQLite schema
fs.copyFileSync(
  path.join(__dirname, 'schema.sqlite.prisma'),
  path.join(__dirname, 'schema.prisma')
);

// Generate client
execSync('npx prisma generate', { stdio: 'inherit' });

// Now use the generated client
const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();

async function main() {
  try {
    console.log('Reading data from SQLite database...');
    
    // Fetch all data from SQLite
    const authors = await client.author.findMany();
    console.log(`Fetched ${authors.length} authors`);
    
    const categories = await client.category.findMany();
    console.log(`Fetched ${categories.length} categories`);
    
    const tags = await client.tag.findMany();
    console.log(`Fetched ${tags.length} tags`);
    
    const posts = await client.post.findMany();
    console.log(`Fetched ${posts.length} posts`);
    
    const postTags = await client.postTag.findMany();
    console.log(`Fetched ${postTags.length} post tags`);
    
    const comments = await client.comment.findMany();
    console.log(`Fetched ${comments.length} comments`);
    
    const users = await client.user.findMany();
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
    
    console.log('Data backup completed and saved to ./prisma/backup directory');

    // Clean up
    await client.$disconnect();
    
    // Restore original schema
    console.log('Restoring original schema...');
    fs.copyFileSync(
      path.join(__dirname, 'schema.temp.prisma'),
      path.join(__dirname, 'schema.prisma')
    );
    fs.unlinkSync(path.join(__dirname, 'schema.temp.prisma'));
    
    // Regenerate client
    execSync('npx prisma generate', { stdio: 'inherit' });
    
  } catch (error) {
    // Restore original schema even on error
    if (fs.existsSync(path.join(__dirname, 'schema.temp.prisma'))) {
      fs.copyFileSync(
        path.join(__dirname, 'schema.temp.prisma'),
        path.join(__dirname, 'schema.prisma')
      );
      fs.unlinkSync(path.join(__dirname, 'schema.temp.prisma'));
      execSync('npx prisma generate', { stdio: 'inherit' });
    }
    
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });