import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../users.api'
import type { CreateUserData } from '../users.types'

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserData) => usersApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    },
  })
}
