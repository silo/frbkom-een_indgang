<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <NuxtLink to="/">
          <img src="/fk-logo.svg" alt="Frederiksberg Kommune" height="40" />
        </NuxtLink>
      </div>

      <div class="sidebar-intro">
        <h3 class="heading-m pb-24">{{ $t('form.createEvent') }}</h3>
        <p class="text-m text-muted">
          Giv os de praktiske detaljer, så vi kan sætte gang i dit arrangement!
        </p>
      </div>

      <div class="sidebar-steps">
        <VerticalStepper
          v-if="formStore.steps"
          v-model="selectedStepIndex"
          :items="stepperItems"
          :clickable="true"
        />
      </div>

      <nav class="sidebar-bottom">
        <a href="#" class="bottom-link">Regler og vilkår</a>
        <span class="bottom-sep" aria-hidden="true" />
        <a href="#" class="bottom-link">Datasikkerhed</a>
        <span class="bottom-sep" aria-hidden="true" />
        <a href="#" class="bottom-link">Kontakt</a>
      </nav>
    </aside>

    <!-- Content -->
    <section class="content">
      <!-- Top bar -->
      <div class="topbar">
        <Button variant="secondary" icon-name="fa7-solid:arrow-left" @click="handleBack">
          Tilbage
        </Button>
        <div class="topbar-right">
          <!-- User info will be added when auth is implemented -->
        </div>
      </div>

      <!-- Main content -->
      <div class="main">
        <div class="main-inner">
          <NuxtPage />
          
          <!-- Bottom CTA -->
          <div class="bottom-cta">
            <Button
              v-if="!formStore.isLastStep"
              variant="primary"
              :full-width="true"
              icon-name="fa7-solid:arrow-right"
              icon-position="right"
              @click="handleNext"
            >
              Gå videre
            </Button>
            <Button
              v-else
              variant="primary"
              :full-width="true"
              :disabled="!formStore.canSubmit"
              @click="handleSubmit"
            >
              Indsend ansøgning
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventFormStore } from '../stores/event-form'
import { Button, VerticalStepper } from 'fk-designsystem'
import type { VerticalStepperItem } from 'fk-designsystem/types/vertical-stepper'

const router = useRouter()
const formStore = useEventFormStore()

// Convert store steps to VerticalStepper format
const stepperItems = computed<VerticalStepperItem[]>(() => {
  if (!formStore.steps) return []
  
  return formStore.steps.map((step, index) => ({
    label: step.title,
    filled: step.completed ? 5 : (formStore.currentStep > index ? formStore.currentStep : 0),
    total: 5,
    disabled: false,
  }))
})

const selectedStepIndex = computed({
  get: () => formStore.currentStep - 1,
  set: (index: number) => {
    formStore.goToStep(index + 1)
    router.push(formStore.steps[index].path)
  },
})

const handleBack = () => {
  if (formStore.isFirstStep) {
    router.push('/')
  } else {
    formStore.previousStep()
  }
}

const handleNext = () => {
  formStore.nextStep()
}

const handleSubmit = async () => {
  const result = await formStore.submitEvent()
  if (result.success) {
    await router.push(`/confirmation/${result.eventId}`)
  }
}

definePageMeta({
  layout: false, // Using custom layout with sidebar
  name: 'Application',
  // middleware: 'auth', // Will implement in Phase 4
})
</script>

<style scoped lang="scss">
:global(body) {
  background: #f7f7f7;
}

.layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  background: white;
  border-right: 1px solid #EBEBEB; // $border-subtle / $color-grey-300
  display: flex;
  flex-direction: column;
  padding-bottom: 32px; // $spacing-2xl
}

.sidebar-top {
  display: flex;
  align-items: center;
  height: 72px; // $size-72
  padding: 0 24px; // $spacing-xl
  border-bottom: 1px solid #EBEBEB;
  
  img,
  svg {
    height: 40px; // $size-40
  }
}

.sidebar-intro {
  padding: 32px 24px 24px; // $spacing-2xl $spacing-xl $spacing-xl
  border-bottom: 1px solid #EBEBEB;
  margin-bottom: 24px; // $spacing-xl
}

.sidebar-steps {
  padding: 0 24px; // $spacing-xl

  // Hide numeric subtext to match design
  :deep(.fk-vertical-stepper-sub) {
    display: none;
  }
}

.sidebar-bottom {
  margin-top: auto;
  padding: 32px 24px 0; // $spacing-2xl $spacing-xl 0
  display: flex;
  align-items: center;
  gap: 16px; // $spacing-md
  flex-wrap: wrap;
}

.bottom-link {
  font-size: 14px; // $font-size-sm
  color: #6A6A6A; // $text-tertiary
  font-weight: 600; // $font-weight-semibold
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.bottom-sep {
  width: 6px; // $size-6
  height: 6px;
  border-radius: 9999px; // $border-radius-full
  background: #EBEBEB; // $color-grey-300
}

/* Content */
.content {
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px; // $spacing-xl $spacing-2xl
  border-bottom: 1px solid #EBEBEB; // $border-subtle
  background: white;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px; // $spacing-lg
}

.main {
  padding: 32px; // $spacing-2xl
  background: #f7f7f7;
  flex: 1;
}

.main-inner {
  max-width: 560px;
  margin: 0 auto;
}

.bottom-cta {
  margin-top: 32px; // $spacing-2xl
}

// Typography helpers
.heading-m {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

.text-m {
  font-size: 16px;
  line-height: 1.5;
}

.text-muted {
  color: #6A6A6A; // $text-tertiary
}

.pb-24 {
  padding-bottom: 24px;
}
</style>
