import { createInnerMetadata } from '@/lib/utils/metadata';
import { expect, test, describe } from 'vitest';

describe('Metadata Generation Tests', () => {
  // Test published post
  test('Published post should be indexable', async () => {
    const metadata = await createInnerMetadata({
      title: 'Test Post',
      description: 'Test Description',
      image: '/test.jpg',
      isDraft: false
    });
    
    expect(metadata.robots?.index).toBe(true);
    expect(metadata.robots?.follow).toBe(true);
  });

  // Test draft post
  test('Draft post should not be indexable', async () => {
    const metadata = await createInnerMetadata({
      title: 'Draft Post',
      description: 'Draft Description',
      isDraft: true
    });
    
    expect(metadata.robots?.index).toBe(false);
    expect(metadata.robots?.follow).toBe(false);
  });

  // Test preview content
  test('Preview content should not be indexable', async () => {
    const metadata = await createInnerMetadata({
      title: 'Preview Post',
      description: 'Preview Description',
      isPreview: true
    });
    
    expect(metadata.robots?.index).toBe(false);
    expect(metadata.robots?.follow).toBe(false);
  });

  // Test admin page
  test('Admin page should not be indexable', async () => {
    const metadata = await createInnerMetadata({
      title: 'Admin Page',
      description: 'Admin Description',
      isAdminPage: true
    });
    
    expect(metadata.robots?.index).toBe(false);
    expect(metadata.robots?.follow).toBe(false);
  });

  // Test error page
  test('Error page should not be indexable but should be followable', async () => {
    const metadata = await createInnerMetadata({
      title: 'Error Page',
      description: 'Error Description',
      isError: true
    });
    
    expect(metadata.robots?.index).toBe(false);
    expect(metadata.robots?.follow).toBe(true);
  });

  // Test favicon inheritance
  test('Metadata should include favicon when available', async () => {
    const metadata = await createInnerMetadata({
      title: 'Test Page',
      description: 'Test Description'
    });
    
    expect(metadata.icons).toBeDefined();
  });

  // Test OpenGraph data
  test('OpenGraph data should be properly formatted', async () => {
    const metadata = await createInnerMetadata({
      title: 'Test Page',
      description: 'Test Description',
      image: '/test.jpg'
    });
    
    expect(metadata.openGraph?.title).toBe('Test Page');
    expect(metadata.openGraph?.description).toBe('Test Description');
    expect(metadata.openGraph?.images).toBeDefined();
  });
});