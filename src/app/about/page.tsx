import Image from 'next/image';
import { createInnerMetadata } from '@/lib/utils/metadata';

export const generateMetadata = () => createInnerMetadata({
  title: 'About Us',
  description: "The name Ikira draws from the elegance of ink and the spark of irony — representing the balance between structure and spontaneity. It’s about creating with meaning, not just noise.",
  path: '/about',
  isListing: true,
});

export default function AboutPage() {
  return (
    <div className="content-standard">
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Us</h1>
      
      <div className="prose-content">
        
        <h2>Ikira</h2>
        <p>
          The name Ikira draws from the elegance of ink and the spark of irony — representing the balance between structure and spontaneity.
          It’s about creating with meaning, not just noise.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          Have questions, suggestions, or want to contribute to our blog? We'd love to hear from you!
        </p>
      </div>
    </div>
  );
}