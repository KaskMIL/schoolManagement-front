import { useMutation, useQueryClient } from '@tanstack/react-query'
import { familiesApi } from '../families.api'
import type { CreateGuardianData } from '../families.types'

interface CreateGuardianVars {
  familyId: string
  data: CreateGuardianData
}

export function useCreateGuardian() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ familyId, data }: CreateGuardianVars) =>
      familiesApi.createGuardian(familyId, data),
    onSuccess: (_, { familyId }) => {
      void queryClient.invalidateQueries({ queryKey: ['families', familyId] })
    },
  })
}
