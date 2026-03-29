export type InstallmentStatus = 'pendiente' | 'parcial' | 'pagada' | 'vencida' | 'anulada'

export interface InstallmentDetail {
  id: string
  description: string
  amount: string
  discountAmount: string
  finalAmount: string
  student: { id: string; firstName: string; lastName: string } | null
  feeConcept: { id: string; name: string }
}

export interface Installment {
  id: string
  createdAt: string
  updatedAt: string
  academicYear: number
  month: number
  description: string
  subtotal: string
  discountAmount: string
  surchargeAmount: string
  total: string
  dueDate: string
  status: InstallmentStatus
  generatedAt: string
  notes: string | null
  details: InstallmentDetail[]
}

export interface GenerateInstallmentData {
  familyId: string
  month: number
  academicYear?: number
  dueDate: string
  notes?: string
}
