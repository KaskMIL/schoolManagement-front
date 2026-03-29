export type PaymentMethod = 'efectivo' | 'transferencia' | 'mercadopago'

export interface Receipt {
  id: string
  receiptNumber: number
  academicYear: number
  issuedDate: string
}

export interface Payment {
  id: string
  createdAt: string
  amount: string
  paymentDate: string
  method: PaymentMethod
  reference: string | null
  notes: string | null
  installment: { id: string; description: string; month: number; academicYear: number } | null
  receivedBy: { id: string; firstName: string; lastName: string }
  receipt: Receipt | null
}

export interface CreatePaymentData {
  familyId: string
  installmentId?: string
  amount: string
  paymentDate: string
  method: PaymentMethod
  reference?: string
  notes?: string
}
