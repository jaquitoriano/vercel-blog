import Link from 'next/link';
import { categories } from '@/data/categories';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';

export const metadata = {
  title: 'Categories',
  description: 'Browse posts by category',
};

export default function CategoriesPage() {
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