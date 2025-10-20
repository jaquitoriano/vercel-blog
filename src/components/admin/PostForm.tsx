'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Author = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

type PostStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'CORRECTED';

type PostFormProps = {
  post?: any;
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  action: 'create' | 'edit';
};

export default function PostForm({ post, authors, categories, tags, action }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize the form with post data if editing
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: post ? {
      ...post,
      tags: post.tags?.map((t: any) => t.id) || [],
      date: post.date ? new Date(post.date).toISOString().split('T')[0] : '',
      status: post.status || 'DRAFT',
    } : {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      authorId: '',
      categoryId: '',
      featured: false,
      status: 'DRAFT',
      date: new Date().toISOString().split('T')[0], // Set today as default
      tags: [],
    },
    mode: 'onBlur' // Validate on blur for better UX
  });
  
  // Watch the title field to auto-generate slug
  const title = watch('title');
  
  // Auto-generate slug from title when creating a new post
  useEffect(() => {
    if (action === 'create' && title && !post) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim(); // Trim extra whitespace
      
      setValue('slug', slug);
    }
  }, [title, action, setValue, post]);
  
  // Handle form submission
  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create a copy of the form data to process
      const data = { ...formData };
      
      // Format date properly
      if (data.date) {
        // Ensure date is in YYYY-MM-DD format
        const dateObj = new Date(data.date);
        if (!isNaN(dateObj.getTime())) {
          data.date = dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
      }
      
      // Ensure tags is an array of strings with no empty values
      data.tags = Array.isArray(data.tags) 
        ? data.tags.filter(Boolean).map(String) // Remove any empty values and ensure all are strings
        : data.tags 
          ? [String(data.tags)].filter(Boolean) 
          : [];
      
      // Trim text fields to remove unnecessary whitespace
      ['title', 'slug', 'excerpt', 'coverImage'].forEach(field => {
        if (data[field]) {
          data[field] = data[field].trim();
        }
      });
      
      // Ensure slug is lowercase with no spaces
      if (data.slug) {
        data.slug = data.slug.toLowerCase().trim();
      }
      
      const endpoint = action === 'create' 
        ? '/api/admin/posts'
        : `/api/admin/posts/${post.id}`;
        
      const method = action === 'create' ? 'POST' : 'PUT';
      
      console.log('Submitting form data:', data);
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Something went wrong');
      }
      
      console.log('Post created/updated successfully:', responseData);
      
      // Redirect to the post list
      router.push('/admin/posts');
      router.refresh();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-medium">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
              Title
            </label>
            <input
              id="title"
              {...register('title', { 
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters'
                }
              })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Post Title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message?.toString()}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">
              Slug
            </label>
            <input
              id="slug"
              {...register('slug', { 
                required: 'Slug is required',
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message: 'Slug must contain only lowercase letters, numbers, and hyphens'
                }
              })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="my-post-title"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message?.toString()}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              URL-friendly version of the title (e.g., my-blog-post)
            </p>
          </div>
          
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              {...register('excerpt', { 
                required: 'Excerpt is required',
                maxLength: {
                  value: 300,
                  message: 'Excerpt cannot exceed 300 characters'
                }
              })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Brief summary of your post"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt.message?.toString()}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>Short summary shown in post listings</span>
              <span>{watch('excerpt')?.length || 0}/300</span>
            </p>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
              Content (Markdown)
            </label>
            <textarea
              id="content"
              rows={12}
              {...register('content', { required: 'Content is required' })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground font-mono"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message?.toString()}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-foreground mb-1">
              Cover Image
            </label>
            <div className="space-y-3">
              <input
                id="coverImage"
                {...register('coverImage')}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder="Enter image URL or select from media"
              />
              
              {watch('coverImage') && (
                <div className="relative aspect-video w-full border border-border rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={watch('coverImage')}
                    alt="Cover image preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    import('../admin/media/ImageSelector').then(({ default: ImageSelector }) => {
                      // Create a modal root
                      const modalRoot = document.createElement('div');
                      modalRoot.id = 'image-selector-modal';
                      document.body.appendChild(modalRoot);
                      
                      // Render the ImageSelector component
                      const { createRoot } = require('react-dom/client');
                      const root = createRoot(modalRoot);
                      
                      root.render(
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            <div className="flex justify-between items-center border-b border-border p-4">
                              <h2 className="text-lg font-medium">Select Cover Image</h2>
                              <button
                                onClick={() => {
                                  root.unmount();
                                  document.body.removeChild(modalRoot);
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}>
                              <ImageSelector
                                currentImageUrl={watch('coverImage') || ''}
                                onImageSelect={(url) => {
                                  setValue('coverImage', url);
                                  root.unmount();
                                  document.body.removeChild(modalRoot);
                                }}
                                aspectRatio="wide"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    });
                  }}
                  className="px-3 py-1.5 border border-border rounded-md text-sm bg-background hover:bg-background-soft transition-colors"
                >
                  Select from Media
                </button>
                
                <button
                  type="button"
                  onClick={() => setValue('coverImage', '')}
                  className="px-3 py-1.5 border border-red-200 text-red-500 rounded-md text-sm hover:bg-red-50 transition-colors"
                  disabled={!watch('coverImage')}
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Featured image for this post (recommended size: 1200x630)
            </p>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-foreground mb-1">
              Publication Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date', { required: 'Publication date is required' })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message?.toString()}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="authorId" className="block text-sm font-medium text-foreground mb-1">
              Author
            </label>
            <select
              id="authorId"
              {...register('authorId', { required: 'Author is required' })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="">Select an author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
            {errors.authorId && (
              <p className="mt-1 text-sm text-red-600">{errors.authorId.message?.toString()}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-1">
              Category
            </label>
            <select
              id="categoryId"
              {...register('categoryId', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message?.toString()}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tags
            </label>
            <div className="border border-border rounded-md p-3 bg-background h-48 overflow-y-auto">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No tags available</p>
              ) : (
                tags.map((tag) => (
                  <div key={tag.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      value={tag.id}
                      {...register('tags')}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`tag-${tag.id}`} className="text-sm text-foreground cursor-pointer">
                      {tag.name}
                    </label>
                  </div>
                ))
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Select one or more tags for your post
            </p>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              id="featured"
              type="checkbox"
              {...register('featured')}
              className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-foreground">
              Featured post
            </label>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <select
              id="status"
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="UNPUBLISHED">Unpublished</option>
              <option value="CORRECTED">Corrected</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message?.toString()}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Set the publication status of this post
            </p>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting
                ? action === 'create' ? 'Creating Post...' : 'Updating Post...'
                : action === 'create' ? 'Create Post' : 'Update Post'
              }
            </button>
            {action === 'create' ? (
              <p className="mt-2 text-xs text-center text-gray-500">
                Your post will be created and you will be redirected to the posts list
              </p>
            ) : (
              <p className="mt-2 text-xs text-center text-gray-500">
                Your changes will be saved and you will be redirected to the posts list
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}