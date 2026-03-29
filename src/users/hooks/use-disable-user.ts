import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../users.api'

export function useDisableUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => usersApi.disable(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    },
  })
}
