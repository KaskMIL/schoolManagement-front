import { api } from '../lib/api'
import type { CurrentUser } from './auth.types'

export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<void>('/api/login', data),
  logout: () => api.post<void>('/api/logout'),
  me: () => api.get<CurrentUser>('/api/me'),
}
