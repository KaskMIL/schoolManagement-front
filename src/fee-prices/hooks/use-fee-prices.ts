import { useQuery } from '@tanstack/react-query'
import { feePricesApi } from '../fee-prices.api'

export function useFeePrices(feeConceptId: string | null, academicYear: number) {
  return useQuery({
    queryKey: ['fee-prices', feeConceptId, academicYear],
    queryFn: () => feePricesApi.list(feeConceptId!, academicYear),
    enabled: !!feeConceptId,
  })
}
