export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const session = useUserSession()
  const authMeta = to.meta.auth as { roles?: Array<'admin' | 'user'> } | undefined
  const requiredRoles = authMeta?.roles
  const requiresAdminLogin = requiredRoles?.includes('admin') && !requiredRoles.includes('user')

  if (!session.loggedIn.value) {
    await session.fetch()
  }

  if (!session.loggedIn.value) {
    const returnTo = encodeURIComponent(to.fullPath)
    if (config.public.enableDevAuth) {
      return navigateTo(`/dev-login?returnTo=${returnTo}`, { replace: true })
    }

    const loginBase = requiresAdminLogin ? '/api/admin-auth/login' : '/api/auth/login'
    const loginUrl = `${loginBase}?returnTo=${returnTo}`
    return navigateTo(loginUrl, { external: true })
  }

  if (requiredRoles?.length && !requiredRoles.includes(session.user.value?.role as 'admin' | 'user')) {
    if (import.meta.server) {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }

    return navigateTo('/', { replace: true })
  }
})
