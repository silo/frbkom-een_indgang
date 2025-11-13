<template>
  <div class="summary-step">
    <header class="header mb-24">
      <h1 class="heading-2xl title">
        <span class="title-icon" aria-hidden="true">
          <Icon name="fa7-solid:check-circle" size="18" />
        </span>
        {{ $t('form.step5.title') }}
      </h1>
    </header>

    <div class="form-section">
      <div class="form-group mb-24">
        <h2 class="heading-m mb-16">{{ $t('form.step5.title') }}</h2>
        <p class="text-body text-muted mb-24">Review your application before submitting</p>
        <p class="text-body">Coming soon: Complete summary of all entered information</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useEventFormStore } from '../../stores/event-form'

const formStore = useEventFormStore()

onMounted(() => {
  formStore.goToStep(5)
})

definePageMeta({
  layout: 'default',
  name: 'ApplicationSummary',
})
</script>

<style scoped lang="scss">
.summary-step {
  // Typography classes are global from design system
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  color: #0057B8;
}

.form-section {
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.mb-16 {
  margin-bottom: 16px;
}

.mb-24 {
  margin-bottom: 24px;
}
</style>
