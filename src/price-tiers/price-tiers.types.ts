export type PriceTierCode = 'jardin' | 'primaria_1' | 'primaria_2' | 'secundaria'

export interface PriceTier {
  id: string
  code: PriceTierCode
  name: string
  displayOrder: number
}
