'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SetupInstructions() {
  const [showMore, setShowMore] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Database Connection Error</h1>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-red-600 font-semibold">Error: Environment variable not found: POSTGRES_URL</p>
          
          <p className="mt-4">
            The admin interface requires a PostgreSQL database connection to function properly. 
            Your environment variables are not configured correctly.
          </p>
          
          <h2 className="text-lg font-semibold mt-6">How to fix this issue:</h2>
          
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Create a <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file in the root of your project
              (or update your existing one) with the following variables:
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                POSTGRES_URL="your_postgres_connection_string"<br/>
                POSTGRES_URL_NON_POOLING="your_postgres_direct_connection_string"<br/>
                NEXTAUTH_URL="http://localhost:3000"<br/>
                NEXTAUTH_SECRET="some_random_string"
              </pre>
            </li>
            <li>
              Use a real PostgreSQL connection string from:
              <ul className="list-disc pl-6 mt-2">
                <li>A local PostgreSQL instance</li>
                <li>Vercel Postgres</li>
                <li>Any other PostgreSQL provider</li>
              </ul>
            </li>
            <li>Restart your development server</li>
          </ol>
          
          {showMore && (
            <>
              <h2 className="text-lg font-semibold mt-6">Setting up your database:</h2>
              
              <p>
                After configuring your environment variables, run the following commands to set up your database schema and create an admin user:
              </p>
              
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                # Generate Prisma client<br/>
                npx prisma generate<br/><br/>
                # Push schema to database<br/>
                npx prisma db push<br/><br/>
                # Create admin user<br/>
                npx ts-node scripts/create-admin-user.ts
              </pre>
              
              <p className="mt-4">
                Once your admin user is created, you can log in with:
              </p>
              
              <ul className="list-disc pl-6 mt-2">
                <li>Email: admin@example.com</li>
                <li>Password: Admin@123</li>
              </ul>
            </>
          )}
          
          <div className="mt-6 flex justify-between">
            <button 
              onClick={() => setShowMore(!showMore)} 
              className="text-blue-600 hover:underline"
            >
              {showMore ? 'Show less' : 'Show more setup instructions'}
            </button>
            
            <Link
              href="/"
              className="text-blue-600 hover:underline"
            >
              Return to blog homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}