<template>
  <main class="dev-login">
    <div class="dev-login__layout">
      <section class="dev-login__intro">
        <p class="eyebrow">Kun udviklingsmiljø</p>
        <h1 class="heading-2xl">Simuler MitID-login</h1>
        <p class="text-l">
          Brug denne side til at teste flowet uden Nets eID broker. Sessionen bruger kun mock-data og påvirker ikke rigtige borgere.
        </p>

        <div class="dev-login__info-grid" aria-live="polite">
          <div class="info-card">
            <p class="info-label">Aktivt miljø</p>
            <p class="info-value">{{ environmentLabel }}</p>
          </div>
          <div class="info-card">
            <p class="info-label">Redirect efter login</p>
            <p class="info-value">{{ decodedReturnTo }}</p>
          </div>
        </div>
      </section>

      <section class="dev-login__panel" aria-labelledby="dev-login-form-heading">
        <div class="panel-header">
          <Badge label="Kun udvikling" variant="warning" icon-name="fa7-solid:flask" />
          <div>
            <h2 id="dev-login-form-heading" class="heading-xl">Log ind som testbruger</h2>
            <p class="text-m text-muted">
              Vælg en rolle, giv brugeren et navn og vi genererer en session, så du kan teste formularen fra brugerens perspektiv.
            </p>
          </div>
        </div>

        <form class="panel-form" @submit.prevent="handleLogin">
          <div class="form-section">
            <h3 class="heading-s">1. Vælg rolle</h3>
            <RadioGroup
              id="dev-login-role"
              v-model="role"
              name="dev-login-role"
              :options="roleOptions"
              orientation="horizontal"
            />
          </div>

          <div class="form-section">
            <Input
              id="dev-login-name"
              v-model="name"
              label="Visningsnavn (valgfrit)"
              placeholder="fx. Dev Borger"
              :hint="'Bruges kun i denne testsession'"
            />
          </div>

          <div class="form-section form-actions">
            <Button
              type="submit"
              variant="primary"
              icon-name="fa7-solid:arrow-right-to-bracket"
              :loading="loading"
            >
              Log ind
            </Button>
            <Button
              type="button"
              variant="secondary"
              :disabled="loading"
              @click="handleCancel"
            >
              Annuller
            </Button>
          </div>

          <div v-if="errorMessage" class="dev-login__error" role="alert">
            {{ errorMessage }}
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { createError } from 'h3'
import { computed, ref } from 'vue'
import { Badge, Button, Input, RadioGroup } from 'fk-designsystem'

const config = useRuntimeConfig()

if (!config.public.enableDevAuth) {
  if (import.meta.server) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  } else {
    await navigateTo('/', { replace: true })
  }
}

const session = useUserSession()
const route = useRoute()
const fallbackPath = '/application/contact-info'

const encodedReturnTo = computed(() => {
  const value = route.query.returnTo
  return typeof value === 'string' ? value : encodeURIComponent(fallbackPath)
})

const decodedReturnTo = computed(() => {
  try {
    const decoded = decodeURIComponent(encodedReturnTo.value)
    return decoded.startsWith('/') ? decoded : fallbackPath
  } catch {
    return fallbackPath
  }
})

const environmentLabel = computed(() =>
  config.public.netsEnvironment === 'production' ? 'Production' : 'Preproduction',
)

const roleOptions = [
  { label: 'Borger (ansøger)', value: 'user' },
  { label: 'Sagsbehandler', value: 'admin' },
] as const

const role = ref<'user' | 'admin'>('user')
const name = ref('')
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const handleCancel = async () => {
  await navigateTo('/', { replace: true })
}

const handleLogin = async () => {
  if (!config.public.enableDevAuth) {
    errorMessage.value = 'Development auth is disabled.'
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    await $fetch('/api/auth/dev-login', {
      method: 'POST',
      body: {
        role: role.value,
        name: name.value || undefined,
      },
    })

    await session.fetch()
    await navigateTo(decodedReturnTo.value, { replace: true })
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else if (typeof error === 'object' && error && 'statusMessage' in error) {
      errorMessage.value = (error as { statusMessage?: string }).statusMessage || 'Login mislykkedes.'
    } else {
      errorMessage.value = 'Login mislykkedes.'
    }
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'default',
})
</script>

<style scoped lang="scss">
.dev-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f5ff 0%, #f8f8f8 60%, #ffffff 100%);
  padding: 48px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dev-login__layout {
  width: min(1200px, 100%);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.dev-login__intro {
  background: #051937;
  color: #fff;
  border-radius: 32px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 60px rgba(5, 25, 55, 0.35);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
  color: #8cb9ff;
}

.dev-login__info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.info-card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 6px;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.dev-login__panel {
  background: #fff;
  border-radius: 32px;
  padding: 40px;
  border: 1px solid #ebebeb;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.panel-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-actions {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
}

.dev-login__error {
  border-radius: 12px;
  border: 1px solid #f5c0c0;
  background: #fff5f5;
  color: #8c1c1c;
  padding: 12px 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .dev-login {
    padding: 32px 16px;
  }

  .dev-login__panel,
  .dev-login__intro {
    padding: 28px;
    border-radius: 24px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
