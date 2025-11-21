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
        <div>
          <Input
            id="contact-cvr-cpr"
            v-model="contactInfo.cvrCpr"
            :label="$t('form.step1.cvrCpr')"
            :error="!!errors.cvrCpr"
            :error-message="errors.cvrCpr || ''"
            @blur="validateField('cvrCpr')"
          />
        </div>
        <div>
          <Input
            id="contact-full-name"
            v-model="contactInfo.fullName"
            :label="$t('form.step1.fullName')"
            :error="!!errors.fullName"
            :error-message="errors.fullName || ''"
            @blur="validateField('fullName')"
          />
        </div>
      </div>
      <div class="form-row two-cols gap-24">
        <div>
          <Input
            id="contact-phone"
            v-model="contactInfo.phone"
            :label="$t('form.step1.phone')"
            type="tel"
            :error="!!errors.phone"
            :error-message="errors.phone || ''"
            @blur="validateField('phone')"
          />
        </div>
        <div>
          <Input
            id="contact-email"
            v-model="contactInfo.email"
            :label="$t('form.step1.email')"
            type="email"
            :error="!!errors.email"
            :error-message="errors.email || ''"
            @blur="validateField('email')"
          />
        </div>
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
      <Tooltip
        id="contact-person-help"
        text="Kontaktpersonen er den primære person, vi vil kontakte vedrørende arrangementet"
        placement="top"
      >
        <Icon name="fa7-solid:circle-question" size="18" style="color: #6a6a6a" />
      </Tooltip>
    </div>

    <div class="form-grid gap-24 mb-40">
      <div class="form-row two-cols gap-24">
        <div>
          <Input
            id="contact-person-name"
            v-model="contactInfo.contactPerson.fullName"
            :label="$t('form.step1.contactPersonName')"
            :error="!!errors.contactPersonName"
            :error-message="errors.contactPersonName || ''"
            @blur="validateField('contactPersonName')"
          />
        </div>
        <div>
          <Input
            id="contact-person-phone"
            v-model="contactInfo.contactPerson.phone"
            :label="$t('form.step1.contactPersonPhone')"
            type="tel"
            :error="!!errors.contactPersonPhone"
            :error-message="errors.contactPersonPhone || ''"
            @blur="validateField('contactPersonPhone')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEventFormStore } from '../../stores/event-form'
import { useI18n } from 'vue-i18n'
import { Input, RadioGroup, Tooltip } from 'fk-designsystem'
import { useStepControls } from '../../composables/useStepControls'
import { contactInfoSchema } from '~~/shared/schemas/event'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const formStore = useEventFormStore()
const stepControls = useStepControls()
const contactInfo = formStore.formData.contactInfo

const commercialOptions = computed(() => [
  { label: t('form.step1.yes'), value: true },
  { label: t('form.step1.no'), value: false },
])

const errors = reactive({
  cvrCpr: null as string | null,
  fullName: null as string | null,
  phone: null as string | null,
  email: null as string | null,
  contactPersonName: null as string | null,
  contactPersonPhone: null as string | null,
})

const resetErrors = () => {
  errors.cvrCpr = null
  errors.fullName = null
  errors.phone = null
  errors.email = null
  errors.contactPersonName = null
  errors.contactPersonPhone = null
}

const validateField = (field: keyof typeof errors) => {
  switch (field) {
    case 'cvrCpr': {
      const result = contactInfoSchema.shape.cvrCpr.safeParse(contactInfo.cvrCpr)
      errors.cvrCpr = result.success ? null : t('validation.invalidCVR')
      break
    }
    case 'fullName': {
      const result = contactInfoSchema.shape.fullName.safeParse(contactInfo.fullName)
      errors.fullName = result.success ? null : t('validation.required')
      break
    }
    case 'phone': {
      const result = contactInfoSchema.shape.phone.safeParse(contactInfo.phone)
      errors.phone = result.success ? null : t('validation.invalidPhone')
      break
    }
    case 'email': {
      const result = contactInfoSchema.shape.email.safeParse(contactInfo.email)
      errors.email = result.success ? null : t('validation.invalidEmail')
      break
    }
    case 'contactPersonName': {
      const result = contactInfoSchema.shape.contactPerson.shape.fullName.safeParse(
        contactInfo.contactPerson.fullName
      )
      errors.contactPersonName = result.success ? null : t('validation.required')
      break
    }
    case 'contactPersonPhone': {
      const result = contactInfoSchema.shape.contactPerson.shape.phone.safeParse(
        contactInfo.contactPerson.phone
      )
      errors.contactPersonPhone = result.success ? null : t('validation.invalidPhone')
      break
    }
  }
}

const validateForm = (silent = false) => {
  if (!silent) resetErrors()
  const result = contactInfoSchema.safeParse(contactInfo)

  if (!result.success) {
    if (!silent) {
      const formattedErrors = result.error.format()
      
      if (formattedErrors.cvrCpr) errors.cvrCpr = t('validation.invalidCVR')
      if (formattedErrors.fullName) errors.fullName = t('validation.required')
      if (formattedErrors.phone) errors.phone = t('validation.invalidPhone')
      if (formattedErrors.email) errors.email = t('validation.invalidEmail')
      
      if (formattedErrors.contactPerson?.fullName) {
        errors.contactPersonName = t('validation.required')
      }
      if (formattedErrors.contactPerson?.phone) {
        errors.contactPersonPhone = t('validation.invalidPhone')
      }
    }
    return false
  }

  return true
}

const goToNextStep = async () => {
  const nextStepPath = formStore.getStepPath(2)
  if (nextStepPath) {
    formStore.goToStep(2)
    await router.push(nextStepPath)
  }

  const isValid = validateForm()
  formStore.markStepCompleted(1, isValid)
}

onMounted(() => {
  formStore.setCurrentStepByPath('/application/contact-info')
  stepControls.value.onNext = goToNextStep

  const currentStep = formStore.getCurrentStep
  if (route.query.validate === 'true' || (currentStep?.visited && !currentStep?.valid)) {
    validateForm()
  }
})

onUnmounted(() => {
  if (stepControls.value.onNext === goToNextStep) {
    stepControls.value.onNext = undefined
  }
})

definePageMeta({
  layout: 'application',
  name: 'ContactInfo',
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.contact-info-step {
  // Typography classes are global from design system
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  gap: $spacing-24;
}

.title {
  display: flex;
  align-items: center;
  gap: $spacing-16;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: $color-white;
  border: 1px solid $color-grey-300;
}

.title-icon :deep(svg) {
  color: $color-text-primary;
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
  gap: $spacing-16;
  align-items: center;
}

.hr {
  height: 1px;
  background: $color-grey-300;
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
  color: $color-text-muted;
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
  color: $color-text-primary;
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: $color-text-secondary;
}

.form-section {
  background: $color-bg-surface;
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
  color: $color-text-primary;
}

.required {
  color: $color-critical;
}

input[type='text'],
input[type='tel'],
input[type='email'] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid $color-grey-400;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: $color-primary;
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

.radio-label input[type='radio'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.error-message {
  display: block;
  color: $color-critical;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
