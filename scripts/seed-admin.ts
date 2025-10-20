import { createAdminUser } from '../src/lib/auth/user';

async function main() {
  console.log('Creating admin user...');
  await createAdminUser();
}

main()
  .then(() => console.log('Seeding completed!'))
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seed script finished');
    process.exit(0);
  });