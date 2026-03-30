import { useQuery } from '@tanstack/react-query'
import { discountsApi } from '../discounts.api'

export const appliedDiscountsQueryKey = (studentId: string, academicYear: number) =>
  ['applied-discounts', studentId, academicYear] as const

export function useAppliedDiscounts(studentId: string, academicYear: number) {
  return useQuery({
    queryKey: appliedDiscountsQueryKey(studentId, academicYear),
    queryFn: () => discountsApi.listApplied(studentId, academicYear),
    enabled: !!studentId,
  })
}
