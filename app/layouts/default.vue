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
              to="/events"
              class="text-gray-700 hover:text-gray-900"
            >
              {{ $t('nav.myEvents') }}
            </NuxtLink>
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
const appName = config.public.appName
const currentYear = new Date().getFullYear()
</script>
