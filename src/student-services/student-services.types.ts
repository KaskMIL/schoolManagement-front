import type { FeeConcept } from '../fee-concepts/fee-concepts.types'

export interface StudentService {
  id: string
  createdAt: string
  updatedAt: string
  studentId: string
  academicYear: number
  activeFrom: string
  activeTo: string | null
  notes: string | null
  feeConcept: FeeConcept
}

export interface CreateStudentServiceData {
  feeConceptId: string
  academicYear: number
  activeFrom: string
  activeTo?: string
  notes?: string
}

export type UpdateStudentServiceData = Omit<CreateStudentServiceData, 'feeConceptId'>
