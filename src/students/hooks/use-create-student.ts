import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '../students.api'
import type { CreateStudentData } from '../students.types'

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateStudentData) => studentsApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['students', 'list'] })
    },
  })
}
