import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import {
  department,
  eventTypeTag,
  locationPreset,
  user,
  eventApplication,
  eventTypeTagLink,
  departmentEventStatus,
} from './schema'

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

  await clearExistingData()

  const departments = await db
    .insert(department)
    .values([
      { name: 'Byliv og Drift', slug: 'byliv-drift', active: true },
      { name: 'Klima og Miljø', slug: 'klima-miljo', active: true },
      { name: 'Byggeri og Arkitektur', slug: 'byggeri-arkitektur', active: true },
    ])
    .returning()
  console.log('✓ Departments seeded')

  const tags = await db
    .insert(eventTypeTag)
    .values([
      { code: 'festival', nameDa: 'Festival', nameEn: 'Festival', active: true },
      { code: 'market', nameDa: 'Marked', nameEn: 'Market', active: true },
      { code: 'concert', nameDa: 'Koncert', nameEn: 'Concert', active: true },
      { code: 'sports', nameDa: 'Sport', nameEn: 'Sports', active: true },
      { code: 'cultural', nameDa: 'Kulturelt', nameEn: 'Cultural', active: true },
      { code: 'demonstration', nameDa: 'Demonstration', nameEn: 'Demonstration', active: true },
      { code: 'parade', nameDa: 'Parade', nameEn: 'Parade', active: true },
      { code: 'other', nameDa: 'Andet', nameEn: 'Other', active: true },
    ])
    .returning()
  console.log('✓ Event type tags seeded')

  const locations = await db
    .insert(locationPreset)
    .values([
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
    .returning()
  console.log('✓ Location presets seeded')

  const citizens = await db
    .insert(user)
    .values([
      {
        identityType: 'professional',
        cpr: '1234567890',
        mitidUuid: 'seed-mitid-alfred',
        name: 'Alfred Larsen',
        email: 'alfred@example.com',
        phone: '+45 44 55 66 77',
        role: 'user',
        companyCvr: '12345678',
        lastIdp: 'mitid',
      },
      {
        identityType: 'private',
        cpr: '0987654321',
        mitidUuid: 'seed-mitid-ida',
        name: 'Ida Madsen',
        email: 'ida@example.com',
        phone: '+45 22 33 44 55',
        role: 'user',
        lastIdp: 'mitid',
      },
      {
        identityType: 'professional',
        cpr: '1122334455',
        mitidUuid: 'seed-mitid-loke',
        name: 'Loke Holm',
        email: 'loke@example.com',
        phone: '+45 11 22 33 44',
        role: 'user',
        companyCvr: '87654321',
        lastIdp: 'mitid',
      },
    ])
    .returning()
  console.log('✓ Users seeded')

  const locationBySlug = new Map(locations.map((entry) => [entry.slug, entry]))
  const tagByCode = new Map(tags.map((entry) => [entry.code, entry]))
  const departmentBySlug = new Map(departments.map((entry) => [entry.slug, entry]))

  const sampleEvents = [
    {
      data: {
        ownerUserId: citizens[0].id,
        title: 'Frederiksberg Street Food Festival',
        purpose: 'Fejrer lokale food trucks og kultur over en weekend.',
        expectedAttendanceRange: '1001_5000',
        commercial: true,
        contactPersonName: 'Alfred Larsen',
        contactPersonPhone: '+45 44 55 66 77',
        recurring: false,
        startAt: new Date('2025-06-14T10:00:00+02:00'),
        endAt: new Date('2025-06-15T22:00:00+02:00'),
        setupStartAt: new Date('2025-06-13T08:00:00+02:00'),
        setupEndAt: new Date('2025-06-13T20:00:00+02:00'),
        locationType: 'predefined',
        locationPresetId: locationBySlug.get('frederiksberg-have')?.id ?? null,
        status: 'submitted',
        reviewStatus: 'in_review',
        summaryCompletionPct: 92,
      },
      tags: ['festival', 'cultural'],
      departmentStatuses: [
        { slug: 'byliv-drift', status: 'in_review', note: 'Afventer støjplan.' },
        { slug: 'klima-miljo', status: 'pending', note: null },
      ],
    },
    {
      data: {
        ownerUserId: citizens[1].id,
        title: 'Søndermarken Sunrise Run',
        purpose: 'Velgørenhedsløb ved solopgang for lokale foreninger.',
        expectedAttendanceRange: '201_500',
        commercial: false,
        contactPersonName: 'Ida Madsen',
        contactPersonPhone: '+45 22 33 44 55',
        recurring: true,
        recurringInterval: 'weekly',
        startAt: new Date('2025-04-20T06:00:00+02:00'),
        endAt: new Date('2025-04-20T10:30:00+02:00'),
        setupStartAt: new Date('2025-04-19T18:00:00+02:00'),
        setupEndAt: new Date('2025-04-19T20:00:00+02:00'),
        locationType: 'predefined',
        locationPresetId: locationBySlug.get('soendermarken')?.id ?? null,
        status: 'submitted',
        reviewStatus: 'approved',
        summaryCompletionPct: 100,
      },
      tags: ['sports'],
      departmentStatuses: [
        { slug: 'byliv-drift', status: 'approved', note: 'Rute godkendt.' },
        { slug: 'klima-miljo', status: 'approved', note: 'Miljøvurdering godkendt.' },
      ],
    },
    {
      data: {
        ownerUserId: citizens[2].id,
        title: 'City Hall Winter Market',
        purpose: 'Markedsplads foran rådhuset med boder og kulturindslag.',
        expectedAttendanceRange: '5001_plus',
        commercial: true,
        contactPersonName: 'Loke Holm',
        contactPersonPhone: '+45 11 22 33 44',
        recurring: false,
        startAt: new Date('2025-12-05T12:00:00+01:00'),
        endAt: new Date('2025-12-10T20:00:00+01:00'),
        setupStartAt: new Date('2025-12-02T09:00:00+01:00'),
        setupEndAt: new Date('2025-12-04T20:00:00+01:00'),
        locationType: 'custom',
        locationAddress: 'Smørumvej 2, 2000 Frederiksberg',
        status: 'submitted',
        reviewStatus: 'unprocessed',
        summaryCompletionPct: 78,
      },
      tags: ['market', 'other'],
      departmentStatuses: [
        { slug: 'byliv-drift', status: 'pending', note: null },
        { slug: 'byggeri-arkitektur', status: 'pending', note: null },
      ],
    },
  ]

  const insertedEvents = await db
    .insert(eventApplication)
    .values(sampleEvents.map((entry) => entry.data))
    .returning()
  console.log('✓ Event applications seeded')

  const tagLinks = insertedEvents.flatMap((eventRow, index) => {
    const tagCodes = sampleEvents[index]?.tags ?? []
    return tagCodes
      .map((code) => tagByCode.get(code)?.id)
      .filter((tagId): tagId is string => Boolean(tagId))
      .map((tagId) => ({ eventId: eventRow.id, tagId }))
  })

  if (tagLinks.length) {
    await db.insert(eventTypeTagLink).values(tagLinks)
    console.log('✓ Event tag links seeded')
  }

  const statusRows = insertedEvents.flatMap((eventRow, index) => {
    const statuses = sampleEvents[index]?.departmentStatuses ?? []
    return statuses
      .map((status) => {
        const departmentId = departmentBySlug.get(status.slug)?.id
        if (!departmentId) return null
        return {
          eventId: eventRow.id,
          departmentId,
          status: status.status,
          note: status.note ?? undefined,
          updatedAt: new Date(),
        }
      })
      .filter((value): value is NonNullable<typeof value> => Boolean(value))
  })

  if (statusRows.length) {
    await db.insert(departmentEventStatus).values(statusRows)
    console.log('✓ Department statuses seeded')
  }

  console.log('Database seeding completed successfully!')

  await client.end()
}

async function clearExistingData() {
  console.log('Clearing existing data...')
  await db.delete(schema.eventAuditLog)
  await db.delete(schema.departmentEventStatus)
  await db.delete(schema.eventStatusHistory)
  await db.delete(schema.eventArtifact)
  await db.delete(schema.eventDocument)
  await db.delete(schema.eventSoundInfo)
  await db.delete(schema.eventWasteInfo)
  await db.delete(schema.eventFoodInfo)
  await db.delete(schema.eventSafetyInfo)
  await db.delete(schema.eventAccessInfo)
  await db.delete(schema.eventTypeTagLink)
  await db.delete(schema.eventApplication)
  await db.delete(schema.user)
  await db.delete(schema.eventTypeTag)
  await db.delete(schema.locationPreset)
  await db.delete(schema.department)
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
