import { api } from '../lib/api'
import type { SystemConfig, UpdateSystemConfigData } from './system-config.types'

export const systemConfigApi = {
  get: () => api.get<SystemConfig>('/api/system-config'),
  update: (data: UpdateSystemConfigData) => api.patch<SystemConfig>('/api/system-config', data),
}
