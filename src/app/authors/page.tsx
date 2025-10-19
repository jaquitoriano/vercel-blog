import Link from 'next/link';
import { authors } from '@/data/authors';
import { getPostsByAuthor } from '@/data';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';
import ImageHandler from '@/components/ImageHandler';

export const metadata = {
  title: 'Authors',
  description: 'Meet our team of writers and contributors',
};

export default function AuthorsPage() {
  // Get post counts for each author
  const authorsWithPostCount = authors.map(author => {
    const posts = getPostsByAuthor(author.id);
    return {
      ...author,
      postCount: posts.length
    };
  });

  return (
    <div className="content-standard">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-serif mb-4">Authors</h1>
        <p className="text-xl text-muted-foreground">
          Meet our team of writers and contributors
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authorsWithPostCount.map((author) => (
          <Card key={author.id} hover className="flex flex-col">
            <CardHeader className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                <ImageHandler 
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full object-cover"
                  isAvatar={true}
                  name={author.name}
                />
              </div>
              <h2 className="text-xl font-bold mb-1">{author.name}</h2>
              {author.postCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {author.postCount} {author.postCount === 1 ? 'post' : 'posts'}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex-grow text-center">
              <p className="text-muted-foreground line-clamp-3">
                {author.bio}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 border-t border-border pt-4">
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
            </CardFooter>
            <Link href={`/authors/${author.id}`} className="absolute inset-0">
              <span className="sr-only">View {author.name}'s profile</span>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}