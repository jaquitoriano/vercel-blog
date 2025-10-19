import { Tag } from '@/types';

export const tags: Tag[] = [
  {
    id: "tag-1",
    name: "React",
    slug: "react",
  },
  {
    id: "tag-2",
    name: "Next.js",
    slug: "nextjs",
  },
  {
    id: "tag-3",
    name: "TypeScript",
    slug: "typescript",
  },
  {
    id: "tag-4",
    name: "JavaScript",
    slug: "javascript",
  },
  {
    id: "tag-5",
    name: "CSS",
    slug: "css",
  },
  {
    id: "tag-6",
    name: "Tailwind",
    slug: "tailwind",
  },
  {
    id: "tag-7",
    name: "Node.js",
    slug: "nodejs",
  },
  {
    id: "tag-8",
    name: "API",
    slug: "api",
  },
  {
    id: "tag-9",
    name: "Performance",
    slug: "performance",
  },
  {
    id: "tag-10",
    name: "Accessibility",
    slug: "accessibility",
  },
  {
    id: "tag-11",
    name: "Docker",
    slug: "docker",
  },
  {
    id: "tag-12",
    name: "GitHub",
    slug: "github",
  },
];

export function getTagById(id: string): Tag | undefined {
  return tags.find(tag => tag.id === id);
}

export function getTagsByIds(ids: string[]): Tag[] {
  return tags.filter(tag => ids.includes(tag.id));
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find(tag => tag.slug === slug);
}