import { useMutation, useQueryClient } from '@tanstack/react-query'
import { institutionsApi, type UpdateInstitutionData } from '../institutions.api'

export function useUpdateInstitution() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ institutionId, data }: { institutionId: string; data: UpdateInstitutionData }) =>
      institutionsApi.update(institutionId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['institutions'] })
    },
  })
}
