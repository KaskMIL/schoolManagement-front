import { api } from '../lib/api'
import type {
  AppliedDiscount,
  CreateAppliedDiscountData,
  Discount,
  UpdateDiscountData,
} from './discounts.types'

export const discountsApi = {
  list: () => api.get<Discount[]>('/api/discounts'),

  update: (id: string, data: UpdateDiscountData) =>
    api.patch<Discount>(`/api/discounts/${id}`, data),

  toggle: (id: string) => api.put<Discount>(`/api/discounts/${id}/toggle`, {}),

  listApplied: (studentId: string, academicYear: number) =>
    api.get<AppliedDiscount[]>(`/api/discounts/applied?studentId=${studentId}&academicYear=${academicYear}`),

  applyDiscount: (data: CreateAppliedDiscountData) =>
    api.post<AppliedDiscount>('/api/discounts/applied', data),

  removeApplied: (id: string) => api.delete<void>(`/api/discounts/applied/${id}`),
}
