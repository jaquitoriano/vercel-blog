import Link from 'next/link';

export const metadata = {
  title: 'Access Denied',
  robots: 'noindex, nofollow'
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">403 - Access Denied</h1>
        <p className="text-foreground/80 mb-8">
          You don't have permission to view this page.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}