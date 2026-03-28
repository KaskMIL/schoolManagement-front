import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../auth.api'

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { username: string; password: string }) => authApi.login(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
