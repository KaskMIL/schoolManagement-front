import { useMutation, useQueryClient } from '@tanstack/react-query'
import { familiesApi } from '../families.api'
import type { UpdateFamilyData } from '../families.types'

interface UpdateFamilyVars {
  familyId: string
  data: UpdateFamilyData
}

export function useUpdateFamily() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ familyId, data }: UpdateFamilyVars) => familiesApi.update(familyId, data),
    onSuccess: (_, { familyId }) => {
      void queryClient.invalidateQueries({ queryKey: ['families', 'list'] })
      void queryClient.invalidateQueries({ queryKey: ['families', familyId] })
    },
  })
}
