export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  date: string;
  updatedAt?: string;
  featured?: boolean;
  draft?: boolean;
  views?: number;
  authorId: string;
  categoryId: string;
  tags: string[]; // Tag IDs
}

export interface PostWithRelations extends Omit<Post, 'authorId' | 'categoryId' | 'tags'> {
  author: Author;
  category: Category;
  tags: Tag[];
}

export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  content: string;
  date: string;
  approved: boolean;
  parentId?: string; // For nested comments
}