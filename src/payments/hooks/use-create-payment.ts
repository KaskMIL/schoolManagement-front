import { useMutation, useQueryClient } from '@tanstack/react-query'
import { installmentsQueryKey } from '../../installments/hooks/use-installments'
import { paymentsApi } from '../payments.api'
import { paymentsQueryKey } from './use-payments'

export function useCreatePayment(familyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paymentsQueryKey(familyId) })
      void queryClient.invalidateQueries({ queryKey: installmentsQueryKey(familyId) })
    },
  })
}
