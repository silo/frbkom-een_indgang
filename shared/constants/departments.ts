export const CORE_DEPARTMENT_SLUGS = ['byliv-drift', 'klima-miljo', 'byggeri-arkitektur'] as const
export type CoreDepartmentSlug = (typeof CORE_DEPARTMENT_SLUGS)[number]
export const DEFAULT_DEPARTMENT_SLUG: CoreDepartmentSlug = 'byliv-drift'
