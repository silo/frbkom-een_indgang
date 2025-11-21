<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <h1>
        {{ t('admin.allEvents') }}
        <span class="dashboard-count-badge">
          {{ t('admin.applicationsCount', { count: events.length }) }}
        </span>
      </h1>
    </header>

    <section>
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

      <Table
        v-else
        class="fk-table events-table"
        :pagination="false"
        :columns="tableColumns"
        :rows="events"
        row-key="id"
      >
        <template #cell-title="{ row }">
          <p class="event-title">{{ row.title }}</p>
          <p class="event-location">{{ formatLocation(row) }}</p>
        </template>

        <template #cell-type="{ row }">
          <p class="event-meta-text">{{ formatTypeTags(row.typeTags) }}</p>
        </template>

        <template #cell-date="{ row }">
          <p class="event-meta-text">{{ formatEventDate(row) }}</p>
        </template>

        <template #cell-departments="{ row }">
          <p class="event-meta-text">{{ formatDepartments(row.departments) }}</p>
        </template>

        <template #cell-status="{ row }">
          <span class="status-badge" :class="getStatusBadgeClass(row.reviewStatus)">
            {{ getStatusLabel(row.reviewStatus) }}
          </span>
        </template>

        <template #cell-actions="{ row }">
          <NuxtLink class="table-link" :to="`/admin/events/${row.id}`">
            {{ $t('admin.table.openApplication') }}
          </NuxtLink>
        </template>
      </Table>
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
type AdminEvent = Record<string, any>

const statusClassMap: Record<ReviewStatus, string> = {
  unprocessed: 'badge-neutral',
  in_review: 'badge-neutral',
  partially_approved: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-critical',
}

const tableColumns = computed<TableColumn[]>(() => [
  { key: 'title', label: t('admin.table.eventTitle'), width: '30%' },
  { key: 'type', label: t('admin.table.type'), width: '18%' },
  { key: 'date', label: t('admin.table.date'), width: '16%' },
  { key: 'departments', label: t('admin.table.department'), width: '20%' },
  { key: 'status', label: t('admin.table.status'), width: '10%' },
  { key: 'actions', label: '', align: 'right', width: '6%' },
])

const formatLocation = (event: AdminEvent) =>
  event.locationAddress || event.locationPreset?.name || t('admin.detail.locationPending')

const eventDateFormatter = new Intl.DateTimeFormat('da-DK', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const formatEventDate = (event: AdminEvent) => {
  if (!event.startAt) return '—'
  try {
    const start = new Date(event.startAt)
    const end = event.endAt ? new Date(event.endAt) : null
    const startLabel = eventDateFormatter.format(start)
    if (!end) {
      return startLabel
    }
    const sameDay = start.toDateString() === end.toDateString()
    const endLabel = eventDateFormatter.format(end)
    return sameDay ? startLabel : `${startLabel} - ${endLabel}`
  } catch {
    return '—'
  }
}

const formatTypeTags = (tags?: { name: string }[]) => {
  if (!tags?.length) return '—'
  return tags.map((tag) => tag.name).join(', ')
}

const formatDepartments = (departments?: string[]) => {
  if (!departments?.length) return '—'
  return departments.join(', ')
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

.dashboard-count-badge {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 2px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  background: #e2e8f0;
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

.events-table {
  width: 100%;
}

.event-title {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #111827;
}

.event-location {
  margin-top: 4px;
  font-size: 14px;
  line-height: 20px;
  color: #6a6a6a;
}

.event-meta-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-text-tertiary, #6a6a6a);
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
  font-size: 14px;
  line-height: 20px;
  color: var(--text-text-brand, #0a6b3e);
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
