<template>
  <div class="summary-step">
    <header class="header mb-24">
      <h1 class="heading-2xl title">
        <span class="title-icon" aria-hidden="true">
          <Icon name="fa7-solid:check-circle" size="18" />
        </span>
        {{ $t('form.step5.title') }}
      </h1>
    </header>

    <p class="text-m text-muted mb-24">
      {{ $t('form.step5.subtitle') }}
    </p>

    <div v-if="submissionStatus !== 'idle'" class="status-banner mb-24" :class="submissionStatus === 'success' ? 'status-success' : 'status-error'">
      <Icon
        :name="submissionStatus === 'success' ? 'fa7-solid:circle-check' : 'fa7-solid:circle-exclamation'"
        size="18"
      />
      <span>
        {{ submissionStatus === 'success' ? $t('form.step5.submitSuccess') : $t('form.step5.submitError') }}
      </span>
    </div>

    <!-- Progress indicator -->
    <div class="progress-card mb-24">
      <div class="progress-header">
        <h3 class="heading-m">{{ $t('form.step5.completionProgress') }}</h3>
        <span class="progress-percent heading-l">{{ completionPercentage }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${completionPercentage}%` }"></div>
      </div>
      <p v-if="completionPercentage < 100" class="text-s text-muted mt-12">
        {{ $t('form.step5.incompleteWarning') }}
      </p>
    </div>

    <!-- Step 1: Kontaktoplysninger -->
    <div class="summary-card mb-24">
      <div class="card-header">
        <h3 class="heading-m">1. {{ $t('form.step5.contactInfoSummary') }}</h3>
        <button type="button" class="edit-button" @click="goToStep(1)">
          <Icon name="fa7-solid:pen" size="14" />
          {{ $t('form.step5.editStep') }}
        </button>
      </div>
      <div class="card-content">
        <div class="field-row">
          <span class="field-label">CVR/CPR nummer:</span>
          <span class="field-value">{{ formData.contactInfo.cvrCpr || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Fulde navn:</span>
          <span class="field-value">{{ formData.contactInfo.fullName || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Telefon:</span>
          <span class="field-value">{{ formData.contactInfo.phone || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Email:</span>
          <span class="field-value">{{ formData.contactInfo.email || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Kommercielt arrangement:</span>
          <span class="field-value">{{ formData.contactInfo.isCommercial === true ? 'Ja' : formData.contactInfo.isCommercial === false ? 'Nej' : '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Kontaktperson navn:</span>
          <span class="field-value">{{ formData.contactInfo.contactPerson.fullName || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Kontaktperson telefon:</span>
          <span class="field-value">{{ formData.contactInfo.contactPerson.phone || '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Eventoplysninger -->
    <div class="summary-card mb-24">
      <div class="card-header">
        <h3 class="heading-m">2. {{ $t('form.step5.eventInfoSummary') }}</h3>
        <button type="button" class="edit-button" @click="goToStep(2)">
          <Icon name="fa7-solid:pen" size="14" />
          {{ $t('form.step5.editStep') }}
        </button>
      </div>
      <div class="card-content">
        <div class="field-row">
          <span class="field-label">Start dato og tid:</span>
          <span class="field-value">{{ formatDateTime(formData.eventInfo.startAt) }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Slut dato og tid:</span>
          <span class="field-value">{{ formatDateTime(formData.eventInfo.endAt) }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Lokation:</span>
          <span class="field-value">{{ formData.eventInfo.locationType === 'custom' ? formData.eventInfo.locationAddress : formData.eventInfo.locationPresetId || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Event typer:</span>
          <span class="field-value">{{ formData.eventInfo.typeTagCodes.length > 0 ? formData.eventInfo.typeTagCodes.join(', ') : '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Titel:</span>
          <span class="field-value">{{ formData.eventInfo.title || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Formål:</span>
          <span class="field-value">{{ formData.eventInfo.purpose || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Forventet deltagere:</span>
          <span class="field-value">{{ formData.eventInfo.attendanceRange || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Opsætning start:</span>
          <span class="field-value">{{ formatDateTime(formData.eventInfo.setupStartAt) }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Opsætning slut:</span>
          <span class="field-value">{{ formatDateTime(formData.eventInfo.setupEndAt) }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Tilbagevendende:</span>
          <span class="field-value">{{ formData.eventInfo.isRecurring === true ? `Ja (${formData.eventInfo.recurringInterval || 'ikke angivet'})` : 'Nej' }}</span>
        </div>
      </div>
    </div>

    <!-- Step 3: Praktiske forhold og sikkerhed -->
    <div class="summary-card mb-24">
      <div class="card-header">
        <h3 class="heading-m">3. {{ $t('form.step5.practicalSafetySummary') }}</h3>
        <button type="button" class="edit-button" @click="goToStep(3)">
          <Icon name="fa7-solid:pen" size="14" />
          {{ $t('form.step5.editStep') }}
        </button>
      </div>
      <div class="card-content">
        <div class="field-row">
          <span class="field-label">Personer samtidigt:</span>
          <span class="field-value">{{ formData.practicalInfo.simultaneousPersons || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Midlertidige konstruktioner:</span>
          <span class="field-value">{{ formData.practicalInfo.hasTemporaryConstructions === true ? 'Ja' : formData.practicalInfo.hasTemporaryConstructions === false ? 'Nej' : '—' }}</span>
        </div>
        <div v-if="formData.practicalInfo.hasTemporaryConstructions" class="field-row">
          <span class="field-label">Konstruktionsbeskrivelse:</span>
          <span class="field-value">{{ formData.practicalInfo.constructionDescription || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">BR18 bekræftelse:</span>
          <span class="field-value">{{ formData.practicalInfo.br18Acknowledgment === true ? 'Ja' : formData.practicalInfo.br18Acknowledgment === false ? 'Nej' : '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Arrangementsplan:</span>
          <span class="field-value">{{ formData.practicalInfo.arrangementPlanType === 'upload' ? 'Upload' : formData.practicalInfo.arrangementPlanType === 'planner' ? 'Planner' : '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Lyd fra højtalere:</span>
          <span class="field-value">{{ formData.practicalInfo.hasSound === true ? 'Ja' : formData.practicalInfo.hasSound === false ? 'Nej' : '—' }}</span>
        </div>
        <div v-if="formData.practicalInfo.hasSound" class="field-row">
          <span class="field-label">Lydansvarlig:</span>
          <span class="field-value">{{ formData.practicalInfo.soundResponsibleName || '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Step 4: Tilladelser og drift -->
    <div class="summary-card mb-40">
      <div class="card-header">
        <h3 class="heading-m">4. {{ $t('form.step5.permitsOperationsSummary') }}</h3>
        <button type="button" class="edit-button" @click="goToStep(4)">
          <Icon name="fa7-solid:pen" size="14" />
          {{ $t('form.step5.editStep') }}
        </button>
      </div>
      <div class="card-content">
        <div class="field-row">
          <span class="field-label">Afspærring:</span>
          <span class="field-value">{{ formData.permitsInfo.needsBlockage === true ? 'Ja' : formData.permitsInfo.needsBlockage === false ? 'Nej' : '—' }}</span>
        </div>
        <div v-if="formData.permitsInfo.needsBlockage" class="field-row">
          <span class="field-label">Afspærringsbeskrivelse:</span>
          <span class="field-value">{{ formData.permitsInfo.blockageDescription || '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Politigodkendelse:</span>
          <span class="field-value">{{ formData.permitsInfo.hasPolicePermission === true ? 'Ja' : formData.permitsInfo.hasPolicePermission === false ? 'Nej' : '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Affaldshåndtering:</span>
          <span class="field-value">{{ formData.permitsInfo.hasWasteHandling === true ? 'Ja' : formData.permitsInfo.hasWasteHandling === false ? 'Nej' : '—' }}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Mad og drikkevarer:</span>
          <span class="field-value">{{ formData.permitsInfo.hasFoodDrinks === true ? 'Ja' : formData.permitsInfo.hasFoodDrinks === false ? 'Nej' : '—' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useEventFormStore } from '../../stores/event-form'
import { useRouter } from 'vue-router'
import { useStepControls } from '../../composables/useStepControls'
const formStore = useEventFormStore()
const router = useRouter()
const stepControls = useStepControls()
const submissionStatus = ref<'idle' | 'success' | 'error'>('idle')
const isSubmitting = ref(false)

// Form data
const formData = computed(() => formStore.formData)

// Completion percentage
const completionPercentage = computed(() => formStore.getCompletionPercentage)

// Methods
const goToStep = async (stepNumber: number) => {
  const targetPath = formStore.getStepPath(stepNumber)
  if (!targetPath) return
  formStore.goToStep(stepNumber)
  await router.push(targetPath)
}

const formatDateTime = (date: Date | null): string => {
  if (!date) return '—'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}-${year} - ${hours}:${minutes}`
}

const handleSubmit = async () => {
  if (isSubmitting.value || !formStore.canSubmit) {
    return
  }

  try {
    isSubmitting.value = true
    const result = await formStore.submitEvent()
    submissionStatus.value = result.success ? 'success' : 'error'
    formStore.markStepCompleted(5, result.success)
  }
  catch (error) {
    console.error('Failed to submit event form:', error)
    submissionStatus.value = 'error'
  }
  finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  formStore.setCurrentStepByPath('/application/summary')
  stepControls.value.onSubmit = handleSubmit
})

onUnmounted(() => {
  stepControls.value.onSubmit = undefined
})

definePageMeta({
  layout: 'application',
  name: 'ApplicationSummary',
})
</script>

<style scoped lang="scss">
.summary-step {
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

.mb-12 {
  margin-bottom: 12px;
}

.mb-24 {
  margin-bottom: 24px;
}

.mb-40 {
  margin-bottom: 40px;
}

.mt-12 {
  margin-top: 12px;
}

.progress-card {
  padding: 24px;
  background: #f0f7ff;
  border: 2px solid #0057B8;
  border-radius: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-percent {
  color: #0057B8;
  font-weight: 700;
}

.progress-bar {
  height: 12px;
  background: #e5e5e5;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0057B8 0%, #0070dd 100%);
  transition: width 0.3s ease;
  border-radius: 6px;
}

.summary-card {
  padding: 24px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.status-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
}

.status-success {
  background: #ebf7ed;
  color: #137333;
}

.status-error {
  background: #fdecea;
  color: #b3261e;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #0057B8;
  border-radius: 6px;
  background: white;
  color: #0057B8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f7ff;
  }

  &:active {
    background: #e0f0ff;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.field-value {
  font-size: 14px;
  color: #333;
  word-break: break-word;
}
</style>
