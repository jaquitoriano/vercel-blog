#!/bin/bash

# Script to set up SQLite database for local development
echo "Setting up SQLite database for local development..."

# Copy SQLite environment variables to .env
cp .env.sqlite .env

# Create SQLite schema
cat > prisma/schema.prisma << EOL
// SQLite schema for local development
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Author {
  id        String   @id @default(uuid())
  name      String
  avatar    String?
  bio       String?
  social    Json?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  posts     Post[]

  @@map("authors")
}

model Category {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  posts     Post[]

  @@map("categories")
}

model Tag {
  id        String     @id @default(uuid())
  name      String
  slug      String     @unique
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")
  posts     PostTag[]

  @@map("tags")
}

model Post {
  id          String    @id @default(uuid())
  title       String
  slug        String    @unique
  excerpt     String
  content     String
  coverImage  String?   @map("cover_image")
  date        DateTime
  featured    Boolean   @default(false)
  views       Int       @default(0)
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  author      Author    @relation(fields: [authorId], references: [id])
  authorId    String    @map("author_id")
  category    Category  @relation(fields: [categoryId], references: [id])
  categoryId  String    @map("category_id")
  tags        PostTag[]
  comments    Comment[]

  @@map("posts")
}

model PostTag {
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String   @map("post_id")
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId     String   @map("tag_id")
  createdAt DateTime @default(now()) @map("created_at")

  @@id([postId, tagId])
  @@map("post_tags")
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  authorName String  @map("author_name")
  authorEmail String? @map("author_email")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String   @map("post_id")

  @@map("comments")
}

model User {
  id            String    @id @default(uuid())
  name          String?
  email         String    @unique
  emailVerified DateTime? @map("email_verified")
  password      String
  image         String?
  role          String    @default("user")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@map("users")
}
EOL

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Create initial migration
echo "Creating migration..."
npx prisma migrate dev --name sqlite-setup

# Create admin user
echo "Creating admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function createAdmin() {
  const prisma = new PrismaClient();
  try {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('Admin user created successfully!');
    console.log('Login with: admin@example.com / Admin@123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
"

echo "SQLite setup completed!"
echo "Run 'npm run dev' to start the development server."