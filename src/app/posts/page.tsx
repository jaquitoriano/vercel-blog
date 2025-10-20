import Link from 'next/link';
import { getAllPostsWithRelations } from '@/lib/postgresData';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/Card';
import ImageHandler from '@/components/ImageHandler';

export const metadata = {
  title: 'All Posts',
  description: 'Browse all our blog posts and articles',
};

export default async function Posts() {
  const allPosts = await getAllPostsWithRelations();
  
  return (
    <div className="content-wide">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-serif mb-4">All Posts</h1>
        <p className="text-xl text-muted-foreground">
          Browse all our articles and tutorials on web development
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {allPosts.map((post) => {
          const readTime = calculateReadTime(post.content);
          
          return (
            <Card key={post.id} hover className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Link 
                    href={`/categories/${post.category.slug}`}
                    className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {post.category.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {readTime} min read
                  </span>
                </div>
                
                <CardTitle>
                  <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <ImageHandler 
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                      isAvatar={true}
                      name={post.author.name}
                    />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{post.author.name}</span>
                    <span className="text-muted-foreground"> · {formatDate(post.date)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <CardDescription>
                  {post.excerpt}
                </CardDescription>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <Button variant="link" asChild>
                  <Link href={`/posts/${post.slug}`}>
                    Read More →
                  </Link>
                </Button>
                
                {post.tags.length > 0 && (
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map(tag => (
                      <Link 
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-xs px-2 py-1 text-muted-foreground">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}