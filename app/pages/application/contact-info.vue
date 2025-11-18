<template>
  <div class="contact-info-step">
    <header class="header mb-24">
      <h1 class="heading-2xl title">
        <span class="title-icon" aria-hidden="true">
          <Icon name="fa7-solid:phone" size="18" />
        </span>
        {{ $t('form.step1.title') }}
      </h1>
    </header>

    <p class="text-m text-muted mb-24">
      {{ $t('form.step1.subtitle') }}
    </p>

    <h4 class="heading-m mb-24">{{ $t('form.step1.generalInfo') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div class="form-row two-cols gap-24">
        <Input
          id="contact-cvr-cpr"
          v-model="contactInfo.cvrCpr"
          :label="$t('form.step1.cvrCpr')"
          :error="errors.cvrCpr"
          required
        />
        <Input
          id="contact-full-name"
          v-model="contactInfo.fullName"
          :label="$t('form.step1.fullName')"
          :error="errors.fullName"
          required
        />
      </div>
      <div class="form-row">
        <Input
          id="contact-phone"
          v-model="contactInfo.phone"
          :label="$t('form.step1.phone')"
          type="tel"
          :error="errors.phone"
          required
        />
      </div>
      <div class="form-row">
        <Input
          id="contact-email"
          v-model="contactInfo.email"
          :label="$t('form.step1.email')"
          type="email"
          :error="errors.email"
          required
        />
      </div>
      <div class="form-row gap-12">
        <h5 class="heading-s">{{ $t('form.step1.isCommercial') }}</h5>
        <RadioGroup
          id="contact-is-commercial"
          name="contact-is-commercial"
          v-model="contactInfo.isCommercial"
          :options="commercialOptions"
          orientation="vertical"
        />
      </div>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <div class="section-header mb-24">
      <h4 class="heading-m">{{ $t('form.step1.contactPerson') }}</h4>
      <Tooltip id="contact-person-help" text="Kontaktpersonen er den primære person, vi vil kontakte vedrørende arrangementet" placement="top">
        <Icon
          name="fa7-solid:circle-question"
          size="18"
          style="color: #6a6a6a"
        />
      </Tooltip>
    </div>

    <div class="form-grid gap-24 mb-40">
      <div class="form-row two-cols gap-24">
        <Input
          id="contact-person-name"
          v-model="contactInfo.contactPerson.fullName"
          :label="$t('form.step1.contactPersonName')"
          :error="errors.contactPersonName"
          required
        />
        <Input
          id="contact-person-phone"
          v-model="contactInfo.contactPerson.phone"
          :label="$t('form.step1.contactPersonPhone')"
          type="tel"
          :error="errors.contactPersonPhone"
          required
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventFormStore } from '../../stores/event-form'
import { useI18n } from 'vue-i18n'
import { Input, RadioGroup, Tooltip } from 'fk-designsystem'
import { useStepControls } from '../../composables/useStepControls'

const { t } = useI18n()
const router = useRouter()
const formStore = useEventFormStore()
const stepControls = useStepControls()
const contactInfo = formStore.formData.contactInfo

const commercialOptions = computed(() => [
  { label: t('form.step1.yes'), value: true },
  { label: t('form.step1.no'), value: false },
])

const errors = reactive({
  cvrCpr: '',
  fullName: '',
  phone: '',
  email: '',
  contactPersonName: '',
  contactPersonPhone: '',
})

const resetErrors = () => {
  errors.cvrCpr = ''
  errors.fullName = ''
  errors.phone = ''
  errors.email = ''
  errors.contactPersonName = ''
  errors.contactPersonPhone = ''
}

const validateForm = () => {
  resetErrors()
  let isValid = true

  if (!contactInfo.cvrCpr || !/^\d{8}$|^\d{10}$/.test(contactInfo.cvrCpr)) {
    errors.cvrCpr = t('validation.invalidCVR')
    isValid = false
  }

  if (!contactInfo.fullName || contactInfo.fullName.length < 2) {
    errors.fullName = t('validation.required')
    isValid = false
  }

  if (!contactInfo.phone || !/^\d{8}$/.test(contactInfo.phone.replace(/\s/g, ''))) {
    errors.phone = t('validation.invalidPhone')
    isValid = false
  }

  if (!contactInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
    errors.email = t('validation.invalidEmail')
    isValid = false
  }

  if (!contactInfo.contactPerson.fullName || contactInfo.contactPerson.fullName.length < 2) {
    errors.contactPersonName = t('validation.required')
    isValid = false
  }

  if (
    !contactInfo.contactPerson.phone ||
    !/^\d{8}$/.test(contactInfo.contactPerson.phone.replace(/\s/g, ''))
  ) {
    errors.contactPersonPhone = t('validation.invalidPhone')
    isValid = false
  }

  return isValid
}

const goToNextStep = async () => {
  const isValid = validateForm()
  formStore.markStepCompleted(1, isValid)
  if (!isValid) {
    return
  }

  const nextStepPath = formStore.getStepPath(2)
  if (nextStepPath) {
    formStore.goToStep(2)
    await router.push(nextStepPath)
  }
}

onMounted(() => {
  formStore.setCurrentStepByPath('/application/contact-info')
  stepControls.value.onNext = goToNextStep
})

onUnmounted(() => {
  stepControls.value.onNext = undefined
})

definePageMeta({
  layout: 'application',
  name: 'ContactInfo',
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
.contact-info-step {
  // Typography classes are global from design system
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem; // $spacing-lg
}

.title {
  display: flex;
  align-items: center;
  gap: 1rem; // $spacing-md
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px; // $size-40
  height: 40px;
  border-radius: 9999px; // $border-radius-full
  background: white;
  border: 1px solid #EBEBEB; // $color-grey-300
}

.title-icon :deep(svg) {
  color: #141414; // $color-grey-1000
}

.form-grid {
  display: grid;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
}

.form-row.two-cols {
  grid-template-columns: repeat(2, 1fr);
}

.section-header {
  display: flex;
  gap: 1rem; // $spacing-md
  align-items: center;
}

.hr {
  height: 1px;
  background: #EBEBEB; // $color-grey-300
  border: none;
}

// Utility spacing classes from design system pattern
.mb-24 {
  margin-bottom: 24px;
}

.mb-40 {
  margin-bottom: 40px;
}

.pt-16 {
  padding-top: 16px;
}

.pb-40 {
  padding-bottom: 40px;
}

.gap-12 {
  gap: 12px;
}

.gap-24 {
  gap: 24px;
}

// Typography helpers
.text-m {
  font-size: 16px;
  line-height: 1.5;
}

.text-muted {
  color: #6A6A6A; // $text-tertiary
}

.heading-m {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

.heading-s {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.heading-2xl {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
}

.step-contact-info {
  max-width: 700px;
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: var(--color-text-primary);
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
}

.form-section {
  background: var(--color-background-light, #f9fafb);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
}

.required {
  color: var(--color-error, #dc2626);
}

input[type="text"],
input[type="tel"],
input[type="email"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.radio-group {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.radio-label input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.error-message {
  display: block;
  color: var(--color-error, #dc2626);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
