'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageSelector from './media/ImageSelector';

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [blobConfigStatus, setBlobConfigStatus] = useState<{
    isConfigured: boolean;
    errors: string[];
    config?: { hasToken: boolean; hasStoreId: boolean };
  }>({ isConfigured: true, errors: [] });

  // Check blob configuration via API on component mount
  useEffect(() => {
    const checkBlobConfig = async () => {
      try {
        const response = await fetch('/api/admin/blob-config');
        if (!response.ok) {
          throw new Error('Failed to check blob configuration');
        }
        
        const data = await response.json();
        setBlobConfigStatus({
          isConfigured: data.isConfigured,
          errors: !data.isConfigured ? ['Blob configuration issue detected'] : []
        });
        
        if (!data.isConfigured) {
          let errorMessage = 'Image upload functionality is not available';
          if (!data.hasToken) errorMessage += ': BLOB_READ_WRITE_TOKEN environment variable is not set';
          if (!data.hasStoreId) errorMessage += (data.hasToken ? ' and ' : ': ') + 'NEXT_PUBLIC_STORE_ID environment variable is not set';
          
          setError(errorMessage);
        }
      } catch (err: any) {
        console.error('Error checking blob configuration:', err);
        setBlobConfigStatus({
          isConfigured: false,
          errors: ['Failed to check image upload configuration']
        });
        setError('Failed to check image upload configuration: ' + (err.message || 'Unknown error'));
      }
    };
    
    checkBlobConfig();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update settings');
      }

      setSuccess('Settings updated successfully');
      router.refresh(); // Refresh the page to update any server components
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'reset' }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to reset settings');
        }

        const data = await response.json();
        setSettings(data.settings);
        setSuccess('Settings reset to defaults');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Failed to reset settings');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-background-soft border border-border rounded-lg overflow-hidden">
      <div className="border-b border-border">
        <nav className="flex overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            General Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            SEO Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'social'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Social Media
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('welcome')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'welcome'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Welcome Section
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('other')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'other'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Other Settings
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {/* General Settings */}
        <div className={activeTab === 'general' ? '' : 'hidden'}>
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="site_title" className="block text-sm font-medium text-foreground mb-1">
                Site Title
              </label>
              <input
                id="site_title"
                type="text"
                value={settings.site_title || ''}
                onChange={(e) => handleChange('site_title', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The title of your blog that appears in the header
              </p>
            </div>

            <div>
              <label htmlFor="site_description" className="block text-sm font-medium text-foreground mb-1">
                Site Description
              </label>
              <input
                id="site_description"
                type="text"
                value={settings.site_description || ''}
                onChange={(e) => handleChange('site_description', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                A short tagline that appears below the site title
              </p>
            </div>

            <div>
              <label htmlFor="site_logo" className="block text-sm font-medium text-foreground mb-1">
                Site Logo
              </label>
              <div className="space-y-3">
                <input
                  id="site_logo"
                  type="text"
                  value={settings.site_logo || ''}
                  onChange={(e) => handleChange('site_logo', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Enter image URL or use the selector below"
                />
                <ImageSelector
                  currentImageUrl={settings.site_logo || ''}
                  onImageSelect={(url) => handleChange('site_logo', url)}
                  aspectRatio="wide"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Logo image for your site (recommended size: 200x50)
              </p>
            </div>

            <div>
              <label htmlFor="site_favicon" className="block text-sm font-medium text-foreground mb-1">
                Favicon
              </label>
              <div className="space-y-3">
                <input
                  id="site_favicon"
                  type="text"
                  value={settings.site_favicon || ''}
                  onChange={(e) => handleChange('site_favicon', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Enter image URL or use the selector below"
                />
                <ImageSelector
                  currentImageUrl={settings.site_favicon || ''}
                  onImageSelect={(url) => handleChange('site_favicon', url)}
                  aspectRatio="square"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Favicon for your site (recommended size: 32x32)
              </p>
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-foreground mb-1">
                Contact Email
              </label>
              <input
                id="contact_email"
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Email address displayed on contact pages
              </p>
            </div>

            <div>
              <label htmlFor="footer_text" className="block text-sm font-medium text-foreground mb-1">
                Footer Text
              </label>
              <input
                id="footer_text"
                type="text"
                value={settings.footer_text || ''}
                onChange={(e) => handleChange('footer_text', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Copyright notice or other text to display in the footer
              </p>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className={activeTab === 'seo' ? '' : 'hidden'}>
          <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="meta_title" className="block text-sm font-medium text-foreground mb-1">
                Default Meta Title
              </label>
              <input
                id="meta_title"
                type="text"
                value={settings.meta_title || ''}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The title that appears in search engine results (50-60 characters recommended)
              </p>
            </div>

            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium text-foreground mb-1">
                Default Meta Description
              </label>
              <textarea
                id="meta_description"
                value={settings.meta_description || ''}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Description that appears in search results (150-160 characters recommended)
              </p>
            </div>

            <div>
              <label htmlFor="meta_keywords" className="block text-sm font-medium text-foreground mb-1">
                Default Meta Keywords
              </label>
              <input
                id="meta_keywords"
                type="text"
                value={settings.meta_keywords || ''}
                onChange={(e) => handleChange('meta_keywords', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Comma-separated keywords relevant to your site (less important today but still used by some search engines)
              </p>
            </div>

            <div>
              <label htmlFor="og_image" className="block text-sm font-medium text-foreground mb-1">
                Default Open Graph Image
              </label>
              <div className="space-y-3">
                <input
                  id="og_image"
                  type="text"
                  value={settings.og_image || ''}
                  onChange={(e) => handleChange('og_image', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Enter image URL or use the selector below"
                />
                <ImageSelector
                  currentImageUrl={settings.og_image || ''}
                  onImageSelect={(url) => handleChange('og_image', url)}
                  aspectRatio="wide"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Image used when sharing on social media (recommended size: 1200x630)
              </p>
            </div>

            <div>
              <label htmlFor="twitter_handle" className="block text-sm font-medium text-foreground mb-1">
                Twitter Handle
              </label>
              <input
                id="twitter_handle"
                type="text"
                value={settings.twitter_handle || ''}
                onChange={(e) => handleChange('twitter_handle', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your Twitter handle (e.g. @yourusername)
              </p>
            </div>

            <div>
              <label htmlFor="google_analytics_id" className="block text-sm font-medium text-foreground mb-1">
                Google Analytics ID
              </label>
              <input
                id="google_analytics_id"
                type="text"
                value={settings.google_analytics_id || ''}
                onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your Google Analytics tracking ID (e.g. G-XXXXXXXXXX or UA-XXXXXXXX-X)
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Settings */}
        <div className={activeTab === 'social' ? '' : 'hidden'}>
          <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="social_twitter" className="block text-sm font-medium text-foreground mb-1">
                Twitter URL
              </label>
              <input
                id="social_twitter"
                type="text"
                value={settings.social_twitter || ''}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>

            <div>
              <label htmlFor="social_facebook" className="block text-sm font-medium text-foreground mb-1">
                Facebook URL
              </label>
              <input
                id="social_facebook"
                type="text"
                value={settings.social_facebook || ''}
                onChange={(e) => handleChange('social_facebook', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>

            <div>
              <label htmlFor="social_instagram" className="block text-sm font-medium text-foreground mb-1">
                Instagram URL
              </label>
              <input
                id="social_instagram"
                type="text"
                value={settings.social_instagram || ''}
                onChange={(e) => handleChange('social_instagram', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>

            <div>
              <label htmlFor="social_linkedin" className="block text-sm font-medium text-foreground mb-1">
                LinkedIn URL
              </label>
              <input
                id="social_linkedin"
                type="text"
                value={settings.social_linkedin || ''}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>

            <div>
              <label htmlFor="social_github" className="block text-sm font-medium text-foreground mb-1">
                GitHub URL
              </label>
              <input
                id="social_github"
                type="text"
                value={settings.social_github || ''}
                onChange={(e) => handleChange('social_github', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Welcome Section Settings */}
        <div className={activeTab === 'welcome' ? '' : 'hidden'}>
          <h2 className="text-xl font-semibold mb-4">Welcome Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="welcome_heading" className="block text-sm font-medium text-foreground mb-1">
                Welcome Heading
              </label>
              <input
                id="welcome_heading"
                type="text"
                value={settings.welcome_heading || ''}
                onChange={(e) => handleChange('welcome_heading', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The main heading in the welcome section
              </p>
            </div>

            <div>
              <label htmlFor="welcome_subheading" className="block text-sm font-medium text-foreground mb-1">
                Welcome Subheading
              </label>
              <input
                id="welcome_subheading"
                type="text"
                value={settings.welcome_subheading || ''}
                onChange={(e) => handleChange('welcome_subheading', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The descriptive text below the main heading
              </p>
            </div>

            <div>
              <label htmlFor="welcome_cta_text" className="block text-sm font-medium text-foreground mb-1">
                Call to Action Text
              </label>
              <input
                id="welcome_cta_text"
                type="text"
                value={settings.welcome_cta_text || ''}
                onChange={(e) => handleChange('welcome_cta_text', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The text shown on the main button
              </p>
            </div>

            <div>
              <label htmlFor="welcome_cta_link" className="block text-sm font-medium text-foreground mb-1">
                Call to Action Link
              </label>
              <input
                id="welcome_cta_link"
                type="text"
                value={settings.welcome_cta_link || ''}
                onChange={(e) => handleChange('welcome_cta_link', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The URL the button links to (e.g., /posts)
              </p>
            </div>

            <div>
              <label htmlFor="welcome_featured_text" className="block text-sm font-medium text-foreground mb-1">
                Featured Posts Heading
              </label>
              <input
                id="welcome_featured_text"
                type="text"
                value={settings.welcome_featured_text || ''}
                onChange={(e) => handleChange('welcome_featured_text', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The heading above the featured posts section
              </p>
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className={activeTab === 'other' ? '' : 'hidden'}>
          <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="footer_links" className="block text-sm font-medium text-foreground mb-1">
                Footer Links (JSON)
              </label>
              <textarea
                id="footer_links"
                value={settings.footer_links || ''}
                onChange={(e) => handleChange('footer_links', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground font-mono text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                JSON array of links to display in the footer. Format: [{'"name"'}: {'"Home"'}, {'"url"'}: {'"/"'}]
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            Reset to Defaults
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}