import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feePricesApi } from '../fee-prices.api'
import type { UpdateFeePriceData } from '../fee-prices.types'

export function useUpdateFeePrice(feeConceptId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ priceId, data }: { priceId: string; data: UpdateFeePriceData }) =>
      feePricesApi.update(priceId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['fee-prices', feeConceptId] })
    },
  })
}
