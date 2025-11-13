import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const databaseUrl = useRuntimeConfig().databaseUrl

if (!databaseUrl) {
  console.warn('⚠️  DATABASE_URL is not configured. Database operations will fail.')
  console.warn('   Please set DATABASE_URL in your .env file or set up PostgreSQL.')
  console.warn('   The app will start but database-dependent features won\'t work.')
}

// Create postgres connection (only if URL is provided)
let db: ReturnType<typeof drizzle>

if (databaseUrl) {
  try {
    const client = postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
    db = drizzle(client, { schema })
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }
} else {
  // Create a mock db that throws helpful errors
  db = new Proxy({} as any, {
    get() {
      throw new Error('Database is not configured. Please set DATABASE_URL environment variable.')
    },
  })
}

export { db }
export type Database = typeof db
