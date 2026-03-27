import { useMutation, useQueryClient } from '@tanstack/react-query'
import { familiesApi } from '../families.api'
import type { CreateFamilyData } from '../families.types'

export function useCreateFamily() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFamilyData) => familiesApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['families', 'list'] })
    },
  })
}
