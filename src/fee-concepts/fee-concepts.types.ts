export const FEE_CONCEPT_TYPES = ['arancel', 'servicio', 'matricula', 'otro'] as const
export type FeeConceptType = (typeof FEE_CONCEPT_TYPES)[number]

export const FEE_CONCEPT_TYPE_LABELS: Record<FeeConceptType, string> = {
  arancel: 'Arancel',
  servicio: 'Servicio',
  matricula: 'Matrícula',
  otro: 'Otro',
}

export interface FeeConcept {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  type: FeeConceptType
  isRecurring: boolean
  isActive: boolean
  description: string | null
}

export interface CreateFeeConceptData {
  institutionId: string
  name: string
  type: FeeConceptType
  isRecurring: boolean
  description?: string
}

export interface UpdateFeeConceptData {
  name: string
  type: FeeConceptType
  isRecurring: boolean
  description?: string
}
