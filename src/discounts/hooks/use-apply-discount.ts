import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateAppliedDiscountData } from '../discounts.types'
import { discountsApi } from '../discounts.api'
import { appliedDiscountsQueryKey } from './use-applied-discounts'

export function useApplyDiscount(studentId: string, academicYear: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAppliedDiscountData) => discountsApi.applyDiscount(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: appliedDiscountsQueryKey(studentId, academicYear),
      })
    },
  })
}
