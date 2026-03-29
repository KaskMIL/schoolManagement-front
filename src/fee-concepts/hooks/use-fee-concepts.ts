import { useQuery } from '@tanstack/react-query'
import { feeConceptsApi } from '../fee-concepts.api'

export function useFeeConcepts(institutionId: string | null) {
  return useQuery({
    queryKey: ['fee-concepts', institutionId],
    queryFn: () => feeConceptsApi.list(institutionId!),
    enabled: !!institutionId,
  })
}
