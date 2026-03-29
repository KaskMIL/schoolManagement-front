import { useMutation, useQueryClient } from '@tanstack/react-query'
import { installmentsApi } from '../installments.api'
import { installmentsQueryKey } from './use-installments'

export function useGenerateInstallment(familyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: installmentsApi.generate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: installmentsQueryKey(familyId) })
    },
  })
}
