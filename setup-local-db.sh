#!/bin/bash

# Setup script for local development database
echo "Setting up local development database..."

# Copy dev schema to active schema
cp prisma/schema.dev.prisma prisma/schema.prisma

# Generate Prisma client based on SQLite schema
echo "Generating Prisma client..."
npx prisma generate

# Create and migrate SQLite database
echo "Creating SQLite database..."
npx prisma migrate dev --name init

# Seed the database
echo "Seeding the database with sample data..."
npm run seed

echo "Local development database setup complete!"