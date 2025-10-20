import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

// Generic error handling for database operations
export async function executeQuery(queryFn: Function) {
  try {
    noStore();
    return await queryFn();
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to fetch data from the database');
  }
}

// Base function for Vercel Postgres queries
export async function vercelQuery(query: string, params?: any[]) {
  return executeQuery(async () => {
    try {
      const result = await sql.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Vercel Postgres error:', error);
      throw new Error('Database operation failed');
    }
  });
}