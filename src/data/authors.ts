import { Author } from '@/types';

export const authors: Author[] = [
  {
    id: "author-1",
    name: "John Doe",
    avatar: "/images/avatars/john-doe.png",
    bio: "John is a tech writer with over 5 years of experience in web development. He specializes in JavaScript frameworks and modern frontend technologies.",
    social: {
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      website: "https://johndoe.com",
    },
  },
  {
    id: "author-2",
    name: "Jane Smith",
    avatar: "/images/avatars/jane-smith.png",
    bio: "Jane is a senior developer and tech lead with expertise in React and Next.js. She loves teaching and sharing her knowledge about building performant web applications.",
    social: {
      twitter: "https://twitter.com/janesmith",
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
    },
  },
  {
    id: "author-3",
    name: "Alex Johnson",
    avatar: "/images/avatars/alex-johnson.png",
    bio: "Alex is a UI/UX designer and frontend developer passionate about creating beautiful, accessible interfaces. They have worked with various startups to improve their digital presence.",
    social: {
      twitter: "https://twitter.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      website: "https://alexjohnson.design",
    },
  },
];

export function getAuthorById(id: string): Author | undefined {
  return authors.find(author => author.id === id);
}