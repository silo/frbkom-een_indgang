<template>
  <div class="permits-operations-step">
    <header class="header mb-24">
      <h1 class="heading-2xl title">
        <span class="title-icon" aria-hidden="true">
          <Icon name="fa7-solid:file-certificate" size="18" />
        </span>
        {{ $t('form.step4.title') }}
      </h1>
    </header>

    <p class="text-m text-muted mb-24">
      {{ $t('form.step4.subtitle') }}
    </p>

    <section class="section-card" aria-labelledby="blockage-heading">
      <div class="section-heading">
        <span class="section-icon" aria-hidden="true">
          <Icon name="ph:traffic-cone-fill" size="24" />
        </span>
        <div>
          <h4 id="blockage-heading" class="heading-m mb-4">{{ $t('form.step4.blockageInfo') }}</h4>
          <p class="text-s text-muted">{{ $t('form.step4.blockageHelper') }}</p>
        </div>
      </div>

      <div class="form-grid gap-24">
        <div class="form-row">
          <h5 class="heading-s mb-12">
            {{ $t('form.step4.needsBlockage') }} <span class="required">*</span>
          </h5>
          <RadioGroup
            id="needs-blockage"
            v-model="formData.needsBlockage"
            name="needs-blockage"
            :options="yesNoOptions"
            orientation="vertical"
          />
          <p v-if="errors.needsBlockage" class="error-text text-s mt-8">
            {{ errors.needsBlockage }}
          </p>
        </div>

        <div v-if="formData.needsBlockage === true" class="form-row">
          <Textarea
            id="blockage-description"
            v-model="formData.blockageDescription"
            :label="$t('form.step4.blockageDescription')"
            :error="!!errors.blockageDescription"
            :error-message="errors.blockageDescription || ''"
            @blur="validateField('blockageDescription')"
            placeholder="Oplys hvilke veje/fortov/pladser..."
            :rows="4"
          />
        </div>

        <div class="form-row">
          <h5 class="heading-s mb-12">
            {{ $t('form.step4.hasPolicePermission') }} <span class="required">*</span>
          </h5>
          <RadioGroup
            id="has-police-permission"
            v-model="formData.hasPolicePermission"
            name="has-police-permission"
            :options="yesNoOptions"
            orientation="vertical"
          />
          <p v-if="errors.hasPolicePermission" class="error-text text-s mt-8">
            {{ errors.hasPolicePermission }}
          </p>
        </div>

        <div v-if="formData.hasPolicePermission === true" class="form-row">
          <label class="label-text text-m mb-8"
            >{{ $t('form.step4.policePermissionDocument') }} <span class="required">*</span></label
          >
          <p class="text-s text-muted mb-12">Upload PDF (maks. 5MB)</p>
          <input
            ref="policeFileInput"
            type="file"
            accept=".pdf"
            class="file-input"
            @change="handlePoliceFileUpload"
          />
          <p v-if="formData.policePermissionDocument" class="text-s mt-8">
            {{ formData.policePermissionDocument.name }}
          </p>
          <p v-if="errors.policePermissionDocument" class="error-text text-s mt-8">
            {{ errors.policePermissionDocument }}
          </p>
        </div>
      </div>
    </section>

    <section class="section-card" aria-labelledby="operations-heading">
      <div class="section-heading">
        <span class="section-icon" aria-hidden="true">
          <Icon name="ph:leaf-fill" size="24" />
        </span>
        <div>
          <h4 id="operations-heading" class="heading-m mb-4">
            {{ $t('form.step4.wasteHandling') }}
          </h4>
          <p class="text-s text-muted">{{ $t('form.step4.operationsHelper') }}</p>
        </div>
      </div>

      <div class="form-grid gap-24">
        <div class="form-row">
          <h5 class="heading-s mb-12">
            {{ $t('form.step4.hasWasteHandling') }} <span class="required">*</span>
          </h5>
          <RadioGroup
            id="has-waste-handling"
            v-model="formData.hasWasteHandling"
            name="has-waste-handling"
            :options="yesNoOptions"
            orientation="vertical"
          />
          <p v-if="errors.hasWasteHandling" class="error-text text-s mt-8">
            {{ errors.hasWasteHandling }}
          </p>
        </div>

        <div v-if="formData.hasWasteHandling === true" class="form-row">
          <Textarea
            id="waste-description"
            v-model="formData.wasteDescription"
            :label="$t('form.step4.wasteDescription')"
            :error="!!errors.wasteDescription"
            :error-message="errors.wasteDescription || ''"
            @blur="validateField('wasteDescription')"
            placeholder="Beskriv affaldshåndteringen..."
            :rows="3"
          />
        </div>

        <div class="section-divider" aria-hidden="true" />

        <div class="form-row">
          <h5 class="heading-s mb-12">
            {{ $t('form.step4.hasFoodDrinks') }} <span class="required">*</span>
          </h5>
          <RadioGroup
            id="has-food-drinks"
            v-model="formData.hasFoodDrinks"
            name="has-food-drinks"
            :options="yesNoOptions"
            orientation="vertical"
          />
          <p v-if="errors.hasFoodDrinks" class="error-text text-s mt-8">
            {{ errors.hasFoodDrinks }}
          </p>
        </div>

        <div v-if="formData.hasFoodDrinks === true" class="form-row">
          <Textarea
            id="food-description"
            v-model="formData.foodDescription"
            :label="$t('form.step4.foodDescription')"
            :error="!!errors.foodDescription"
            :error-message="errors.foodDescription || ''"
            @blur="validateField('foodDescription')"
            placeholder="Beskriv hvilke mad og drikkevarer..."
            :rows="3"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEventFormStore } from '../../stores/event-form'
import { useI18n } from 'vue-i18n'
import { RadioGroup, Textarea } from 'fk-designsystem'
import { useStepControls } from '../../composables/useStepControls'
import { accessInfoSchema, wasteInfoSchema, foodInfoSchema } from '~~/shared/schemas/event-info'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const formStore = useEventFormStore()
const stepControls = useStepControls()
const policeFileInput = ref<HTMLInputElement | null>(null)

// Form data (v-model bound to store)
const formData = computed(() => formStore.formData.permitsInfo)

// Validation errors
const errors = reactive({
  needsBlockage: '',
  blockageDescription: '',
  hasPolicePermission: '',
  policePermissionDocument: '',
  hasWasteHandling: '',
  wasteDescription: '',
  hasFoodDrinks: '',
  foodDescription: '',
})

// Options
const yesNoOptions = [
  { label: 'Ja', value: true },
  { label: 'Nej', value: false },
]

// Methods
const handlePoliceFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      errors.policePermissionDocument = 'Filen må ikke være større end 5MB'
      target.value = ''
      return
    }

    if (file.type !== 'application/pdf') {
      errors.policePermissionDocument = 'Kun PDF-filer er tilladt'
      target.value = ''
      return
    }

    formStore.formData.permitsInfo.policePermissionDocument = file
    errors.policePermissionDocument = ''
  }
}

const mapAccessToSchemaInput = () => {
  const data = formStore.formData.permitsInfo
  return {
    eventId: '00000000-0000-0000-0000-000000000000',
    needsBlockage: data.needsBlockage === true,
    blockageDescription: data.blockageDescription || null,
    policePermissionApplied: data.hasPolicePermission === true,
    policeApprovalDocumentId: data.policePermissionDocument ? '00000000-0000-0000-0000-000000000000' : null,
  }
}

const mapWasteToSchemaInput = () => {
  const data = formStore.formData.permitsInfo
  return {
    eventId: '00000000-0000-0000-0000-000000000000',
    needsWasteHandling: data.hasWasteHandling === true,
    description: data.wasteDescription || null,
  }
}

const mapFoodToSchemaInput = () => {
  const data = formStore.formData.permitsInfo
  return {
    eventId: '00000000-0000-0000-0000-000000000000',
    hasFoodOrBeverage: data.hasFoodDrinks === true,
    description: data.foodDescription || null,
  }
}

const validateField = (field: keyof typeof errors) => {
  if (['needsBlockage', 'blockageDescription', 'hasPolicePermission', 'policePermissionDocument'].includes(field)) {
    const input = mapAccessToSchemaInput()
    const result = accessInfoSchema.safeParse(input)
    
    if (!result.success) {
      const formatted = result.error.format()
      // @ts-expect-error index access
      const fieldError = formatted[field === 'needsBlockage' ? 'needsBlockage' : field === 'blockageDescription' ? 'blockageDescription' : field === 'hasPolicePermission' ? 'policePermissionApplied' : 'policeApprovalDocumentId']
      
      if (fieldError && fieldError._errors.length > 0) {
        // @ts-expect-error index access
        errors[field] = t('validation.required')
      } else {
        // @ts-expect-error index access
        errors[field] = ''
      }
    } else {
      // @ts-expect-error index access
      errors[field] = ''
    }
  } else if (['hasWasteHandling', 'wasteDescription'].includes(field)) {
    const input = mapWasteToSchemaInput()
    const result = wasteInfoSchema.safeParse(input)
    
    if (!result.success) {
      const formatted = result.error.format()
      // @ts-expect-error index access
      const fieldError = formatted[field === 'hasWasteHandling' ? 'needsWasteHandling' : 'description']
      
      if (fieldError && fieldError._errors.length > 0) {
        // @ts-expect-error index access
        errors[field] = t('validation.required')
      } else {
        // @ts-expect-error index access
        errors[field] = ''
      }
    } else {
      // @ts-expect-error index access
      errors[field] = ''
    }
  } else if (['hasFoodDrinks', 'foodDescription'].includes(field)) {
    const input = mapFoodToSchemaInput()
    const result = foodInfoSchema.safeParse(input)
    
    if (!result.success) {
      const formatted = result.error.format()
      // @ts-expect-error index access
      const fieldError = formatted[field === 'hasFoodDrinks' ? 'hasFoodOrBeverage' : 'description']
      
      if (fieldError && fieldError._errors.length > 0) {
        // @ts-expect-error index access
        errors[field] = t('validation.required')
      } else {
        // @ts-expect-error index access
        errors[field] = ''
      }
    } else {
      // @ts-expect-error index access
      errors[field] = ''
    }
  }
}

const validateForm = (silent = false) => {
  let isValid = true
  
  // Access
  const accessInput = mapAccessToSchemaInput()
  const accessResult = accessInfoSchema.safeParse(accessInput)
  if (!accessResult.success) {
    isValid = false
    if (!silent) {
      const formatted = accessResult.error.format()
      if (formatted.needsBlockage) errors.needsBlockage = t('validation.required')
      else errors.needsBlockage = ''
        
      if (formatted.blockageDescription) errors.blockageDescription = t('validation.required')
      else errors.blockageDescription = ''
        
      if (formatted.policePermissionApplied) errors.hasPolicePermission = t('validation.required')
      else errors.hasPolicePermission = ''
        
      if (formatted.policeApprovalDocumentId) errors.policePermissionDocument = t('validation.required')
      else errors.policePermissionDocument = ''
    }
  } else if (!silent) {
    errors.needsBlockage = ''
    errors.blockageDescription = ''
    errors.hasPolicePermission = ''
    errors.policePermissionDocument = ''
  }
  
  // Waste
  const wasteInput = mapWasteToSchemaInput()
  const wasteResult = wasteInfoSchema.safeParse(wasteInput)
  if (!wasteResult.success) {
    isValid = false
    if (!silent) {
      const formatted = wasteResult.error.format()
      if (formatted.needsWasteHandling) errors.hasWasteHandling = t('validation.required')
      else errors.hasWasteHandling = ''
        
      if (formatted.description) errors.wasteDescription = t('validation.required')
      else errors.wasteDescription = ''
    }
  } else if (!silent) {
    errors.hasWasteHandling = ''
    errors.wasteDescription = ''
  }
  
  // Food
  const foodInput = mapFoodToSchemaInput()
  const foodResult = foodInfoSchema.safeParse(foodInput)
  if (!foodResult.success) {
    isValid = false
    if (!silent) {
      const formatted = foodResult.error.format()
      if (formatted.hasFoodOrBeverage) errors.hasFoodDrinks = t('validation.required')
      else errors.hasFoodDrinks = ''
        
      if (formatted.description) errors.foodDescription = t('validation.required')
      else errors.foodDescription = ''
    }
  } else if (!silent) {
    errors.hasFoodDrinks = ''
    errors.foodDescription = ''
  }
  
  return isValid
}

const validateAndProceed = async () => {
  const nextPath = formStore.getStepPath(5)
  if (nextPath) {
    formStore.goToStep(5)
    await router.push(nextPath)
  }

  const isValid = validateForm()
  formStore.markStepCompleted(4, isValid)
}

onMounted(() => {
  formStore.setCurrentStepByPath('/application/permits-operations')
  stepControls.value.onNext = validateAndProceed

  const currentStep = formStore.steps.find(s => s.path === '/application/permits-operations')
  if (route.query.validate === 'true' || (currentStep?.visited && !currentStep?.valid)) {
    validateForm(false)
  }
})

onUnmounted(() => {
  if (stepControls.value.onNext === validateAndProceed) {
    stepControls.value.onNext = undefined
  }
})

definePageMeta({
  layout: 'application',
  name: 'PermitsOperations',
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.permits-operations-step {
  // Typography classes are global from design system
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
  color: $color-primary;
}

.section-card {
  background: $color-white;
  border: 1px solid $color-grey-300;
  border-radius: 16px;
  padding: $spacing-24;
  margin-bottom: $spacing-32;
  box-shadow: 0 8px 24px rgba(24, 39, 75, 0.06);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: $spacing-16;
  margin-bottom: $spacing-24;
}

.section-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: $color-brand-100;
  color: $color-primary;
}

.form-grid {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  flex-direction: column;
}

.section-divider {
  height: 1px;
  background: $color-grey-300;
  margin: $spacing-8 0 $spacing-16;
}

.gap-24 {
  gap: $spacing-24;
}

.mb-8 {
  margin-bottom: $spacing-8;
}

.mb-12 {
  margin-bottom: $spacing-12;
}

.mb-16 {
  margin-bottom: $spacing-16;
}

.mb-24 {
  margin-bottom: $spacing-24;
}

.mb-40 {
  margin-bottom: $spacing-40;
}

.mt-8 {
  margin-top: $spacing-8;
}

@media (min-width: 768px) {
  .section-card {
    padding: $spacing-32 $spacing-40;
  }
}

.label-text {
  font-weight: 600;
  color: $color-text-primary;
  display: block;
}

.required {
  color: $color-critical;
}

.file-input {
  padding: $spacing-12;
  border: 2px dashed $color-grey-400;
  border-radius: 8px;
  background: $color-grey-100;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: $color-primary;
    background: $color-brand-100;
  }

  &::file-selector-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: $color-primary;
    color: $color-white;
    font-weight: 500;
    cursor: pointer;
    margin-right: 12px;

    &:hover {
      background: $color-primary-dark;
    }
  }
}

.error-text {
  color: $color-critical;
  font-weight: 500;
}
</style>
