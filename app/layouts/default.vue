<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink
            to="/"
            class="text-2xl font-bold text-gray-900"
          >
            {{ appName }}
          </NuxtLink>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-gray-900"
            >
              {{ $t('nav.home') }}
            </NuxtLink>
            <NuxtLink
              v-if="loggedIn"
              to="/"
              class="text-gray-700 hover:text-gray-900"
            >
              {{ $t('nav.myEvents') }}
            </NuxtLink>
            <NuxtLink
              to="/application/contact-info"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {{ $t('nav.newEvent') }}
            </NuxtLink>
            
            <div v-if="loggedIn" class="flex items-center gap-4 ml-4 border-l pl-4">
              <span class="text-sm text-gray-600 hidden md:inline-block">{{ user?.name }}</span>
              <button 
                class="text-gray-700 hover:text-gray-900 text-sm font-medium"
                @click="handleLogout"
              >
                Log ud
              </button>
            </div>
            <div v-else class="ml-4 border-l pl-4">
              <NuxtLink 
                to="/api/auth/login" 
                external
                class="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                Log ind
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 py-8 flex-1">
      <slot />
    </main>

    <footer class="bg-white border-t">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        <p>&copy; {{ currentYear }} Frederiksberg Kommune</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { loggedIn, user, clear } = useUserSession()
const appName = config.public.appName
const currentYear = new Date().getFullYear()

const handleLogout = async () => {
  await clear()
  await navigateTo('/')
}
</script>
