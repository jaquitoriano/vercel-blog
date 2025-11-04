import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';
import { categoryRepository } from '@/lib/repositories/category.repository';

export const metadata = {
  title: 'Categories',
  description: 'Browse posts by category',
};

export default async function CategoriesPage() {
  const categories = await categoryRepository.findAll();
  
  return (
    <div className="content-standard">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-serif mb-4">Categories</h1>
        <p className="text-xl text-muted-foreground">
          Browse our content by category
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.slug}`}
            key={category.id}
            className="block"
          >
            <Card hover className="h-full transition-all duration-300">
              <CardHeader>
                <h2 className="text-xl font-bold">{category.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {category.description || `Browse posts in the ${category.name} category`}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                </p>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-primary">View posts →</div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}