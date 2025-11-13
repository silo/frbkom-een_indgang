<template>
  <div class="application-page">
    <h1>{{ $t('form.createEvent') }}</h1>
    <MultiStepForm>
      <NuxtPage />
    </MultiStepForm>
  </div>
</template>

<script setup lang="ts">
// Event handlers are managed by MultiStepForm and store

definePageMeta({
  layout: 'default',
  name: 'Application',
  // middleware: 'auth', // Will implement in Phase 4
})
</script>

<style scoped>
.application-page {
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--color-text-primary);
}
</style>
