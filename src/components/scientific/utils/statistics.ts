import type { ValueItem, Statistics } from '@/types/scientific'

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export const calculateStatistics = (values: ValueItem[], significantFigures: number): Statistics => {
  if (values.length === 0) {
    return {
      count: 0,
      sum: 0,
      sumOfDeviations: 0,
      sumOfSquaredDeviations: 0,
      mean: 0,
      variance: 0,
      standardDeviation: 0,
      meanAbsoluteDeviation: 0,
      relativeUncertainty: 0,
      min: 0,
      max: 0,
      range: 0,
      median: 0
    }
  }

  const valuesArray = values.map(v => v.value)
  const count = valuesArray.length
  const sum = valuesArray.reduce((acc, val) => acc + val, 0)
  const mean = sum / count
  
  const deviations = valuesArray.map(val => Math.abs(val - mean))
  const sumOfDeviations = deviations.reduce((acc, val) => acc + val, 0)
  const meanAbsoluteDeviation = sumOfDeviations / count
  
  const squaredDeviations = valuesArray.map(val => Math.pow(val - mean, 2))
  const sumOfSquaredDeviations = squaredDeviations.reduce((acc, val) => acc + val, 0)
  const variance = count < 2 ? 0 : sumOfSquaredDeviations / (count - 1)
  const standardDeviation = Math.sqrt(variance)
  
  const relativeUncertainty = mean === 0 ? 0 : (meanAbsoluteDeviation / Math.abs(mean)) * 100
  
  const min = Math.min(...valuesArray)
  const max = Math.max(...valuesArray)
  const range = max - min
  
 
  const sorted = [...valuesArray].sort((a, b) => a - b)
  let median: number = 0
  
  if (sorted.length % 2 === 0) {
    const left = sorted[sorted.length / 2 - 1]
    const right = sorted[sorted.length / 2]

    if (left !== undefined && right !== undefined) {
      median = (left + right) / 2
    } else if (left !== undefined) {
      median = left
    }
  } else {
    const middle = sorted[Math.floor(sorted.length / 2)]
    if (middle !== undefined) {
      median = middle
    }
  }

  return {
    count,
    sum,
    sumOfDeviations,
    sumOfSquaredDeviations,
    mean,
    variance,
    standardDeviation,
    meanAbsoluteDeviation,
    relativeUncertainty,
    min,
    max,
    range,
    median
  }
}

export const formatNumber = (num: number, significantFigures: number): string => {
  if (num === 0) return '0'
  if (isNaN(num) || !isFinite(num)) return '—'

  try {
    if (significantFigures > 0 && num !== 0) {
      return num.toPrecision(significantFigures)
    }

    if (Math.abs(num) < 0.001 || Math.abs(num) > 10000) {
      return num.toExponential(3)
    }
    return num.toFixed(4).replace(/\.?0+$/, '')
  } catch {
    return num.toString()
  }
}