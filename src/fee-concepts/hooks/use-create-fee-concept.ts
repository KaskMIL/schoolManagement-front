import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feeConceptsApi } from '../fee-concepts.api'
import type { CreateFeeConceptData } from '../fee-concepts.types'

export function useCreateFeeConcept() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFeeConceptData) => feeConceptsApi.create(data),
    onSuccess: (_result, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['fee-concepts', vars.institutionId] })
    },
  })
}
