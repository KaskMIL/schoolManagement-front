import { api } from '../lib/api'
import type { CreateFeePriceData, FeePrice, UpdateFeePriceData } from './fee-prices.types'

export const feePricesApi = {
  list: (feeConceptId: string, academicYear: number) =>
    api.get<FeePrice[]>(`/api/fee-prices?feeConceptId=${feeConceptId}&academicYear=${academicYear}`),
  create: (data: CreateFeePriceData) => api.post<void>('/api/fee-prices', data),
  update: (priceId: string, data: UpdateFeePriceData) =>
    api.patch<void>(`/api/fee-prices/${priceId}`, data),
  delete: (priceId: string) => api.delete<void>(`/api/fee-prices/${priceId}`),
}
