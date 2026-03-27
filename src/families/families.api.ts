import { api } from '../lib/api'
import type {
  CreateFamilyData,
  CreateGuardianData,
  FamilyDetail,
  FamilyStatus,
  FamilySummary,
  Guardian,
  PaginatedResponse,
  UpdateFamilyData,
  UpdateGuardianData,
} from './families.types'

interface ListParams {
  page?: number
  limit?: number
  status?: FamilyStatus
}

export const familiesApi = {
  list: (params: ListParams) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    return api.get<PaginatedResponse<FamilySummary>>(`/api/families?${query}`)
  },

  getOne: (familyId: string) => api.get<FamilyDetail>(`/api/families/${familyId}`),

  create: (data: CreateFamilyData) => api.post<FamilyDetail>('/api/families', data),

  update: (familyId: string, data: UpdateFamilyData) =>
    api.patch<FamilyDetail>(`/api/families/${familyId}`, data),

  deactivate: (familyId: string) => api.post<void>(`/api/families/${familyId}/deactivate`),

  reactivate: (familyId: string) => api.post<void>(`/api/families/${familyId}/reactivate`),

  createGuardian: (familyId: string, data: CreateGuardianData) =>
    api.post<Guardian>(`/api/families/${familyId}/guardians`, data),

  updateGuardian: (familyId: string, guardianId: string, data: UpdateGuardianData) =>
    api.patch<Guardian>(`/api/families/${familyId}/guardians/${guardianId}`, data),

  deleteGuardian: (familyId: string, guardianId: string) =>
    api.delete<void>(`/api/families/${familyId}/guardians/${guardianId}`),
}
