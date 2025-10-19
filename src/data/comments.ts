import { Comment } from '@/types';

export const comments: Comment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    name: "Alex Thompson",
    email: "alex@example.com",
    content: "This was incredibly helpful! I've been struggling with setting up TypeScript in my Next.js project and this guide made it very clear.",
    date: "2025-10-16",
    approved: true,
  },
  {
    id: "comment-2",
    postId: "post-1",
    name: "Maria Garcia",
    email: "maria@example.com",
    content: "Would you recommend using path aliases with TypeScript in Next.js? I've found them really helpful but wonder if there are any downsides.",
    date: "2025-10-16",
    approved: true,
  },
  {
    id: "comment-3",
    postId: "post-1",
    name: "John Doe",
    email: "john@example.com",
    content: "Thanks for this guide! One question - do you have any recommendations for handling API types when working with external services?",
    date: "2025-10-17",
    approved: true,
    parentId: "comment-1",
  },
  {
    id: "comment-4",
    postId: "post-2",
    name: "Sara Wilson",
    email: "sara@example.com",
    content: "Accessibility is so important and often overlooked. Thanks for highlighting these practices!",
    date: "2025-10-11",
    approved: true,
  },
  {
    id: "comment-5",
    postId: "post-2",
    name: "Miguel Rodriguez",
    email: "miguel@example.com",
    content: "I've been implementing these practices in my projects and it's made a huge difference. One addition I'd suggest is mentioning ARIA live regions for dynamic content updates.",
    date: "2025-10-12",
    approved: true,
  },
  {
    id: "comment-6",
    postId: "post-3",
    name: "Priya Patel",
    email: "priya@example.com",
    content: "Great explanation of when to use these optimization techniques. I've seen many teams over-optimize and create more problems than they solve.",
    date: "2025-10-07",
    approved: true,
  },
  {
    id: "comment-7",
    postId: "post-4",
    name: "David Kim",
    email: "david@example.com",
    content: "I've been using Tailwind for years but never thought about structuring it as a design system like this. Going to try implementing some of these ideas!",
    date: "2025-09-30",
    approved: true,
  }
];

export function getCommentsByPostId(postId: string): Comment[] {
  return comments.filter(comment => comment.postId === postId && comment.approved);
}

export function getCommentById(id: string): Comment | undefined {
  return comments.find(comment => comment.id === id);
}