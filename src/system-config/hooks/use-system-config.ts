import { useQuery } from '@tanstack/react-query'
import { systemConfigApi } from '../system-config.api'

export const systemConfigQueryKey = ['system-config']

export function useSystemConfig() {
  return useQuery({
    queryKey: systemConfigQueryKey,
    queryFn: () => systemConfigApi.get(),
  })
}
