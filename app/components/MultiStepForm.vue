<template>
  <div class="multi-step-form">
    <!-- Progress indicator -->
    <div v-if="formStore.steps" class="progress-bar-container">
      <div class="progress-steps">
        <div
          v-for="step in formStore.steps"
          :key="step.id"
          class="progress-step"
          :class="{
            active: step.id === formStore.currentStep,
            completed: step.completed,
          }"
          @click="formStore.goToStep(step.id)"
        >
          <div class="step-number">
            <span v-if="step.completed">✓</span>
            <span v-else>{{ step.id }}</span>
          </div>
          <div class="step-title">{{ step.title }}</div>
        </div>
      </div>
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          :style="{ width: `${formStore.getCompletionPercentage}%` }"
        />
      </div>
    </div>

    <!-- Form content -->
    <div class="form-content">
      <slot />
    </div>

    <!-- Navigation buttons -->
    <div class="form-navigation">
      <button
        v-if="!formStore.isFirstStep"
        type="button"
        class="btn btn-secondary"
        @click="handlePrevious"
      >
        {{ t('common.previous') }}
      </button>

      <button
        v-if="!formStore.isLastStep"
        type="button"
        class="btn btn-secondary"
        @click="handleSaveDraft"
      >
        {{ t('form.saveDraft') }}
      </button>

      <button
        v-if="!formStore.isLastStep"
        type="button"
        class="btn btn-primary"
        @click="handleNext"
      >
        {{ t('common.next') }}
      </button>

      <button
        v-if="formStore.isLastStep"
        type="button"
        class="btn btn-primary"
        :disabled="!formStore.canSubmit"
        @click="handleSubmit"
      >
        {{ t('common.submit') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventFormStore } from '../stores/event-form'

const { t } = useI18n()
const formStore = useEventFormStore()
const router = useRouter()

const emit = defineEmits(['next', 'previous', 'saveDraft', 'submit'])

const handleNext = () => {
  emit('next')
}

const handlePrevious = () => {
  formStore.previousStep()
  emit('previous')
}

const handleSaveDraft = async () => {
  emit('saveDraft')
  await formStore.saveDraft()
}

const handleSubmit = async () => {
  emit('submit')
  const result = await formStore.submitEvent()
  if (result.success) {
    await router.push(`/bekræftelse/${result.eventId}`)
  }
}
</script>

<style scoped>
.multi-step-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.progress-bar-container {
  margin-bottom: 3rem;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-200);
  color: var(--color-gray-600);
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background-color: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.progress-step.completed .step-number {
  background-color: var(--color-success);
  color: white;
}

.step-title {
  font-size: 0.875rem;
  text-align: center;
  color: var(--color-gray-600);
  max-width: 120px;
}

.progress-step.active .step-title {
  color: var(--color-primary);
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background-color: var(--color-gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.form-content {
  min-height: 400px;
  margin-bottom: 2rem;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-gray-200);
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
}

.btn-secondary:hover {
  background-color: var(--color-gray-300);
}
</style>
