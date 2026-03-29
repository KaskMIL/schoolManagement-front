import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifyError } from '../../lib/notifications'
import { studentServicesApi } from '../student-services.api'
import type { CreateStudentServiceData, UpdateStudentServiceData } from '../student-services.types'

export function useStudentServices(studentId: string) {
  return useQuery({
    queryKey: ['student-services', studentId],
    queryFn: () => studentServicesApi.list(studentId),
  })
}

export function useCreateStudentService(studentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateStudentServiceData) =>
      studentServicesApi.create(studentId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-services', studentId] })
    },
    onError: notifyError,
  })
}

export function useUpdateStudentService(studentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      serviceId,
      data,
    }: {
      serviceId: string
      data: UpdateStudentServiceData
    }) => studentServicesApi.update(studentId, serviceId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-services', studentId] })
    },
    onError: notifyError,
  })
}

export function useDeleteStudentService(studentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (serviceId: string) => studentServicesApi.delete(studentId, serviceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-services', studentId] })
    },
    onError: notifyError,
  })
}
