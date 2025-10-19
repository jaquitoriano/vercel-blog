import Link from 'next/link';
import { tags } from '@/data/tags';
import { getPostsByTag } from '@/data';

export const metadata = {
  title: 'Tags',
  description: 'Browse posts by tag',
};

export default function TagsPage() {
  // Get post counts for each tag
  const tagsWithCount = tags.map(tag => {
    const posts = getPostsByTag(tag.slug);
    return {
      ...tag,
      count: posts.length
    };
  });

  // Calculate tag sizes based on post count for a tag cloud effect
  const maxCount = Math.max(...tagsWithCount.map(tag => tag.count));
  const minCount = Math.min(...tagsWithCount.map(tag => tag.count));
  const range = maxCount - minCount || 1;

  // Sort tags alphabetically
  const sortedTags = [...tagsWithCount].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="content-standard">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-serif mb-4">Tags</h1>
        <p className="text-xl text-muted-foreground">
          Browse our content by topic
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {sortedTags.map((tag) => {
          // Calculate size between 1-5 based on count
          const size = tag.count === 0 ? 1 : Math.ceil((tag.count - minCount) / range * 4) + 1;
          
          // Map size to appropriate text size class
          const sizeClass = [
            'text-xs',
            'text-sm',
            'text-base',
            'text-lg',
            'text-xl'
          ][size - 1];
          
          return (
            <Link
              href={`/tags/${tag.slug}`}
              key={tag.id}
              className={`${sizeClass} px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground hover:bg-secondary/30 transition-colors font-medium inline-flex items-center`}
            >
              {tag.name} 
              {tag.count > 0 && (
                <span className="ml-1 opacity-70 text-xs">({tag.count})</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}