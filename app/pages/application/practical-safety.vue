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
          <label class="label-text text-m mb-8">{{ $t('form.step3.simultaneousPersons') }} <span class="required">*</span></label>
          <DropdownButton
            v-model="formData.simultaneousPersons"
            :options="attendanceOptions"
            button-label="Vælg antal..."
          />
          <p v-if="errors.simultaneousPersons" class="error-text text-s mt-8">{{ errors.simultaneousPersons }}</p>
        </div>
      </div>

      <div class="form-row">
        <h5 class="heading-s mb-12">{{ $t('form.step3.hasConstructions') }} <span class="required">*</span></h5>
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
          :error="errors.constructionDescription"
          required
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
        <p v-if="errors.constructionCertificate" class="error-text text-s mt-8">{{ errors.constructionCertificate }}</p>
      </div>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <!-- 3.2 Andre opmærksomhedspunkter -->
    <h4 class="heading-m mb-16">{{ $t('form.step3.otherConsiderations') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div class="form-row">
        <h5 class="heading-s mb-12">{{ $t('form.step3.br18Acknowledgment') }} <span class="required">*</span></h5>
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
        <p v-if="errors.br18Acknowledgment" class="error-text text-s mt-8">{{ errors.br18Acknowledgment }}</p>
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
        <h5 class="heading-s mb-12">{{ $t('form.step3.planChoice') }} <span class="required">*</span></h5>
        <RadioGroup
          id="arrangement-plan-type"
          name="arrangement-plan-type"
          v-model="formData.arrangementPlanType"
          :options="planTypeOptions"
          orientation="vertical"
        />
        <p v-if="errors.arrangementPlanType" class="error-text text-s mt-8">{{ errors.arrangementPlanType }}</p>
      </div>

      <div v-if="formData.arrangementPlanType === 'upload' || isCustomAddress" class="form-row">
        <label class="label-text text-m mb-8">{{ $t('form.step3.uploadPlan') }} <span class="required">*</span></label>
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
        <p v-if="errors.arrangementPlanDocument" class="error-text text-s mt-8">{{ errors.arrangementPlanDocument }}</p>
      </div>

      <div v-if="formData.arrangementPlanType === 'planner' && !isCustomAddress" class="form-row">
        <div class="planner-placeholder">
          <Icon name="fa7-solid:map" size="48" style="color: #0057B8;" />
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
        <h5 class="heading-s mb-12">{{ $t('form.step3.hasSound') }} <span class="required">*</span></h5>
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
          :error="errors.soundDescription"
          required
          placeholder="Beskriv type og lydstyrke (dB)..."
          :rows="3"
        />
      </div>

      <div v-if="formData.hasSound === true" class="form-row two-cols gap-24">
        <Input
          id="sound-responsible-name"
          v-model="formData.soundResponsibleName"
          :label="$t('form.step3.soundResponsibleName')"
          :error="errors.soundResponsibleName"
          required
          placeholder="Fulde navn"
        />
        <Input
          id="sound-responsible-phone"
          v-model="formData.soundResponsiblePhone"
          :label="$t('form.step3.soundResponsiblePhone')"
          type="tel"
          :error="errors.soundResponsiblePhone"
          required
          placeholder="Telefonnummer"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEventFormStore } from '../../stores/event-form'
import { useI18n } from 'vue-i18n'
import { Input, RadioGroup, DropdownButton, Textarea } from 'fk-designsystem'
import { useStepControls } from '../../composables/useStepControls'

const { t } = useI18n()
const router = useRouter()
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

const validateAndProceed = async () => {
  let isValid = true

  if (!formData.value.simultaneousPersons) {
    errors.simultaneousPersons = t('validation.required')
    isValid = false
  } else {
    errors.simultaneousPersons = ''
  }

  if (formData.value.hasTemporaryConstructions === null) {
    errors.constructionDescription = t('validation.required')
    isValid = false
  } else if (formData.value.hasTemporaryConstructions) {
    if (!formData.value.constructionDescription) {
      errors.constructionDescription = t('validation.required')
      isValid = false
    } else {
      errors.constructionDescription = ''
    }

    if (!formData.value.constructionCertificate) {
      errors.constructionCertificate = t('validation.required')
      isValid = false
    } else {
      errors.constructionCertificate = ''
    }
  } else {
    errors.constructionDescription = ''
    errors.constructionCertificate = ''
  }

  if (formData.value.br18Acknowledgment !== true) {
    errors.br18Acknowledgment = t('validation.required')
    isValid = false
  } else {
    errors.br18Acknowledgment = ''
  }

  if (!isCustomAddress.value) {
    if (!formData.value.arrangementPlanType) {
      errors.arrangementPlanType = t('validation.required')
      isValid = false
    } else {
      errors.arrangementPlanType = ''
    }
  }

  const needsUpload = isCustomAddress.value || formData.value.arrangementPlanType === 'upload'
  if (needsUpload && !formData.value.arrangementPlanDocument) {
    errors.arrangementPlanDocument = t('validation.required')
    isValid = false
  } else {
    errors.arrangementPlanDocument = ''
  }

  if (formData.value.hasSound === null) {
    errors.soundDescription = t('validation.required')
    isValid = false
  } else if (formData.value.hasSound) {
    if (!formData.value.soundDescription) {
      errors.soundDescription = t('validation.required')
      isValid = false
    } else {
      errors.soundDescription = ''
    }

    if (!formData.value.soundResponsibleName) {
      errors.soundResponsibleName = t('validation.required')
      isValid = false
    } else {
      errors.soundResponsibleName = ''
    }

    if (
      !formData.value.soundResponsiblePhone ||
      !/^\d{8}$/.test(formData.value.soundResponsiblePhone.replace(/\s/g, ''))
    ) {
      errors.soundResponsiblePhone = t('validation.invalidPhone')
      isValid = false
    } else {
      errors.soundResponsiblePhone = ''
    }
  } else {
    errors.soundDescription = ''
    errors.soundResponsibleName = ''
    errors.soundResponsiblePhone = ''
  }

  formStore.markStepCompleted(3, isValid)

  if (!isValid) {
    return
  }

  const nextPath = formStore.getStepPath(4)
  if (nextPath) {
    formStore.goToStep(4)
    await router.push(nextPath)
  }
}

onMounted(() => {
  formStore.setCurrentStepByPath('/application/practical-safety')
  stepControls.value.onNext = validateAndProceed

  if (isCustomAddress.value) {
    formStore.formData.practicalInfo.arrangementPlanType = 'upload'
  }
})

onUnmounted(() => {
  stepControls.value.onNext = undefined
})

definePageMeta({
  layout: 'application',
  name: 'PracticalSafety',
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
.practical-safety-step {
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
  gap: 12px;
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

.mt-16 {
  margin-top: 16px;
}

.pt-16 {
  padding-top: 16px;
}

.pb-40 {
  padding-bottom: 40px;
}

.hr {
  height: 1px;
  background-color: #e5e5e5;
  border: none;
}

.label-text {
  font-weight: 600;
  color: #333;
  display: block;
}

.dropdown-wrapper {
  width: 100%;
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

.planner-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  border: 2px dashed #d1d1d1;
  border-radius: 8px;
  background: #fafafa;
  min-height: 300px;
}
</style>
