import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlugWithRelations, getRelatedPosts, getPostWithComments } from '@/lib/postgresData';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import ImageHandler from '@/components/ImageHandler';

// For rendering markdown content
import ReactMarkdown from 'react-markdown';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlugWithRelations(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPostBySlugWithRelations(params.slug);
  
  if (!post) {
    notFound();
  }

  const readTime = calculateReadTime(post.content);
  const relatedPosts = await getRelatedPosts(post.id, 3);
  const postWithComments = await getPostWithComments(post.id);
  const comments = postWithComments?.comments || [];
  
  return (
    <div className="content-standard">
      {/* Post Header */}
      <div className="mb-10">
        <Link 
          href="/posts"
          className="text-sm mb-5 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
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
          Back to all posts
        </Link>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
          {post.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <ImageHandler 
                src={post.author.avatar}
                alt={post.author.name}
                className="w-full h-full object-cover"
                isAvatar={true}
                name={post.author.name}
              />
            </div>
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">
                <Link href={`/authors/${post.author.id}`} className="hover:text-primary transition-colors">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4">
            <div className="flex items-center gap-1">
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{formatDate(post.date)}</span>
            </div>
            
            <div className="flex items-center gap-1">
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
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{readTime} min read</span>
            </div>
            
            {post.views && (
              <div className="flex items-center gap-1">
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
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{post.views} views</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8">
          <Link 
            href={`/categories/${post.category.slug}`}
            className="px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
          >
            {post.category.name}
          </Link>
          
          {post.tags.map((tag) => (
            <Link 
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 transition-colors text-sm"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured Image */}
      <div className="mb-10 rounded-lg overflow-hidden">
        <ImageHandler 
          src={post.coverImage || ''}
          alt={post.title}
          className="w-full h-auto rounded-lg"
          isAvatar={false}
          name={post.title}
        />
      </div>
      
      {/* Post Content */}
      <div className="prose dark:prose-dark max-w-none mb-12">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      
      {/* Author Bio */}
      <div className="mb-16">
        <Card className="bg-muted border-none">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <ImageHandler 
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                  isAvatar={true}
                  name={post.author.name}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{post.author.name}</h3>
                <p className="text-muted-foreground mb-4">{post.author.bio}</p>
                <div className="flex gap-3">
                  {post.author.social?.twitter && (
                    <a 
                      href={post.author.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                  )}
                  {post.author.social?.github && (
                    <a 
                      href={post.author.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                  )}
                  {post.author.social?.linkedin && (
                    <a 
                      href={post.author.social.linkedin} 
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
                  {post.author.social?.website && (
                    <a 
                      href={post.author.social.website} 
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
          </CardContent>
        </Card>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
            Related Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} hover className="flex flex-col">
                <CardHeader>
                  <div className="text-xs text-muted-foreground mb-2">
                    {formatDate(relatedPost.date)}
                  </div>
                  <CardTitle className="text-lg">
                    <Link href={`/posts/${relatedPost.slug}`} className="hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="line-clamp-3">
                    {relatedPost.excerpt}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild>
                    <Link href={`/posts/${relatedPost.slug}`}>
                      Read More →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      {/* Comments Section */}
      {comments.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
            Comments ({comments.length})
          </h2>
          <div className="space-y-6">
            {comments.filter(c => c.approved).map((comment) => (
              <Card key={comment.id} className="bg-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold">{comment.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.date)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-1">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="w-full px-4 py-2 rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <Button type="submit">
                Submit Comment
              </Button>
            </form>
          </div>
        </section>
      )}
      
      {/* Newsletter */}
      <section className="mb-16">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">
                Enjoyed this article?
              </h2>
              <p className="mb-6 opacity-90">
                Subscribe to our newsletter to get notified when we publish new content. No spam, ever.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 rounded-md text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}