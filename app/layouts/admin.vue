<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <header class="bg-blue-900 text-white shadow-lg">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink
            to="/admin"
            class="text-2xl font-bold hover:text-blue-200"
          >
            {{ $t('admin.dashboard') }}
          </NuxtLink>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/admin"
              class="text-white hover:text-blue-200"
            >
              {{ $t('admin.allEvents') }}
            </NuxtLink>
            <button
              class="text-white hover:text-blue-200"
              @click="handleLogout"
            >
              {{ $t('nav.logout') }}
            </button>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 py-8 flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const handleLogout = () => {
  navigateTo('/api/admin-auth/logout', { external: true })
}
</script>
