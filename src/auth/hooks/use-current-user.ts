import { useQuery } from '@tanstack/react-query'
import { authApi } from '../auth.api'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
