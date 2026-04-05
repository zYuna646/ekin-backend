import { PrismaClient } from '@prisma/client';

/**
 * Template seeder for reference
 *
 * To use this seeder:
 * 1. Uncomment the function implementation
 * 2. Add it to the seeders array in seeders/index.ts
 * 3. Run npm run prisma:seed
 */
export async function seedUnits(prisma: PrismaClient) {
  // Uncomment to enable
  /*
  console.log('🌱 Seeding Units...');

  try {
    // Clear existing units
    await prisma.unit.deleteMany({});
    console.log('  Cleared existing units');

    // Create units
    const units = [
      {
        id: 'UNIT_001',
        name: 'Unit 1',
        desc: 'First organizational unit',
      },
      {
        id: 'UNIT_002',
        name: 'Unit 2',
        desc: 'Second organizational unit',
      },
    ];

    for (const unit of units) {
      await prisma.unit.create({
        data: unit,
      });
      console.log(`  ✓ Created unit: ${unit.name}`);
    }

    console.log(`✅ Units seeded successfully (${units.length} records)\n`);
  } catch (error) {
    console.error('❌ Error seeding units:', error);
    throw error;
  }
  */
}
