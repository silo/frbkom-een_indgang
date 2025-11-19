export interface EventFormData {
  // Step 1: Kontaktoplysninger
  contactInfo: {
    cvrCpr: string
    fullName: string
    phone: string
    email: string
    isCommercial: boolean | null
    contactPerson: {
      fullName: string
      phone: string
    }
  }

  // Step 2: Eventoplysninger
  eventInfo: {
    startAt: Date | null
    endAt: Date | null
    locationType: 'predefined' | 'custom' | null
    locationPresetId: string | null
    locationAddress: string | null
    typeTagCodes: string[]
    title: string
    purpose: string
    attendanceRange: string | null
    setupStartAt: Date | null
    setupEndAt: Date | null
    isRecurring: boolean | null
    recurringInterval: 'daily' | 'weekly' | 'monthly' | null
    relevantInfoDocuments: File[]
  }

  // Step 3: Praktiske forhold og sikkerhed
  practicalInfo: {
    simultaneousPersons: string | null
    hasTemporaryConstructions: boolean | null
    constructionDescription: string
    constructionCertificate: File | null
    br18Acknowledgment: boolean | null
    otherConsiderations: string
    arrangementPlanType: 'upload' | 'planner' | null
    arrangementPlanDocument: File | null
    hasSound: boolean | null
    soundDescription: string
    soundResponsibleName: string
    soundResponsiblePhone: string
  }

  // Step 4: Tilladelser og drift
  permitsInfo: {
    needsBlockage: boolean | null
    blockageDescription: string
    hasPolicePermission: boolean | null
    policePermissionDocument: File | null
    hasWasteHandling: boolean | null
    wasteDescription: string
    hasFoodDrinks: boolean | null
    foodDescription: string
  }
}

export interface FormStep {
  id: number
  key: string
  title: string
  path: string
  completed: boolean
  valid: boolean
  visited?: boolean
}

export type StepKey = 'contact-info' | 'event-info' | 'practical-safety' | 'permits-operations' | 'summary'
