<template>
  <div class="application-route">
    <div v-if="isBaseRoute" class="application-redirect">
      <Icon name="fa7-solid:spinner" class="spinner" />
      <p>{{ $t('common.loading') }}</p>
    </div>
    <NuxtPage v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const isBaseRoute = computed(() => route.path === '/application' || route.path === '/application/')

definePageMeta({
  layout: 'application',
  name: 'Application',
})

if (import.meta.server) {
  await navigateTo('/application/contact-info')
} else {
  const router = useRouter()
  onMounted(() => {
    router.replace('/application/contact-info')
  })
}
</script>

<style scoped>
.application-route {
  width: 100%;
}

.application-redirect {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 12px;
  color: #6a6a6a;
}

.spinner {
  font-size: 32px;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
