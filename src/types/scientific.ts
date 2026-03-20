export interface ValueItem {
  id: string
  value: number
}

export interface UnitOption {
  value: string
  label: string
}

export interface Statistics {
  count: number
  sum: number
  sumOfDeviations: number
  mean: number
  uncertainty: number
  percentageDeviation: number
  min: number
  max: number
  range: number
}

export interface ExportData {
  measurements: ValueItem[]
  unit: string
  statistics: Statistics
  significantFigures: number
  exportedAt: string
}