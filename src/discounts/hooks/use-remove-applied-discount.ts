import { useMutation, useQueryClient } from '@tanstack/react-query'
import { discountsApi } from '../discounts.api'
import { appliedDiscountsQueryKey } from './use-applied-discounts'

export function useRemoveAppliedDiscount(studentId: string, academicYear: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => discountsApi.removeApplied(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: appliedDiscountsQueryKey(studentId, academicYear),
      })
    },
  })
}
