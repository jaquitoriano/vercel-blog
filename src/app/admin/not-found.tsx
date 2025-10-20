import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-4">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/admin/dashboard"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}