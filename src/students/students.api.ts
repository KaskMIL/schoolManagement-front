import { api } from '../lib/api'
import type {
  CreateEmergencyContactData,
  CreateEnrollmentData,
  CreateStudentData,
  EmergencyContact,
  Enrollment,
  PaginatedResponse,
  StudentDetail,
  StudentStatus,
  StudentSummary,
  UpdateEmergencyContactData,
  UpdateEnrollmentData,
  UpdateStudentData,
} from './students.types'

interface ListStudentsParams {
  page?: number
  limit?: number
  familyId?: string
  institutionId?: string
  status?: StudentStatus
  search?: string
}

export const studentsApi = {
  list: (params: ListStudentsParams) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.familyId) query.set('familyId', params.familyId)
    if (params.institutionId) query.set('institutionId', params.institutionId)
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    return api.get<PaginatedResponse<StudentSummary>>(`/api/students?${query}`)
  },

  getOne: (studentId: string) => api.get<StudentDetail>(`/api/students/${studentId}`),

  create: (data: CreateStudentData) => api.post<StudentDetail>('/api/students', data),

  update: (studentId: string, data: UpdateStudentData) =>
    api.patch<StudentDetail>(`/api/students/${studentId}`, data),

  createEnrollment: (studentId: string, data: CreateEnrollmentData) =>
    api.post<Enrollment>(`/api/students/${studentId}/enrollments`, data),

  updateEnrollment: (studentId: string, enrollmentId: string, data: UpdateEnrollmentData) =>
    api.patch<Enrollment>(`/api/students/${studentId}/enrollments/${enrollmentId}`, data),

  createEmergencyContact: (studentId: string, data: CreateEmergencyContactData) =>
    api.post<EmergencyContact>(`/api/students/${studentId}/emergency-contacts`, data),

  updateEmergencyContact: (
    studentId: string,
    contactId: string,
    data: UpdateEmergencyContactData,
  ) =>
    api.patch<EmergencyContact>(
      `/api/students/${studentId}/emergency-contacts/${contactId}`,
      data,
    ),

  deleteEmergencyContact: (studentId: string, contactId: string) =>
    api.delete<void>(`/api/students/${studentId}/emergency-contacts/${contactId}`),
}
