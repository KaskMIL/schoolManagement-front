import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '../students.api'
import type { UpdateStudentData } from '../students.types'

interface UpdateStudentVars {
  studentId: string
  data: UpdateStudentData
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, data }: UpdateStudentVars) => studentsApi.update(studentId, data),
    onSuccess: (_, { studentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['students', 'list'] })
      void queryClient.invalidateQueries({ queryKey: ['students', studentId] })
    },
  })
}
