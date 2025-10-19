import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByCategory } from '@/data';
import { categories } from '@/data/categories';
import { formatDate, calculateReadTime } from '@/lib/utils';
import ImageHandler from '@/components/ImageHandler';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/Card';

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found'
    };
  }
  
  return {
    title: `${category.name} - Category`,
    description: category.description || `Browse all posts in the ${category.name} category`
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    notFound();
  }
  
  const posts = getPostsByCategory(params.slug);

  return (
    <div className="content-wide">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Link 
            href="/categories"
            className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            All Categories
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold font-serif mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xl text-muted-foreground">
            {category.description}
          </p>
        )}
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post) => {
            const readTime = calculateReadTime(post.content);
            
            return (
              <Card key={post.id} hover className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category.name}
                    </span>
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
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No posts found</h2>
          <p className="text-muted-foreground mb-6">
            There are no posts in this category yet.
          </p>
          <Button asChild>
            <Link href="/posts">
              Browse All Posts
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}