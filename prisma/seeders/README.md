# Database Seeders

This directory contains all database seeders for seeding initial data into the database.

## Structure

- `seed.ts` - Main entry point that orchestrates all seeders
- `seeders/` - Directory containing individual seeder files
  - `index.ts` - Exports all seeders and orchestration logic
  - `settings.seeder.ts` - Seeds default application settings

## Available Seeders

### Settings Seeder (`settings.seeder.ts`)
Populates the `Settings` table with default application configuration:
- `ADMIN_ID` - Administrator user ID from environment variable
- `DEFAULT_DAY_TIME_START` - Default work day start time (08:00)
- `DEFAULT_DAY_TIME_END` - Default work day end time (17:00)
- `DEFAULT_WORK_DAY_AVAIBLE` - Available work days (all days)
- `DEFAULT_BREAK_TIME_START` - Default break start (12:00)
- `DEFAULT_BREAK_TIME_END` - Default break end (13:00)
- `DEFAULT_TOTAL_MINUTE_WORK` - Total work minutes per day (480)

**Configuration**: Reads from `src/common/const/settings.const.ts` and environment variables

## Running Seeders

### Development
```bash
npm run prisma:seed
```

### Production
```bash
npm run prisma:seed:prod
```

### With Prisma CLI
```bash
# Using Prisma CLI directly
npx prisma db seed

# Or via npm
npm run prisma:seed
```

## Adding New Seeders

1. Create a new seeder file in `seeders/` directory:
```typescript
// seeders/my-feature.seeder.ts
import { PrismaClient } from '@prisma/client';

export async function seedMyFeature(prisma: PrismaClient) {
  console.log('🌱 Seeding MyFeature...');

  try {
    // Your seeding logic here

    console.log('✅ MyFeature seeded successfully\n');
  } catch (error) {
    console.error('❌ Error seeding MyFeature:', error);
    throw error;
  }
}
```

2. Register the seeder in `seeders/index.ts`:
```typescript
import { seedMyFeature } from './my-feature.seeder';

export const seeders = [
  {
    name: 'Settings',
    run: seedSettings,
  },
  {
    name: 'MyFeature',
    run: seedMyFeature,
  },
  // ... more seeders
];
```

## Console Output

Seeders use emoji-prefixed logging for better visibility:
- 🌱 - Starting a seeder
- ✓ - Individual record created
- ✅ - Seeder completed successfully
- ❌ - Error occurred
- 🌾 - Seeding started
- 🎉 - All seeders completed

## Notes

- Settings seeder clears existing settings before reseeding
- Each seeder is independent and can be run in any order
- Seeders use error handling to prevent partial execution
- All seeders are wrapped in try-catch with descriptive error messages
