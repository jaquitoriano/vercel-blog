'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  date: string | Date;
  views: number;
  authorId: string;
  // The author property may not be available since it's not included in the query
  author?: {
    id: string;
    name: string;
  };
}

interface StatsProps {
  counts: {
    posts: number;
    authors: number;
    categories: number;
    tags: number;
    comments: number;
  };
  recentPosts: Post[];
  topPosts: Post[];
}

export default function AdminDashboardContent({ stats }: { stats: StatsProps }) {

  const StatCard = ({ title, count, icon, href }: { title: string, count: number, icon: JSX.Element, href: string }) => (
    <Link
      href={href}
      className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{count}</p>
        </div>
      </div>
    </Link>
  );

  const [isClient, setIsClient] = useState(false);
  
  // Use this to ensure we're running on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        
        {isClient && (
          <div>
            <Link
              href="/admin/logout"
              className="px-4 py-2 rounded bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
        
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Posts"
          count={stats.counts.posts}
          href="/admin/posts"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          }
        />
        
        <StatCard
          title="Authors"
          count={stats.counts.authors}
          href="/admin/authors"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          }
        />
        
        <StatCard
          title="Categories"
          count={stats.counts.categories}
          href="/admin/categories"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
          }
        />
        
        <StatCard
          title="Tags"
          count={stats.counts.tags}
          href="/admin/tags"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
            </svg>
          }
        />
        
        <StatCard
          title="Comments"
          count={stats.counts.comments}
          href="/admin/comments"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          }
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="bg-white p-5 rounded-lg border border-border shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
          <div className="divide-y divide-border">
            {stats.recentPosts.map((post: Post) => (
              <div key={post.id} className="py-2.5">
                <h3 className="font-medium text-foreground">
                  <Link href={`/admin/posts/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <span>Author ID: {post.authorId}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right">
            <Link href="/admin/posts" className="text-sm text-primary hover:underline">
              View all posts →
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-border shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Top Posts by Views</h2>
          <div className="divide-y divide-border">
            {stats.topPosts.map((post: Post) => (
              <div key={post.id} className="py-2.5">
                <h3 className="font-medium text-foreground">
                  <Link href={`/admin/posts/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm text-muted-foreground">
                    <span>Author ID: {post.authorId}</span>
                  </div>
                  <div className="text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span>{post.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right">
            <Link href="/admin/posts" className="text-sm text-primary hover:underline">
              View all posts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}