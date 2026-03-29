import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feePricesApi } from '../fee-prices.api'
import type { CreateFeePriceData } from '../fee-prices.types'

export function useCreateFeePrice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFeePriceData) => feePricesApi.create(data),
    onSuccess: (_result, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['fee-prices', vars.feeConceptId] })
    },
  })
}
