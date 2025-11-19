<template>
  <div class="event-info-step">
    <header class="header mb-24">
      <h1 class="heading-2xl title">
        <span class="title-icon" aria-hidden="true">
          <Icon name="fa7-solid:calendar" size="18" />
        </span>
        {{ $t('form.step2.title') }}
      </h1>
    </header>

    <p class="text-m text-muted mb-24">
      {{ $t('form.step2.subtitle') }}
    </p>

    <!-- 2.1 Tidspunkt for event -->
    <h4 class="heading-m mb-24">{{ $t('form.step2.timing') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div class="form-row two-cols gap-24">
        <div class="datepicker-wrapper">
          <VueDatePicker
            uid="event-start-at"
            v-model="formData.startAt"
            :format="dateFormat"
            :enable-time-picker="true"
            :locale="locale"
            auto-apply
            :clearable="false"
          >
            <template #dp-input="{ value }">
              <Input
                id="event-start-at-input"
                :model-value="value"
                :label="$t('form.step2.startAt')"
                :placeholder="$t('form.step2.startAt')"
                :error="!!errors.startAt"
                :error-message="errors.startAt || ''"
                required
                readonly
              />
            </template>
          </VueDatePicker>
        </div>
        <div class="datepicker-wrapper">
          <VueDatePicker
            uid="event-end-at"
            v-model="formData.endAt"
            :format="dateFormat"
            :enable-time-picker="true"
            :locale="locale"
            auto-apply
            :clearable="false"
          >
            <template #dp-input="{ value }">
              <Input
                id="event-end-at-input"
                :model-value="value"
                :label="$t('form.step2.endAt')"
                :placeholder="$t('form.step2.endAt')"
                :error="!!errors.endAt"
                :error-message="errors.endAt || ''"
                required
                readonly
              />
            </template>
          </VueDatePicker>
        </div>
      </div>
    </div>

    <!-- 2.1 Location -->
    <h4 class="heading-m mb-16">{{ $t('form.step2.location') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div class="form-row">
        <Checkbox
          id="event-custom-address"
          v-model="isCustomAddress"
          :label="$t('form.step2.customAddress')"
        />
      </div>

      <div v-if="isCustomAddress" class="form-row">
        <Input
          id="event-location-address"
          v-model="formData.locationAddress"
          :label="$t('form.step2.addressInput')"
          :error="!!errors.locationAddress"
          :error-message="errors.locationAddress || ''"
          @blur="validateField('locationAddress')"
          placeholder="Indtast adresse..."
        />
      </div>

      <div v-else class="form-row">
        <div class="dropdown-wrapper">
          <label class="label-text text-m mb-8"
            >{{ $t('form.step2.presetLocation') }} <span class="required">*</span></label
          >
          <DropdownButton
            v-model="formData.locationPresetId"
            :options="locationOptions"
            button-label="Vælg sted..."
            width="100%"
          />
          <p v-if="errors.locationPresetId" class="error-text text-s mt-8">
            {{ errors.locationPresetId }}
          </p>
        </div>
      </div>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <!-- 2.2 Type af event -->
    <h4 class="heading-m mb-16">{{ $t('form.step2.eventTypes') }}</h4>
    <p class="text-s text-muted mb-16">{{ $t('form.step2.eventTypesHint') }}</p>

    <div class="form-row mb-24">
      <div class="badge-grid">
        <Badge
          v-for="eventType in eventTypeOptions"
          :key="eventType.value"
          :label="eventType.label"
          :variant="formData.typeTagCodes.includes(eventType.value) ? 'brand' : 'neutral'"
          size="medium"
          class="badge-selectable"
          @click="toggleEventType(eventType.value)"
        />
      </div>
      <p v-if="errors.typeTagCodes" class="error-text text-s mt-8">{{ errors.typeTagCodes }}</p>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <!-- 2.3 Om arrangementet -->
    <h4 class="heading-m mb-24">{{ $t('form.step2.aboutEvent') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div class="form-row">
        <Input
          id="event-title"
          v-model="formData.title"
          :label="$t('form.step2.eventTitle')"
          :error="!!errors.title"
          :error-message="errors.title || ''"
          @blur="validateField('title')"
          placeholder="F.eks. Sommerfest 2025"
        />
      </div>

      <div class="form-row">
        <Textarea
          id="event-purpose"
          v-model="formData.purpose"
          :label="$t('form.step2.purpose')"
          :error="!!errors.purpose"
          :error-message="errors.purpose || ''"
          @blur="validateField('purpose')"
          placeholder="Beskriv formålet med arrangementet..."
          :rows="4"
        />
      </div>

      <div class="form-row">
        <div class="dropdown-wrapper">
          <label class="label-text text-m mb-8"
            >{{ $t('form.step2.expectedAttendance') }} <span class="required">*</span></label
          >
          <DropdownButton
            v-model="formData.attendanceRange"
            :options="attendanceOptions"
            button-label="Vælg antal..."
          />
          <p v-if="errors.attendanceRange" class="error-text text-s mt-8">
            {{ errors.attendanceRange }}
          </p>
        </div>
      </div>

      <div class="form-row">
        <label class="label-text text-m mb-8">{{ $t('form.step2.relevantInfo') }}</label>
        <p class="text-s text-muted mb-12">Upload PDF (maks. 5MB)</p>
        <input
          ref="fileInput"
          type="file"
          accept=".pdf"
          class="file-input"
          @change="handleFileUpload"
        />
        <p v-if="formData.relevantInfoDocuments.length > 0" class="text-s mt-8">
          {{ formData.relevantInfoDocuments[0].name }}
        </p>
        <p v-if="errors.relevantInfoDocuments" class="error-text text-s mt-8">
          {{ errors.relevantInfoDocuments }}
        </p>
      </div>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <!-- 2.4 Tidspunkt for opsætning og nedtagning -->
    <h4 class="heading-m mb-24">{{ $t('form.step2.setupTeardown') }}</h4>

    <div class="form-grid gap-24 mb-24">
      <div class="form-row two-cols gap-24">
        <div class="datepicker-wrapper">
          <VueDatePicker
            uid="setup-start-at"
            v-model="formData.setupStartAt"
            :format="dateFormat"
            :enable-time-picker="true"
            :locale="locale"
            auto-apply
            :clearable="false"
          >
            <template #dp-input="{ value }">
              <Input
                id="setup-start-at-input"
                :model-value="value"
                :label="$t('form.step2.setupStart')"
                :placeholder="$t('form.step2.setupStart')"
                :error="!!errors.setupStartAt"
                :error-message="errors.setupStartAt || ''"
                required
                readonly
              />
            </template>
          </VueDatePicker>
        </div>
        <div class="datepicker-wrapper">
          <VueDatePicker
            uid="setup-end-at"
            v-model="formData.setupEndAt"
            :format="dateFormat"
            :enable-time-picker="true"
            :locale="locale"
            auto-apply
            :clearable="false"
          >
            <template #dp-input="{ value }">
              <Input
                id="setup-end-at-input"
                :model-value="value"
                :label="$t('form.step2.setupEnd')"
                :placeholder="$t('form.step2.setupEnd')"
                :error="!!errors.setupEndAt"
                :error-message="errors.setupEndAt || ''"
                required
                readonly
              />
            </template>
          </VueDatePicker>
        </div>
      </div>
    </div>

    <div class="pt-16 pb-40">
      <div class="hr"></div>
    </div>

    <!-- 2.5 Er eventet tilbagevendende? -->
    <h4 class="heading-m mb-16">{{ $t('form.step2.recurring') }}</h4>

    <div class="form-grid gap-24 mb-40">
      <div class="form-row">
        <RadioGroup
          id="event-is-recurring"
          name="event-is-recurring"
          v-model="formData.isRecurring"
          :options="yesNoOptions"
          orientation="vertical"
        />
      </div>

      <div v-if="formData.isRecurring === true" class="form-row">
        <div class="dropdown-wrapper">
          <label class="label-text text-m mb-8"
            >{{ $t('form.step2.recurringInterval') }} <span class="required">*</span></label
          >
          <DropdownButton
            v-model="formData.recurringInterval"
            :options="recurringOptions"
            button-label="Vælg interval..."
          />
          <p v-if="errors.recurringInterval" class="error-text text-s mt-8">
            {{ errors.recurringInterval }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEventFormStore } from '../../stores/event-form'
import { Input, RadioGroup, DropdownButton, Checkbox, Textarea, Badge } from 'fk-designsystem'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { da } from 'date-fns/locale'
import { createEventSchema } from '../../shared-schemas/event-schema-adapter'
import { useStepControls } from '../../composables/useStepControls'
const router = useRouter()
const route = useRoute()
const formStore = useEventFormStore()
const stepControls = useStepControls()
const fileInput = ref<HTMLInputElement | null>(null)

// Date formatting and locale
const locale = da
const dateFormat = 'dd/MM-yyyy - HH:mm'

// Form data (v-model bound to store)
const formData = computed(() => formStore.formData.eventInfo)

// Custom address checkbox
const isCustomAddress = computed({
  get: () => formStore.formData.eventInfo.locationType === 'custom',
  set: (value: boolean) => {
    formStore.formData.eventInfo.locationType = value ? 'custom' : 'predefined'
    // Clear the other location field
    if (value) {
      formStore.formData.eventInfo.locationPresetId = null
    } else {
      formStore.formData.eventInfo.locationAddress = null
    }
  },
})

// Validation errors
const errors = reactive({
  title: null as string | null,
  purpose: null as string | null,
  startAt: null as string | null,
  endAt: null as string | null,
  locationType: null as string | null,
  locationPresetId: null as string | null,
  locationAddress: null as string | null,
  attendanceRange: null as string | null,
  setupStartAt: null as string | null,
  setupEndAt: null as string | null,
  isRecurring: null as string | null,
  recurringInterval: null as string | null,
  typeTagCodes: null as string | null,
  relevantInfoDocuments: '' as string | null,
})

// Options
const locationOptions = [
  { label: 'Frederiksberg Have', value: 'frederiksberg-have' },
  { label: 'Smallegade', value: 'smallegade' },
  { label: 'Søndre Fasanvej', value: 'sondre-fasanvej' },
  { label: 'Falkoner Plads', value: 'falkoner-plads' },
]

const eventTypeOptions = [
  { label: 'Festival', value: 'festival' },
  { label: 'Cirkus', value: 'cirkus' },
  { label: 'Motionsløb/cykelløb', value: 'motion-race' },
  { label: 'Koncert', value: 'koncert' },
  { label: 'Mad- og loppemarked', value: 'food-flea-market' },
  { label: 'Vejfest', value: 'street-party' },
  { label: 'Filmoptagelse', value: 'film-recording' },
  { label: 'Optræden', value: 'performance' },
  { label: 'Sport', value: 'sport' },
  { label: 'Udstilling', value: 'exhibition' },
  { label: 'Andet', value: 'other' },
]

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

const recurringOptions = [
  { label: 'Dagligt', value: 'daily' },
  { label: 'Ugentligt', value: 'weekly' },
  { label: 'Månedligt', value: 'monthly' },
]

const mapFormToSchemaInput = () => {
  const data = formStore.formData.eventInfo

  return {
    title: data.title,
    purpose: data.purpose,
    expectedAttendanceRange: data.attendanceRange,
    commercial: formStore.formData.contactInfo.isCommercial === true,
    contactPersonName: formStore.formData.contactInfo.contactPerson.fullName,
    contactPersonPhone: formStore.formData.contactInfo.contactPerson.phone,
    recurring: data.isRecurring === true,
    recurringInterval: data.isRecurring ? data.recurringInterval : null,
    startAt: data.startAt,
    endAt: data.endAt,
    setupStartAt: data.setupStartAt,
    setupEndAt: data.setupEndAt,
    locationType: data.locationType ?? 'predefined',
    locationAddress: data.locationAddress ?? undefined,
    locationPresetId: data.locationPresetId ?? undefined,
    typeTagCodes: data.typeTagCodes,
  }
}

const validateField = (field: keyof typeof errors) => {
  const input = mapFormToSchemaInput()
  const result = createEventSchema.safeParse(input)

  if (!result.success) {
    const formatted = result.error.format()
    // @ts-expect-error index access
    const fieldError = formatted[field]
    if (fieldError && fieldError._errors.length > 0) {
      // @ts-expect-error index access
      errors[field] = fieldError._errors[0]
    } else {
      // @ts-expect-error index access
      errors[field] = null
    }
  } else {
    // @ts-expect-error index access
    errors[field] = null
  }
}

const applyValidationErrors = (issues: { path: (string | number)[]; message: string }[]) => {
  Object.keys(errors).forEach((key) => {
    // @ts-expect-error index
    errors[key] = null
  })

  for (const issue of issues) {
    const field = issue.path[0]
    if (!field) continue

    switch (field) {
      case 'startAt':
        errors.startAt = issue.message
        break
      case 'endAt':
        errors.endAt = issue.message
        break
      case 'locationAddress':
        errors.locationAddress = issue.message
        break
      case 'locationPresetId':
        errors.locationPresetId = issue.message
        break
      case 'typeTagCodes':
        errors.typeTagCodes = issue.message
        break
      case 'title':
        errors.title = issue.message
        break
      case 'purpose':
        errors.purpose = issue.message
        break
      case 'expectedAttendanceRange':
        errors.attendanceRange = issue.message
        break
      case 'setupStartAt':
        errors.setupStartAt = issue.message
        break
      case 'setupEndAt':
        errors.setupEndAt = issue.message
        break
      case 'recurringInterval':
        errors.recurringInterval = issue.message
        break
      default:
        break
    }
  }
}

const validateForm = (silent = false) => {
  try {
    const input = mapFormToSchemaInput()
    createEventSchema.parse(input)
    // Clear errors if valid
    if (!silent) {
      Object.keys(errors).forEach((key) => {
        // @ts-expect-error index
        errors[key] = null
      })
    }
    return true
  } catch (error: any) {
    if (!silent && error?.issues) {
      applyValidationErrors(error.issues)
    }
    return false
  }
}

const validateAndProceed = async () => {
  const isValid = validateForm(true)
  formStore.markStepCompleted(2, isValid)

  const nextPath = formStore.getStepPath(3)
  if (nextPath) {
    formStore.goToStep(3)
    await router.push(nextPath)
  }
}

// Methods
const toggleEventType = (typeCode: string) => {
  const index = formStore.formData.eventInfo.typeTagCodes.indexOf(typeCode)
  if (index > -1) {
    formStore.formData.eventInfo.typeTagCodes.splice(index, 1)
  } else {
    formStore.formData.eventInfo.typeTagCodes.push(typeCode)
  }
  errors.typeTagCodes = ''
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      errors.relevantInfoDocuments = 'Filen må ikke være større end 5MB'
      target.value = ''
      return
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      errors.relevantInfoDocuments = 'Kun PDF-filer er tilladt'
      target.value = ''
      return
    }

    formStore.formData.eventInfo.relevantInfoDocuments = [file]
    errors.relevantInfoDocuments = ''
  }
}

onMounted(() => {
  formStore.setCurrentStepByPath('/application/event-info')
  stepControls.value.onNext = validateAndProceed

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
  name: 'EventInfo',
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.event-info-step {
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

.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-12;
}

.badge-selectable {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}

.datepicker-wrapper {
  width: 100%;
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
  padding: 12px;
  border: 2px dashed #d1d1d1;
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
