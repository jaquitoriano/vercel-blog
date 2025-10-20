# Vercel Blog CMS

A modern, responsive blog platform built with Next.js, React, TypeScript, and Tailwind CSS. This blog application now uses Vercel Postgres for data storage.

## Features

- 📝 Blog post creation and editing with Markdown support
- 🔒 User and author management
- 📱 Responsive design for all devices
- 🚀 Ready for deployment on Vercel
- 🔄 SSR and SSG for optimal performance
- 💾 PostgreSQL database via Vercel Postgres
- 🔍 SEO optimized

## Database Migration

The project has been migrated from SQLite to Vercel Postgres. The migration process involved:

1. Updating the Prisma schema to use PostgreSQL as the provider
2. Creating a baseline migration for the existing database schema
3. Updating environment variables to use Vercel Postgres connection strings
4. Creating and running a seed script to populate the database with sample data

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository or download the source code:

```bash
git clone <repository-url>
cd vercel-blog
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env.local`:

```
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Management

### Seed the Database

To seed the database with sample data:

```bash
node prisma/seed-postgres.js
```

### Sync Schema with Database

To sync the Prisma schema with the database:

```bash
npx prisma db push
```

### Prisma Studio

To explore your database with Prisma Studio:

```bash
npx prisma studio
```

## Project Structure

- `src/app/` - Application pages using Next.js App Router
- `src/components/` - React components
- `src/lib/` - Utility functions and database access
- `src/types` - TypeScript type definitions
- `prisma/` - Database schema and migrations

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://prisma.io/) - Database ORM
- [Vercel Postgres](https://vercel.com/storage/postgres) - Database
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

## Deployment

You can deploy this project to Vercel with a few clicks:

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your repository
4. Set up the environment variables for Postgres connection
5. Deploy!

## License

This project is open source and available under the [MIT License](LICENSE).