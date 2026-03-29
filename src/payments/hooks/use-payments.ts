import { useQuery } from '@tanstack/react-query'
import { paymentsApi } from '../payments.api'

export const paymentsQueryKey = (familyId: string) => ['payments', familyId]

export function usePayments(familyId: string) {
  return useQuery({
    queryKey: paymentsQueryKey(familyId),
    queryFn: () => paymentsApi.listByFamily(familyId),
    enabled: !!familyId,
  })
}
