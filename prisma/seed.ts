import { PrismaClient, PostStatus } from '@prisma/client'
import { hash } from 'bcrypt'
import { settingsRepository } from '@/lib/repositories/settings.repository'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminId = 'c9f5d30d-87c2-4dad-8f4a-789e90d4c4c9'
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create sample author
  const author = await prisma.author.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'John Doe',
      avatar: '/authors/john-doe.jpg',
      bio: 'Tech enthusiast and full-stack developer with 10 years of experience.',
      social: {
        twitter: 'https://twitter.com/johndoe',
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe'
      }
    }
  })

  console.log('Created author:', author.name)

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest in tech and development'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: 'Tutorial',
        slug: 'tutorial',
        description: 'Step-by-step guides and tutorials'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'news' },
      update: {},
      create: {
        name: 'News',
        slug: 'news',
        description: 'Latest updates and announcements'
      }
    })
  ])

  console.log('Created categories:', categories.map(c => c.name).join(', '))

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: {
        name: 'Prisma',
        slug: 'prisma'
      }
    })
  ])

  console.log('Created tags:', tags.map(t => t.name).join(', '))

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'getting-started-with-nextjs-13' },
      update: {},
      create: {
        title: 'Getting Started with Next.js 13',
        slug: 'getting-started-with-nextjs-13',
        excerpt: 'Learn how to build modern web applications with Next.js 13 and its new app directory structure.',
        content: `# Getting Started with Next.js 13

Next.js 13 introduces several groundbreaking features that revolutionize how we build web applications. In this comprehensive guide, we'll explore:

## The App Directory

The new app directory provides:
- Improved routing
- Layouts
- Server Components
- Streaming

## Server Components

React Server Components allow you to:
- Reduce client-side JavaScript
- Improve initial page load
- Better SEO

## Examples and Best Practices

Here are some code examples...`,
        coverImage: '/blog/nextjs-13-guide.jpg',
        date: new Date('2025-10-15'),
        featured: true,
        authorId: author.id,
        categoryId: categories[0].id, // Technology
        status: PostStatus.PUBLISHED,
        tags: {
          create: [
            { tag: { connect: { slug: 'nextjs' } } },
            { tag: { connect: { slug: 'react' } } }
          ]
        },
        comments: {
          create: [
            {
              content: 'Great introduction to Next.js 13! Very helpful.',
              authorName: 'Jane Smith',
              authorEmail: 'jane@example.com'
            }
          ]
        }
      }
    }),
    prisma.post.upsert({
      where: { slug: 'prisma-typescript-best-practices' },
      update: {},
      create: {
        title: 'Prisma TypeScript Best Practices',
        slug: 'prisma-typescript-best-practices',
        excerpt: 'Learn the best practices for using Prisma with TypeScript in your Next.js applications.',
        content: `# Prisma TypeScript Best Practices

## Type Safety with Prisma

Prisma provides excellent TypeScript support out of the box. Here's how to make the most of it:

### Generated Types

Prisma automatically generates...

### Error Handling

Best practices for handling Prisma errors...`,
        coverImage: '/blog/prisma-typescript.jpg',
        date: new Date('2025-10-20'),
        featured: true,
        authorId: author.id,
        categoryId: categories[1].id, // Tutorial
        status: PostStatus.PUBLISHED,
        tags: {
          create: [
            { tag: { connect: { slug: 'prisma' } } },
            { tag: { connect: { slug: 'typescript' } } }
          ]
        }
      }
    })
  ])

  console.log('Created posts:', posts.map(p => p.title).join(', '))

  // Initialize default settings
  await settingsRepository.initialize()
  console.log('Initialized default settings')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })