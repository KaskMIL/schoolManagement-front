import { UserRole } from './constants'

export type { UserRole }

export interface User {
  id: string
  username: string
  role: UserRole
  createdAt: string
  updatedAt: string
  disabledAt: string | null
}

export interface PaginatedUsers {
  items: User[]
  total: number
}

export interface CreateUserData {
  username: string
  password: string
  role: UserRole
}

export interface UpdateUserProfileData {
  username: string
  role: UserRole
}

export interface UpdateUserPasswordData {
  password: string
}
