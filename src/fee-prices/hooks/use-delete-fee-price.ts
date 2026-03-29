import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feePricesApi } from '../fee-prices.api'

export function useDeleteFeePrice(feeConceptId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (priceId: string) => feePricesApi.delete(priceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['fee-prices', feeConceptId] })
    },
  })
}
