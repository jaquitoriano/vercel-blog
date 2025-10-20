import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/Card';
import { getFeaturedPostsWithRelations, getRecentPostsWithRelations } from '@/lib/postgresData';
import { formatDate } from '@/lib/utils';
import ImageHandler from '@/components/ImageHandler';

export default async function Home() {
  // Get data from PostgreSQL database
  const featuredPosts = await getFeaturedPostsWithRelations();
  const featuredPost = featuredPosts[0]; // Get the first featured post
  const recentPosts = await getRecentPostsWithRelations(3);
  return (
    <div className="content-wide">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="rounded-lg bg-background-soft p-8 md:p-12 border border-border">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                Welcome to Our Blog
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore the latest in web development, design, and technology with our
              in-depth articles and tutorials.
            </p>
            <Button size="lg" asChild>
              <Link href="/posts">
                Explore All Posts
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
          Featured Post
        </h2>
        {featuredPost ? (
          <Card hover>
            <div className="w-full h-64 bg-muted overflow-hidden">
              <ImageHandler 
                src={featuredPost.coverImage || ''} 
                alt={featuredPost.title}
                className="w-full h-full object-cover"
                isAvatar={false}
                name={featuredPost.title}
              />
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-3">
                {featuredPost.tags && featuredPost.tags.map(tag => (
                  <span key={tag.id} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                {formatDate(featuredPost.date)}
                <span className="inline-block mx-1">•</span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  {featuredPost.views}
                </span>
              </div>
              <CardTitle>
                <Link href={`/posts/${featuredPost.slug}`} className="hover:text-primary transition-colors">
                  {featuredPost.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <ImageHandler 
                    src={featuredPost.author.avatar} 
                    alt={featuredPost.author.name}
                    className="w-full h-full object-cover"
                    isAvatar={true}
                    name={featuredPost.author.name}
                  />
                </div>
                <span className="font-medium">{featuredPost.author.name}</span>
              </div>
              <CardDescription className="mb-4">
                {featuredPost.excerpt}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild>
                <Link href={`/posts/${featuredPost.slug}`}>
                  Continue Reading →
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <p className="text-muted-foreground">No featured posts available.</p>
        )}
      </section>

      {/* Recent Posts */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">
            Recent Posts
          </h2>
          <Link
            href="/posts"
            className="text-primary hover:text-primary-hover font-medium"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <Card key={post.id} hover className="flex flex-col">
              <div className="w-full h-40 bg-muted overflow-hidden">
                <ImageHandler 
                  src={post.coverImage || ''} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                  isAvatar={false}
                  name={post.title}
                />
              </div>
              <CardHeader>
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.tags && post.tags.slice(0, 2).map(tag => (
                    <span key={tag.id} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                      {tag.name}
                    </span>
                  ))}
                  {post.tags && post.tags.length > 2 && (
                    <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {formatDate(post.date)}
                </div>
                <CardTitle>
                  <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <ImageHandler 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                      isAvatar={true}
                      name={post.author.name}
                    />
                  </div>
                  <span>{post.author.name}</span>
                </div>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild>
                  <Link href={`/posts/${post.slug}`}>
                    Read More →
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="mb-16">
        <Card className="bg-muted p-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">
              Subscribe to our newsletter
            </h2>
            <p className="text-muted-foreground mb-6">
              Get notified when we publish new articles. We won't spam you or share your details.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-md border border-border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary flex-grow px-4 py-2"
                required
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
          </div>
        </Card>
      </section>
    </div>
  );
}
