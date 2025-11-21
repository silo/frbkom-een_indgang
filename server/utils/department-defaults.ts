import { and, eq } from 'drizzle-orm'
import { department, departmentEventStatus } from '../database/schema'
import type { Database } from '../database/client'
import {
  CORE_DEPARTMENT_SLUGS,
  DEFAULT_DEPARTMENT_SLUG,
  type CoreDepartmentSlug,
} from '../../shared/constants/departments'

const slugOrder = new Map(CORE_DEPARTMENT_SLUGS.map((slug, index) => [slug, index]))

export const sortCoreDepartments = <T extends { slug: string }>(entries: T[]) =>
  entries
    .filter((entry): entry is T & { slug: CoreDepartmentSlug } =>
      CORE_DEPARTMENT_SLUGS.includes(entry.slug as CoreDepartmentSlug),
    )
    .sort((a, b) => (slugOrder.get(a.slug as CoreDepartmentSlug)! - slugOrder.get(b.slug as CoreDepartmentSlug)!))

export { CORE_DEPARTMENT_SLUGS, DEFAULT_DEPARTMENT_SLUG }
export type { CoreDepartmentSlug }

export const ensureDefaultDepartmentStatus = async (db: Database, eventId: string) => {
  const [defaultDepartment] = await db
    .select()
    .from(department)
    .where(eq(department.slug, DEFAULT_DEPARTMENT_SLUG))
    .limit(1)

  if (!defaultDepartment) {
    throw new Error('Default department missing in database')
  }

  const [existing] = await db
    .select({ id: departmentEventStatus.id })
    .from(departmentEventStatus)
    .where(
      and(
        eq(departmentEventStatus.eventId, eventId),
        eq(departmentEventStatus.departmentId, defaultDepartment.id),
      ),
    )
    .limit(1)

  if (existing) {
    return defaultDepartment
  }

  await db
    .insert(departmentEventStatus)
    .values({
      eventId,
      departmentId: defaultDepartment.id,
      status: 'pending',
      note: null,
      updatedAt: new Date(),
    })
    .onConflictDoNothing()

  return defaultDepartment
}
