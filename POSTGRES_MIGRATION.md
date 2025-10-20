# Migrating to Vercel Postgres

This document outlines the steps to migrate your blog data from SQLite to Vercel Postgres.

## Prerequisites

1. Create a Vercel Postgres database in the Vercel dashboard
2. Get the connection details from your Vercel project's dashboard (under Storage > Postgres)

## Step 1: Set Up Vercel Postgres

1. Go to your Vercel dashboard and navigate to your project
2. Click on "Storage" in the left sidebar
3. Click "Connect Database" and select "Vercel Postgres"
4. Follow the setup instructions
5. Once created, go to the "Postgres" section and click "View connection details"
6. Copy these details for the next step

## Step 2: Create Production Environment File

1. Copy the provided template file:
   ```bash
   cp .env.production.template .env.production
   ```

2. Open `.env.production` and replace the placeholders with your actual Vercel Postgres connection details:
   ```
   POSTGRES_URL="your-postgres-url"
   POSTGRES_PRISMA_URL="your-postgres-prisma-url"
   POSTGRES_URL_NON_POOLING="your-postgres-url-non-pooling"
   POSTGRES_USER="your-postgres-user"
   POSTGRES_HOST="your-postgres-host"
   POSTGRES_PASSWORD="your-postgres-password"
   POSTGRES_DATABASE="your-postgres-database"
   ```

## Step 3: Run the Migration Script

1. Install dependencies if not already done:
   ```bash
   npm install
   ```

2. Run the migration script:
   ```bash
   npm run migrate-to-postgres
   ```

3. The script will:
   - Back up your SQLite data to the `/prisma/backup` directory
   - Switch the Prisma schema to PostgreSQL
   - Create and run migrations
   - Migrate your data to Vercel Postgres
   - Verify the migrated data

## Step 4: Update your Vercel Project

1. Push your code changes to your Git repository
2. Ensure your Vercel project has all the environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`
   - `DATABASE_URL` (set to the same value as `POSTGRES_PRISMA_URL`)
   - `NEXT_PUBLIC_SITE_URL`

## Step 5: Deploy your Project

1. Deploy your project to Vercel:
   ```bash
   npm run deploy
   ```

## Troubleshooting

If you encounter any issues during migration:

1. Check the backup data in `/prisma/backup` to ensure your data was properly exported
2. Examine any error messages from the migration script
3. Ensure your Vercel Postgres connection details are correct
4. Try running the prisma commands manually:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Reverting to SQLite (If Needed)

To revert to SQLite:

1. Restore the original schema:
   ```bash
   git checkout -- prisma/schema.prisma
   ```

2. Run Prisma generate:
   ```bash
   npx prisma generate
   ```

3. Ensure your `.env.local` file has the correct SQLite connection string:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   ```