import { useQuery } from '@tanstack/react-query'
import { familiesApi } from '../families.api'

export function useFamily(familyId: string) {
  return useQuery({
    queryKey: ['families', familyId],
    queryFn: () => familiesApi.getOne(familyId),
  })
}
