// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
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

    // Public keys (client + server)
    public: {
      netsClientId: '',
      netsEnvironment: 'preproduction',
      baseUrl: 'http://localhost:3000',
      appName: 'Én Indgang',
      maxFileSizeMb: 5,
    },
  },

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',

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
