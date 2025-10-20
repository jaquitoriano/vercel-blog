import { prisma } from '@/lib/db/prisma';
import { PrismaClient } from '@prisma/client';

// Define interfaces for the settings data
interface SiteSetting {
  id: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SiteSettings {
  [key: string]: string;
}

// Define error interface
interface PrismaError extends Error {
  code: string;
  meta?: Record<string, any>;
}

// Define the default settings
const DEFAULT_SETTINGS = {
  // General settings
  site_title: 'Blog Template',
  site_description: 'A Next.js Blog Template',
  site_logo: '/logo.png',
  site_favicon: '/favicon.ico',
  
  // SEO settings
  meta_title: 'Blog Template | A Next.js Blog',
  meta_description: 'A powerful, feature-rich blog template built with Next.js and Tailwind CSS',
  meta_keywords: 'blog, next.js, react, tailwind, typescript',
  og_image: '/og-image.jpg',
  twitter_handle: '@yourtwitterhandle',
  
  // Contact settings
  contact_email: 'contact@example.com',
  
  // Social media links
  social_twitter: 'https://twitter.com/',
  social_facebook: 'https://facebook.com/',
  social_instagram: 'https://instagram.com/',
  social_linkedin: 'https://linkedin.com/',
  social_github: 'https://github.com/',
  
  // Analytics
  google_analytics_id: '',
  
  // Footer settings
  footer_text: '© 2025 Blog Template. All rights reserved.',
  footer_links: JSON.stringify([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Privacy Policy', url: '/privacy' },
  ]),
};

// Repository for settings
export const settingsRepository = {
  /**
   * Initialize settings with default values if they don't exist
   */
  async initialize(): Promise<void> {
    try {
      // Check if SiteSetting model exists by attempting a findFirst
      try {
        await prisma.siteSetting.findFirst();
      } catch (e) {
        // If we get here, the model likely doesn't exist yet
        console.warn('SiteSetting model not available yet - skipping initialization');
        return;
      }
      
      const existingSettings = await prisma.siteSetting.findMany();
      const existingKeys = existingSettings.map(setting => setting.key);
      
      const missingKeys = Object.keys(DEFAULT_SETTINGS).filter(
        key => !existingKeys.includes(key)
      );
      
      if (missingKeys.length > 0) {
        for (const key of missingKeys) {
          await prisma.siteSetting.create({
            data: {
              key,
              value: DEFAULT_SETTINGS[key],
            },
          });
        }
        console.log(`Initialized ${missingKeys.length} missing settings`);
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
      throw error;
    }
  },
  
  /**
   * Get all settings as a key-value object
   */
  async getAll(): Promise<SiteSettings> {
    try {
      try {
        // Make sure settings are initialized
        await this.initialize();
        
        const settings = await prisma.siteSetting.findMany();
        return settings.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as SiteSettings);
      } catch (error) {
        // If we get an error (likely because SiteSetting model doesn't exist),
        // return the default settings instead
        console.warn('Error accessing SiteSetting model, using default settings:', error);
        return { ...DEFAULT_SETTINGS };
      }
    } catch (error) {
      console.error('Error getting all settings:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific setting by key
   */
  async getByKey(key: string): Promise<string | null> {
    try {
      try {
        const setting = await prisma.siteSetting.findUnique({
          where: { key },
        });
        return setting ? setting.value : DEFAULT_SETTINGS[key] || null;
      } catch (error) {
        // If there's an error (likely model doesn't exist), return the default value
        return DEFAULT_SETTINGS[key] || null;
      }
    } catch (error) {
      console.error(`Error getting setting by key ${key}:`, error);
      throw error;
    }
  },
  
  /**
   * Update a batch of settings
   */
  async updateBatch(settings: SiteSettings): Promise<SiteSettings> {
    try {
      const updatedSettings: SiteSettings = {};
      
      // Process settings sequentially without using transaction
      // This avoids potential transaction timeouts with many settings
      for (const [key, value] of Object.entries(settings)) {
        const setting = await prisma.siteSetting.upsert({
          where: { key },
          update: { value, updatedAt: new Date() },
          create: { key, value },
        });
        updatedSettings[key] = setting.value;
      }
      
      return updatedSettings;
    } catch (error) {
      console.error('Error updating batch settings:', error);
      throw error;
    }
  },
  
  /**
   * Update a single setting by key
   */
  async update(key: string, value: string): Promise<SiteSetting> {
    try {
      return await prisma.siteSetting.upsert({
        where: { key },
        update: { value, updatedAt: new Date() },
        create: { key, value },
      });
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  },
  
  /**
   * Reset settings to default values
   */
  async resetToDefaults(): Promise<SiteSettings> {
    try {
      // Delete all existing settings
      await prisma.siteSetting.deleteMany({});
      
      // Create default settings
      for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
        await prisma.siteSetting.create({
          data: {
            key,
            value,
          },
        });
      }
      
      return await this.getAll();
    } catch (error) {
      console.error('Error resetting settings to defaults:', error);
      throw error;
    }
  }
};