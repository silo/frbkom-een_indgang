import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema',
  out: './server/database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.NUXT_DATABASE_URL || '',
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
})
