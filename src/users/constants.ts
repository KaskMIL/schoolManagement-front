export const USER_ROLES = ['Admin'] as const

export type UserRole = (typeof USER_ROLES)[number]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  Admin: 'Administrador',
}
