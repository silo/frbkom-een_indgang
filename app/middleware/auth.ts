export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const session = useUserSession()

  if (!session.loggedIn.value) {
    await session.fetch()
  }

  if (!session.loggedIn.value) {
    const returnTo = encodeURIComponent(to.fullPath)
    if (config.public.enableDevAuth) {
      return navigateTo(`/dev-login?returnTo=${returnTo}`, { replace: true })
    }

    const loginUrl = `/api/auth/login?returnTo=${returnTo}`
    return navigateTo(loginUrl, { external: true })
  }

  const authMeta = to.meta.auth as { roles?: Array<'admin' | 'user'> } | undefined
  const requiredRoles = authMeta?.roles

  if (requiredRoles?.length && !requiredRoles.includes(session.user.value?.role as 'admin' | 'user')) {
    if (import.meta.server) {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }

    return navigateTo('/', { replace: true })
  }
})
