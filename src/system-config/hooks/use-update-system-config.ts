import { useMutation, useQueryClient } from '@tanstack/react-query'
import { systemConfigApi } from '../system-config.api'
import { systemConfigQueryKey } from './use-system-config'

export function useUpdateSystemConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: systemConfigApi.update,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: systemConfigQueryKey })
    },
  })
}
