import { api } from '../lib/api'
import type { Institution } from './institutions.types'

export interface UpdateInstitutionData {
  name: string
  cue?: string
  diegepDipregep?: string
  address?: string
  phone?: string
  email?: string
  logoUrl?: string
}

export const institutionsApi = {
  list: () => api.get<Institution[]>('/api/institutions'),
  update: (institutionId: string, data: UpdateInstitutionData) =>
    api.patch<void>(`/api/institutions/${institutionId}`, data),
}
