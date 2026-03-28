import { api } from '../lib/api'
import type { Institution } from './institutions.types'

export const institutionsApi = {
  list: () => api.get<Institution[]>('/api/institutions'),
}
