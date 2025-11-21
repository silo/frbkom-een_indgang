import type { inferRouterProxyClient } from '@trpc/client'
import type { AppRouter } from '~/server/trpc/routers'

declare module '#app' {
  interface NuxtApp {
    $trpc: inferRouterProxyClient<AppRouter>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $trpc: inferRouterProxyClient<AppRouter>
  }
}

export {}
