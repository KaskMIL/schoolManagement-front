import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { authApi } from '../auth.api'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      navigate('/login', { replace: true })
      queryClient.clear()
    },
  })
}
