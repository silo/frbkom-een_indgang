import type { DefineComponent } from 'vue'

declare module 'fk-designsystem' {
  export const Button: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const Input: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const RadioGroup: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const DropdownButton: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const Checkbox: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const Textarea: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const Badge: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const VerticalStepper: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const FileUpload: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>

  export type FileUploadItemStatus = 'queued' | 'uploading' | 'success' | 'error'
  export interface FileUploadItem {
    id: string
    name: string
    sizeLabel: string
    progress?: number
    status?: FileUploadItemStatus
  }
  export interface FileUploadProps {
    label?: string
    helperText?: string
    disabled?: boolean
    multiple?: boolean
    accept?: string
    items?: FileUploadItem[]
  }
}
