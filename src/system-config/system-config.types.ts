export interface SystemConfig {
  currentAcademicYear: number
  earlyPaymentCutoffDay: number
}

export interface UpdateSystemConfigData {
  currentAcademicYear: number
  earlyPaymentCutoffDay?: number
}
