import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '../students.api'
import type { UpdateEmergencyContactData } from '../students.types'

interface UpdateContactVars {
  studentId: string
  contactId: string
  data: UpdateEmergencyContactData
}

export function useUpdateEmergencyContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, contactId, data }: UpdateContactVars) =>
      studentsApi.updateEmergencyContact(studentId, contactId, data),
    onSuccess: (_, { studentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['students', studentId] })
    },
  })
}
