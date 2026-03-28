import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '../students.api'
import type { CreateEnrollmentData } from '../students.types'

interface CreateEnrollmentVars {
  studentId: string
  data: CreateEnrollmentData
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, data }: CreateEnrollmentVars) =>
      studentsApi.createEnrollment(studentId, data),
    onSuccess: (_, { studentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['students', studentId] })
    },
  })
}
