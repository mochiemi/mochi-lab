export interface ValueItem {
  id: string
  value: number
  timestamp?: string
}

export interface UnitOption {
  value: string
  label: string
  symbol?: string
}

export interface Statistics {
  count: number
  sum: number
  sumOfDeviations: number
  sumOfSquaredDeviations: number
  mean: number
  variance: number
  standardDeviation: number
  meanAbsoluteDeviation: number
  relativeUncertainty: number
  min: number
  max: number
  range: number
  median: number
}

export interface StoredData {
  id: string
  name: string
  measurements: ValueItem[]
  unit: string
  significantFigures: number
  statistics: Statistics | null
  createdAt: string
  updatedAt: string
}

export interface ExportData {
  metadata: {
    name: string
    createdAt: string
    updatedAt: string
    version: string
  }
  measurements: ValueItem[]
  unit: string
  significantFigures: number
  statistics: Statistics
}

export interface ApostilaStatistics extends Statistics {
  experimentalValue: number
  absoluteError: number
  relativeError: number
}