import type { Ref } from 'vue'

export interface StepControlHandlers {
  onNext?: () => Promise<void> | void
  onSubmit?: () => Promise<void> | void
}

export const useStepControls = (): Ref<StepControlHandlers> => {
  return useState<StepControlHandlers>('step-controls', () => ({}))
}
