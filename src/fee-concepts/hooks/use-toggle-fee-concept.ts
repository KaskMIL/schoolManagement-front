import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feeConceptsApi } from '../fee-concepts.api'

export function useToggleFeeConcept(institutionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ conceptId, active }: { conceptId: string; active: boolean }) =>
      active ? feeConceptsApi.activate(conceptId) : feeConceptsApi.deactivate(conceptId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['fee-concepts', institutionId] })
    },
  })
}
