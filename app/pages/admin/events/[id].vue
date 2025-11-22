<template>
  <div class="admin-event-page">
    <section class="detail-toolbar">
      <Button variant="secondary" icon-name="fa7-solid:arrow-left" @click="handleBack">
        {{ $t('admin.detail.back') }}
      </Button>
    </section>

    <section v-if="feedbackMessage" class="detail-feedback" :class="`is-${feedbackMessage.type}`">
      <div>
        <strong>{{ feedbackMessage.title }}</strong>
        <p>{{ feedbackMessage.text }}</p>
      </div>
      <Button variant="ghost" size="small" icon-name="fa7-solid:close" @click="feedbackMessage = null">
        {{ $t('common.close') }}
      </Button>
    </section>

    <section v-if="event" class="detail-hero-card">
      <div class="hero-heading">
        <h1>{{ event.title }}</h1>
      </div>
      <div class="hero-meta-row">
        <div class="hero-meta" aria-live="polite">
          <span class="hero-meta-item">
            <Icon name="fa7-solid:location-dot" size="14" aria-hidden="true" />
            <span>{{ heroLocation }}</span>
          </span>
          <span class="hero-meta-item">
            <Icon name="fa7-solid:calendar-days" size="14" aria-hidden="true" />
            <span>{{ heroDateRange }}</span>
          </span>
          <span class="hero-meta-item">
            <Icon name="fa7-solid:tag" size="14" aria-hidden="true" />
            <span>{{ heroTypeLabel }}</span>
          </span>
          <span class="hero-meta-item hero-meta-status">
            <Badge :label="getReviewStatusLabel(event.reviewStatus)" :variant="reviewStatusVariant[event.reviewStatus]" />
          </span>
        </div>
        <div class="hero-actions">
          <Button variant="primary" icon-name="fa7-solid:envelope-circle-check" @click="openApprovalModal">
            {{ $t('admin.detail.actions.startApproval') }}
          </Button>
        </div>
      </div>
    </section>

    <section v-else-if="eventPending" class="detail-card detail-state">
      <p>{{ $t('common.loading') }}</p>
    </section>

    <section v-else-if="eventError" class="detail-card detail-state">
      <p>{{ $t('common.error') }}</p>
      <Button variant="secondary" @click="refreshEvent">
        {{ $t('common.retry') }}
      </Button>
    </section>

    <section class="detail-map-card" aria-live="polite">
      <img
        v-if="heroMapImage"
        :src="heroMapImage"
        :alt="heroMapAlt"
        :width="mapSize.width"
        :height="mapSize.height"
        loading="lazy"
      >
      <div v-else class="map-fallback">
        <p>{{ $t('admin.detail.locationPending') }}</p>
      </div>
    </section>

    <div class="detail-columns">
      <div class="detail-main">
        <article class="detail-card">
          <header class="detail-card-header">
            <h2>{{ $t('admin.detail.contactTitle') }}</h2>
          </header>
          <div class="detail-grid detail-grid--two">
            <div
              v-for="(column, columnIndex) in contactColumns"
              :key="`contact-column-${columnIndex}`"
              class="detail-subsection"
            >
              <div v-for="field in column" :key="field.label" class="detail-field">
                <p class="detail-field-label">{{ field.label }}</p>
                <p class="detail-field-value">{{ field.value }}</p>
              </div>
            </div>
          </div>

        </article>

        <article class="detail-card">
          <header class="detail-card-header">
            <h2>{{ $t('admin.detail.eventInfoTitle') }}</h2>
          </header>
          <div class="detail-subsection">
            <h3>{{ $t('admin.detail.eventAvailability') }}</h3>
            <div class="detail-grid detail-grid--two">
              <div v-for="field in eventAvailabilityFields" :key="field.label" class="detail-field">
                <p class="detail-field-label">{{ field.label }}</p>
                <p class="detail-field-value">{{ field.value }}</p>
              </div>
            </div>
          </div>
          <div class="detail-divider" role="presentation" />
          <div class="detail-subsection">
            <h3>{{ $t('admin.detail.eventAbout') }}</h3>
            <div class="detail-field">
              <p class="detail-field-label">{{ $t('admin.detail.eventTitleLabel') }}</p>
              <p class="detail-field-value">{{ event?.title || placeholder }}</p>
            </div>
            <div class="detail-field">
              <p class="detail-field-label">{{ $t('admin.detail.purpose') }}</p>
              <p class="detail-field-value">{{ event?.purpose || placeholder }}</p>
            </div>
            <div class="detail-grid detail-grid--two">
              <div v-for="field in eventAboutFields" :key="field.label" class="detail-field">
                <p class="detail-field-label">{{ field.label }}</p>
                <p class="detail-field-value">{{ field.value }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="detail-card">
          <header class="detail-card-header">
            <h2>{{ $t('admin.detail.practicalSafetyTitle') }}</h2>
          </header>
          <div class="detail-subsection">
            <h3>{{ $t('admin.detail.fireAndConstruction') }}</h3>
            <div class="detail-grid detail-grid--two">
              <div v-for="field in fireSafetyFields" :key="field.label" class="detail-field">
                <p class="detail-field-label">{{ field.label }}</p>
                <p class="detail-field-value">{{ field.value }}</p>
              </div>
            </div>
            <div class="detail-field">
              <p class="detail-field-label">{{ $t('admin.detail.constructionCertificate') }}</p>
              <p class="detail-field-value">{{ certificateLabel }}</p>
            </div>
            <div class="detail-field">
              <p class="detail-field-label">{{ $t('admin.detail.otherConsiderations') }}</p>
              <p class="detail-field-value">{{ otherConsiderations }}</p>
            </div>
          </div>
          <div class="detail-divider" role="presentation" />
          <div class="detail-subsection">
            <h3>{{ $t('admin.detail.arrangementPlan') }}</h3>
            <div class="detail-grid detail-grid--two">
              <div v-for="field in arrangementPlanFields" :key="field.label" class="detail-field">
                <p class="detail-field-label">{{ field.label }}</p>
                <p class="detail-field-value">{{ field.value }}</p>
              </div>
            </div>
          </div>
          <div class="detail-divider" role="presentation" />
          <div class="detail-subsection">
            <h3>{{ $t('admin.detail.sound') }}</h3>
            <div v-for="field in soundFields" :key="field.label" class="detail-field">
              <p class="detail-field-label">{{ field.label }}</p>
              <p class="detail-field-value">{{ field.value }}</p>
            </div>
          </div>
        </article>

        <article class="detail-card">
          <header class="detail-card-header">
            <h2>{{ $t('admin.detail.permitsTitle') }}</h2>
          </header>
          <div class="detail-subsection">
            <h3>{{ $t('admin.detail.blockage') }}</h3>
            <div class="detail-grid detail-grid--two">
              <div v-for="field in blockageFields" :key="field.label" class="detail-field">
                <p class="detail-field-label">{{ field.label }}</p>
                <p class="detail-field-value">{{ field.value }}</p>
              </div>
            </div>
          </div>
          <div class="detail-divider" role="presentation" />
          <div class="detail-subsection">
            <h3>{{ $t('admin.detail.wasteHandling') }}</h3>
            <div v-for="field in wasteFields" :key="field.label" class="detail-field">
              <p class="detail-field-label">{{ field.label }}</p>
              <p class="detail-field-value">{{ field.value }}</p>
            </div>
          </div>
        </article>
      </div>

      <aside class="detail-sidebar" aria-live="polite">
        <article class="detail-card sidebar-card">
          <header class="detail-card-header">
            <h2>{{ $t('admin.detail.departmentsTitle') }}</h2>
          </header>
          <div class="department-checkbox-list">
            <div v-for="card in departmentCards" :key="card.id" class="department-checkbox">
              <Checkbox
                :id="`department-${card.id}`"
                v-model="departmentSelection[card.id]"
                :disabled="card.slug === DEFAULT_DEPARTMENT_SLUG"
                :aria-labelledby="`department-label-${card.id}`"
              />
              <span :id="`department-label-${card.id}`">{{ card.name }}</span>
            </div>
          </div>
          <p v-if="departmentAssignmentError" class="inline-error">{{ departmentAssignmentError }}</p>
          <Button
            variant="secondary"
            :disabled="!hasDepartmentChanges || departmentAssignmentLoading"
            :loading="departmentAssignmentLoading"
            @click="handleDepartmentAssignments"
          >
            {{ $t('admin.detail.departmentNotifyCta') }}
          </Button>
        </article>

        <article class="detail-card sidebar-card">
          <header class="detail-card-header">
            <h2>{{ $t('admin.detail.statusPanelTitle') }}</h2>
          </header>
          <ul class="department-summary-list">
            <li
              v-for="card in selectedDepartmentCards"
              :key="card.id"
              class="status-pill"
              :class="{ 'is-approved': card.status === 'approved' }"
            >
              <div>
                <p class="status-name">{{ card.name }}</p>
                <p class="status-text">
                  <Icon v-if="card.status === 'approved'" name="fa7-solid:check" size="14" aria-hidden="true" />
                  {{ card.status ? getDepartmentStatusLabel(card.status) : $t('admin.detail.departmentStatuses.pending') }}
                </p>
              </div>
              <button
                v-if="card.status === 'approved' && canDownloadApproval"
                type="button"
                class="status-download"
                @click="downloadLatestApproval"
              >
                {{ $t('admin.detail.statusDownload') }}
                <Icon name="fa7-solid:download" size="14" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </article>
      </aside>
    </div>

    <section class="attachments-section">
      <header class="attachments-header">
        <h2>{{ $t('admin.detail.applicationDocuments') }}</h2>
      </header>
      <div v-if="applicationDocuments.length" class="attachment-grid">
        <button
          v-for="doc in applicationDocuments"
          :key="doc.id"
          type="button"
          class="attachment-card"
          :disabled="documentDownloadState[doc.id]"
          @click="handleDocumentDownload(doc.id, doc.fileName)"
        >
          <span class="attachment-icon">
            <Icon name="fa7-solid:file" size="20" aria-hidden="true" />
          </span>
          <div class="attachment-content">
            <p class="attachment-name">{{ doc.fileName }}</p>
            <p class="attachment-link">{{ $t('admin.detail.documentOpen') }}</p>
          </div>
        </button>
      </div>
      <p v-else class="empty-text">{{ $t('admin.detail.noDocuments') }}</p>
    </section>

    <section class="detail-card audit-card">
      <header class="detail-card-header">
        <div>
          <h2>{{ $t('admin.detail.auditTitle') }}</h2>
          <p>{{ $t('admin.detail.auditSubtitle') }}</p>
        </div>
      </header>
      <div v-if="auditLogPending" class="detail-state inline">
        <p>{{ $t('common.loading') }}</p>
      </div>
      <ul v-else-if="auditEntries.length" class="audit-list">
        <li v-for="entry in auditEntries" :key="entry.id">
          <div>
            <p class="audit-action">{{ formatAuditAction(entry) }}</p>
            <p class="audit-meta">{{ entry.actor?.name || placeholder }} · {{ formatDateTime(entry.createdAt) }}</p>
          </div>
          <p v-if="entry.payload?.note" class="audit-note">{{ entry.payload.note }}</p>
        </li>
      </ul>
      <p v-else class="empty-text">{{ $t('admin.detail.noAuditEntries') }}</p>
    </section>

    <Modal
      v-model="isApprovalModalOpen"
      :title="$t('admin.detail.approvalModal.title')"
      :width="560"
      :dismissible="!approvalSending"
      :close-on-esc="!approvalSending"
      :actions="approvalModalActions"
      @action="handleApprovalModalAction"
      @close="resetApprovalModal"
    >
      <p class="modal-intro">{{ $t('admin.detail.approvalModal.body') }}</p>
      <DropdownButton
        v-model="approvalDepartmentId"
        class="approval-department-dropdown"
        :options="departmentOptions"
        :button-label="$t('admin.detail.approvalModal.departmentLabel')"
        :disabled="approvalSending"
      />
      <FileUpload
        class="mt-16"
        :label="$t('admin.detail.approvalModal.uploadLabel')"
        :helper-text="$t('admin.detail.approvalModal.uploadHelper')"
        accept=".pdf"
        :items="approvalUploadItems"
        @files-added="handleApprovalFilesAdded"
        @remove="handleApprovalFileRemove"
        @cancel="handleApprovalFileRemove"
      />
      <Textarea
        v-model="approvalMessage"
        class="mt-16"
        :label="$t('admin.detail.approvalModal.noteLabel')"
        :rows="4"
        :disabled="approvalSending"
      />
      <p v-if="approvalError" class="inline-error">{{ approvalError }}</p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { inferRouterProxyClient } from '@trpc/client'
import {
  Badge,
  Button,
  Checkbox,
  DropdownButton,
  FileUpload,
  Modal,
  Textarea,
  type DropdownOption,
  type FileUploadItem,
  type ModalAction,
  type BadgeVariant,
} from 'fk-designsystem'
import type { AppRouter } from '~/server/trpc/routers'
import type { AttendanceRange, ReviewStatus } from '~/shared/schemas/event'
import type { DepartmentStatus } from '~/shared/schemas/department-status'
import { DEFAULT_DEPARTMENT_SLUG } from '~~/shared/constants/departments'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  auth: {
    roles: ['admin'],
  },
})

type FeedbackMessage = {
  type: 'success' | 'error'
  title: string
  text: string
}

type ApprovalAttachment = {
  fileName: string
  mimeType: string
  sizeBytes: number
  base64: string
}

const route = useRoute()
const router = useRouter()
const { $trpc } = useNuxtApp()
const trpc = $trpc as inferRouterProxyClient<AppRouter>
const { t } = useI18n()

const placeholder = '—'
const mapSize = { width: 1200, height: 320 }
const yesLabel = computed(() => t('form.step1.yes'))
const noLabel = computed(() => t('form.step1.no'))

const eventId = computed(() => route.params.id as string)

const fetchEvent = () => trpc.admin.byId.query({ id: eventId.value })
const fetchDepartments = () => trpc.admin.departments.query()
const fetchDepartmentStatuses = () => trpc.admin.listDepartmentStatuses.query({ eventId: eventId.value })
const fetchDocuments = () => trpc.documents.list.query({ eventId: eventId.value })
const fetchAudit = () => trpc.admin.auditLog.query({ eventId: eventId.value })

type DepartmentEntry = Awaited<ReturnType<typeof fetchDepartments>>[number]
type DepartmentStatusEntry = Awaited<ReturnType<typeof fetchDepartmentStatuses>>[number]
type DocumentListEntry = Awaited<ReturnType<typeof fetchDocuments>>[number]
type AuditEntry = Awaited<ReturnType<typeof fetchAudit>>[number]

const {
  data: eventResponse,
  pending: eventPending,
  error: eventError,
  refresh: refreshEvent,
} = useAsyncData(() => `admin-event-${eventId.value}`, fetchEvent, {
  immediate: false,
  server: false,
  watch: [eventId],
})

const { data: departmentsData, refresh: refreshDepartments } = useAsyncData(
  'admin-departments',
  fetchDepartments,
  {
    immediate: false,
    server: false,
  },
)

const { data: departmentStatusesData, refresh: refreshDepartmentStatuses } = useAsyncData(
  () => `admin-department-statuses-${eventId.value}`,
  fetchDepartmentStatuses,
  {
    immediate: false,
    server: false,
    watch: [eventId],
  },
)

const { data: documentsData, refresh: refreshDocuments } = useAsyncData(
  () => `admin-documents-${eventId.value}`,
  fetchDocuments,
  {
    immediate: false,
    server: false,
    watch: [eventId],
  },
)

const {
  data: auditLogData,
  pending: auditLogPending,
  refresh: refreshAuditLog,
} = useAsyncData(() => `admin-audit-${eventId.value}`, fetchAudit, {
  immediate: false,
  server: false,
  watch: [eventId],
})

onMounted(() => {
  refreshEvent()
  refreshDepartments()
  refreshDepartmentStatuses()
  refreshDocuments()
  refreshAuditLog()
})

const feedbackMessage = ref<FeedbackMessage | null>(null)
const departmentAssignmentError = ref('')
const departmentAssignmentLoading = ref(false)
const documentDownloadState = reactive<Record<string, boolean>>({})
const departmentSelection = reactive<Record<string, boolean>>({})
const initialDepartmentSelection = ref<Set<string>>(new Set())

const departmentsList = computed<DepartmentEntry[]>(() => departmentsData.value ?? ([] as DepartmentEntry[]))
const departmentStatuses = computed<DepartmentStatusEntry[]>(
  () => departmentStatusesData.value ?? ([] as DepartmentStatusEntry[]),
)
const departmentStatusesMap = computed(() => {
  const entries = new Map<string, DepartmentStatusEntry>()
  departmentStatuses.value.forEach((status) => {
    entries.set(status.departmentId, status)
  })
  return entries
})

const syncDepartmentSelection = () => {
  if (!departmentsList.value.length) {
    return
  }
  const assigned = new Set<string>()
  const nextSelection: Record<string, boolean> = {}
  departmentsList.value.forEach((dept) => {
    const isDefaultDepartment = dept.slug === DEFAULT_DEPARTMENT_SLUG
    const isAssigned = isDefaultDepartment || departmentStatusesMap.value.has(dept.id)
    nextSelection[dept.id] = isAssigned
    if (isAssigned) {
      assigned.add(dept.id)
    }
  })
  Object.keys(departmentSelection).forEach((key) => {
    if (!(key in nextSelection)) {
      delete departmentSelection[key]
    }
  })
  Object.entries(nextSelection).forEach(([key, value]) => {
    departmentSelection[key] = value
  })
  initialDepartmentSelection.value = assigned
}

watch([departmentsList, departmentStatuses], () => {
  syncDepartmentSelection()
}, { immediate: true })

const event = computed(() => eventResponse.value?.event ?? null)
const typeTags = computed(() => eventResponse.value?.typeTags ?? [])
const safetyInfo = computed(() => eventResponse.value?.safetyInfo ?? null)
const soundInfo = computed(() => eventResponse.value?.soundInfo ?? null)
const wasteInfo = computed(() => eventResponse.value?.wasteInfo ?? null)
const foodInfo = computed(() => eventResponse.value?.foodInfo ?? null)
const accessInfo = computed(() => eventResponse.value?.accessInfo ?? null)

const heroLocation = computed(() => {
  if (!event.value) return placeholder
  if (event.value.locationType === 'predefined') {
    return event.value.locationPreset?.name ?? placeholder
  }
  return event.value.locationAddress ?? placeholder
})

const dateTimeFormatter = new Intl.DateTimeFormat('da-DK', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const dateFormatter = new Intl.DateTimeFormat('da-DK', {
  dateStyle: 'medium',
})

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return placeholder
  try {
    return dateTimeFormatter.format(new Date(value))
  } catch {
    return placeholder
  }
}

const formatDateRange = (start?: string | Date | null, end?: string | Date | null) => {
  if (!start || !end) return placeholder
  try {
    return `${dateFormatter.format(new Date(start))} · ${dateFormatter.format(new Date(end))}`
  } catch {
    return placeholder
  }
}

const attendanceRangeLabels: Record<AttendanceRange, string> = {
  '0_50': '0-50',
  '51_200': '51-200',
  '201_500': '201-500',
  '501_1000': '501-1000',
  '1001_5000': '1001-5000',
  '5001_plus': '5000+',
}

const formatAttendanceRange = (range?: AttendanceRange | null) => {
  if (!range) return placeholder
  return attendanceRangeLabels[range] ?? placeholder
}

const boolLabel = (value?: boolean | null) => {
  if (value === null || value === undefined) return placeholder
  return value ? yesLabel.value : noLabel.value
}

const heroDateRange = computed(() => formatDateRange(event.value?.startAt ?? null, event.value?.endAt ?? null))
const heroTypeLabel = computed(() => {
  if (!typeTags.value.length) return placeholder
  return typeTags.value.map((tag) => tag.name).join(', ')
})
const heroMapImage = computed(() => event.value?.locationPreset?.imageUrl ?? null)
const heroMapAlt = computed(() => {
  if (!heroMapImage.value) {
    return t('admin.detail.locationPending')
  }
  return `${t('admin.detail.location')}: ${heroLocation.value}`
})

const reviewStatusVariant: Record<ReviewStatus, BadgeVariant> = {
  unprocessed: 'neutral',
  in_review: 'info',
  partially_approved: 'warning',
  approved: 'success',
  rejected: 'critical',
}

const getReviewStatusLabel = (status: ReviewStatus) => t(`events.status.${status}`)
const getDepartmentStatusLabel = (status: DepartmentStatus) =>
  t(`admin.detail.departmentStatuses.${status}`)

type DetailField = {
  label: string
  value: string
}

const contactColumns = computed<DetailField[][]>(() => {
  const current = event.value
  return [
    [
      { label: t('form.step1.fullName'), value: current?.owner?.name ?? placeholder },
      { label: t('form.step1.email'), value: current?.owner?.email ?? placeholder },
      { label: t('form.step1.phone'), value: current?.owner?.phone ?? placeholder },
    ],
    [
      { label: t('form.step1.contactPersonName'), value: current?.contactPersonName ?? placeholder },
      { label: t('form.step1.contactPersonPhone'), value: current?.contactPersonPhone ?? placeholder },
      { label: 'CVR / CPR', value: current?.owner?.companyCvr ?? placeholder },
    ],
  ]
})

const eventAvailabilityFields = computed<DetailField[]>(() => {
  const current = event.value
  return [
    { label: t('form.step2.startAt'), value: formatDateTime(current?.startAt ?? null) },
    { label: t('form.step2.endAt'), value: formatDateTime(current?.endAt ?? null) },
    { label: t('form.step2.setupStart'), value: formatDateTime(current?.setupStartAt ?? null) },
    { label: t('form.step2.setupEnd'), value: formatDateTime(current?.setupEndAt ?? null) },
    { label: t('admin.detail.recurring'), value: boolLabel(current?.recurring) },
    {
      label: t('form.step2.expectedAttendance'),
      value: formatAttendanceRange(current?.expectedAttendanceRange as AttendanceRange | undefined),
    },
  ]
})

const recurringLabels: Record<string, string> = {
  daily: t('admin.detail.recurringDaily'),
  weekly: t('admin.detail.recurringWeekly'),
  monthly: t('admin.detail.recurringMonthly'),
}

const eventAboutFields = computed<DetailField[]>(() => {
  const current = event.value
  return [
    { label: t('form.step2.eventTypes'), value: heroTypeLabel.value },
    { label: t('form.step1.isCommercial'), value: boolLabel(current?.commercial) },
    {
      label: t('form.step2.recurringInterval'),
      value: current?.recurring && current.recurringInterval
        ? recurringLabels[current.recurringInterval] ?? placeholder
        : placeholder,
    },
  ]
})

const fireSafetyFields = computed<DetailField[]>(() => {
  const info = safetyInfo.value
  return [
    {
      label: t('form.step3.simultaneousPersons'),
      value: formatAttendanceRange(info?.simultaneousPersonsRange as AttendanceRange | undefined),
    },
    { label: t('form.step3.hasConstructions'), value: boolLabel(info?.hasTemporaryConstructions) },
    { label: t('form.step3.br18Acknowledgment'), value: boolLabel(info?.hasReadBR18Bilag11) },
  ]
})

const certificateLabel = computed(() => boolLabel(Boolean(safetyInfo.value?.constructionsCertificateDocumentId)))
const otherConsiderations = computed(() => safetyInfo.value?.otherConsiderations?.trim() || placeholder)

const arrangementPlanFields = computed<DetailField[]>(() => {
  const info = safetyInfo.value
  return [
    { label: t('form.step3.arrangementPlan'), value: info?.constructionsDescription || placeholder },
    { label: t('form.step3.otherSpecialConsiderations'), value: otherConsiderations.value },
  ]
})

const soundFields = computed<DetailField[]>(() => {
  const info = soundInfo.value
  return [
    { label: t('form.step3.hasSound'), value: boolLabel(info?.hasSound) },
    { label: t('form.step3.soundDescription'), value: info?.description || placeholder },
    { label: t('form.step3.soundResponsibleName'), value: info?.responsibleName || placeholder },
    { label: t('form.step3.soundResponsiblePhone'), value: info?.responsiblePhone || placeholder },
  ]
})

const blockageFields = computed<DetailField[]>(() => {
  const info = accessInfo.value
  return [
    { label: t('form.step4.needsBlockage'), value: boolLabel(info?.needsBlockage) },
    { label: t('form.step4.blockageDescription'), value: info?.blockageDescription || placeholder },
    { label: t('form.step4.hasPolicePermission'), value: boolLabel(info?.policePermissionApplied) },
  ]
})

const wasteFields = computed<DetailField[]>(() => {
  const waste = wasteInfo.value
  const food = foodInfo.value
  return [
    { label: t('form.step4.needsWaste'), value: boolLabel(waste?.needsWasteHandling) },
    { label: t('form.step4.wasteDescription'), value: waste?.description || placeholder },
    { label: t('form.step4.hasFoodDrinks'), value: boolLabel(food?.hasFoodOrBeverage) },
    { label: t('form.step4.foodDescription'), value: food?.description || placeholder },
  ]
})

const departmentCards = computed(() =>
  departmentsList.value.map((dept) => {
    const statusEntry = departmentStatusesMap.value.get(dept.id)
    return {
      id: dept.id,
      name: dept.name,
      slug: dept.slug,
      status: statusEntry?.status ?? null,
    }
  }),
)

const selectedDepartmentCards = computed(() =>
  departmentCards.value.filter((card) => Boolean(departmentSelection[card.id])),
)

const departmentOptions = computed<DropdownOption[]>(() => {
  const assignedIds = [...initialDepartmentSelection.value]
  const sourceCards = assignedIds.length
    ? departmentCards.value.filter((card) => assignedIds.includes(card.id))
    : departmentCards.value

  // When no departments are assigned yet, fall back to listing all available ones
  return sourceCards.map((card) => ({
    value: card.id,
    label: card.name,
  }))
})

const hasDepartmentChanges = computed(() =>
  Object.entries(departmentSelection).some(
    ([id, selected]) => selected && !initialDepartmentSelection.value.has(id),
  ),
)

const handleDepartmentAssignments = async () => {
  departmentAssignmentError.value = ''
  const newDepartmentIds = Object.entries(departmentSelection)
    .filter(([id, selected]) => selected && !initialDepartmentSelection.value.has(id))
    .map(([id]) => id)

  if (!newDepartmentIds.length) {
    return
  }

  departmentAssignmentLoading.value = true
  try {
    await trpc.admin.assignDepartments.mutate({
      eventId: eventId.value,
      departmentIds: newDepartmentIds,
    })
    feedbackMessage.value = {
      type: 'success',
      title: t('common.success'),
      text: t('admin.detail.messages.departmentAssigned'),
    }
    await Promise.all([refreshDepartmentStatuses(), refreshAuditLog()])
  } catch (error) {
    console.error('Failed to assign departments', error)
    departmentAssignmentError.value = t('admin.detail.messages.departmentFailed')
    feedbackMessage.value = {
      type: 'error',
      title: t('common.error'),
      text: t('admin.detail.messages.departmentFailed'),
    }
  } finally {
    departmentAssignmentLoading.value = false
  }
}

const documentsList = computed<DocumentListEntry[]>(
  () => documentsData.value ?? ([] as DocumentListEntry[]),
)
const applicationDocuments = computed<DocumentListEntry[]>(() =>
  documentsList.value
    .filter((doc) => doc.kind !== 'approval_document')
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
)
const approvalDocuments = computed<DocumentListEntry[]>(() =>
  documentsList.value
    .filter((doc) => doc.kind === 'approval_document')
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
)
const canDownloadApproval = computed(() => approvalDocuments.value.length > 0)

const base64ToBlob = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

const handleDocumentDownload = async (documentId: string, fallbackName: string) => {
  documentDownloadState[documentId] = true
  try {
    const doc = await trpc.documents.get.query({ id: documentId })
    const blob = base64ToBlob(doc.content, doc.mimeType)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = doc.fileName || fallbackName
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Document download failed', error)
    feedbackMessage.value = {
      type: 'error',
      title: t('common.error'),
      text: t('admin.detail.messages.documentDownloadFailed'),
    }
  } finally {
    documentDownloadState[documentId] = false
  }
}

const downloadLatestApproval = () => {
  const latest = approvalDocuments.value[0]
  if (!latest) return
  return handleDocumentDownload(latest.id, latest.fileName)
}

const auditEntries = computed<AuditEntry[]>(() => auditLogData.value ?? ([] as AuditEntry[]))

const formatAuditAction = (entry: AuditEntry) => {
  switch (entry.action) {
    case 'create':
      return t('admin.detail.audit.actions.create')
    case 'update':
      return t('admin.detail.audit.actions.update')
    case 'add_document':
      return t('admin.detail.audit.actions.addDocument')
    case 'remove_document':
      return t('admin.detail.audit.actions.removeDocument')
    case 'status_change':
    default:
      return t('admin.detail.audit.actions.status')
  }
}

const approvalDepartmentId = ref('')
const approvalMessage = ref('')
const approvalFile = ref<ApprovalAttachment | null>(null)
const approvalError = ref('')
const approvalSending = ref(false)
const isApprovalModalOpen = ref(false)

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const approvalUploadItems = computed<FileUploadItem[]>(() => {
  if (!approvalFile.value) return []
  return [
    {
      id: approvalFile.value.fileName,
      name: approvalFile.value.fileName,
      sizeLabel: formatFileSize(approvalFile.value.sizeBytes),
      status: 'success',
    },
  ]
})

const readFileAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Invalid file content'))
        return
      }
      const [, base64] = reader.result.split(',')
      if (!base64) {
        reject(new Error('Invalid file data'))
        return
      }
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error ?? new Error('File read failed'))
    reader.readAsDataURL(file)
  })

const handleApprovalFilesAdded = async (files: FileList) => {
  approvalError.value = ''
  const file = files.item(0)
  if (!file) return

  if (file.type !== 'application/pdf') {
    approvalError.value = t('admin.detail.approvalModal.fileWrongType', { name: file.name })
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    approvalError.value = t('admin.detail.approvalModal.fileTooLarge', { name: file.name })
    return
  }

  try {
    const base64 = await readFileAsBase64(file)
    approvalFile.value = {
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      base64,
    }
  } catch (error) {
    console.error('Failed to process approval file', error)
    approvalError.value = t('admin.detail.approvalModal.error')
  }
}

const handleApprovalFileRemove = () => {
  approvalFile.value = null
  approvalError.value = ''
}

const canSubmitApproval = computed(
  () =>
    Boolean(
      approvalDepartmentId.value &&
        approvalMessage.value.trim().length >= 10 &&
        approvalFile.value &&
        !approvalSending.value,
    ),
)

const approvalModalActions = computed<ModalAction[]>(() => [
  {
    id: 'cancel',
    label: t('common.cancel'),
    variant: 'secondary',
    disabled: approvalSending.value,
  },
  {
    id: 'confirm',
    label: t('admin.detail.approvalModal.confirm'),
    variant: 'primary',
    loading: approvalSending.value,
    disabled: !canSubmitApproval.value,
  },
])

watch(
  () => departmentOptions.value,
  (options) => {
    const safeOptions = options ?? []
    if (!safeOptions.length) {
      approvalDepartmentId.value = ''
      return
    }
    if (!safeOptions.some((option) => option.value === approvalDepartmentId.value)) {
      const [firstOption] = safeOptions
      if (firstOption) {
        approvalDepartmentId.value = firstOption.value as string
      }
    }
  },
  { immediate: true },
)

const resetApprovalModal = () => {
  approvalMessage.value = ''
  approvalFile.value = null
  approvalError.value = ''
}

const openApprovalModal = () => {
  approvalError.value = ''
  isApprovalModalOpen.value = true
}

const submitApproval = async () => {
  approvalError.value = ''
  if (!approvalDepartmentId.value) {
    approvalError.value = t('validation.required')
    return
  }
  if (!approvalFile.value) {
    approvalError.value = t('admin.detail.approvalModal.validation.files')
    return
  }
  if (approvalMessage.value.trim().length < 10) {
    approvalError.value = t('validation.minLength', { min: 10 })
    return
  }

  approvalSending.value = true
  try {
    await trpc.admin.sendApprovalNotice.mutate({
      eventId: eventId.value,
      departmentId: approvalDepartmentId.value,
      message: approvalMessage.value.trim(),
      attachment: {
        fileName: approvalFile.value.fileName,
        mimeType: approvalFile.value.mimeType as 'application/pdf',
        sizeBytes: approvalFile.value.sizeBytes,
        content: approvalFile.value.base64,
      },
    })
    feedbackMessage.value = {
      type: 'success',
      title: t('common.success'),
      text: t('admin.detail.messages.statusUpdated'),
    }
    isApprovalModalOpen.value = false
    resetApprovalModal()
    await Promise.all([refreshDocuments(), refreshAuditLog()])
  } catch (error) {
    console.error('Failed to send approval notice', error)
    approvalError.value = t('admin.detail.approvalModal.error')
    feedbackMessage.value = {
      type: 'error',
      title: t('common.error'),
      text: t('admin.detail.approvalModal.error'),
    }
  } finally {
    approvalSending.value = false
  }
}

const handleApprovalModalAction = (actionId: string) => {
  if (actionId === 'cancel') {
    resetApprovalModal()
    isApprovalModalOpen.value = false
    return
  }
  if (actionId === 'confirm') {
    submitApproval()
  }
}

const handleBack = () => {
  router.push('/admin')
}
</script>
