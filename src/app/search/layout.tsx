import { createInnerMetadata } from '@/lib/utils/metadata';

export const generateMetadata = () => createInnerMetadata({
  title: 'Search',
  description: 'Search all posts',
  path: '/search',
  isListing: true,
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
