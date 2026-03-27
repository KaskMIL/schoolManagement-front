export type FamilyStatus = 'activa' | 'inactiva'
export type Relationship = 'padre' | 'madre' | 'tutor' | 'otro'

export interface Guardian {
  id: string
  createdAt: string
  updatedAt: string
  firstName: string
  lastName: string
  dni: string | null
  cuitCuil: string | null
  relationship: Relationship
  phone: string | null
  email: string | null
  isPrimaryContact: boolean
  occupation: string | null
  employer: string | null
  notes: string | null
}

export interface FamilySummary {
  id: string
  createdAt: string
  updatedAt: string
  status: FamilyStatus
  familyName: string
  primaryEmail: string | null
  primaryPhone: string | null
  address: string | null
  locality: string | null
  notes: string | null
}

export interface FamilyDetail extends FamilySummary {
  guardians: Guardian[]
}

export interface PaginatedResponse<T> {
  total: number
  items: T[]
}

export interface CreateFamilyData {
  familyName: string
  primaryEmail?: string
  primaryPhone?: string
  address?: string
  locality?: string
  notes?: string
}

export type UpdateFamilyData = CreateFamilyData

export interface CreateGuardianData {
  firstName: string
  lastName: string
  relationship: Relationship
  dni?: string
  cuitCuil?: string
  phone?: string
  email?: string
  isPrimaryContact?: boolean
  occupation?: string
  employer?: string
  notes?: string
}

export type UpdateGuardianData = CreateGuardianData
