'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

interface HeroSectionProps {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  bgVideo: string;
  bgOverlay: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  heading,
  subheading,
  ctaText,
  ctaLink,
  bgVideo,
  bgOverlay
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      sectionRef.current.classList.add('scale-100', 'opacity-100');
    }
  }, []);

  const scrollToFeatured = () => {
    const featuredSection = document.getElementById('featured-post-section');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <section 
        ref={sectionRef}
        className="relative w-screen h-screen -mt-6 mb-16 overflow-hidden left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] transition-all duration-1000 transform scale-95 opacity-0"
      >
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ backgroundColor: bgOverlay }}
        />

        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <div 
            className="max-w-4xl mx-auto text-center opacity-0 transform translate-y-4 animate-fadeIn"
            style={{ animation: 'fadeInUp 1s ease-out 0.5s forwards' }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
              <span className="text-white">{heading}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {subheading}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToFeatured}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
              >
                Featured Post
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;