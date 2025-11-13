<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">
      {{ $t('admin.dashboard') }}
    </h1>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ $t('admin.allEvents') }}
      </h2>
      <p class="text-gray-500">
        Administratoroverblik kommer snart...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>
