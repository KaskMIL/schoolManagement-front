import type { FamilySummary } from '../families/families.types'
import type { Institution } from '../institutions/institutions.types'

export type StudentStatus = 'activo' | 'inactivo' | 'egresado' | 'baja'
export type Gender = 'masculino' | 'femenino' | 'otro'
export type Level = 'jardin' | 'primaria' | 'secundaria'
export type Section = 'A' | 'B' | 'unico'
export type Shift = 'manana' | 'tarde' | 'completo'
export type EnrollmentStatus = 'inscripto' | 'confirmado' | 'baja'

export interface Enrollment {
  id: string
  createdAt: string
  updatedAt: string
  academicYear: number
  level: Level
  gradeOrRoom: string
  section: Section
  shift: Shift
  status: EnrollmentStatus
  enrollmentDate: string | null
  notes: string | null
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  priorityOrder: number
}

export interface StudentSummary {
  id: string
  createdAt: string
  updatedAt: string
  status: StudentStatus
  firstName: string
  lastName: string
  dni: string | null
  birthDate: string | null
  gender: Gender | null
  family: FamilySummary
  institution: Institution
}

export interface StudentDetail extends StudentSummary {
  bloodType: string | null
  medicalNotes: string | null
  allergies: string | null
  healthInsurance: string | null
  healthInsuranceNumber: string | null
  enrollmentDate: string | null
  notes: string | null
  enrollments: Enrollment[]
  emergencyContacts: EmergencyContact[]
}

export interface PaginatedResponse<T> {
  total: number
  items: T[]
}

export interface CreateStudentData {
  familyId: string
  institutionId: string
  firstName: string
  lastName: string
  status?: StudentStatus
  dni?: string
  birthDate?: string
  gender?: Gender
  bloodType?: string
  medicalNotes?: string
  allergies?: string
  healthInsurance?: string
  healthInsuranceNumber?: string
  enrollmentDate?: string
  notes?: string
}

export type UpdateStudentData = Omit<CreateStudentData, 'familyId' | 'institutionId'>

export interface CreateEnrollmentData {
  academicYear: number
  level: Level
  gradeOrRoom: string
  section: Section
  shift: Shift
  status?: EnrollmentStatus
  enrollmentDate?: string
  notes?: string
}

export type UpdateEnrollmentData = CreateEnrollmentData

export interface CreateEmergencyContactData {
  name: string
  phone: string
  relationship: string
  priorityOrder?: number
}

export type UpdateEmergencyContactData = CreateEmergencyContactData
