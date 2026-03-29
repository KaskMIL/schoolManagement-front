import { api } from '../lib/api'
import type { CreateFeeConceptData, FeeConcept, UpdateFeeConceptData } from './fee-concepts.types'

export const feeConceptsApi = {
  list: (institutionId: string) =>
    api.get<FeeConcept[]>(`/api/fee-concepts?institutionId=${institutionId}`),
  create: (data: CreateFeeConceptData) => api.post<void>('/api/fee-concepts', data),
  update: (conceptId: string, data: UpdateFeeConceptData) =>
    api.patch<void>(`/api/fee-concepts/${conceptId}`, data),
  activate: (conceptId: string) =>
    api.post<void>(`/api/fee-concepts/${conceptId}/activate`),
  deactivate: (conceptId: string) =>
    api.post<void>(`/api/fee-concepts/${conceptId}/deactivate`),
}
