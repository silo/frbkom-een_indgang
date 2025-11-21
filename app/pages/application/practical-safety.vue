<template>
  <div class="practical-safety-step">
    <header class="header mb-24">
      <h1 class="heading-2xl title">
        <span class="title-icon" aria-hidden="true">
          <Icon name="fa7-solid:shield" size="18" />
        </span>
        {{ $t('form.step3.title') }}
      </h1>
    </header>

    <p class="text-m text-muted mb-24">
      {{ $t('form.step3.subtitle') }}
    </p>

    <!-- 3.1 Brandforhold og midlertidige konstruktioner -->
    <h4 class="heading-m mb-24">{{ $t('form.step3.fireAndConstructions') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div class="form-row">
        <div class="dropdown-wrapper">
          <label class="label-text text-m mb-8"
            >{{ $t('form.step3.simultaneousPersons') }} <span class="required">*</span></label
          >
          <DropdownButton
            v-model="formData.simultaneousPersons"
            :options="attendanceOptions"
            button-label="Vælg antal..."
          />
          <p v-if="errors.simultaneousPersons" class="error-text text-s mt-8">
            {{ errors.simultaneousPersons }}
          </p>
        </div>
      </div>

      <div class="form-row">
        <h5 class="heading-s mb-12">
          {{ $t('form.step3.hasConstructions') }} <span class="required">*</span>
        </h5>
        <RadioGroup
          id="has-temporary-constructions"
          name="has-temporary-constructions"
          v-model="formData.hasTemporaryConstructions"
          :options="yesNoOptions"
          orientation="vertical"
        />
      </div>

      <div v-if="formData.hasTemporaryConstructions === true" class="form-row">
        <Textarea
          id="construction-description"
          v-model="formData.constructionDescription"
          :label="$t('form.step3.constructionDescription')"
          :error="!!errors.constructionDescription"
          :error-message="errors.constructionDescription || ''"
          @blur="validateField('constructionDescription')"
          placeholder="Beskriv hvilke konstruktioner og deres formål..."
          :rows="4"
        />
      </div>

      <div v-if="formData.hasTemporaryConstructions === true" class="form-row">
        <label class="label-text text-m mb-8">{{ $t('form.step3.constructionCertificate') }}</label>
        <p class="text-s text-muted mb-12">Upload PDF (maks. 5MB) - valgfrit</p>
        <input
          ref="constructionFileInput"
          type="file"
          accept=".pdf"
          class="file-input"
          @change="handleConstructionFileUpload"
        />
        <p v-if="formData.constructionCertificate" class="text-s mt-8">
          {{ formData.constructionCertificate.name }}
        </p>
        <p v-if="errors.constructionCertificate" class="error-text text-s mt-8">
          {{ errors.constructionCertificate }}
        </p>
      </div>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <!-- 3.2 Andre opmærksomhedspunkter -->
    <h4 class="heading-m mb-16">{{ $t('form.step3.otherConsiderations') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div class="form-row">
        <h5 class="heading-s mb-12">
          {{ $t('form.step3.br18Acknowledgment') }} <span class="required">*</span>
        </h5>
        <p class="text-s text-muted mb-12">
          {{ $t('form.step3.br18AcknowledgmentText') }}
        </p>
        <RadioGroup
          id="br18-acknowledgment"
          name="br18-acknowledgment"
          v-model="formData.br18Acknowledgment"
          :options="yesNoOptions"
          orientation="vertical"
        />
        <p v-if="errors.br18Acknowledgment" class="error-text text-s mt-8">
          {{ errors.br18Acknowledgment }}
        </p>
      </div>

      <div class="form-row">
        <Textarea
          id="other-considerations"
          v-model="formData.otherConsiderations"
          :label="$t('form.step3.otherSpecialConsiderations')"
          placeholder="Andre særlige hensyn..."
          :rows="4"
        />
      </div>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <!-- 3.3 Arrangementsplan -->
    <h4 class="heading-m mb-16">{{ $t('form.step3.arrangementPlan') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div v-if="!isCustomAddress" class="form-row">
        <h5 class="heading-s mb-12">
          {{ $t('form.step3.planChoice') }} <span class="required">*</span>
        </h5>
        <RadioGroup
          id="arrangement-plan-type"
          name="arrangement-plan-type"
          v-model="formData.arrangementPlanType"
          :options="planTypeOptions"
          orientation="vertical"
        />
        <p v-if="errors.arrangementPlanType" class="error-text text-s mt-8">
          {{ errors.arrangementPlanType }}
        </p>
      </div>

      <div v-if="formData.arrangementPlanType === 'upload' || isCustomAddress" class="form-row">
        <label class="label-text text-m mb-8"
          >{{ $t('form.step3.uploadPlan') }} <span class="required">*</span></label
        >
        <p class="text-s text-muted mb-12">Upload PDF (maks. 5MB)</p>
        <input
          ref="planFileInput"
          type="file"
          accept=".pdf"
          class="file-input"
          @change="handlePlanFileUpload"
        />
        <p v-if="formData.arrangementPlanDocument" class="text-s mt-8">
          {{ formData.arrangementPlanDocument.name }}
        </p>
        <p v-if="errors.arrangementPlanDocument" class="error-text text-s mt-8">
          {{ errors.arrangementPlanDocument }}
        </p>
      </div>

      <div v-if="formData.arrangementPlanType === 'planner' && !isCustomAddress" class="form-row">
        <div class="planner-placeholder">
          <Icon name="fa7-solid:map" size="48" style="color: #0057b8" />
          <p class="text-m mt-16">{{ $t('form.step3.plannerComingSoon') }}</p>
        </div>
      </div>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <!-- 3.4 Glade naboer - retningslinjer for lyd -->
    <h4 class="heading-m mb-16">{{ $t('form.step3.soundGuidelines') }}</h4>

    <div class="form-grid gap-24 mb-40">
      <div class="form-row">
        <h5 class="heading-s mb-12">
          {{ $t('form.step3.hasSound') }} <span class="required">*</span>
        </h5>
        <RadioGroup
          id="has-sound"
          name="has-sound"
          v-model="formData.hasSound"
          :options="yesNoOptions"
          orientation="vertical"
        />
      </div>

      <div v-if="formData.hasSound === true" class="form-row">
        <Textarea
          id="sound-description"
          v-model="formData.soundDescription"
          :label="$t('form.step3.soundDescription')"
          :error="!!errors.soundDescription"
          :error-message="errors.soundDescription || ''"
          @blur="validateField('soundDescription')"
          placeholder="Beskriv type og lydstyrke (dB)..."
          :rows="3"
        />
      </div>

      <div v-if="formData.hasSound === true" class="form-row two-cols gap-24">
        <div>
          <Input
            id="sound-responsible-name"
            v-model="formData.soundResponsibleName"
            :label="$t('form.step3.soundResponsibleName')"
            :error="!!errors.soundResponsibleName"
            :error-message="errors.soundResponsibleName || ''"
            @blur="validateField('soundResponsibleName')"
            placeholder="Fulde navn"
          />
        </div>
        <div>
          <Input
            id="sound-responsible-phone"
            v-model="formData.soundResponsiblePhone"
            :label="$t('form.step3.soundResponsiblePhone')"
            type="tel"
            :error="!!errors.soundResponsiblePhone"
            :error-message="errors.soundResponsiblePhone || ''"
            @blur="validateField('soundResponsiblePhone')"
            placeholder="Telefonnummer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEventFormStore } from '../../stores/event-form'
import { useI18n } from 'vue-i18n'
import { Input, RadioGroup, DropdownButton, Textarea } from 'fk-designsystem'
import { useStepControls } from '../../composables/useStepControls'
import { safetyInfoSchema, soundInfoSchema } from '~~/shared/schemas/event-info'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const formStore = useEventFormStore()
const stepControls = useStepControls()
const constructionFileInput = ref<HTMLInputElement | null>(null)
const planFileInput = ref<HTMLInputElement | null>(null)

// Form data (v-model bound to store)
const formData = computed(() => formStore.formData.practicalInfo)

// Check if custom address is selected in step 2
const isCustomAddress = computed(() => formStore.formData.eventInfo.locationType === 'custom')

// Validation errors
const errors = reactive({
  simultaneousPersons: '',
  constructionDescription: '',
  constructionCertificate: '',
  br18Acknowledgment: '',
  arrangementPlanType: '',
  arrangementPlanDocument: '',
  soundDescription: '',
  soundResponsibleName: '',
  soundResponsiblePhone: '',
})

// Options
const attendanceOptions = [
  { label: '0-50', value: '0-50' },
  { label: '51-200', value: '51-200' },
  { label: '201-500', value: '201-500' },
  { label: '501-1000', value: '501-1000' },
  { label: '1001-5000', value: '1001-5000' },
  { label: '5001+', value: '5001+' },
]

const yesNoOptions = [
  { label: 'Ja', value: true },
  { label: 'Nej', value: false },
]

const planTypeOptions = [
  { label: 'Jeg vil uploade min egen plan', value: 'upload' },
  { label: 'Jeg vil bruge den indbyggede planner', value: 'planner' },
]

// Methods
const handleConstructionFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      errors.constructionCertificate = 'Filen må ikke være større end 5MB'
      target.value = ''
      return
    }

    if (file.type !== 'application/pdf') {
      errors.constructionCertificate = 'Kun PDF-filer er tilladt'
      target.value = ''
      return
    }

    formStore.formData.practicalInfo.constructionCertificate = file
    errors.constructionCertificate = ''
  }
}

const handlePlanFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      errors.arrangementPlanDocument = 'Filen må ikke være større end 5MB'
      target.value = ''
      return
    }

    if (file.type !== 'application/pdf') {
      errors.arrangementPlanDocument = 'Kun PDF-filer er tilladt'
      target.value = ''
      return
    }

    formStore.formData.practicalInfo.arrangementPlanDocument = file
    errors.arrangementPlanDocument = ''
  }
}

const mapSafetyToSchemaInput = () => {
  const data = formStore.formData.practicalInfo
  const eventInfo = formStore.formData.eventInfo
  
  return {
    eventId: '00000000-0000-0000-0000-000000000000', // Dummy ID
    simultaneousPersonsRange: data.simultaneousPersons,
    hasTemporaryConstructions: data.hasTemporaryConstructions === true,
    constructionsDescription: data.constructionDescription || null,
    constructionsCertificateDocumentId: data.constructionCertificate ? '00000000-0000-0000-0000-000000000000' : null,
    hasReadBR18Bilag11: data.br18Acknowledgment === true,
    otherConsiderations: data.otherConsiderations || null,
    arrangementPlanType: data.arrangementPlanType || null,
    arrangementPlanDocumentId: data.arrangementPlanDocument ? '00000000-0000-0000-0000-000000000000' : null,
    locationType: eventInfo.locationType,
  }
}

const mapSoundToSchemaInput = () => {
  const data = formStore.formData.practicalInfo
  
  return {
    eventId: '00000000-0000-0000-0000-000000000000', // Dummy ID
    hasSound: data.hasSound === true,
    description: data.soundDescription || null,
    responsibleName: data.soundResponsibleName || null,
    responsiblePhone: data.soundResponsiblePhone || null,
  }
}

const validateField = (field: keyof typeof errors) => {
  if (['simultaneousPersons', 'constructionDescription', 'constructionCertificate', 'br18Acknowledgment', 'arrangementPlanType', 'arrangementPlanDocument'].includes(field)) {
    const input = mapSafetyToSchemaInput()
    const result = safetyInfoSchema.safeParse(input)
    
    if (!result.success) {
      const formatted = result.error.format()
      // @ts-expect-error index access
      const fieldError = formatted[field === 'simultaneousPersons' ? 'simultaneousPersonsRange' : field === 'constructionCertificate' ? 'constructionsCertificateDocumentId' : field === 'br18Acknowledgment' ? 'hasReadBR18Bilag11' : field === 'arrangementPlanDocument' ? 'arrangementPlanDocumentId' : field === 'constructionDescription' ? 'constructionsDescription' : field]
      
      if (fieldError && fieldError._errors.length > 0) {
        // @ts-expect-error index access
        errors[field] = t('validation.required') // Simplified error message
      } else {
        // @ts-expect-error index access
        errors[field] = ''
      }
    } else {
      // @ts-expect-error index access
      errors[field] = ''
    }
  } else if (['soundDescription', 'soundResponsibleName', 'soundResponsiblePhone'].includes(field)) {
    const input = mapSoundToSchemaInput()
    const result = soundInfoSchema.safeParse(input)
    
    if (!result.success) {
      const formatted = result.error.format()
      // @ts-expect-error index access
      const fieldError = formatted[field === 'soundDescription' ? 'description' : field === 'soundResponsibleName' ? 'responsibleName' : field === 'soundResponsiblePhone' ? 'responsiblePhone' : field]
      
      if (fieldError && fieldError._errors.length > 0) {
        // @ts-expect-error index access
        errors[field] = field === 'soundResponsiblePhone' ? t('validation.invalidPhone') : t('validation.required')
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
  
  // Safety Info Validation
  const safetyInput = mapSafetyToSchemaInput()
  const safetyResult = safetyInfoSchema.safeParse(safetyInput)
  
  if (!safetyResult.success) {
    isValid = false
    if (!silent) {
      const formatted = safetyResult.error.format()
      
      if (formatted.simultaneousPersonsRange) errors.simultaneousPersons = t('validation.required')
      else errors.simultaneousPersons = ''
        
      if (formatted.constructionsDescription) errors.constructionDescription = t('validation.required')
      else errors.constructionDescription = ''
        
      if (formatted.constructionsCertificateDocumentId) errors.constructionCertificate = t('validation.required')
      else errors.constructionCertificate = ''
        
      if (formatted.hasReadBR18Bilag11) errors.br18Acknowledgment = t('validation.required')
      else errors.br18Acknowledgment = ''
        
      if (formatted.arrangementPlanType) errors.arrangementPlanType = t('validation.required')
      else errors.arrangementPlanType = ''
        
      if (formatted.arrangementPlanDocumentId) errors.arrangementPlanDocument = t('validation.required')
      else errors.arrangementPlanDocument = ''
    }
  } else if (!silent) {
    errors.simultaneousPersons = ''
    errors.constructionDescription = ''
    errors.constructionCertificate = ''
    errors.br18Acknowledgment = ''
    errors.arrangementPlanType = ''
    errors.arrangementPlanDocument = ''
  }
  
  // Sound Info Validation
  const soundInput = mapSoundToSchemaInput()
  const soundResult = soundInfoSchema.safeParse(soundInput)
  
  if (!soundResult.success) {
    isValid = false
    if (!silent) {
      const formatted = soundResult.error.format()
      
      if (formatted.description) errors.soundDescription = t('validation.required')
      else errors.soundDescription = ''
        
      if (formatted.responsibleName) errors.soundResponsibleName = t('validation.required')
      else errors.soundResponsibleName = ''
        
      if (formatted.responsiblePhone) errors.soundResponsiblePhone = t('validation.invalidPhone')
      else errors.soundResponsiblePhone = ''
    }
  } else if (!silent) {
    errors.soundDescription = ''
    errors.soundResponsibleName = ''
    errors.soundResponsiblePhone = ''
  }
  
  return isValid
}

const validateAndProceed = async () => {
  const nextPath = formStore.getStepPath(4)
  if (nextPath) {
    formStore.goToStep(4)
    await router.push(nextPath)
  }

  const isValid = validateForm()
  formStore.markStepCompleted(3, isValid)
}

onMounted(() => {
  formStore.setCurrentStepByPath('/application/practical-safety')
  stepControls.value.onNext = validateAndProceed

  if (isCustomAddress.value) {
    formStore.formData.practicalInfo.arrangementPlanType = 'upload'
  }

  const currentStep = formStore.getCurrentStep
  if (route.query.validate === 'true' || (currentStep?.visited && !currentStep?.valid)) {
    validateForm()
  }
})

onUnmounted(() => {
  if (stepControls.value.onNext === validateAndProceed) {
    stepControls.value.onNext = undefined
  }
})

definePageMeta({
  layout: 'application',
  name: 'PracticalSafety',
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.practical-safety-step {
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

.form-grid {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  flex-direction: column;

  &.two-cols {
    flex-direction: row;
  }
}

.gap-12 {
  gap: $spacing-12;
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

.mt-16 {
  margin-top: $spacing-16;
}

.pt-16 {
  padding-top: $spacing-16;
}

.pb-40 {
  padding-bottom: $spacing-40;
}

.hr {
  height: 1px;
  background-color: $color-grey-300;
  border: none;
}

.label-text {
  font-weight: 600;
  color: $color-text-primary;
  display: block;
}

.dropdown-wrapper {
  width: 100%;
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

.planner-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-48;
  border: 2px dashed #d1d1d1;
  border-radius: 8px;
  background: $color-grey-100;
  min-height: 300px;
}
</style>
