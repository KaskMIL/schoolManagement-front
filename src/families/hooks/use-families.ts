import { useQuery } from '@tanstack/react-query'
import { familiesApi } from '../families.api'
import type { FamilyStatus } from '../families.types'

interface UseFamiliesOptions {
  page?: number
  limit?: number
  status?: FamilyStatus
  search?: string
}

export function useFamilies(opts: UseFamiliesOptions = {}) {
  return useQuery({
    queryKey: ['families', 'list', opts],
    queryFn: () => familiesApi.list(opts),
  })
}
