import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '../students.api'

interface DeleteContactVars {
  studentId: string
  contactId: string
}

export function useDeleteEmergencyContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, contactId }: DeleteContactVars) =>
      studentsApi.deleteEmergencyContact(studentId, contactId),
    onSuccess: (_, { studentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['students', studentId] })
    },
  })
}
