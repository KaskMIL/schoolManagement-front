import { useQuery } from '@tanstack/react-query'
import { studentsApi } from '../students.api'
import type { StudentStatus } from '../students.types'

interface UseStudentsOptions {
  page?: number
  limit?: number
  familyId?: string
  institutionId?: string
  status?: StudentStatus
  search?: string
}

export function useStudents(opts: UseStudentsOptions = {}) {
  return useQuery({
    queryKey: ['students', 'list', opts],
    queryFn: () => studentsApi.list(opts),
  })
}
