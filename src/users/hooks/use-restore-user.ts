import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../users.api'

export function useRestoreUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => usersApi.restore(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    },
  })
}
