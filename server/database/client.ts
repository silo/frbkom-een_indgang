import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const resolveDatabaseUrl = () => {
  const envUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL
  if (envUrl) {
    return envUrl
  }

  console.warn('⚠️  DATABASE_URL is not configured. Database operations will fail.')
  console.warn('   Please set DATABASE_URL or NUXT_DATABASE_URL in your .env file.')
  console.warn('   The app will start but database-dependent features won\'t work.')
  return null
}

const databaseUrl = resolveDatabaseUrl()

const db: ReturnType<typeof drizzle> = (() => {
  if (!databaseUrl) {
    return new Proxy({} as ReturnType<typeof drizzle>, {
      get() {
        throw new Error('Database is not configured. Please set DATABASE_URL environment variable.')
      },
    })
  }

  try {
    const client = postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
    return drizzle(client, { schema })
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }
})()

export { db }
export type Database = typeof db
