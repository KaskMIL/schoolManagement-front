import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '../students.api'
import type { UpdateEnrollmentData } from '../students.types'

interface UpdateEnrollmentVars {
  studentId: string
  enrollmentId: string
  data: UpdateEnrollmentData
}

export function useUpdateEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, enrollmentId, data }: UpdateEnrollmentVars) =>
      studentsApi.updateEnrollment(studentId, enrollmentId, data),
    onSuccess: (_, { studentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['students', studentId] })
    },
  })
}
