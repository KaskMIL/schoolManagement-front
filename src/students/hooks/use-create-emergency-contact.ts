import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '../students.api'
import type { CreateEmergencyContactData } from '../students.types'

interface CreateContactVars {
  studentId: string
  data: CreateEmergencyContactData
}

export function useCreateEmergencyContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, data }: CreateContactVars) =>
      studentsApi.createEmergencyContact(studentId, data),
    onSuccess: (_, { studentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['students', studentId] })
    },
  })
}
