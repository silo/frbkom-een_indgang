<template>
  <div class="confirmation-page">
    <div class="confirmation-card">
      <div class="icon-wrapper">
        <Icon name="fa7-solid:check" size="32" />
      </div>

      <h1 class="heading-2xl mb-16">{{ $t('form.confirmation.title') }}</h1>
      <p class="text-m text-muted mb-32">{{ $t('form.confirmation.subtitle') }}</p>

      <div class="reference-box mb-32">
        <p class="text-s text-muted mb-4">{{ $t('form.confirmation.referenceNumber') }}</p>
        <p class="text-xl font-mono">{{ route.params.id }}</p>
      </div>

      <div class="next-steps mb-40">
        <h2 class="heading-m mb-16">{{ $t('form.confirmation.nextSteps') }}</h2>
        <ul class="steps-list">
          <li class="step-item">
            <span class="step-number">1</span>
            <p class="text-m">{{ $t('form.confirmation.step1') }}</p>
          </li>
          <li class="step-item">
            <span class="step-number">2</span>
            <p class="text-m">{{ $t('form.confirmation.step2') }}</p>
          </li>
          <li class="step-item">
            <span class="step-number">3</span>
            <p class="text-m">{{ $t('form.confirmation.step3') }}</p>
          </li>
        </ul>
      </div>

      <div class="actions">
        <NuxtLink to="/" class="btn btn-primary">
          {{ $t('form.confirmation.backToHome') }}
        </NuxtLink>
        <NuxtLink to="/application" class="btn btn-secondary">
          {{ $t('form.confirmation.viewApplication') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

definePageMeta({
  layout: 'default',
  name: 'ApplicationConfirmation',
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.confirmation-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: $spacing-24;
}

.confirmation-card {
  background: $color-white;
  border-radius: 16px;
  padding: $spacing-48;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: $color-green-100;
  color: $color-success;
  margin-bottom: $spacing-24;
}

.reference-box {
  background: $color-grey-100;
  padding: $spacing-16;
  border-radius: 8px;
  border: 1px solid $color-grey-300;
}

.font-mono {
  font-family: monospace;
  font-weight: 600;
  letter-spacing: 1px;
}

.next-steps {
  text-align: left;
  background: $color-brand-100;
  padding: $spacing-24;
  border-radius: 12px;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.step-item {
  display: flex;
  gap: $spacing-16;
  align-items: flex-start;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: $color-primary;
  color: $color-white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

.actions {
  display: flex;
  gap: $spacing-16;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-12 $spacing-24;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background: $color-primary;
  color: $color-white;

  &:hover {
    background: $color-primary-dark;
  }
}

.btn-secondary {
  background: $color-white;
  color: $color-text-primary;
  border: 1px solid $color-grey-300;

  &:hover {
    background: $color-grey-100;
  }
}

// Typography helpers
.heading-2xl {
  font-size: 32px;
  font-weight: 700;
  color: $color-text-primary;
}

.heading-m {
  font-size: 20px;
  font-weight: 600;
  color: $color-text-primary;
}

.text-xl {
  font-size: 24px;
  color: $color-text-primary;
}

.text-m {
  font-size: 16px;
  line-height: 1.5;
  color: $color-text-primary;
}

.text-s {
  font-size: 14px;
}

.text-muted {
  color: $color-text-muted;
}

.mb-4 {
  margin-bottom: $spacing-4;
}
.mb-16 {
  margin-bottom: $spacing-16;
}
.mb-24 {
  margin-bottom: $spacing-24;
}
.mb-32 {
  margin-bottom: $spacing-32;
}
.mb-40 {
  margin-bottom: $spacing-40;
}
</style>
