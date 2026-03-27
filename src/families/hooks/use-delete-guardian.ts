import { useMutation, useQueryClient } from '@tanstack/react-query'
import { familiesApi } from '../families.api'

interface DeleteGuardianVars {
  familyId: string
  guardianId: string
}

export function useDeleteGuardian() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ familyId, guardianId }: DeleteGuardianVars) =>
      familiesApi.deleteGuardian(familyId, guardianId),
    onSuccess: (_, { familyId }) => {
      void queryClient.invalidateQueries({ queryKey: ['families', familyId] })
    },
  })
}
