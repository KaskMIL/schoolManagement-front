import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../users.api'

interface UseUsersOptions {
  page?: number
  limit?: number
}

export function useUsers(opts: UseUsersOptions = {}) {
  return useQuery({
    queryKey: ['users', 'list', opts],
    queryFn: () => usersApi.list(opts),
  })
}
