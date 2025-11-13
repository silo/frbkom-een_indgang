import { z } from 'zod'

export const departmentStatusEnum = z.enum(['pending', 'in_review', 'approved'])

export const updateDepartmentStatusSchema = z.object({
  eventId: z.string().uuid(),
  departmentId: z.string().uuid(),
  status: departmentStatusEnum,
  note: z.string().max(2000).optional().nullable(),
})

export const getDepartmentStatusSchema = z.object({
  eventId: z.string().uuid(),
  departmentId: z.string().uuid(),
})

export const listDepartmentStatusesSchema = z.object({
  eventId: z.string().uuid(),
})

export type UpdateDepartmentStatusInput = z.infer<typeof updateDepartmentStatusSchema>
export type GetDepartmentStatusInput = z.infer<typeof getDepartmentStatusSchema>
export type ListDepartmentStatusesInput = z.infer<typeof listDepartmentStatusesSchema>
export type DepartmentStatus = z.infer<typeof departmentStatusEnum>
