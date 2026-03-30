import { useQuery } from '@tanstack/react-query'
import { paymentsApi } from '../payments.api'

export const receiptDataQueryKey = (paymentId: string) => ['receipt-data', paymentId] as const

export function useReceiptData(paymentId: string | null) {
  return useQuery({
    queryKey: receiptDataQueryKey(paymentId ?? ''),
    queryFn: () => paymentsApi.getReceiptData(paymentId!),
    enabled: !!paymentId,
    staleTime: Infinity, // los datos del recibo no cambian
  })
}
