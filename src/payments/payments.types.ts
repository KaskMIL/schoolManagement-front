export type PaymentMethod = 'efectivo' | 'transferencia' | 'mercadopago'

export interface Receipt {
  id: string
  receiptNumber: number
  academicYear: number
  issuedDate: string
}

export interface PaymentAllocation {
  id: string
  allocatedAmount: string
  installment: {
    id: string
    description: string
    month: number
    academicYear: number
    total: string
  }
}

export interface Payment {
  id: string
  createdAt: string
  amount: string
  paymentDate: string
  method: PaymentMethod
  reference: string | null
  notes: string | null
  allocations: PaymentAllocation[]
  receivedBy: { id: string; firstName: string; lastName: string }
  receipt: Receipt | null
}

// --- Receipt data (para generación de PDF) ---

export interface ReceiptInstitution {
  name: string
  address: string | null
  phone: string | null
  logoUrl: string | null
}

export interface ReceiptAllocationDetail {
  description: string
  amount: string
  discountAmount: string
  finalAmount: string
}

export interface ReceiptAllocation {
  installmentDescription: string
  subtotal: string
  discountAmount: string
  total: string
  details: ReceiptAllocationDetail[]
}

export interface ReceiptData {
  receiptNumber: number
  academicYear: number
  issuedDate: string
  paymentDate: string
  amount: string
  method: string
  reference: string | null
  family: { name: string; address: string | null }
  primaryContact: { firstName: string; lastName: string } | null
  institutions: ReceiptInstitution[]
  allocations: ReceiptAllocation[]
  receivedBy: string
}

// --- Inputs ---

export interface AllocationInput {
  installmentId: string
  allocatedAmount: string
}

export interface CreatePaymentData {
  familyId: string
  /** Vacío = pago a cuenta (saldo a favor) */
  allocations?: AllocationInput[]
  amount: string
  paymentDate: string
  method: PaymentMethod
  reference?: string
  notes?: string
}
