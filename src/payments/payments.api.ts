import { api } from '../lib/api'
import type { CreatePaymentData, Payment, ReceiptData } from './payments.types'

export const paymentsApi = {
  listByFamily: (familyId: string) => api.get<Payment[]>(`/api/payments?familyId=${familyId}`),
  get: (paymentId: string) => api.get<Payment>(`/api/payments/${paymentId}`),
  create: (data: CreatePaymentData) => api.post<Payment>('/api/payments', data),
  getReceiptData: (paymentId: string) =>
    api.get<ReceiptData>(`/api/payments/${paymentId}/receipt-data`),
}
