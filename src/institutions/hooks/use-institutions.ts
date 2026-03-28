import { useQuery } from '@tanstack/react-query'
import { institutionsApi } from '../institutions.api'

export function useInstitutions() {
  return useQuery({
    queryKey: ['institutions'],
    queryFn: () => institutionsApi.list(),
  })
}
