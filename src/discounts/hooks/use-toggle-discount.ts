import { useMutation, useQueryClient } from '@tanstack/react-query'
import { discountsApi } from '../discounts.api'
import { discountsQueryKey } from './use-discounts'

export function useToggleDiscount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => discountsApi.toggle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: discountsQueryKey() })
    },
  })
}
