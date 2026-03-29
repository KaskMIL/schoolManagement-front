export type UserRole = 'Admin'

export interface CurrentUser {
  id: string
  username: string
  role: UserRole
  createdAt: string
  updatedAt: string
  disabledAt: string | null
}
