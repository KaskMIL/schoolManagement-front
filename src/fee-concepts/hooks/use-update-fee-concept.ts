import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feeConceptsApi } from '../fee-concepts.api'
import type { UpdateFeeConceptData } from '../fee-concepts.types'

export function useUpdateFeeConcept(institutionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ conceptId, data }: { conceptId: string; data: UpdateFeeConceptData }) =>
      feeConceptsApi.update(conceptId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['fee-concepts', institutionId] })
    },
  })
}
