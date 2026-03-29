import { useMutation, useQueryClient } from '@tanstack/react-query'
import { installmentsApi } from '../installments.api'
import { installmentsQueryKey } from './use-installments'

export function useAnnulInstallment(familyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: installmentsApi.annul,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: installmentsQueryKey(familyId) })
    },
  })
}
