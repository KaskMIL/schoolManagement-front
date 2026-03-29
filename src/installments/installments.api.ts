import { api } from '../lib/api'
import type { GenerateInstallmentData, Installment } from './installments.types'

export const installmentsApi = {
  listByFamily: (familyId: string) =>
    api.get<Installment[]>(`/api/installments?familyId=${familyId}`),
  get: (installmentId: string) => api.get<Installment>(`/api/installments/${installmentId}`),
  generate: (data: GenerateInstallmentData) => api.post<Installment>('/api/installments', data),
  annul: (installmentId: string) =>
    api.put<Installment>(`/api/installments/${installmentId}/annul`),
}
