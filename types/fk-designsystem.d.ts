declare module 'fk-designsystem' {
  type VueComponent<Props> = import('vue').DefineComponent<Props, Record<string, never>, unknown>

  export type ButtonProps = import('../node_modules/fk-designsystem/dist/types/button').ButtonProps
  export type ButtonVariant = import('../node_modules/fk-designsystem/dist/types/button').ButtonVariant
  export type ButtonSize = import('../node_modules/fk-designsystem/dist/types/button').ButtonSize
  export const Button: VueComponent<ButtonProps>

  export type InputProps = import('../node_modules/fk-designsystem/dist/types/input').InputProps
  export type InputIconColor = import('../node_modules/fk-designsystem/dist/types/input').InputIconColor
  export const Input: VueComponent<InputProps>

  export type RadioGroupProps = import('../node_modules/fk-designsystem/dist/types/radio-group').RadioGroupProps
  export type RadioGroupOrientation = import('../node_modules/fk-designsystem/dist/types/radio-group').RadioGroupOrientation
  export type RadioOption = import('../node_modules/fk-designsystem/dist/types/radio-group').RadioOption
  export type RadioModel = import('../node_modules/fk-designsystem/dist/types/radio').RadioModel
  export const RadioGroup: VueComponent<RadioGroupProps>

  export type DropdownButtonProps = import('../node_modules/fk-designsystem/dist/types/dropdown').DropdownButtonProps
  export type DropdownSearchProps = import('../node_modules/fk-designsystem/dist/types/dropdown').DropdownSearchProps
  export type DropdownBaseProps = import('../node_modules/fk-designsystem/dist/types/dropdown').DropdownBaseProps
  export type DropdownOption = import('../node_modules/fk-designsystem/dist/types/dropdown').DropdownOption
  export const DropdownButton: VueComponent<DropdownButtonProps>

  export type CheckboxProps = import('../node_modules/fk-designsystem/dist/types/checkbox').CheckboxProps
  export const Checkbox: VueComponent<CheckboxProps>

  export type TextareaProps = import('../node_modules/fk-designsystem/dist/types/textarea').TextareaProps
  export const Textarea: VueComponent<TextareaProps>

  export type BadgeProps = import('../node_modules/fk-designsystem/dist/types/badge').BadgeProps
  export type BadgeVariant = import('../node_modules/fk-designsystem/dist/types/badge').BadgeVariant
  export type BadgeSize = import('../node_modules/fk-designsystem/dist/types/badge').BadgeSize
  export const Badge: VueComponent<BadgeProps>

  export type VerticalStepperProps = import('../node_modules/fk-designsystem/dist/types/vertical-stepper').VerticalStepperProps
  export type VerticalStepperItem = import('../node_modules/fk-designsystem/dist/types/vertical-stepper').VerticalStepperItem
  export const VerticalStepper: VueComponent<VerticalStepperProps>

  export type FileUploadProps = import('../node_modules/fk-designsystem/dist/types/file-upload').FileUploadProps
  export type FileUploadItem = import('../node_modules/fk-designsystem/dist/types/file-upload').FileUploadItem
  export type FileUploadItemStatus = import('../node_modules/fk-designsystem/dist/types/file-upload').FileUploadItemStatus
  export const FileUpload: VueComponent<FileUploadProps>

  export type TableProps = import('../node_modules/fk-designsystem/dist/types/table').TableProps
  export type TableColumn = import('../node_modules/fk-designsystem/dist/types/table').TableColumn
  export type TableAlign = import('../node_modules/fk-designsystem/dist/types/table').TableAlign
  export type SortDirection = import('../node_modules/fk-designsystem/dist/types/table').SortDirection
  export const Table: VueComponent<TableProps>
}
