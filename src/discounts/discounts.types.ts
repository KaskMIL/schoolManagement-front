export type DiscountType = 'hermano' | 'beca' | 'docente_hijo' | 'pronto_pago'

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  hermano: 'Descuento por hermano',
  beca: 'Beca',
  docente_hijo: 'Hijo de docente',
  pronto_pago: 'Pronto pago',
}

/** Tipos que se aplican automáticamente (no requieren AppliedDiscount manual) */
export const AUTOMATIC_DISCOUNT_TYPES: DiscountType[] = ['hermano', 'pronto_pago']

export interface Discount {
  id: string
  type: DiscountType
  name: string
  percentage: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AppliedDiscount {
  id: string
  discount: Discount
  student: { id: string; firstName: string; lastName: string }
  academicYear: number
  percentage: string
  approvedBy: { id: string; firstName: string; lastName: string } | null
  validFrom: string | null
  validTo: string | null
  notes: string | null
  createdAt: string
}

export interface UpdateDiscountData {
  name?: string
  percentage?: string
}

export interface CreateAppliedDiscountData {
  studentId: string
  discountId: string
  academicYear: number
  percentage?: string
  validFrom?: string
  validTo?: string
  notes?: string
}
