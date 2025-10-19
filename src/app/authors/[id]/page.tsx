import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByAuthor } from '@/data';
import { authors, getAuthorById } from '@/data/authors';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/Card';
import ImageHandler from '@/components/ImageHandler';

export function generateMetadata({ params }: { params: { id: string } }) {
  const author = getAuthorById(params.id);
  
  if (!author) {
    return {
      title: 'Author Not Found',
      description: 'The requested author could not be found'
    };
  }
  
  return {
    title: `${author.name} - Author`,
    description: author.bio || `Browse posts by ${author.name}`
  };
}

export default function AuthorPage({ params }: { params: { id: string } }) {
  const author = getAuthorById(params.id);
  
  if (!author) {
    notFound();
  }
  
  const posts = getPostsByAuthor(params.id);

  return (
    <div className="content-standard">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Link 
            href="/authors"
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
            All Authors
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <ImageHandler 
                        src={author.avatar}
                        alt={author.name}
                        className="w-full h-full object-cover"
                        isAvatar={true}
                        name={author.name}
                      />
                    </div>          <div className="md:flex-1">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-center md:text-left">
              {author.name}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 text-center md:text-left">
              {author.bio}
            </p>
            
            <div className="flex gap-4 justify-center md:justify-start">
              {author.social?.twitter && (
                <a 
                  href={author.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              )}
              {author.social?.github && (
                <a 
                  href={author.social.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              )}
              {author.social?.linkedin && (
                <a 
                  href={author.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
              {author.social?.website && (
                <a 
                  href={author.social.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Posts by {author.name} ({posts.length})
        </h2>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post) => {
            const readTime = calculateReadTime(post.content);
            
            return (
              <Card key={post.id} hover className="flex flex-col">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Link 
                      href={`/categories/${post.category.slug}`}
                      className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {post.category.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.date)} · {readTime} min read
                    </span>
                  </div>
                  
                  <CardTitle>
                    <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
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
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map(tag => (
                        <Link 
                          key={tag.id}
                          href={`/tags/${tag.slug}`}
                          className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 transition-colors"
                        >
                          {tag.name}
                        </Link>
                      ))}
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
            This author hasn't published any posts yet.
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