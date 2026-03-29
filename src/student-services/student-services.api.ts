import { api } from '../lib/api'
import type {
  CreateStudentServiceData,
  StudentService,
  UpdateStudentServiceData,
} from './student-services.types'

export const studentServicesApi = {
  list: (studentId: string) =>
    api.get<StudentService[]>(`/api/students/${studentId}/services`),

  create: (studentId: string, data: CreateStudentServiceData) =>
    api.post<StudentService>(`/api/students/${studentId}/services`, data),

  update: (studentId: string, serviceId: string, data: UpdateStudentServiceData) =>
    api.patch<StudentService>(`/api/students/${studentId}/services/${serviceId}`, data),

  delete: (studentId: string, serviceId: string) =>
    api.delete<void>(`/api/students/${studentId}/services/${serviceId}`),
}
