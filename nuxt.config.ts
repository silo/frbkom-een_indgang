import { fileURLToPath } from 'node:url'

const authServerUtilsPath = fileURLToPath(
  new URL('./node_modules/nuxt-auth-utils/dist/runtime/server/utils/session.js', import.meta.url)
)

const netsEnvironment = process.env.NUXT_PUBLIC_NETS_ENVIRONMENT ?? 'preproduction'
const netsIssuer =
  process.env.NUXT_PUBLIC_NETS_ISSUER ??
  (netsEnvironment === 'production'
    ? 'https://netseidbroker.dk/op'
    : 'https://pp.netseidbroker.dk/op')
const baseUrl = process.env.NUXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
const enableDevAuth = process.env.ENABLE_DEV_AUTH === 'true'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    // Ensure Nitro resolves server session helpers to the actual runtime file
    '#auth-utils/server': authServerUtilsPath,
  },

  modules: [
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],

  devtools: { enabled: true },

  // Runtime Configuration
  runtimeConfig: {
    // Private keys (server-only) - values loaded from env automatically
    databaseUrl: '',
    netsClientSecret: '',
    sessionPassword: '',
    adminAdIssuer: '',
    adminAdClientId: '',
    adminAdClientSecret: '',
    sendgridApiKey: '',
    sendgridFromEmail: '',
    sendgridFromName: '',
    sendgridTemplateSubmissionConfirmed: '',
    sendgridTemplateApproved: '',
    sendgridTemplateRejected: '',
    departmentEmailBylivDrift: '',
    departmentEmailKlimaMiljo: '',
    departmentEmailByggeriArkitektur: '',

    // Public keys (client + server)
    public: {
      netsClientId: '',
      netsEnvironment,
      netsIssuer,
      baseUrl,
      enableDevAuth,
      appName: 'Én Indgang',
      maxFileSizeMb: 5,
    },
  },

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',

  // @ts-expect-error Added by nuxt-auth-utils module
  auth: {
    sessionConfig: {
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
    },
  },

  // CSS
  css: ['fk-designsystem/style.css', '~/assets/scss/main.scss'],

  // TypeScript Configuration
  typescript: {
    strict: true,
    typeCheck: false, // Disable type checking during dev for now
  },

  // i18n Configuration
  i18n: {
    defaultLocale: 'da-DK',
    langDir: 'locales',
    locales: [
      {
        code: 'da-DK',
        file: 'da-DK.json',
        name: 'Dansk',
      },
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    restructureDir: false,
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
})
