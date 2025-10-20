'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditAuthor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const authorId = params.id;
  
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`/api/authors/${authorId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load author');
        }
        
        const author = await response.json();
        if (author) {
          setFormData({
            name: author.name,
            avatar: author.avatar || '',
            bio: author.bio || '',
          });
        } else {
          setError('Author not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load author');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuthor();
  }, [authorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/authors/${authorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update author');
      }
      
      router.push('/admin/authors');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update author');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/authors/${authorId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete author');
      }
      
      router.push('/admin/authors');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete author');
      if (err.message?.includes('published posts')) {
        setError('Cannot delete this author because they have published posts. Remove or reassign their posts first.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation(false);
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Author</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium mb-1">
              Avatar URL
            </label>
            <input
              type="text"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL to the author's profile image (optional)
            </p>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Biography
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground mt-1">
              A short biography of the author (optional)
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-border text-foreground rounded-md hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      
      <div className="mt-12 pt-6 border-t border-border">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        
        {!deleteConfirmation ? (
          <button
            type="button"
            onClick={() => setDeleteConfirmation(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Author
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="mb-4 font-medium">Are you sure you want to delete this author? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
                  isDeleting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmation(false)}
                className="px-4 py-2 bg-white border border-border text-foreground rounded-md hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}