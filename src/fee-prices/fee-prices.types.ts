import type { PriceTier } from '../price-tiers/price-tiers.types'

export interface FeePrice {
  id: string
  createdAt: string
  updatedAt: string
  academicYear: number
  amount: string
  priceTier: PriceTier | null
}

export interface CreateFeePriceData {
  feeConceptId: string
  priceTierId?: string
  academicYear: number
  amount: number
}

export interface UpdateFeePriceData {
  priceTierId?: string
  academicYear: number
  amount: number
}
