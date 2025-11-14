import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventFormStore } from '../stores/event-form'

type StepStatus = {
  id: number
  title: string
  missingCount: number
  total: number
  percentage: number
  isComplete: boolean
}

const validator = (active: boolean, valid: boolean) => ({ active, valid })

const buildStatus = (id: number, title: string, validators: ReturnType<typeof validator>[]): StepStatus => {
  const activeValidators = validators.filter((item) => item.active)
  const total = activeValidators.length
  const missingCount = activeValidators.filter((item) => !item.valid).length
  const percentage = total === 0 ? 100 : Math.round(((total - missingCount) / total) * 100)

  return {
    id,
    title,
    missingCount,
    total,
    percentage,
    isComplete: missingCount === 0,
  }
}

export const useStepCompletion = () => {
  const { t } = useI18n()
  const formStore = useEventFormStore()

  const stepStatuses = computed<StepStatus[]>(() => {
    const statuses: StepStatus[] = []
    const contact = formStore.formData.contactInfo
    const eventInfo = formStore.formData.eventInfo
    const practical = formStore.formData.practicalInfo
    const permits = formStore.formData.permitsInfo
    const isCustomAddress = eventInfo.locationType === 'custom'
    const needsPlanUpload = isCustomAddress || practical.arrangementPlanType === 'upload'

    const step1Validators = [
      validator(true, /^[0-9]{8}$|^[0-9]{10}$/.test(contact.cvrCpr ?? '')),
      validator(true, Boolean(contact.fullName && contact.fullName.length >= 2)),
      validator(true, Boolean(contact.phone && /^[0-9]{8}$/.test(contact.phone.replace(/\s/g, '')))),
      validator(true, Boolean(contact.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))),
      validator(true, Boolean(contact.contactPerson.fullName && contact.contactPerson.fullName.length >= 2)),
      validator(true, Boolean(contact.contactPerson.phone && /^[0-9]{8}$/.test(contact.contactPerson.phone.replace(/\s/g, '')))),
    ]
    statuses.push(buildStatus(1, t('form.step5.contactInfoSummary'), step1Validators))

    const step2Validators = [
      validator(true, Boolean(eventInfo.startAt)),
      validator(true, Boolean(eventInfo.endAt)),
      validator(true, eventInfo.locationType !== null),
      validator(eventInfo.locationType !== 'custom', Boolean(eventInfo.locationPresetId)),
      validator(isCustomAddress, Boolean(eventInfo.locationAddress)),
      validator(true, eventInfo.typeTagCodes.length > 0),
      validator(true, Boolean(eventInfo.title && eventInfo.title.trim().length >= 3)),
      validator(true, Boolean(eventInfo.purpose && eventInfo.purpose.trim().length >= 5)),
      validator(true, Boolean(eventInfo.attendanceRange)),
      validator(true, Boolean(eventInfo.setupStartAt)),
      validator(true, Boolean(eventInfo.setupEndAt)),
      validator(true, eventInfo.isRecurring !== null),
      validator(eventInfo.isRecurring === true, Boolean(eventInfo.recurringInterval)),
    ]
    statuses.push(buildStatus(2, t('form.step5.eventInfoSummary'), step2Validators))

    const step3Validators = [
      validator(true, Boolean(practical.simultaneousPersons)),
      validator(true, practical.hasTemporaryConstructions !== null),
      validator(practical.hasTemporaryConstructions === true, Boolean(practical.constructionDescription)),
      validator(practical.hasTemporaryConstructions === true, Boolean(practical.constructionCertificate)),
      validator(true, practical.br18Acknowledgment === true),
      validator(!isCustomAddress, Boolean(practical.arrangementPlanType)),
      validator(needsPlanUpload, Boolean(practical.arrangementPlanDocument)),
      validator(true, practical.hasSound !== null),
      validator(practical.hasSound === true, Boolean(practical.soundDescription)),
      validator(practical.hasSound === true, Boolean(practical.soundResponsibleName)),
      validator(
        practical.hasSound === true,
        Boolean(
          practical.soundResponsiblePhone &&
            /^[0-9]{8}$/.test(practical.soundResponsiblePhone.replace(/\s/g, '')),
        ),
      ),
    ]
    statuses.push(buildStatus(3, t('form.step5.practicalSafetySummary'), step3Validators))

    const step4Validators = [
      validator(true, permits.needsBlockage !== null),
      validator(permits.needsBlockage === true, Boolean(permits.blockageDescription)),
      validator(true, permits.hasPolicePermission !== null),
      validator(permits.hasPolicePermission === true, Boolean(permits.policePermissionDocument)),
      validator(true, permits.hasWasteHandling !== null),
      validator(permits.hasWasteHandling === true, Boolean(permits.wasteDescription)),
      validator(true, permits.hasFoodDrinks !== null),
      validator(permits.hasFoodDrinks === true, Boolean(permits.foodDescription)),
    ]
    statuses.push(buildStatus(4, t('form.step5.permitsOperationsSummary'), step4Validators))

    return statuses
  })

  const incompleteSteps = computed(() => stepStatuses.value.filter((step) => !step.isComplete))

  const formatMissingLabel = (count: number) => {
    if (count === 0) {
      return t('form.step5.noMissingFields')
    }
    if (count === 1) {
      return t('form.step5.missingFieldsOne')
    }
    return t('form.step5.missingFieldsOther', { count })
  }

  return {
    stepStatuses,
    incompleteSteps,
    formatMissingLabel,
  }
}
