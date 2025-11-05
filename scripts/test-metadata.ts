import { createInnerMetadata } from '@/lib/utils/metadata';

async function testMetadata() {
  console.log('Testing metadata generation...\n');

  // Test published post
  const publishedMetadata = await createInnerMetadata({
    title: 'Test Post',
    description: 'Test Description',
    image: '/test.jpg',
    isDraft: false
  });
  
  console.log('Published Post Metadata:');
  console.log('- Title:', publishedMetadata.title);
  console.log('- Robots:', publishedMetadata.robots);
  console.log('- OpenGraph:', publishedMetadata.openGraph);
  console.log('\n');

  // Test draft post
  const draftMetadata = await createInnerMetadata({
    title: 'Draft Post',
    description: 'Draft Description',
    isDraft: true
  });
  
  console.log('Draft Post Metadata:');
  console.log('- Title:', draftMetadata.title);
  console.log('- Robots:', draftMetadata.robots);
  console.log('- OpenGraph:', draftMetadata.openGraph);
  console.log('\n');

  // Test preview content
  const previewMetadata = await createInnerMetadata({
    title: 'Preview Post',
    description: 'Preview Description',
    isPreview: true
  });
  
  console.log('Preview Post Metadata:');
  console.log('- Title:', previewMetadata.title);
  console.log('- Robots:', previewMetadata.robots);
  console.log('- OpenGraph:', previewMetadata.openGraph);
  console.log('\n');

  // Test admin page
  const adminMetadata = await createInnerMetadata({
    title: 'Admin Page',
    description: 'Admin Description',
    isAdminPage: true
  });
  
  console.log('Admin Page Metadata:');
  console.log('- Title:', adminMetadata.title);
  console.log('- Robots:', adminMetadata.robots);
  console.log('- OpenGraph:', adminMetadata.openGraph);
  console.log('\n');

  // Test error page
  const errorMetadata = await createInnerMetadata({
    title: 'Error Page',
    description: 'Error Description',
    isError: true
  });
  
  console.log('Error Page Metadata:');
  console.log('- Title:', errorMetadata.title);
  console.log('- Robots:', errorMetadata.robots);
  console.log('- OpenGraph:', errorMetadata.openGraph);
}

testMetadata().catch(console.error);