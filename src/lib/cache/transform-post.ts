import { Post, PostTag } from '@prisma/client';
import { PostWithRelations } from './posts-cache';

type RawPostResult = Post & {
  author: {
    id: string;
    name: string;
    avatar: string | null;
    bio: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: Array<PostTag & {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
};

export function transformPost(post: RawPostResult): PostWithRelations {
  return {
    ...post,
    tags: post.tags.map(pt => pt.tag)
  };
}