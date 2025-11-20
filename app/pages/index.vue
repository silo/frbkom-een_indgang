<template>
  <div>
    <h1 class="text-4xl font-bold mb-6">
      {{ $t('events.title') }}
    </h1>

    <section class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        Velkommen til {{ appName }}
      </h2>
      <p class="text-gray-700 mb-6">
        Her kan du oprette og administrere dine arrangementsansøgninger.
      </p>

      <div class="flex gap-4">
        <NuxtLink
          to="/application/contact-info"
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ $t('events.createNew') }}
        </NuxtLink>
        
        <NuxtLink
          v-if="!loggedIn"
          to="/api/auth/login"
          external
          class="inline-block bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Log ind med MitID
        </NuxtLink>
      </div>
    </section>

    <section v-if="loggedIn" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ $t('events.myEvents') }}
      </h2>
      <p class="text-gray-500">
        Ingen arrangementer endnu.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { loggedIn } = useUserSession()
const appName = config.public.appName

definePageMeta({
  layout: 'default',
})
</script>
