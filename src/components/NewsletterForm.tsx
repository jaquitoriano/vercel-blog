'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate API call delay
    try {
      // Replace with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      setEmail('');
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <svg 
          className="w-12 h-12 mx-auto text-green-500 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-bold mb-2">Thanks for subscribing!</h3>
        <p>We'll be in touch with updates and new content.</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow px-4 py-3 rounded-md text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        required
        disabled={isLoading}
      />
      <Button 
        type="submit"
        className={`bg-gradient-to-r from-primary to-primary-hover hover:scale-105 hover:shadow-glow-pink transition-all px-6 py-3 whitespace-nowrap flex items-center justify-center gap-2 ${isLoading ? 'animate-pulse' : ''}`}
        size="lg"
        disabled={isLoading}
      >
        {isLoading && (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-hover to-primary opacity-30 animate-pulse"></div>
          </div>
        )}
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2 text-center w-full">
          {errorMessage}
        </div>
      )}
    </form>
  );
}