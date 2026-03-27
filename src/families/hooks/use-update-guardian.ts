import { useMutation, useQueryClient } from '@tanstack/react-query'
import { familiesApi } from '../families.api'
import type { UpdateGuardianData } from '../families.types'

interface UpdateGuardianVars {
  familyId: string
  guardianId: string
  data: UpdateGuardianData
}

export function useUpdateGuardian() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ familyId, guardianId, data }: UpdateGuardianVars) =>
      familiesApi.updateGuardian(familyId, guardianId, data),
    onSuccess: (_, { familyId }) => {
      void queryClient.invalidateQueries({ queryKey: ['families', familyId] })
    },
  })
}
