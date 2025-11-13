<template>
  <div class="step-contact-info">
    <h2>{{ $t('form.step1.title') }}</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Generelle oplysninger -->
      <section class="form-section">
        <h3>{{ $t('form.step1.generalInfo') }}</h3>

        <div class="form-field">
          <label for="cvrCpr">
            {{ $t('form.step1.cvrCpr') }}
            <span class="required">*</span>
          </label>
          <input
            id="cvrCpr"
            v-model="formData.cvrCpr"
            type="text"
            :placeholder="$t('form.step1.cvrCpr')"
            required
          >
          <span v-if="errors.cvrCpr" class="error-message">{{ errors.cvrCpr }}</span>
        </div>

        <div class="form-field">
          <label for="fullName">
            {{ $t('form.step1.fullName') }}
            <span class="required">*</span>
          </label>
          <input
            id="fullName"
            v-model="formData.fullName"
            type="text"
            :placeholder="$t('form.step1.fullName')"
            required
          >
          <span v-if="errors.fullName" class="error-message">{{ errors.fullName }}</span>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="phone">
              {{ $t('form.step1.phone') }}
              <span class="required">*</span>
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              :placeholder="$t('form.step1.phone')"
              required
            >
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
          </div>

          <div class="form-field">
            <label for="email">
              {{ $t('form.step1.email') }}
              <span class="required">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :placeholder="$t('form.step1.email')"
              required
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
        </div>

        <div class="form-field">
          <label>{{ $t('form.step1.isCommercial') }}</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                v-model="formData.isCommercial"
                type="radio"
                name="isCommercial"
                :value="true"
              >
              {{ $t('form.step1.yes') }}
            </label>
            <label class="radio-label">
              <input
                v-model="formData.isCommercial"
                type="radio"
                name="isCommercial"
                :value="false"
              >
              {{ $t('form.step1.no') }}
            </label>
          </div>
        </div>
      </section>

      <!-- Kontaktperson -->
      <section class="form-section">
        <h3>{{ $t('form.step1.contactPerson') }}</h3>

        <div class="form-field">
          <label for="contactPersonName">
            {{ $t('form.step1.contactPersonName') }}
            <span class="required">*</span>
          </label>
          <input
            id="contactPersonName"
            v-model="formData.contactPerson.fullName"
            type="text"
            :placeholder="$t('form.step1.contactPersonName')"
            required
          >
          <span v-if="errors.contactPersonName" class="error-message">
            {{ errors.contactPersonName }}
          </span>
        </div>

        <div class="form-field">
          <label for="contactPersonPhone">
            {{ $t('form.step1.contactPersonPhone') }}
            <span class="required">*</span>
          </label>
          <input
            id="contactPersonPhone"
            v-model="formData.contactPerson.phone"
            type="tel"
            :placeholder="$t('form.step1.contactPersonPhone')"
            required
          >
          <span v-if="errors.contactPersonPhone" class="error-message">
            {{ errors.contactPersonPhone }}
          </span>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useEventFormStore } from '../../stores/event-form'

const formStore = useEventFormStore()

const formData = reactive({
  cvrCpr: formStore.formData.contactInfo.cvrCpr,
  fullName: formStore.formData.contactInfo.fullName,
  phone: formStore.formData.contactInfo.phone,
  email: formStore.formData.contactInfo.email,
  isCommercial: formStore.formData.contactInfo.isCommercial,
  contactPerson: {
    fullName: formStore.formData.contactInfo.contactPerson.fullName,
    phone: formStore.formData.contactInfo.contactPerson.phone,
  },
})

const errors = reactive({
  cvrCpr: '',
  fullName: '',
  phone: '',
  email: '',
  contactPersonName: '',
  contactPersonPhone: '',
})

const validateForm = () => {
  let isValid = true
  errors.cvrCpr = ''
  errors.fullName = ''
  errors.phone = ''
  errors.email = ''
  errors.contactPersonName = ''
  errors.contactPersonPhone = ''

  // CVR/CPR validation (8 or 10 digits)
  if (!formData.cvrCpr || !/^\d{8}$|^\d{10}$/.test(formData.cvrCpr)) {
    errors.cvrCpr = 'CVR skal være 8 cifre eller CPR skal være 10 cifre'
    isValid = false
  }

  // Name validation
  if (!formData.fullName || formData.fullName.length < 2) {
    errors.fullName = 'Navn er påkrævet'
    isValid = false
  }

  // Phone validation
  if (!formData.phone || !/^\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Telefonnummer skal være 8 cifre'
    isValid = false
  }

  // Email validation
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Ugyldig email-adresse'
    isValid = false
  }

  // Contact person name validation
  if (!formData.contactPerson.fullName || formData.contactPerson.fullName.length < 2) {
    errors.contactPersonName = 'Kontaktpersonens navn er påkrævet'
    isValid = false
  }

  // Contact person phone validation
  if (!formData.contactPerson.phone || !/^\d{8}$/.test(formData.contactPerson.phone.replace(/\s/g, ''))) {
    errors.contactPersonPhone = 'Telefonnummer skal være 8 cifre'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    // Update store
    formStore.formData.contactInfo = {
      ...formData,
    }
    formStore.markStepCompleted(1, true)
    formStore.nextStep()
  }
}

onMounted(() => {
  // Load existing data if any
  if (formStore.formData.contactInfo.cvrCpr) {
    Object.assign(formData, formStore.formData.contactInfo)
  }
})

definePageMeta({
  layout: 'default',
  name: 'ContactInfo',
})
</script>

<style scoped>
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
