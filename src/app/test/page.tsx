import { TestImageFallback } from '@/components/TestImageFallback';

export const metadata = {
  title: 'Test Image Fallback',
  description: 'Test page for image fallback functionality',
};

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Image Fallback Testing</h1>
      <TestImageFallback />
    </div>
  );
}