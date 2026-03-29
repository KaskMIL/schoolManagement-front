import { api } from '../lib/api'
import type { CreatePaymentData, Payment } from './payments.types'

export const paymentsApi = {
  listByFamily: (familyId: string) => api.get<Payment[]>(`/api/payments?familyId=${familyId}`),
  get: (paymentId: string) => api.get<Payment>(`/api/payments/${paymentId}`),
  create: (data: CreatePaymentData) => api.post<Payment>('/api/payments', data),
}
