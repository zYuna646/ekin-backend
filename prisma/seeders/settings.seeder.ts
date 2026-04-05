import { PrismaClient } from '@prisma/client';
import {
  SETTINGS_KEY,
  SETTINGS_KEY_DEFAULT_VALUE,
} from '../../src/common/const/settings.const';

export async function seedSettings(prisma: PrismaClient) {
  console.log('🌱 Seeding Settings...');

  try {
    // Clear existing settings
    await prisma.settings.deleteMany({});
    console.log('  Cleared existing settings');

    // Seed each setting
    const settingsToCreate = Object.values(SETTINGS_KEY).map((key) => ({
      key,
      value: JSON.stringify(SETTINGS_KEY_DEFAULT_VALUE[key]),
    }));

    for (const setting of settingsToCreate) {
      await prisma.settings.create({
        data: setting,
      });
      console.log(`  ✓ Created setting: ${setting.key}`);
    }

    console.log(`✅ Settings seeded successfully (${settingsToCreate.length} records)\n`);
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    throw error;
  }
}
