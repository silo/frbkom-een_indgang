<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">{{ $t('admin.dashboard') }}</p>
        <h1>{{ $t('admin.allEvents') }}</h1>
      </div>
      <p class="result-count">
        {{ events.length }}
      </p>
    </header>

    <section class="events-panel">
      <div class="panel-header">
        <h2>{{ $t('admin.allEvents') }}</h2>
        <span class="result-count">{{ events.length }}</span>
      </div>

      <div v-if="pending" class="panel-state">
        <p>{{ $t('common.loading') }}</p>
      </div>

      <div v-else-if="error" class="panel-state">
        <p>{{ $t('common.error') }}</p>
        <button type="button" class="retry-button" @click="refresh">
          {{ $t('common.retry') }}
        </button>
      </div>

      <div v-else-if="!events.length" class="panel-state">
        <h3>{{ $t('admin.empty.title') }}</h3>
        <p>{{ $t('admin.empty.subtitle') }}</p>
      </div>

      <div v-else class="table-wrapper">
        <Table
          class="events-table"
          :pagination="false"
          :columns="tableColumns"
          :rows="events"
          row-key="id"
        >
          <template #cell-event="{ row }">
            <p class="event-title">{{ row.title }}</p>
            <p class="event-purpose">{{ row.purpose }}</p>
          </template>

          <template #cell-applicant="{ row }">
            <p class="applicant-name">{{ row.owner?.name || '—' }}</p>
            <p class="applicant-email">{{ row.owner?.email || '—' }}</p>
          </template>

          <template #cell-submitted="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>

          <template #cell-status="{ row }">
            <span class="status-badge" :class="getStatusBadgeClass(row.reviewStatus)">
              {{ getStatusLabel(row.reviewStatus) }}
            </span>
          </template>

          <template #cell-actions="{ row }">
            <NuxtLink class="table-link" :to="`/admin/events/${row.id}`">
              {{ $t('admin.table.open') }}
            </NuxtLink>
          </template>
        </Table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { inferRouterProxyClient } from '@trpc/client'
import { Table } from 'fk-designsystem'
import type { ReviewStatus } from '~/shared/schemas/event'
import type { AppRouter } from '~/server/trpc/routers'
import type { TableColumn } from 'fk-designsystem'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  auth: {
    roles: ['admin'],
  },
})

const { $trpc } = useNuxtApp()
const trpc = $trpc as inferRouterProxyClient<AppRouter>
const { t } = useI18n()

const fetchEvents = () =>
  trpc.admin.listAll.query({
    status: 'submitted',
    limit: 50,
  })

type AdminEventList = Awaited<ReturnType<typeof fetchEvents>>

const { data, pending, error, refresh } = useAsyncData<AdminEventList>('admin-events', () => fetchEvents(), {
  immediate: false,
  server: false,
})

onMounted(() => {
  refresh()
})

const events = computed<AdminEventList>(() => data.value ?? [])

const dateFormatter = new Intl.DateTimeFormat('da-DK', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const statusClassMap: Record<ReviewStatus, string> = {
  unprocessed: 'badge-neutral',
  in_review: 'badge-info',
  partially_approved: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-critical',
}

const tableColumns = computed<TableColumn[]>(() => [
  { key: 'event', label: t('admin.table.event'), width: '32%' },
  { key: 'applicant', label: t('admin.table.applicant'), width: '22%' },
  { key: 'submitted', label: t('admin.table.submitted'), width: '18%' },
  { key: 'status', label: t('admin.table.status'), width: '16%' },
  { key: 'actions', label: t('admin.table.actions'), align: 'right', width: '12%' },
])

const formatDateTime = (value?: string | null) => {
  if (!value) return '—'
  try {
    return dateFormatter.format(new Date(value))
  } catch {
    return value
  }
}

const getStatusLabel = (status: ReviewStatus) => t(`events.status.${status}`)
const getStatusBadgeClass = (status: ReviewStatus) => statusClassMap[status] ?? 'badge-neutral'
</script>

<style scoped lang="scss">
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 4px 0 0;
}

.eyebrow {
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5a6a85;
}

.result-count {
  font-size: 16px;
  color: #6b7280;
}


.status-badge {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
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

.events-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 0 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}


.table-wrapper {
  overflow-x: auto;
}

.events-table {
  width: 100%;
}

.event-title {
  font-weight: 600;
  color: #111827;
}

.event-purpose {
  color: #6b7280;
  font-size: 14px;
  margin-top: 4px;
}

.applicant-name {
  font-weight: 500;
  color: #111827;
}

.applicant-email {
  color: #4b5563;
  font-size: 14px;
}

.panel-state {
  padding: 32px 20px;
  text-align: center;
  color: #4b5563;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.retry-button {
  align-self: center;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #111827;
  background: transparent;
  font-weight: 600;
  cursor: pointer;
}

.table-link {
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.table-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .events-table th,
  .events-table td {
    padding: 12px;
  }
}
</style>
