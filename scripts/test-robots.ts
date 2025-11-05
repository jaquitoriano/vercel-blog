type MetadataInput = {
  title: string;
  description: string;
  image?: string;
  isAdminPage?: boolean;
  isPreview?: boolean;
  isDraft?: boolean;
  isError?: boolean;
};

function getRobotsMeta(options: {
  isAdminPage?: boolean;
  isPreview?: boolean;
  isDraft?: boolean;
  isError?: boolean;
}): {
  index: boolean;
  follow: boolean;
  reason: string;
} {
  const { isAdminPage, isPreview, isDraft, isError } = options;

  // Admin pages should never be indexed
  if (isAdminPage) {
    return { index: false, follow: false, reason: 'Admin pages are not indexed or followed' };
  }

  // Preview or draft content should not be indexed
  if (isPreview || isDraft) {
    return { index: false, follow: false, reason: 'Draft/preview content is not indexed or followed' };
  }

  // Error pages should not be indexed but can be followed
  if (isError) {
    return { index: false, follow: true, reason: 'Error pages are not indexed but can be followed' };
  }

  // Default to indexable and followable
  return { index: true, follow: true, reason: 'Published content is indexed and followed' };
}

function testMetadataGeneration() {
  console.log('🧪 Testing metadata generation...\n');

  // Basic Test Cases
  console.log('=== Basic Cases ===\n');
  const basicCases = [
    {
      name: 'Published Post',
      input: {
        title: 'Test Post',
        description: 'Test Description',
        image: '/test.jpg',
        isDraft: false
      }
    },
    {
      name: 'Draft Post',
      input: {
        title: 'Draft Post',
        description: 'Draft Description',
        isDraft: true
      }
    },
    {
      name: 'Preview Content',
      input: {
        title: 'Preview Post',
        description: 'Preview Description',
        isPreview: true
      }
    },
    {
      name: 'Admin Page',
      input: {
        title: 'Admin Page',
        description: 'Admin Description',
        isAdminPage: true
      }
    },
    {
      name: 'Error Page',
      input: {
        title: 'Error Page',
        description: 'Error Description',
        isError: true
      }
    }
  ];

  // Edge Cases
  console.log('=== Edge Cases ===\n');
  const edgeCases = [
    {
      name: 'Admin Draft Preview',
      input: {
        title: 'Admin Draft Preview',
        description: 'Admin Draft Preview Description',
        isAdminPage: true,
        isDraft: true,
        isPreview: true
      }
    },
    {
      name: 'Draft with Error',
      input: {
        title: 'Draft Error',
        description: 'Draft Error Description',
        isDraft: true,
        isError: true
      }
    },
    {
      name: 'All flags true',
      input: {
        title: 'All Flags',
        description: 'All Flags Description',
        isAdminPage: true,
        isPreview: true,
        isDraft: true,
        isError: true
      }
    }
  ];

  // Special Cases
  console.log('=== Special Cases ===\n');
  const specialCases = [
    {
      name: 'All flags false',
      input: {
        title: 'Published',
        description: 'Published Description',
        isAdminPage: false,
        isPreview: false,
        isDraft: false,
        isError: false
      }
    },
    {
      name: 'Undefined flags',
      input: {
        title: 'Undefined Flags',
        description: 'Undefined Flags Description'
      }
    }
  ];

  // Run all test cases
  [...basicCases, ...edgeCases, ...specialCases].forEach(testCase => {
    console.log(`Testing ${testCase.name}:`);
    const robotsMeta = getRobotsMeta(testCase.input);
    console.log('- Input:', JSON.stringify(testCase.input, null, 2));
    console.log('- Result:');
    console.log('  • Indexable:', robotsMeta.index ? '✅ Yes' : '❌ No');
    console.log('  • Followable:', robotsMeta.follow ? '✅ Yes' : '❌ No');
    console.log('  • Reason:', robotsMeta.reason);
    console.log('\n');
  });
}

// Run tests
testMetadataGeneration();
console.log('✅ Tests Completed');