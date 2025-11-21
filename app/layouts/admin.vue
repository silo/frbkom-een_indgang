<template>
  <div class="admin-layout bg-secondary">
    <header class="admin-header">
      <nav class="admin-nav" aria-label="Admin navigation">
        <NuxtLink to="/admin" class="admin-logo-link" aria-label="Frederiksberg Kommune">
          <img src="/fk-logo.svg" alt="Frederiksberg Kommune" width="177" height="40" class="admin-logo">
        </NuxtLink>
        <AvatarDropdown
          class="admin-account"
          :name="avatarName"
          :status="avatarStatus"
          :initials="avatarInitials"
          :bottom-items="avatarBottomItems"
          @select="handleAvatarSelect"
        />
      </nav>
    </header>

    <main :class="mainClasses">
      <div class="admin-main-inner">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AvatarDropdown } from 'fk-designsystem'
import type { AvatarDropdownItem } from 'fk-designsystem'

const { user } = useUserSession()
const { t } = useI18n()
const route = useRoute()

const avatarName = computed(() => user.value?.name?.trim() || t('nav.adminUser'))
const avatarStatus = computed(() => t('nav.adminUser'))
const avatarInitials = computed(() => {
  const name = user.value?.name?.trim()
  if (name) {
    const letters = name
      .split(/\s+/)
      .map((part: string) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
    if (letters.length) {
      return letters.join('').toUpperCase()
    }
  }
  return 'FK'
})

const avatarBottomItems = computed<AvatarDropdownItem[]>(() => [
  {
    label: t('nav.logout'),
    iconName: 'fa7-solid:arrow-right-from-bracket',
    value: 'logout',
    color: '#D8251C',
  },
])

const handleAvatarSelect = (item: AvatarDropdownItem) => {
  if (item.value === 'logout') {
    navigateTo('/api/admin-auth/logout', { external: true })
  }
}

const mainClasses = computed(() => {
  const classes = ['admin-main']
  if (route.path.startsWith('/admin/events/')) {
    classes.push('bg-secondary')
  } else {
    classes.push('bg-surface')
  }
  return classes
})
</script>
