'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditCategory({ params }: { params: { id: string } }) {
  const router = useRouter();
  const categoryId = params.id;
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load category');
        }
        
        const category = await response.json();
        if (category) {
          setFormData({
            name: category.name,
            slug: category.slug,
          });
        } else {
          setError('Category not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load category');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update category');
      }
      
      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }
      
      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
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
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 !important"
              required
              style={{backgroundColor: '#ffffff', color: '#333333'}}
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 !important"
              required
              style={{backgroundColor: '#ffffff', color: '#333333'}}
            />
            <p className="text-sm text-gray-500 mt-1">
              The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      
      <div className="mt-12 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        
        {!deleteConfirmation ? (
          <button
            type="button"
            onClick={() => setDeleteConfirmation(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Category
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="mb-4 font-medium text-red-800">Are you sure you want to delete this category? This action cannot be undone.</p>
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
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
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