<template>
  <div class="admin-event-detail">
    <header class="detail-hero">
      <div class="hero-left">
        <Button variant="secondary" icon-name="fa7-solid:arrow-left" @click="handleBack">
          {{ $t('admin.detail.back') }}
        </Button>

        <div v-if="event" class="hero-text">
          <div class="hero-title">
            <h1>{{ event.title }}</h1>
            <Badge :label="getReviewStatusLabel(event.reviewStatus)" :variant="reviewStatusVariant[event.reviewStatus]" />
          </div>
          <p class="hero-meta">
            {{ formatDateRange(event.startAt, event.endAt) }} ·
            {{ resolveLocation(event) }}
          </p>
        </div>
      </div>

      <div v-if="event" class="hero-actions">
        <Button
          v-if="event.reviewStatus === 'unprocessed'"
          variant="ghost"
          :loading="reviewStatusLoading"
          @click="handleReviewStatusChange('in_review')"
        >
          {{ $t('admin.detail.actions.startReview') }}
        </Button>

        <Button
          v-else-if="event.reviewStatus === 'in_review'"
          variant="ghost"
          :loading="reviewStatusLoading"
          @click="handleReviewStatusChange('partially_approved')"
        >
          {{ $t('admin.detail.actions.markPartiallyApproved') }}
        </Button>

        <Button variant="danger" :disabled="isApproving" @click="openRejectModal">
          {{ $t('admin.detail.actions.reject') }}
        </Button>
        <Button variant="primary" :disabled="isRejecting" @click="openApproveModal">
          {{ $t('admin.detail.actions.approve') }}
        </Button>
      </div>
    </header>

    <section v-if="feedbackMessage" class="detail-feedback" :class="`is-${feedbackMessage.type}`">
      <div>
        <strong>{{ feedbackMessage.title }}</strong>
        <p>{{ feedbackMessage.text }}</p>
      </div>
      <Button variant="ghost" size="small" icon-name="fa7-solid:close" @click="feedbackMessage = null">
        {{ $t('common.close') }}
      </Button>
    </section>

    <section v-if="eventPending" class="detail-state">
      <p>{{ $t('common.loading') }}</p>
    </section>

    <section v-else-if="eventError" class="detail-state">
      <p>{{ $t('common.error') }}</p>
      <Button variant="secondary" @click="refreshEvent">
        {{ $t('common.retry') }}
      </Button>
    </section>

    <template v-else-if="event">
      <section class="case-overview">
        <div class="case-card">
          <p class="card-label">{{ $t('admin.detail.reviewStatus') }}</p>
          <div class="case-status-row">
            <Badge :label="getReviewStatusLabel(event.reviewStatus)" :variant="reviewStatusVariant[event.reviewStatus]" />
            <DropdownButton
              v-model="reviewStatusDraft"
              class="status-dropdown"
              :disabled="reviewStatusLoading"
              :button-label="$t('admin.detail.statusDropdownLabel')"
              :options="reviewStatusOptions"
              @select="onReviewStatusSelect"
            />
          </div>
        </div>
        <div class="case-card">
          <p class="card-label">{{ $t('admin.detail.submissionStatus') }}</p>
          <Badge :label="getSubmissionStatus(event.status)" variant="info" />
          <p class="case-secondary">{{ $t('admin.detail.submittedAt') }} · {{ formatDateTime(event.createdAt) }}</p>
        </div>
        <div class="case-card">
          <p class="card-label">{{ $t('admin.detail.recurring') }}</p>
          <p class="card-value">{{ getRecurringLabel(event) }}</p>
          <p v-if="event.recurring && event.recurringInterval" class="case-secondary">
            {{ getRecurringIntervalLabel(event.recurringInterval) }}
          </p>
        </div>
      </section>

      <section class="info-grid">
        <article class="info-card">
          <div class="info-card-header">
            <p class="card-label">{{ $t('admin.detail.basicInfo') }}</p>
            <span class="info-id">{{ event.id }}</span>
          </div>
          <dl>
            <dt>{{ $t('admin.table.event') }}</dt>
            <dd>{{ event.title }}</dd>
            <dt>{{ $t('admin.detail.purpose') }}</dt>
            <dd>{{ event.purpose }}</dd>
            <dt>{{ $t('admin.detail.location') }}</dt>
            <dd>{{ resolveLocation(event) }}</dd>
            <dt>{{ $t('admin.detail.attendance') }}</dt>
            <dd>{{ formatAttendanceLabel(event.expectedAttendanceRange) }}</dd>
            <dt>{{ $t('admin.detail.commercial') }}</dt>
            <dd>{{ event.commercial ? $t('form.step1.yes') : $t('form.step1.no') }}</dd>
          </dl>
        </article>

        <article class="info-card">
          <p class="card-label">{{ $t('admin.detail.contact') }}</p>
          <dl>
            <dt>{{ $t('admin.table.applicant') }}</dt>
            <dd>{{ event.owner?.name || '—' }}</dd>
            <dt>Email</dt>
            <dd>{{ event.owner?.email || '—' }}</dd>
            <dt>{{ $t('form.step1.phone') }}</dt>
            <dd>{{ event.owner?.phone || '—' }}</dd>
            <dt>CVR</dt>
            <dd>{{ event.owner?.companyCvr || '—' }}</dd>
          </dl>
        </article>

        <article class="info-card">
          <p class="card-label">{{ $t('admin.detail.timing') }}</p>
          <dl>
            <dt>{{ $t('admin.detail.submittedAt') }}</dt>
            <dd>{{ formatDateTime(event.createdAt) }}</dd>
            <dt>{{ $t('admin.detail.startTime') }}</dt>
            <dd>{{ formatDateTime(event.startAt) }}</dd>
            <dt>{{ $t('admin.detail.endTime') }}</dt>
            <dd>{{ formatDateTime(event.endAt) }}</dd>
            <dt>{{ $t('admin.detail.setup') }}</dt>
            <dd>{{ formatSetupRange(event.setupStartAt, event.setupEndAt) }}</dd>
          </dl>
        </article>
      </section>

      <section class="department-section">
        <header class="section-heading">
          <div>
            <h2>{{ $t('admin.detail.departmentsTitle') }}</h2>
            <p>{{ $t('admin.detail.departmentsSubtitle') }}</p>
          </div>
        </header>

        <div v-if="departmentsPending || departmentStatusesPending" class="detail-state inline">
          <p>{{ $t('common.loading') }}</p>
        </div>

        <div v-else class="department-grid">
          <article v-for="card in departmentCards" :key="card.id" class="department-card">
            <div class="department-header">
              <h3>{{ card.name }}</h3>
              <Badge
                v-if="card.status"
                :label="getDepartmentStatusLabel(card.status)"
                :variant="departmentStatusVariant[card.status]"
              />
            </div>

            <p v-if="card.updatedAt" class="department-updated">
              {{ $t('admin.detail.departmentUpdated', { date: formatDateTime(card.updatedAt) }) }}
            </p>

            <div v-if="card.status" class="department-controls">
              <DropdownButton
                :model-value="getDraftStatus(card.id, card.status)"
                :options="departmentStatusOptions"
                :button-label="$t('admin.detail.departmentStatusLabel')"
                @select="handleDepartmentStatusSelect(card.id, $event)"
              />
              <Textarea
                :model-value="getDraftNote(card.id, card.note)"
                :label="$t('admin.detail.departmentNoteLabel')"
                :rows="3"
                :disabled="departmentSaving[card.id]"
                @update:model-value="handleDepartmentNoteInput(card.id, $event as string)"
              />
              <div class="department-actions">
                <Button
                  variant="secondary"
                  size="small"
                  :loading="departmentSaving[card.id]"
                  @click="handleDepartmentSave(card.id)"
                >
                  {{ $t('common.save') }}
                </Button>
              </div>
            </div>

            <div v-else class="department-empty">
              <p>{{ $t('admin.detail.departmentUnassigned') }}</p>
              <Button variant="secondary" size="small" :loading="departmentSaving[card.id]" @click="handleDepartmentAssign(card.id)">
                {{ $t('admin.detail.departmentAssign') }}
              </Button>
            </div>

            <p v-if="departmentErrors[card.id]" class="inline-error">
              {{ departmentErrors[card.id] }}
            </p>
          </article>
        </div>
      </section>

      <section class="documents-section">
        <header class="section-heading">
          <div>
            <h2>{{ $t('admin.detail.documentsTitle') }}</h2>
            <p>{{ $t('admin.detail.documentsSubtitle') }}</p>
          </div>
          <Button variant="secondary" size="small" @click="openApproveModal">
            {{ $t('admin.detail.documentsCta') }}
          </Button>
        </header>

        <div class="documents-grid">
          <article class="documents-card">
            <h3>{{ $t('admin.detail.applicationDocuments') }}</h3>
            <ul v-if="applicationDocuments.length" class="document-list">
              <li v-for="doc in applicationDocuments" :key="doc.id">
                <div>
                  <p class="document-name">{{ doc.fileName }}</p>
                  <p class="document-meta">
                    {{ getDocumentKindLabel(doc.kind) }} · {{ formatFileSize(doc.sizeBytes) }} ·
                    {{ formatDateTime(doc.uploadedAt) }}
                  </p>
                </div>
                <div class="document-actions">
                  <Button
                    variant="ghost"
                    size="small"
                    :loading="documentDownloadState[doc.id]"
                    @click="handleDocumentDownload(doc.id, doc.fileName)"
                  >
                    {{ $t('admin.detail.documentDownload') }}
                  </Button>
                </div>
              </li>
            </ul>
            <p v-else class="empty-text">{{ $t('admin.detail.noDocuments') }}</p>
          </article>

          <article class="documents-card">
            <h3>{{ $t('admin.detail.approvalDocuments') }}</h3>
            <ul v-if="approvalDocuments.length" class="document-list">
              <li v-for="doc in approvalDocuments" :key="doc.id">
                <div>
                  <p class="document-name">{{ doc.fileName }}</p>
                  <p class="document-meta">
                    {{ formatFileSize(doc.sizeBytes) }} · {{ formatDateTime(doc.uploadedAt) }}
                  </p>
                </div>
                <div class="document-actions">
                  <Button
                    variant="ghost"
                    size="small"
                    :loading="documentDownloadState[doc.id]"
                    @click="handleDocumentDownload(doc.id, doc.fileName)"
                  >
                    {{ $t('admin.detail.documentDownload') }}
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    :loading="documentDeletingState[doc.id]"
                    @click="handleDocumentDelete(doc.id)"
                  >
                    {{ $t('common.delete') }}
                  </Button>
                </div>
              </li>
            </ul>
            <p v-else class="empty-text">{{ $t('admin.detail.noApprovalDocuments') }}</p>
          </article>
        </div>
      </section>

      <section class="audit-section">
        <header class="section-heading">
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
              <p class="audit-meta">{{ entry.actor?.name || '—' }} · {{ formatDateTime(entry.createdAt) }}</p>
            </div>
            <p v-if="entry.payload?.note" class="audit-note">{{ entry.payload.note }}</p>
          </li>
        </ul>
        <p v-else class="empty-text">{{ $t('admin.detail.noAuditEntries') }}</p>
      </section>
    </template>

    <Modal
      v-model="isApproveModalOpen"
      :title="$t('admin.detail.approvalModal.title')"
      :width="560"
      :dismissible="!isApproving"
      :close-on-esc="!isApproving"
      :actions="approveModalActions"
      @action="handleApproveModalAction"
      @close="resetApprovalModal"
    >
      <p class="modal-intro">{{ $t('admin.detail.approvalModal.body') }}</p>
      <FileUpload
        :label="$t('admin.detail.approvalModal.uploadLabel')"
        :helper-text="$t('admin.detail.approvalModal.uploadHelper')"
        accept=".pdf"
        :items="approvalUploadItems"
        @files-added="handleApprovalFilesAdded"
        @remove="handleApprovalFileRemove"
        @cancel="handleApprovalFileRemove"
      />
      <p v-if="approvalUploadError" class="inline-error">{{ approvalUploadError }}</p>
    </Modal>

    <Modal
      v-model="isRejectModalOpen"
      :title="$t('admin.detail.rejectModal.title')"
      :width="520"
      :actions="rejectModalActions"
      @action="handleRejectModalAction"
      @close="resetRejectModal"
    >
      <p class="modal-intro">{{ $t('admin.detail.rejectModal.body') }}</p>
      <Textarea
        v-model="rejectionNote"
        :label="$t('admin.detail.rejectModal.noteLabel')"
        :rows="4"
        :error="!!rejectionError"
        :error-message="rejectionError || ''"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Button, Badge, DropdownButton, Textarea, FileUpload, Modal } from 'fk-designsystem'
import type { ModalAction, FileUploadItem } from 'fk-designsystem'
import type { inferRouterProxyClient } from '@trpc/client'
import type { DepartmentStatus } from '~/shared/schemas/department-status'
import type { ReviewStatus } from '~/shared/schemas/event'
import type { DocumentKind } from '~/shared/schemas/document'
import type { AppRouter } from '~/server/trpc/routers'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  auth: {
    roles: ['admin'],
  },
})

const route = useRoute()
const router = useRouter()
const { $trpc } = useNuxtApp()
const trpc = $trpc as inferRouterProxyClient<AppRouter>
const { t } = useI18n()

const eventId = computed(() => route.params.id as string)

const {
  data: eventData,
  pending: eventPending,
  error: eventError,
  refresh: refreshEvent,
} = useAsyncData(() => trpc.admin.byId.query({ id: eventId.value }), {
  watch: [eventId],
})

const {
  data: departmentsData,
  pending: departmentsPending,
} = useAsyncData(() => trpc.admin.departments.query(), {})

const {
  data: departmentStatusesData,
  pending: departmentStatusesPending,
  refresh: refreshDepartmentStatuses,
} = useAsyncData(() => trpc.admin.listDepartmentStatuses.query({ eventId: eventId.value }), {
  watch: [eventId],
})

const {
  data: documentsData,
  refresh: refreshDocuments,
} = useAsyncData(() => trpc.documents.list.query({ eventId: eventId.value }), {
  watch: [eventId],
})

const {
  data: auditLogData,
  pending: auditLogPending,
  refresh: refreshAuditLog,
} = useAsyncData(() => trpc.admin.auditLog.query({ eventId: eventId.value }), {
  watch: [eventId],
})

const event = computed(() => eventData.value)
const departments = computed(() => departmentsData.value ?? [])

type DepartmentStatusRow = {
  id: string
  departmentId: string
  status: DepartmentStatus
  note: string | null
  updatedAt: string | null
}

type EventDocumentRow = {
  id: string
  eventId: string
  kind: DocumentKind
  fileName: string
  mimeType: string
  sizeBytes: number
  uploadedAt: string
}

type AuditPayload = {
  fromStatus?: ReviewStatus
  toStatus?: ReviewStatus
  note?: string
  fileName?: string
}

type AuditEntry = {
  id: string
  action: string
  payload?: AuditPayload | null
  createdAt: string
  actor?: { id: string; name: string | null; email: string | null } | null
}

type SelectOption = {
  label: string
  value: string
}

const departmentStatuses = computed<DepartmentStatusRow[]>(() => departmentStatusesData.value ?? [])
const documents = computed<EventDocumentRow[]>(() => documentsData.value ?? [])
const auditEntries = computed<AuditEntry[]>(() => auditLogData.value ?? [])

const reviewStatusVariant: Record<ReviewStatus, import('fk-designsystem').BadgeVariant> = {
  unprocessed: 'neutral',
  in_review: 'info',
  partially_approved: 'warning',
  approved: 'success',
  rejected: 'critical',
}

const departmentStatusVariant: Record<DepartmentStatus, import('fk-designsystem').BadgeVariant> = {
  pending: 'neutral',
  in_review: 'info',
  approved: 'success',
}

const departmentCards = computed(() =>
  departments.value.map((dept) => {
    const status = departmentStatuses.value.find((entry) => entry.departmentId === dept.id)
    return {
      id: dept.id,
      name: dept.name,
      slug: dept.slug,
      status: status?.status ?? null,
      note: status?.note ?? null,
      updatedAt: status?.updatedAt ?? null,
    }
  }),
)

const departmentDraft = reactive<Record<string, { status: DepartmentStatus; note: string }>>({})
const departmentSaving = reactive<Record<string, boolean>>({})
const departmentErrors = reactive<Record<string, string>>({})

const syncDepartmentDrafts = () => {
  departmentCards.value.forEach((card) => {
    if (!card.status) return
    departmentDraft[card.id] = {
      status: card.status,
      note: card.note ?? '',
    }
  })
}

watch(
  departmentCards,
  () => {
    syncDepartmentDrafts()
  },
  { immediate: true },
)

const departmentStatusOptions = computed(() =>
  (['pending', 'in_review', 'approved'] as DepartmentStatus[]).map((status) => ({
    label: getDepartmentStatusLabel(status),
    value: status,
  })),
)

const reviewStatusOptions = computed(() =>
  (['unprocessed', 'in_review', 'partially_approved'] as ReviewStatus[]).map((status) => ({
    label: getReviewStatusLabel(status),
    value: status,
  })),
)

const reviewStatusDraft = ref<ReviewStatus>('unprocessed')
watch(
  () => event.value?.reviewStatus,
  (status) => {
    if (status) reviewStatusDraft.value = status
  },
  { immediate: true },
)

const reviewStatusLoading = ref(false)
const isApproveModalOpen = ref(false)
const isRejectModalOpen = ref(false)
const isApproving = ref(false)
const isRejecting = ref(false)
const rejectionNote = ref('')
const rejectionError = ref<string | null>(null)

const pendingApprovalFiles = ref<File[]>([])
const approvalUploadError = ref<string | null>(null)

const feedbackMessage = ref<{ type: 'success' | 'error'; title: string; text: string } | null>(null)

const MAX_FILE_SIZE = 5 * 1024 * 1024
const APPROVAL_KIND: DocumentKind = 'approval_document'

const approvalUploadItems = computed<FileUploadItem[]>(() =>
  pendingApprovalFiles.value.map((file) => ({
    id: `${file.name}-${file.lastModified}`,
    name: file.name,
    sizeLabel: formatFileSize(file.size),
    status: 'success',
  })),
)

const applicationDocuments = computed(() =>
  documents.value.filter((doc) => doc.kind !== APPROVAL_KIND),
)

const approvalDocuments = computed(() =>
  documents.value.filter((doc) => doc.kind === APPROVAL_KIND),
)

const documentDownloadState = reactive<Record<string, boolean>>({})
const documentDeletingState = reactive<Record<string, boolean>>({})

const approveModalActions = computed<ModalAction[]>(() => [
  {
    id: 'cancel',
    label: t('common.cancel'),
    variant: 'secondary',
    disabled: isApproving.value,
  },
  {
    id: 'approve',
    label: t('admin.detail.approvalModal.confirm'),
    variant: 'primary',
    loading: isApproving.value,
    disabled: pendingApprovalFiles.value.length === 0,
    autoClose: false,
  },
])

const rejectModalActions = computed<ModalAction[]>(() => [
  {
    id: 'cancel',
    label: t('common.cancel'),
    variant: 'secondary',
    disabled: isRejecting.value,
  },
  {
    id: 'reject',
    label: t('admin.detail.rejectModal.confirm'),
    variant: 'danger',
    loading: isRejecting.value,
    autoClose: false,
  },
])

const dateTimeFormatter = new Intl.DateTimeFormat('da-DK', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatDateTime = (value?: string | null) => {
  if (!value) return '—'
  try {
    return dateTimeFormatter.format(new Date(value))
  } catch {
    return value
  }
}

const formatDateRange = (start?: string | null, end?: string | null) => {
  if (!start || !end) return '—'
  return `${formatDateTime(start)} → ${formatDateTime(end)}`
}

const formatSetupRange = (start?: string | null, end?: string | null) => {
  if (!start && !end) return '—'
  if (start && end) return `${formatDateTime(start)} → ${formatDateTime(end)}`
  return formatDateTime(start ?? end)
}

const attendanceLabels: Record<string, string> = {
  '0_50': '0-50',
  '51_200': '51-200',
  '201_500': '201-500',
  '501_1000': '501-1000',
  '1001_5000': '1001-5000',
  '5001_plus': '5001+',
}

const formatAttendanceLabel = (value?: string | null) => attendanceLabels[value ?? ''] || '—'

const getRecurringLabel = (current: { recurring: boolean }) =>
  current.recurring ? t('form.step1.yes') : t('form.step1.no')

const recurringIntervalLabels = computed<Record<string, string>>(() => ({
  daily: t('admin.detail.recurringDaily'),
  weekly: t('admin.detail.recurringWeekly'),
  monthly: t('admin.detail.recurringMonthly'),
}))

const getRecurringIntervalLabel = (value?: string | null) =>
  (value && recurringIntervalLabels.value[value]) || '—'

const getReviewStatusLabel = (status: ReviewStatus) => t(`events.status.${status}`)
const getSubmissionStatus = (status: 'draft' | 'submitted') => t(`events.status.${status}`)
const getDepartmentStatusLabel = (status: DepartmentStatus) =>
  t(`admin.detail.departmentStatuses.${status}`)

const resolveLocation = (current: NonNullable<typeof event.value>) =>
  current.locationAddress || t('admin.detail.locationPending')

const getDocumentKindLabel = (kind: DocumentKind) => {
  switch (kind) {
    case 'attachment':
      return t('admin.detail.documentKinds.attachment')
    case 'construction_certificate':
      return t('admin.detail.documentKinds.certificate')
    case 'plan':
      return t('admin.detail.documentKinds.plan')
    case 'police_approval':
      return t('admin.detail.documentKinds.police')
    case 'approval_document':
      return t('admin.detail.documentKinds.approval')
    default:
      return 'PDF'
  }
}

const getDraftStatus = (id: string, fallback: DepartmentStatus) =>
  departmentDraft[id]?.status ?? fallback

const getDraftNote = (id: string, fallback: string | null) =>
  departmentDraft[id]?.note ?? fallback ?? ''

const updateDepartmentDraftStatus = (id: string, status: DepartmentStatus) => {
  const draft = departmentDraft[id] ?? { status, note: '' }
  draft.status = status
  departmentDraft[id] = draft
}

const updateDepartmentDraftNote = (id: string, value: string) => {
  const draft = departmentDraft[id] ?? { status: 'pending', note: value }
  draft.note = value
  departmentDraft[id] = draft
}

const handleDepartmentStatusSelect = (departmentId: string, option: SelectOption) => {
  updateDepartmentDraftStatus(departmentId, option.value as DepartmentStatus)
}

const handleDepartmentNoteInput = (departmentId: string, value: string) => {
  updateDepartmentDraftNote(departmentId, value)
}

const setFeedback = (type: 'success' | 'error', text: string) => {
  feedbackMessage.value = {
    type,
    title: type === 'success' ? t('common.success') : t('common.error'),
    text,
  }
}

const refreshAll = async () => {
  await Promise.all([refreshEvent(), refreshDepartmentStatuses(), refreshDocuments(), refreshAuditLog()])
}

const handleReviewStatusChange = async (status: ReviewStatus) => {
  await updateReviewStatus(status)
}

const onReviewStatusSelect = async (option: { value: string }) => {
  const status = option.value as ReviewStatus
  if (status === 'approved') {
    openApproveModal()
    return
  }
  if (status === 'rejected') {
    openRejectModal()
    return
  }
  await updateReviewStatus(status)
}

const updateReviewStatus = async (status: ReviewStatus, note?: string) => {
  if (!event.value) return
  try {
    reviewStatusLoading.value = true
    await trpc.admin.updateReviewStatus.mutate({
      id: event.value.id,
      reviewStatus: status,
      note,
    })
    setFeedback('success', t('admin.detail.messages.statusUpdated'))
    await refreshAll()
  } catch (error) {
    console.error(error)
    setFeedback('error', t('admin.detail.messages.statusFailed'))
  } finally {
    reviewStatusLoading.value = false
  }
}

const handleDepartmentAssign = async (departmentId: string) => {
  if (!event.value) return
  try {
    departmentSaving[departmentId] = true
    departmentErrors[departmentId] = ''
    await trpc.admin.setDepartmentStatus.mutate({
      eventId: event.value.id,
      departmentId,
      status: 'pending',
      note: null,
    })
    await refreshDepartmentStatuses()
    setFeedback('success', t('admin.detail.messages.departmentAssigned'))
  } catch (error) {
    console.error(error)
    departmentErrors[departmentId] = t('admin.detail.messages.departmentFailed')
  } finally {
    departmentSaving[departmentId] = false
  }
}

const handleDepartmentSave = async (departmentId: string) => {
  if (!event.value) return
  const draft = departmentDraft[departmentId]
  if (!draft) return
  try {
    departmentSaving[departmentId] = true
    departmentErrors[departmentId] = ''
    await trpc.admin.setDepartmentStatus.mutate({
      eventId: event.value.id,
      departmentId,
      status: draft.status,
      note: draft.note,
    })
    await refreshDepartmentStatuses()
    setFeedback('success', t('admin.detail.messages.departmentSaved'))
  } catch (error) {
    console.error(error)
    departmentErrors[departmentId] = t('admin.detail.messages.departmentFailed')
  } finally {
    departmentSaving[departmentId] = false
  }
}

const handleApprovalFilesAdded = (files: FileList) => {
  const accepted: File[] = []
  const errors: string[] = []
  Array.from(files).forEach((file) => {
    if (file.size > MAX_FILE_SIZE) {
      errors.push(t('admin.detail.approvalModal.fileTooLarge', { name: file.name }))
      return
    }
    if (file.type !== 'application/pdf') {
      errors.push(t('admin.detail.approvalModal.fileWrongType', { name: file.name }))
      return
    }
    accepted.push(file)
  })
  approvalUploadError.value = errors.join('\n') || null
  if (!accepted.length) return
  const next = [...pendingApprovalFiles.value]
  accepted.forEach((file) => {
    if (!next.find((existing) => existing.name === file.name && existing.size === file.size)) {
      next.push(file)
    }
  })
  pendingApprovalFiles.value = next
}

const handleApprovalFileRemove = (item?: FileUploadItem) => {
  if (!item) {
    pendingApprovalFiles.value = []
    return
  }
  pendingApprovalFiles.value = pendingApprovalFiles.value.filter(
    (file) => `${file.name}-${file.lastModified}` !== item.id,
  )
}

const readFileAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        const base64 = result.split(',')[1] || ''
        resolve(base64)
      } else {
        reject(new Error('Invalid file result'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const handleApproveModalAction = async (action: ModalAction) => {
  if (action.id === 'cancel') {
    resetApprovalModal()
    return
  }
  if (action.id === 'approve') {
    await handleApproveConfirm()
  }
}

const handleApproveConfirm = async () => {
  if (!event.value || pendingApprovalFiles.value.length === 0) {
    approvalUploadError.value = t('admin.detail.approvalModal.validation.files')
    return
  }
  try {
    isApproving.value = true
    approvalUploadError.value = null
    for (const file of pendingApprovalFiles.value) {
      const content = await readFileAsBase64(file)
      await trpc.documents.upload.mutate({
        eventId: event.value.id,
        kind: APPROVAL_KIND,
        fileName: file.name,
        mimeType: 'application/pdf',
        sizeBytes: file.size,
        content,
      })
    }
    await updateReviewStatus('approved')
    resetApprovalModal()
    await refreshDocuments()
  } catch (error) {
    console.error(error)
    approvalUploadError.value = t('admin.detail.approvalModal.error')
  } finally {
    isApproving.value = false
  }
}

const handleRejectModalAction = async (action: ModalAction) => {
  if (action.id === 'cancel') {
    resetRejectModal()
    return
  }
  if (action.id === 'reject') {
    await handleRejectConfirm()
  }
}

const handleRejectConfirm = async () => {
  if (!rejectionNote.value.trim()) {
    rejectionError.value = t('admin.detail.rejectModal.validation')
    return
  }
  if (!event.value) return
  try {
    isRejecting.value = true
    rejectionError.value = null
    await updateReviewStatus('rejected', rejectionNote.value.trim())
    resetRejectModal()
  } catch (error) {
    console.error(error)
    rejectionError.value = t('admin.detail.rejectModal.error')
  } finally {
    isRejecting.value = false
  }
}

const handleDocumentDownload = async (id: string, fileName: string) => {
  try {
    documentDownloadState[id] = true
    const doc = await trpc.documents.get.query({ id })
    if (import.meta.client) {
      const binary = atob(doc.content)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: doc.mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error(error)
    setFeedback('error', t('admin.detail.messages.documentDownloadFailed'))
  } finally {
    documentDownloadState[id] = false
  }
}

const handleDocumentDelete = async (id: string) => {
  try {
    documentDeletingState[id] = true
    await trpc.documents.delete.mutate({ id })
    await Promise.all([refreshDocuments(), refreshAuditLog()])
    setFeedback('success', t('admin.detail.messages.documentDeleted'))
  } catch (error) {
    console.error(error)
    setFeedback('error', t('admin.detail.messages.documentDeleteFailed'))
  } finally {
    documentDeletingState[id] = false
  }
}

const formatAuditAction = (entry: (typeof auditEntries.value)[number]) => {
  const mapping: Record<string, string> = {
    create: t('admin.detail.audit.actions.create'),
    update: t('admin.detail.audit.actions.update'),
    status_change: t('admin.detail.audit.actions.status'),
    add_document: t('admin.detail.audit.actions.addDocument'),
    remove_document: t('admin.detail.audit.actions.removeDocument'),
  }
  const label = mapping[entry.action] ?? entry.action
  if (entry.action === 'status_change' && entry.payload?.toStatus) {
    return `${label}: ${getReviewStatusLabel(entry.payload.toStatus as ReviewStatus)}`
  }
  if (entry.action === 'add_document' && entry.payload?.fileName) {
    return `${label}: ${entry.payload.fileName}`
  }
  if (entry.action === 'remove_document' && entry.payload?.fileName) {
    return `${label}: ${entry.payload.fileName}`
  }
  return label
}

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const openApproveModal = () => {
  isApproveModalOpen.value = true
}

const resetApprovalModal = () => {
  if (isApproving.value) return
  isApproveModalOpen.value = false
  pendingApprovalFiles.value = []
  approvalUploadError.value = null
}

const openRejectModal = () => {
  isRejectModalOpen.value = true
}

const resetRejectModal = () => {
  if (isRejecting.value) return
  isRejectModalOpen.value = false
  rejectionNote.value = ''
  rejectionError.value = null
}

const handleBack = () => {
  router.push('/admin')
}

// Keep hero layout in sync with docs/Images/admin/detaljeside*.png mockups.
</script>

<style scoped lang="scss">
.admin-event-detail {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.detail-hero {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hero-title h1 {
  font-size: 28px;
  margin: 0;
}

.hero-meta {
  margin: 0;
  color: #4b5563;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.detail-feedback {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 12px;
}

.detail-feedback.is-success {
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
}

.detail-feedback.is-error {
  background: #fef2f2;
  border: 1px solid #fca5a5;
}

.detail-state {
  padding: 32px;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}

.detail-state.inline {
  padding: 16px;
}

.case-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.case-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
}

.case-status-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.case-secondary {
  margin-top: 12px;
  color: #6b7280;
}

.card-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.info-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 20px;
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.info-id {
  font-size: 12px;
  color: #6b7280;
}

.info-card dl {
  display: grid;
  grid-template-columns: 140px 1fr;
  row-gap: 8px;
  column-gap: 12px;
  font-size: 14px;
}

.info-card dt {
  font-weight: 600;
  color: #4b5563;
}

.department-section,
.documents-section,
.audit-section {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.department-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.department-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.department-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.department-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.department-actions {
  display: flex;
  justify-content: flex-end;
}

.department-empty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #6b7280;
}

.inline-error {
  color: #b91c1c;
  font-size: 14px;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.documents-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.document-name {
  font-weight: 600;
  margin: 0;
}

.document-meta,
.audit-meta,
.audit-note {
  color: #6b7280;
  margin: 0;
}

.document-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.audit-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audit-action {
  font-weight: 600;
  margin: 0;
}

.empty-text {
  color: #6b7280;
  margin: 0;
}

.modal-intro {
  margin-bottom: 16px;
  color: #4b5563;
}

@media (max-width: 640px) {
  .info-card dl {
    grid-template-columns: 1fr;
  }
}
</style>
