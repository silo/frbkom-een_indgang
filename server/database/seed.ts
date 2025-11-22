import { Buffer } from 'node:buffer'
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
  eventDocument,
  eventSafetyInfo,
  eventSoundInfo,
  eventWasteInfo,
  eventFoodInfo,
  eventAccessInfo,
  eventArtifact,
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

const SAMPLE_PDF_CONTENT = Buffer.from(
  'Frederiksberg Kommune seed document placeholder PDF',
  'utf-8',
).toString('base64')

type DocumentKind =
  | 'attachment'
  | 'construction_certificate'
  | 'plan'
  | 'police_approval'
  | 'approval_document'
type ArtifactKind = 'stage' | 'booth' | 'facility' | 'other'
type AttendanceRange = '0_50' | '51_200' | '201_500' | '501_1000' | '1001_5000' | '5001_plus'

type DepartmentStatusSeed = {
  slug: string
  status: 'pending' | 'in_review' | 'approved'
  note?: string | null
}

type SampleDocument = {
  ref?: string
  kind: DocumentKind
  fileName: string
  mimeType?: string
  sizeBytes?: number
  content?: string
}

type SampleSafetyInfo = {
  simultaneousPersonsRange: AttendanceRange
  hasTemporaryConstructions: boolean
  constructionsDescription?: string | null
  constructionsCertificateDocumentRef?: string
  hasReadBR18Bilag11: boolean
  otherConsiderations?: string | null
}

type SampleSoundInfo = {
  hasSound: boolean
  description?: string | null
  responsibleName?: string | null
  responsiblePhone?: string | null
}

type SampleWasteInfo = {
  needsWasteHandling: boolean
  description?: string | null
}

type SampleFoodInfo = {
  hasFoodOrBeverage: boolean
  description?: string | null
}

type SampleAccessInfo = {
  needsBlockage: boolean
  blockageDescription?: string | null
  policePermissionApplied: boolean
  policeApprovalDocumentRef?: string
}

type SampleArtifact = {
  kind: ArtifactKind
  label: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

type SampleEventConfig = {
  data: typeof eventApplication.$inferInsert
  tags?: string[]
  departmentStatuses?: DepartmentStatusSeed[]
  documents?: SampleDocument[]
  safety?: SampleSafetyInfo
  sound?: SampleSoundInfo
  waste?: SampleWasteInfo
  food?: SampleFoodInfo
  access?: SampleAccessInfo
  artifacts?: SampleArtifact[]
}

const defined = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined

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

  const sampleEvents: SampleEventConfig[] = [
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
      documents: [
        {
          ref: 'food-festival-plan',
          kind: 'plan',
          fileName: 'street-food-site-plan.pdf',
          sizeBytes: 241_120,
        },
        {
          ref: 'food-festival-structures',
          kind: 'construction_certificate',
          fileName: 'temporary-stage-certificate.pdf',
          sizeBytes: 185_320,
        },
        {
          ref: 'food-festival-police',
          kind: 'police_approval',
          fileName: 'traffic-closure-approval.pdf',
          sizeBytes: 132_890,
        },
      ],
      safety: {
        simultaneousPersonsRange: '1001_5000',
        hasTemporaryConstructions: true,
        constructionsDescription: 'Sceneplatform og 20 mobile boder kræver sikring.',
        constructionsCertificateDocumentRef: 'food-festival-structures',
        hasReadBR18Bilag11: true,
        otherConsiderations: 'Evakueringsplan dækket af 6 vagter og onsite beredskab.',
      },
      sound: {
        hasSound: true,
        description: 'DJ- og koncertprogram med højttalere frem til 22:00.',
        responsibleName: 'Signe Møller',
        responsiblePhone: '+45 55 66 77 88',
      },
      waste: {
        needsWasteHandling: true,
        description: 'Containere fra CityWaste afhentes to gange dagligt.',
      },
      food: {
        hasFoodOrBeverage: true,
        description: '20 stadeholdere med varm mad, kolde drikke og ølzone.',
      },
      access: {
        needsBlockage: true,
        blockageDescription: 'Lukning af Frederiksberg Runddel kl. 09-23 under festivalen.',
        policePermissionApplied: true,
        policeApprovalDocumentRef: 'food-festival-police',
      },
      artifacts: [
        { kind: 'stage', label: 'Main Stage', x: 110, y: 45, width: 24, height: 12 },
        { kind: 'booth', label: 'Food Court A', x: 60, y: 80, width: 30, height: 20 },
        { kind: 'facility', label: 'First Aid', x: 150, y: 75, width: 10, height: 8 },
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
      documents: [
        {
          ref: 'sunrise-route',
          kind: 'plan',
          fileName: 'sunrise-run-route.pdf',
          sizeBytes: 98_200,
        },
        {
          ref: 'sunrise-permit',
          kind: 'approval_document',
          fileName: 'association-approval.pdf',
          sizeBytes: 76_540,
        },
      ],
      safety: {
        simultaneousPersonsRange: '201_500',
        hasTemporaryConstructions: false,
        hasReadBR18Bilag11: true,
        otherConsiderations: 'Frivillige vagter posteres for hver 300 meter.',
      },
      sound: {
        hasSound: false,
        description: 'Kun startpistol og håndholdt megafon til annonceringer.',
        responsibleName: 'Ida Madsen',
        responsiblePhone: '+45 22 33 44 55',
      },
      waste: {
        needsWasteHandling: true,
        description: 'Opsamling ved målstregen med 4 frivillige.',
      },
      food: {
        hasFoodOrBeverage: true,
        description: 'Kaffe, frugt og vand sponsoreret af lokale butikker.',
      },
      access: {
        needsBlockage: false,
        policePermissionApplied: false,
      },
      artifacts: [
        { kind: 'facility', label: 'Water Station', x: 85, y: 60, width: 10, height: 6 },
        { kind: 'other', label: 'Start Gate', x: 60, y: 30, width: 15, height: 4 },
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
      documents: [
        {
          ref: 'winter-plan',
          kind: 'plan',
          fileName: 'winter-market-site-plan.pdf',
          sizeBytes: 264_890,
        },
        {
          ref: 'winter-structures',
          kind: 'construction_certificate',
          fileName: 'cabin-structural-approval.pdf',
          sizeBytes: 202_330,
        },
        {
          ref: 'winter-police',
          kind: 'police_approval',
          fileName: 'city-hall-access-approval.pdf',
          sizeBytes: 148_220,
        },
        {
          kind: 'attachment',
          fileName: 'communications-plan.pdf',
          sizeBytes: 120_440,
        },
      ],
      safety: {
        simultaneousPersonsRange: '5001_plus',
        hasTemporaryConstructions: true,
        constructionsDescription: '30 salgsboder, lysportaler og ekstra scene.',
        constructionsCertificateDocumentRef: 'winter-structures',
        hasReadBR18Bilag11: true,
        otherConsiderations: 'Natlig vagt ordning og brandgang markeret.',
      },
      sound: {
        hasSound: true,
        description: 'Koroptrædener og baggrundsmusik frem til kl. 21.',
        responsibleName: 'Loke Holm',
        responsiblePhone: '+45 11 22 33 44',
      },
      waste: {
        needsWasteHandling: true,
        description: 'Tre komprimatorer plus hold til glas/pap genbrug.',
      },
      food: {
        hasFoodOrBeverage: true,
        description: 'Gløgg, varme retter og åbne grillzoner med godkendte leverandører.',
      },
      access: {
        needsBlockage: true,
        blockageDescription: 'Delvis lukning af Smørumvej og parkering omkring rådhuset.',
        policePermissionApplied: true,
        policeApprovalDocumentRef: 'winter-police',
      },
      artifacts: [
        { kind: 'stage', label: 'Choir Stage', x: 95, y: 35, width: 18, height: 10 },
        { kind: 'booth', label: 'Market Row A', x: 40, y: 85, width: 50, height: 12 },
        { kind: 'facility', label: 'Power Generator', x: 140, y: 68, width: 8, height: 8 },
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
          note: status.note ?? null,
          updatedAt: new Date(),
        }
      })
      .filter((value): value is NonNullable<typeof value> => Boolean(value))
  })

  if (statusRows.length) {
    await db.insert(departmentEventStatus).values(statusRows)
    console.log('✓ Department statuses seeded')
  }

  const documentRowsWithRefs = insertedEvents.flatMap((eventRow, index) => {
    const documents = sampleEvents[index]?.documents ?? []
    return documents.map((doc) => ({
      refKey: doc.ref ? `${eventRow.id}:${doc.ref}` : undefined,
      values: {
        eventId: eventRow.id,
        kind: doc.kind,
        fileName: doc.fileName,
        mimeType: doc.mimeType ?? 'application/pdf',
        sizeBytes: doc.sizeBytes ?? 120_000,
        content: doc.content ?? SAMPLE_PDF_CONTENT,
      },
    }))
  })

  const insertedDocuments = documentRowsWithRefs.length
    ? await db.insert(eventDocument).values(documentRowsWithRefs.map((entry) => entry.values)).returning()
    : []

  const documentIdByRefKey = new Map<string, string>()
  insertedDocuments.forEach((doc, index) => {
    const refKey = documentRowsWithRefs[index]?.refKey
    if (refKey) {
      documentIdByRefKey.set(refKey, doc.id)
    }
  })

  if (insertedDocuments.length) {
    console.log('✓ Event documents seeded')
  }

  const getDocumentIdForEvent = (eventId: string, ref?: string | null) => {
    if (!ref) return null
    return documentIdByRefKey.get(`${eventId}:${ref}`) ?? null
  }

  const safetyRows = insertedEvents
    .map((eventRow, index) => {
      const info = sampleEvents[index]?.safety
      if (!info) return null
      return {
        eventId: eventRow.id,
        simultaneousPersonsRange: info.simultaneousPersonsRange,
        hasTemporaryConstructions: info.hasTemporaryConstructions,
        constructionsDescription: info.constructionsDescription ?? null,
        constructionsCertificateDocumentId: getDocumentIdForEvent(
          eventRow.id,
          info.constructionsCertificateDocumentRef,
        ),
        hasReadBR18Bilag11: info.hasReadBR18Bilag11,
        otherConsiderations: info.otherConsiderations ?? null,
      }
    })
    .filter(defined)

  if (safetyRows.length) {
    await db.insert(eventSafetyInfo).values(safetyRows)
    console.log('✓ Event safety info seeded')
  }

  const soundRows = insertedEvents
    .map((eventRow, index) => {
      const info = sampleEvents[index]?.sound
      if (!info) return null
      return {
        eventId: eventRow.id,
        hasSound: info.hasSound,
        description: info.description ?? null,
        responsibleName: info.responsibleName ?? null,
        responsiblePhone: info.responsiblePhone ?? null,
      }
    })
    .filter(defined)

  if (soundRows.length) {
    await db.insert(eventSoundInfo).values(soundRows)
    console.log('✓ Event sound info seeded')
  }

  const wasteRows = insertedEvents
    .map((eventRow, index) => {
      const info = sampleEvents[index]?.waste
      if (!info) return null
      return {
        eventId: eventRow.id,
        needsWasteHandling: info.needsWasteHandling,
        description: info.description ?? null,
      }
    })
    .filter(defined)

  if (wasteRows.length) {
    await db.insert(eventWasteInfo).values(wasteRows)
    console.log('✓ Event waste info seeded')
  }

  const foodRows = insertedEvents
    .map((eventRow, index) => {
      const info = sampleEvents[index]?.food
      if (!info) return null
      return {
        eventId: eventRow.id,
        hasFoodOrBeverage: info.hasFoodOrBeverage,
        description: info.description ?? null,
      }
    })
    .filter(defined)

  if (foodRows.length) {
    await db.insert(eventFoodInfo).values(foodRows)
    console.log('✓ Event food info seeded')
  }

  const accessRows = insertedEvents
    .map((eventRow, index) => {
      const info = sampleEvents[index]?.access
      if (!info) return null
      return {
        eventId: eventRow.id,
        needsBlockage: info.needsBlockage,
        blockageDescription: info.blockageDescription ?? null,
        policePermissionApplied: info.policePermissionApplied,
        policeApprovalDocumentId: getDocumentIdForEvent(eventRow.id, info.policeApprovalDocumentRef),
      }
    })
    .filter(defined)

  if (accessRows.length) {
    await db.insert(eventAccessInfo).values(accessRows)
    console.log('✓ Event access info seeded')
  }

  const artifactRows = insertedEvents.flatMap((eventRow, index) => {
    const artifacts = sampleEvents[index]?.artifacts ?? []
    return artifacts.map((artifact) => ({
      eventId: eventRow.id,
      kind: artifact.kind,
      label: artifact.label,
      x: artifact.x,
      y: artifact.y,
      width: artifact.width,
      height: artifact.height,
      rotation: artifact.rotation ?? 0,
    }))
  })

  if (artifactRows.length) {
    await db.insert(eventArtifact).values(artifactRows)
    console.log('✓ Event artifacts seeded')
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
