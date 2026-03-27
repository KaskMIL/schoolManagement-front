import { useMutation, useQueryClient } from '@tanstack/react-query'
import { familiesApi } from '../families.api'

export function useDeactivateFamily() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (familyId: string) => familiesApi.deactivate(familyId),
    onSuccess: (_, familyId) => {
      void queryClient.invalidateQueries({ queryKey: ['families', 'list'] })
      void queryClient.invalidateQueries({ queryKey: ['families', familyId] })
    },
  })
}
