import { defineStore } from 'pinia'
import type { EventFormData, FormStep, StepKey } from '../types/event-form'

export const useEventFormStore = defineStore('eventForm', {
  state: () => ({
    currentStep: 1,
    eventId: null as string | null,
    isDraft: true,
    formData: {
      contactInfo: {
        cvrCpr: '',
        fullName: '',
        phone: '',
        email: '',
        isCommercial: null,
        contactPerson: {
          fullName: '',
          phone: '',
        },
      },
      eventInfo: {
        startAt: null,
        endAt: null,
        locationType: null,
        locationPresetId: null,
        locationAddress: null,
        typeTagCodes: [],
        title: '',
        purpose: '',
        attendanceRange: null,
        setupStartAt: null,
        setupEndAt: null,
        isRecurring: null,
        recurringInterval: null,
        relevantInfoDocuments: [],
      },
      practicalInfo: {
        simultaneousPersons: null,
        hasTemporaryConstructions: null,
        constructionDescription: '',
        constructionCertificate: null,
        br18Acknowledgment: null,
        otherConsiderations: '',
        arrangementPlanType: null,
        arrangementPlanDocument: null,
        hasSound: null,
        soundDescription: '',
        soundResponsibleName: '',
        soundResponsiblePhone: '',
      },
      permitsInfo: {
        needsBlockage: null,
        blockageDescription: '',
        hasPolicePermission: null,
        policePermissionDocument: null,
        hasWasteHandling: null,
        wasteDescription: '',
        hasFoodDrinks: null,
        foodDescription: '',
      },
    } as EventFormData,
    steps: [
      {
        id: 1,
        key: 'contact-info',
        title: 'Kontaktoplysninger',
        path: '/application/contact-info',
        completed: false,
        valid: false,
      },
      {
        id: 2,
        key: 'event-info',
        title: 'Eventoplysninger',
        path: '/application/event-info',
        completed: false,
        valid: false,
      },
      {
        id: 3,
        key: 'practical-safety',
        title: 'Praktiske forhold og sikkerhed',
        path: '/application/practical-safety',
        completed: false,
        valid: false,
      },
      {
        id: 4,
        key: 'permits-operations',
        title: 'Tilladelser og drift',
        path: '/application/permits-operations',
        completed: false,
        valid: false,
      },
      {
        id: 5,
        key: 'summary',
        title: 'Opsummering og bekræftelse',
        path: '/application/summary',
        completed: false,
        valid: false,
      },
    ] as FormStep[],
  }),

  getters: {
    getCurrentStep: (state) => state.steps.find((s: FormStep) => s.id === state.currentStep),
    getStepByKey: (state) => (key: StepKey) => state.steps.find((s: FormStep) => s.key === key),
    getCompletionPercentage: (state) => {
      const completedSteps = state.steps.filter((s: FormStep) => s.completed).length
      return Math.round((completedSteps / (state.steps.length - 1)) * 100) // Exclude summary step
    },
    isLastStep: (state) => state.currentStep === state.steps.length,
    isFirstStep: (state) => state.currentStep === 1,
    canSubmit: (state) => {
      // All steps except summary must be valid
      return state.steps.slice(0, -1).every((s: FormStep) => s.valid)
    },
  },

  actions: {
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    goToStep(stepId: number) {
      if (stepId >= 1 && stepId <= this.steps.length) {
        this.currentStep = stepId
      }
    },

    markStepCompleted(stepId: number, isValid: boolean) {
      const step = this.steps.find((s: FormStep) => s.id === stepId)
      if (step) {
        step.completed = isValid
        step.valid = isValid
      }
    },

    setCurrentStepByPath(path: string) {
      const step = this.steps.find((s: FormStep) => s.path === path)
      if (step) {
        this.currentStep = step.id
      }
    },

    getStepPath(stepId: number) {
      const step = this.steps.find((s: FormStep) => s.id === stepId)
      return step?.path
    },

    async saveDraft() {
      try {
        // TODO: Call tRPC saveDraft endpoint
        this.isDraft = true
        return { success: true }
      }
      catch (error) {
        console.error('Failed to save draft:', error)
        return { success: false, error }
      }
    },

    async submitEvent() {
      try {
        // TODO: Call tRPC submit endpoint
        this.isDraft = false
        return { success: true, eventId: this.eventId }
      }
      catch (error) {
        console.error('Failed to submit event:', error)
        return { success: false, error }
      }
    },

    resetForm() {
      this.$reset()
    },
  },
})
