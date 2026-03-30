import { useQuery } from '@tanstack/react-query'
import { discountsApi } from '../discounts.api'

export const discountsQueryKey = () => ['discounts'] as const

export function useDiscounts() {
  return useQuery({
    queryKey: discountsQueryKey(),
    queryFn: discountsApi.list,
  })
}
