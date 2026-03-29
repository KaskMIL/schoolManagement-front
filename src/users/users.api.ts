import { api } from '../lib/api'
import type {
  CreateUserData,
  PaginatedUsers,
  UpdateUserPasswordData,
  UpdateUserProfileData,
  User,
} from './users.types'

export const usersApi = {
  list: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    const query = searchParams.toString()
    return api.get<PaginatedUsers>(`/api/users${query ? `?${query}` : ''}`)
  },
  get: (userId: string) => api.get<User>(`/api/users/${userId}`),
  create: (data: CreateUserData) => api.post<void>('/api/users', data),
  updateProfile: (userId: string, data: UpdateUserProfileData) =>
    api.patch<void>(`/api/users/${userId}/profile`, data),
  updatePassword: (userId: string, data: UpdateUserPasswordData) =>
    api.patch<void>(`/api/users/${userId}/password`, data),
  disable: (userId: string) => api.post<void>(`/api/users/${userId}/disable`),
  restore: (userId: string) => api.post<void>(`/api/users/${userId}/restore`),
  delete: (userId: string) => api.delete<void>(`/api/users/${userId}`),
}
