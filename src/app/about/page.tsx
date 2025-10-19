import Image from 'next/image';

export const metadata = {
  title: 'About Us',
  description: 'Learn more about our blog and team',
};

export default function AboutPage() {
  return (
    <div className="content-standard">
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Us</h1>
      
      <div className="prose-content">
        <p className="text-xl text-muted-foreground mb-8">
          We're a team of passionate writers and developers sharing insights about web development, 
          design, and technology.
        </p>

        <div className="aspect-[21/9] relative rounded-lg overflow-hidden mb-10">
          <Image 
            src="/images/about-hero.jpg" 
            alt="Our team" 
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
        
        <h2>Our Mission</h2>
        <p>
          At Blog Template, we strive to provide valuable, well-researched content that helps
          developers and designers improve their skills and stay up-to-date with the latest 
          trends and technologies in the web development world.
        </p>
        
        <h2>Our Story</h2>
        <p>
          Founded in 2023, our blog started as a small project to document our learnings and 
          experiences in web development. Over time, it has grown into a comprehensive resource
          for developers at all levels.
        </p>
        
        <h2>Our Team</h2>
        <p>
          We are a diverse group of developers, designers, and writers who are passionate about
          web technologies. Each team member brings unique expertise and perspective to our content.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4">
              <Image 
                src="/images/team-member-1.jpg" 
                alt="Team Member" 
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">Jane Smith</h3>
            <p className="text-muted-foreground mb-3">Lead Developer</p>
            <p className="text-sm">
              Full-stack developer with 8 years of experience specializing in React and Node.js.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4">
              <Image 
                src="/images/team-member-2.jpg" 
                alt="Team Member" 
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">John Doe</h3>
            <p className="text-muted-foreground mb-3">Content Writer</p>
            <p className="text-sm">
              Technical writer with a background in UX design and front-end development.
            </p>
          </div>
        </div>
        
        <h2>Contact Us</h2>
        <p>
          Have questions, suggestions, or want to contribute to our blog? We'd love to hear from you!
        </p>
        <p>
          Email us at <a href="mailto:contact@blog-template.com">contact@blog-template.com</a> or
          connect with us on social media.
        </p>
      </div>
    </div>
  );
}