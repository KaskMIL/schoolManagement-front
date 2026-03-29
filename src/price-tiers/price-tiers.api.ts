import { api } from '../lib/api'
import type { PriceTier } from './price-tiers.types'

export const priceTiersApi = {
  list: () => api.get<PriceTier[]>('/api/price-tiers'),
}
