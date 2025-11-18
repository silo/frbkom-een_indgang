declare module '#auth-utils/server' {
  export * from 'nuxt-auth-utils/dist/runtime/server/utils/session'
}

declare global {
  const useUserSession: typeof import('nuxt-auth-utils/dist/runtime/app/composables/session').useUserSession
}

export {}
