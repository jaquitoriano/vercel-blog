import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: "category-1",
    name: "Web Development",
    slug: "web-development",
    description: "Articles covering frontend and backend web development technologies, best practices, and tutorials.",
  },
  {
    id: "category-2",
    name: "Design",
    slug: "design",
    description: "Topics related to UI/UX design principles, tools, trends, and case studies.",
  },
  {
    id: "category-3",
    name: "DevOps",
    slug: "devops",
    description: "Resources about deployment, CI/CD, containerization, and infrastructure management.",
  },
  {
    id: "category-4",
    name: "Career",
    slug: "career",
    description: "Advice on tech careers, interviews, skill development, and industry insights.",
  },
  {
    id: "category-5",
    name: "Tutorials",
    slug: "tutorials",
    description: "Step-by-step guides to help you learn new technologies and techniques.",
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug);
}