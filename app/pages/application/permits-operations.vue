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
          <h5 class="heading-s mb-12">{{ $t('form.step4.needsBlockage') }} <span class="required">*</span></h5>
          <RadioGroup
            id="needs-blockage"
            v-model="formData.needsBlockage"
            name="needs-blockage"
            :options="yesNoOptions"
            orientation="vertical"
          />
          <p v-if="errors.needsBlockage" class="error-text text-s mt-8">{{ errors.needsBlockage }}</p>
        </div>

        <div v-if="formData.needsBlockage === true" class="form-row">
          <Textarea
            id="blockage-description"
            v-model="formData.blockageDescription"
            :label="$t('form.step4.blockageDescription')"
            :error="errors.blockageDescription"
            required
            placeholder="Oplys hvilke veje/fortov/pladser..."
            :rows="4"
          />
        </div>

        <div class="form-row">
          <h5 class="heading-s mb-12">{{ $t('form.step4.hasPolicePermission') }} <span class="required">*</span></h5>
          <RadioGroup
            id="has-police-permission"
            v-model="formData.hasPolicePermission"
            name="has-police-permission"
            :options="yesNoOptions"
            orientation="vertical"
          />
          <p v-if="errors.hasPolicePermission" class="error-text text-s mt-8">{{ errors.hasPolicePermission }}</p>
        </div>

        <div v-if="formData.hasPolicePermission === true" class="form-row">
          <label class="label-text text-m mb-8">{{ $t('form.step4.policePermissionDocument') }} <span class="required">*</span></label>
          <p class="text-s text-muted mb-12">Upload PDF (maks. 5MB)</p>
          <input
            ref="policeFileInput"
            type="file"
            accept=".pdf"
            class="file-input"
            @change="handlePoliceFileUpload"
          >
          <p v-if="formData.policePermissionDocument" class="text-s mt-8">
            {{ formData.policePermissionDocument.name }}
          </p>
          <p v-if="errors.policePermissionDocument" class="error-text text-s mt-8">{{ errors.policePermissionDocument }}</p>
        </div>
      </div>
    </section>

    <section class="section-card" aria-labelledby="operations-heading">
      <div class="section-heading">
        <span class="section-icon" aria-hidden="true">
          <Icon name="ph:leaf-fill" size="24" />
        </span>
        <div>
          <h4 id="operations-heading" class="heading-m mb-4">{{ $t('form.step4.wasteHandling') }}</h4>
          <p class="text-s text-muted">{{ $t('form.step4.operationsHelper') }}</p>
        </div>
      </div>

      <div class="form-grid gap-24">
        <div class="form-row">
          <h5 class="heading-s mb-12">{{ $t('form.step4.hasWasteHandling') }} <span class="required">*</span></h5>
          <RadioGroup
            id="has-waste-handling"
            v-model="formData.hasWasteHandling"
            name="has-waste-handling"
            :options="yesNoOptions"
            orientation="vertical"
          />
          <p v-if="errors.hasWasteHandling" class="error-text text-s mt-8">{{ errors.hasWasteHandling }}</p>
        </div>

        <div v-if="formData.hasWasteHandling === true" class="form-row">
          <Textarea
            id="waste-description"
            v-model="formData.wasteDescription"
            :label="$t('form.step4.wasteDescription')"
            :error="errors.wasteDescription"
            required
            placeholder="Beskriv affaldshåndteringen..."
            :rows="3"
          />
        </div>

        <div class="section-divider" aria-hidden="true" />

        <div class="form-row">
          <h5 class="heading-s mb-12">{{ $t('form.step4.hasFoodDrinks') }} <span class="required">*</span></h5>
          <RadioGroup
            id="has-food-drinks"
            v-model="formData.hasFoodDrinks"
            name="has-food-drinks"
            :options="yesNoOptions"
            orientation="vertical"
          />
          <p v-if="errors.hasFoodDrinks" class="error-text text-s mt-8">{{ errors.hasFoodDrinks }}</p>
        </div>

        <div v-if="formData.hasFoodDrinks === true" class="form-row">
          <Textarea
            id="food-description"
            v-model="formData.foodDescription"
            :label="$t('form.step4.foodDescription')"
            :error="errors.foodDescription"
            required
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
import { useRouter } from 'vue-router'
import { useEventFormStore } from '../../stores/event-form'
import { useI18n } from 'vue-i18n'
import { RadioGroup, Textarea } from 'fk-designsystem'
import { useStepControls } from '../../composables/useStepControls'

const { t } = useI18n()
const router = useRouter()
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
const validateAndProceed = async () => {
  let isValid = true

  if (formData.value.needsBlockage === null) {
    errors.needsBlockage = t('validation.required')
    isValid = false
  } else {
    errors.needsBlockage = ''
  }

  if (formData.value.needsBlockage) {
    if (!formData.value.blockageDescription) {
      errors.blockageDescription = t('validation.required')
      isValid = false
    } else {
      errors.blockageDescription = ''
    }
  } else {
    errors.blockageDescription = ''
  }

  if (formData.value.hasPolicePermission === null) {
    errors.hasPolicePermission = t('validation.required')
    isValid = false
  } else {
    errors.hasPolicePermission = ''
  }

  if (formData.value.hasPolicePermission) {
    if (!formData.value.policePermissionDocument) {
      errors.policePermissionDocument = t('validation.required')
      isValid = false
    } else {
      errors.policePermissionDocument = ''
    }
  } else {
    errors.policePermissionDocument = ''
  }

  if (formData.value.hasWasteHandling === null) {
    errors.hasWasteHandling = t('validation.required')
    isValid = false
  } else {
    errors.hasWasteHandling = ''
  }

  if (formData.value.hasWasteHandling) {
    if (!formData.value.wasteDescription) {
      errors.wasteDescription = t('validation.required')
      isValid = false
    } else {
      errors.wasteDescription = ''
    }
  } else {
    errors.wasteDescription = ''
  }

  if (formData.value.hasFoodDrinks === null) {
    errors.hasFoodDrinks = t('validation.required')
    isValid = false
  } else {
    errors.hasFoodDrinks = ''
  }

  if (formData.value.hasFoodDrinks) {
    if (!formData.value.foodDescription) {
      errors.foodDescription = t('validation.required')
      isValid = false
    } else {
      errors.foodDescription = ''
    }
  } else {
    errors.foodDescription = ''
  }

  formStore.markStepCompleted(4, isValid)

  if (!isValid) {
    return
  }

  const nextPath = formStore.getStepPath(5)
  if (nextPath) {
    formStore.goToStep(5)
    await router.push(nextPath)
  }
}

onMounted(() => {
  formStore.setCurrentStepByPath('/application/permits-operations')
  stepControls.value.onNext = validateAndProceed
})

onUnmounted(() => {
  stepControls.value.onNext = undefined
})

definePageMeta({
  layout: 'application',
  name: 'PermitsOperations',
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
.permits-operations-step {
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


.section-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 24px rgba(24, 39, 75, 0.06);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.section-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f7ff;
  color: #0057B8;
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
  background: #e5e5e5;
  margin: 8px 0 16px;
}

.gap-24 {
  gap: 24px;
}

.mb-8 {
  margin-bottom: 8px;
}

.mb-12 {
  margin-bottom: 12px;
}

.mb-16 {
  margin-bottom: 16px;
}

.mb-24 {
  margin-bottom: 24px;
}

.mb-40 {
  margin-bottom: 40px;
}

.mt-8 {
  margin-top: 8px;
}


@media (min-width: 768px) {
  .section-card {
    padding: 32px 40px;
  }
}

.label-text {
  font-weight: 600;
  color: #333;
  display: block;
}

.required {
  color: #d32f2f;
}

.file-input {
  padding: 12px;
  border: 2px dashed #d1d1d1;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0057B8;
    background: #f0f7ff;
  }

  &::file-selector-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: #0057B8;
    color: white;
    font-weight: 500;
    cursor: pointer;
    margin-right: 12px;

    &:hover {
      background: #004a9c;
    }
  }
}

.error-text {
  color: #d32f2f;
  font-weight: 500;
}
</style>
