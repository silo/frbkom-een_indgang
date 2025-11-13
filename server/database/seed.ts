import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { department, eventTypeTag, locationPreset } from './schema'

// Load environment variables from .env file
config()

// For seed script, read DATABASE_URL directly from environment
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set')
  process.exit(1)
}

// Create database connection for seeding
const client = postgres(databaseUrl)
const db = drizzle(client, { schema })

export async function seed() {
  console.log('Seeding database...')

  // Seed departments
  await db.insert(department).values([
    {
      name: 'Byliv og Drift',
      slug: 'byliv-drift',
      active: true,
    },
    {
      name: 'Klima og Miljø',
      slug: 'klima-miljo',
      active: true,
    },
    {
      name: 'Byggeri og Arkitektur',
      slug: 'byggeri-arkitektur',
      active: true,
    },
  ])

  console.log('✓ Departments seeded')

  // Seed event type tags
  await db.insert(eventTypeTag).values([
    {
      code: 'festival',
      nameDa: 'Festival',
      nameEn: 'Festival',
      active: true,
    },
    {
      code: 'market',
      nameDa: 'Marked',
      nameEn: 'Market',
      active: true,
    },
    {
      code: 'concert',
      nameDa: 'Koncert',
      nameEn: 'Concert',
      active: true,
    },
    {
      code: 'sports',
      nameDa: 'Sport',
      nameEn: 'Sports',
      active: true,
    },
    {
      code: 'cultural',
      nameDa: 'Kulturelt',
      nameEn: 'Cultural',
      active: true,
    },
    {
      code: 'demonstration',
      nameDa: 'Demonstration',
      nameEn: 'Demonstration',
      active: true,
    },
    {
      code: 'parade',
      nameDa: 'Parade',
      nameEn: 'Parade',
      active: true,
    },
    {
      code: 'other',
      nameDa: 'Andet',
      nameEn: 'Other',
      active: true,
    },
  ])

  console.log('✓ Event type tags seeded')

  // Seed location presets
  await db.insert(locationPreset).values([
    {
      name: 'Frederiksberg Have',
      slug: 'frederiksberg-have',
      imageUrl: '/images/locations/frederiksberg-have.jpg',
      address: 'Frederiksberg Runddel, 2000 Frederiksberg',
      active: true,
    },
    {
      name: 'Søndermarken',
      slug: 'soendermarken',
      imageUrl: '/images/locations/soendermarken.jpg',
      address: 'Søndermarken, 1900 Frederiksberg',
      active: true,
    },
    {
      name: 'Gl. Carlsberg Vej',
      slug: 'gl-carlsberg-vej',
      imageUrl: '/images/locations/gl-carlsberg-vej.jpg',
      address: 'Gl. Carlsberg Vej, 1799 København V',
      active: true,
    },
    {
      name: 'Falkoner Allé',
      slug: 'falkoner-alle',
      imageUrl: '/images/locations/falkoner-alle.jpg',
      address: 'Falkoner Allé, 2000 Frederiksberg',
      active: true,
    },
  ])

  console.log('✓ Location presets seeded')
  console.log('Database seeding completed successfully!')
  
  // Close database connection
  await client.end()
}

// Run seed if executed directly (ES module check)
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log('✅ Seed completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error)
      process.exit(1)
    })
}
