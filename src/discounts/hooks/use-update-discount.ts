import { useMutation, useQueryClient } from '@tanstack/react-query'
import { discountsApi } from '../discounts.api'
import { discountsQueryKey } from './use-discounts'

export function useUpdateDiscount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; percentage?: string } }) =>
      discountsApi.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: discountsQueryKey() })
    },
  })
}
