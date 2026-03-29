import { useQuery } from '@tanstack/react-query'
import { installmentsApi } from '../installments.api'

export const installmentsQueryKey = (familyId: string) => ['installments', familyId]

export function useInstallments(familyId: string) {
  return useQuery({
    queryKey: installmentsQueryKey(familyId),
    queryFn: () => installmentsApi.listByFamily(familyId),
    enabled: !!familyId,
  })
}
