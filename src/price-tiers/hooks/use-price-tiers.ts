import { useQuery } from '@tanstack/react-query'
import { priceTiersApi } from '../price-tiers.api'

export function usePriceTiers() {
  return useQuery({
    queryKey: ['price-tiers'],
    queryFn: () => priceTiersApi.list(),
    staleTime: Infinity, // datos fijos, nunca se invalidan
  })
}
