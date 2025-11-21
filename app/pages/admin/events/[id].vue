<template>
  <div class="admin-detail">
    <header class="detail-header">
      <Button variant="secondary" icon-name="fa7-solid:arrow-left" @click="handleBack">
        {{ $t('admin.detail.back') }}
      </Button>

      <div v-if="event" class="detail-status">
        <div>
          <p class="status-label">{{ $t('admin.detail.reviewStatus') }}</p>
          <span class="status-badge" :class="getStatusBadgeClass(event.reviewStatus)">
            {{ getStatusLabel(event.reviewStatus) }}
          </span>
        </div>
        <div>
          <p class="status-label">{{ $t('admin.detail.submissionStatus') }}</p>
          <span class="status-muted">{{ getSubmissionStatus(event.status) }}</span>
        </div>
      </div>
    </header>

    <section v-if="pending" class="detail-state">
      <p>{{ $t('common.loading') }}</p>
    </section>

    <section v-else-if="error" class="detail-state">
      <p>{{ $t('common.error') }}</p>
      <Button variant="secondary" @click="refresh">
        {{ $t('common.retry') }}
      </Button>
    </section>

    <section v-else-if="event" class="detail-content">
      <div class="info-grid">
        <article class="info-card">
          <h2>{{ $t('admin.detail.basicInfo') }}</h2>
          <dl>
            <dt>{{ $t('admin.detail.eventId') }}</dt>
            <dd>{{ event.id }}</dd>
            <dt>{{ $t('admin.table.event') }}</dt>
            <dd>{{ event.title }}</dd>
            <dt>{{ $t('admin.detail.purpose') }}</dt>
            <dd>{{ event.purpose }}</dd>
            <dt>{{ $t('admin.detail.location') }}</dt>
            <dd>{{ event.locationAddress || '—' }}</dd>
          </dl>
        </article>

        <article class="info-card">
          <h2>{{ $t('admin.detail.contact') }}</h2>
          <dl>
            <dt>{{ $t('admin.table.applicant') }}</dt>
            <dd>{{ event.owner?.name || '—' }}</dd>
            <dt>Email</dt>
            <dd>{{ event.owner?.email || '—' }}</dd>
            <dt>Telefon</dt>
            <dd>{{ event.owner?.phone || '—' }}</dd>
          </dl>
        </article>

        <article class="info-card">
          <h2>{{ $t('admin.detail.timing') }}</h2>
          <dl>
            <dt>{{ $t('admin.detail.submittedAt') }}</dt>
            <dd>{{ formatDateTime(event.createdAt) }}</dd>
            <dt>Start</dt>
            <dd>{{ formatDateTime(event.startAt) }}</dd>
            <dt>Slut</dt>
            <dd>{{ formatDateTime(event.endAt) }}</dd>
          </dl>
        </article>
      </div>

      <div class="placeholder-panel">
        <p>{{ $t('admin.detail.upcomingSections') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from 'fk-designsystem'
import type { inferRouterProxyClient } from '@trpc/client'
import type { ReviewStatus } from '~/shared/schemas/event'
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

const { data, pending, error, refresh } = useAsyncData(() => trpc.admin.byId.query({ id: eventId.value }), {
  watch: [eventId],
})

const event = computed(() => data.value)

const dateFormatter = new Intl.DateTimeFormat('da-DK', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatDateTime = (value?: string | null) => {
  if (!value) return '—'
  try {
    return dateFormatter.format(new Date(value))
  } catch {
    return value
  }
}

const handleBack = () => {
  router.push('/admin')
}

const statusClassMap: Record<ReviewStatus, string> = {
  unprocessed: 'badge-neutral',
  in_review: 'badge-info',
  partially_approved: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-critical',
}

const getStatusBadgeClass = (status: ReviewStatus) => statusClassMap[status] ?? 'badge-neutral'
const getStatusLabel = (status: ReviewStatus) => t(`events.status.${status}`)
const getSubmissionStatus = (status: 'draft' | 'submitted') => t(`events.status.${status}`)
</script>

<style scoped lang="scss">
.admin-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.detail-status {
  display: flex;
  gap: 24px;
}

.status-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 4px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.status-muted {
  font-weight: 600;
  color: #111827;
}

.badge-neutral {
  background: #e2e8f0;
}

.badge-info {
  background: #c7d2fe;
}

.badge-warning {
  background: #fde68a;
}

.badge-success {
  background: #bbf7d0;
}

.badge-critical {
  background: #fecaca;
}

.detail-state {
  padding: 32px;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.info-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 20px;
}

.info-card h2 {
  margin-bottom: 12px;
  font-size: 18px;
}

.info-card dl {
  display: grid;
  grid-template-columns: 140px 1fr;
  row-gap: 8px;
  column-gap: 16px;
  font-size: 14px;
}

.info-card dt {
  font-weight: 600;
  color: #4b5563;
}

.info-card dd {
  margin: 0;
  color: #111827;
}

.placeholder-panel {
  border: 2px dashed #cbd5f5;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #4b5563;
  background: #f8fafc;
}

@media (max-width: 640px) {
  .info-card dl {
    grid-template-columns: 1fr;
  }
}
</style>
