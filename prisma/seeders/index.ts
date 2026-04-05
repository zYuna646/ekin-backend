import { PrismaClient } from '@prisma/client';
import { seedSettings } from './settings.seeder';

export const seeders = [
  {
    name: 'Settings',
    run: seedSettings,
  },
  // Add more seeders here as needed
  // {
  //   name: 'Users',
  //   run: seedUsers,
  // },
];

export async function runAllSeeders(prisma: PrismaClient) {
  console.log('\n🌾 Starting database seeding...\n');

  for (const seeder of seeders) {
    try {
      await seeder.run(prisma);
    } catch (error) {
      console.error(`\n❌ Seeder "${seeder.name}" failed:`, error);
      process.exit(1);
    }
  }

  console.log('🎉 Database seeding completed successfully!\n');
}
