<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <NuxtLink to="/">
          <img src="/fk-logo.svg" alt="Frederiksberg Kommune" height="40" />
        </NuxtLink>
      </div>

      <div class="sidebar-body">
        <div class="sidebar-intro">
          <h3 class="heading-m pb-24">{{ $t('form.createEvent') }}</h3>
          <p class="text-m text-muted">
            Giv os de praktiske detaljer, så vi kan sætte gang i dit arrangement!
          </p>
        </div>

        <div class="sidebar-steps">
          <ClientOnly>
            <VerticalStepper
              v-if="formStore.steps"
              v-model="selectedStepIndex"
              :items="stepperItems"
              :clickable="true"
            />
          </ClientOnly>
        </div>
      </div>

      <nav class="sidebar-bottom">
        <a href="#" class="bottom-link">Regler og vilkår</a>
        <span class="bottom-sep" aria-hidden="true" />
        <a href="#" class="bottom-link">Datasikkerhed</a>
        <span class="bottom-sep" aria-hidden="true" />
        <a href="#" class="bottom-link">Kontakt</a>
      </nav>
    </aside>

    <!-- Content -->
        <section class="content">
          <div class="topbar">
            <ClientOnly>
              <Button variant="secondary" icon-name="fa7-solid:arrow-left" @click="handleBack">
                Tilbage
              </Button>
            </ClientOnly>
            <div class="topbar-right" />
          </div>

      <div class="main">
        <div class="main-inner">
          <slot />

          <div class="bottom-cta">
            <ClientOnly>
              <Button
                v-if="!formStore.isLastStep"
                variant="primary"
                :full-width="true"
                icon-name="fa7-solid:arrow-right"
                icon-position="right"
                @click="handleNext"
              >
                Gå videre
              </Button>
              <Button
                v-else
                variant="primary"
                :full-width="true"
                :disabled="!formStore.canSubmit || !hasSubmitHandler"
                @click="handleSubmit"
              >
                Indsend ansøgning
              </Button>
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, VerticalStepper } from 'fk-designsystem'
import { useEventFormStore } from '../stores/event-form'
import { useStepControls } from '../composables/useStepControls'
import { useStepCompletion } from '../composables/useStepCompletion'

const router = useRouter()
const formStore = useEventFormStore()
const stepControls = useStepControls()
const { stepStatuses } = useStepCompletion()

if (!stepControls.value) {
  stepControls.value = {}
}

const hasSubmitHandler = computed(() => Boolean(stepControls.value && stepControls.value.onSubmit))

const stepStatusMap = computed(() => {
  const map = new Map<number, { total: number; missingCount: number }>()
  stepStatuses.value.forEach((status) => {
    map.set(status.id, { total: status.total, missingCount: status.missingCount })
  })
  return map
})

const stepperItems = computed(() => {
  if (!formStore.steps) return []

  const statuses = stepStatusMap.value

  return formStore.steps.map((step) => {
    const status = statuses.get(step.id)
    const total = status?.total ?? 1
    const filled = status ? total - status.missingCount : step.completed ? 1 : 0

    return {
      label: step.title,
      id: step.id,
      filled,
      total,
      disabled: false,
    }
  })
})

const selectedStepIndex = computed({
  get: () => formStore.currentStep - 1,
  set: (index) => {
    const target = formStore.steps[index]
    if (!target) return
    formStore.goToStep(target.id)
    router.push(target.path)
  },
})

const handleBack = () => {
  if (formStore.isFirstStep) {
    router.push('/')
  } else {
    const previous = formStore.currentStep - 2
    const target = formStore.steps[previous]
    if (target) {
      formStore.goToStep(target.id)
      router.push(target.path)
    }
  }
}

const handleNext = async () => {
  if (!stepControls.value || !stepControls.value.onNext) {
    return
  }
  await stepControls.value.onNext()
}

const handleSubmit = async () => {
  if (!stepControls.value || !stepControls.value.onSubmit) {
    return
  }
  await stepControls.value.onSubmit()
}
</script>

<style scoped lang="scss">
:global(body) {
  background: #f7f7f7;
}

.layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: white;
  border-right: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  padding-bottom: 32px;
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  overflow: hidden;
}

.sidebar-body {
  flex: 1 1 auto;
  overflow-y: auto;
}

.sidebar-top {
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 24px;
  border-bottom: 1px solid #ebebeb;

  img,
  svg {
    height: 40px;
  }
}

.sidebar-intro {
  padding: 32px 24px 24px;
  border-bottom: 1px solid #ebebeb;
  margin-bottom: 24px;
}

.sidebar-steps {
  padding: 0 24px 24px;

  :deep(.fk-vertical-stepper-sub) {
    display: none;
  }
}

.sidebar-bottom {
  margin-top: auto;
  padding: 32px 24px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.bottom-link {
  font-size: 14px;
  color: #6a6a6a;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.bottom-sep {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #ebebeb;
}

.content {
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #ebebeb;
  background: white;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.main {
  padding: 32px;
  background: #f7f7f7;
  flex: 1;
}

.main-inner {
  max-width: 560px;
  margin: 0 auto;
}

.bottom-cta {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.heading-m {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

.text-m {
  font-size: 16px;
  line-height: 1.5;
}

.text-muted {
  color: #6a6a6a;
}

.pb-24 {
  padding-bottom: 24px;
}
</style>
