import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const databaseUrl = useRuntimeConfig().databaseUrl

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured')
}

// Create postgres connection
const client = postgres(databaseUrl)

// Create drizzle instance
export const db = drizzle(client, { schema })

export type Database = typeof db
