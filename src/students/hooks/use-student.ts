import { useQuery } from '@tanstack/react-query'
import { studentsApi } from '../students.api'

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: ['students', studentId],
    queryFn: () => studentsApi.getOne(studentId),
  })
}
