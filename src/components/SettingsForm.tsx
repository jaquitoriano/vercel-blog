'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const settingsSchema = z.object({
  siteTitle: z.string().min(1, 'Site title is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  siteKeywords: z.string(),
  footerText: z.string(),
  twitterUrl: z.string().url().or(z.literal('')),
  facebookUrl: z.string().url().or(z.literal('')),
  linkedinUrl: z.string().url().or(z.literal('')),
  githubUrl: z.string().url().or(z.literal('')),
  contactEmail: z.string().email().or(z.literal('')),
  analyticsId: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData?: Record<string, string>;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const { toast } = useToast();

  const defaultValues: SettingsFormValues = {
    siteTitle: initialData?.siteTitle || '',
    siteDescription: initialData?.siteDescription || '',
    siteKeywords: initialData?.siteKeywords || '',
    footerText: initialData?.footerText || '',
    twitterUrl: initialData?.twitterUrl || '',
    facebookUrl: initialData?.facebookUrl || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    githubUrl: initialData?.githubUrl || '',
    contactEmail: initialData?.contactEmail || '',
    analyticsId: initialData?.analyticsId || '',
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      toast({
        title: 'Settings updated',
        description: 'Your site settings have been successfully updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update settings',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="siteTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Title</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Blog" {...field} />
              </FormControl>
              <FormDescription>
                The name of your site, displayed in the browser tab and header.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siteDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A blog about technology, programming, and more..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of your site used for SEO and social sharing.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siteKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input
                  placeholder="blog, technology, programming, web development"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Comma-separated keywords for SEO (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="footerText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Footer Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="© 2025 My Blog. All rights reserved."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Text displayed in the footer of your site.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://facebook.com/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Email address for contact forms and notifications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="analyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Analytics ID</FormLabel>
                  <FormControl>
                    <Input placeholder="G-XXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Google Analytics tracking ID (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  );
}