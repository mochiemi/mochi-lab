// stores/schedule.ts
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useEventsStore } from './events'
import type { EventItem, EventDay } from '@/types/events'

export const useScheduleStore = defineStore('schedule', () => {
  const eventsStore = useEventsStore()
  
  const weekDays: EventDay[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  // Computed que usam os dados do eventsStore
  const allClasses = computed<EventItem[]>(() => 
    eventsStore.allEvents.filter(e => e.event_type === 'class')
  )

  const getClassesByPeriod = (period: number | 'all' = 'all'): EventItem[] => {
    if (period === 'all') return allClasses.value
    return allClasses.value.filter(c => c.period === period)
  }

  const getClassesByType = (type: 'required' | 'elective' | 'optional'): EventItem[] => {
    return allClasses.value.filter(c => c.class_type === type)
  }

  const classesByDay = computed((): Map<EventDay, EventItem[]> => {
    const map = new Map<EventDay, EventItem[]>()
    weekDays.forEach(day => map.set(day, []))
    
    allClasses.value.forEach(c => {
      const dayClasses = map.get(c.day)
      if (dayClasses) {
        dayClasses.push(c)
      }
    })

    map.forEach((classes) => {
      classes.sort((a, b) => a.time.localeCompare(b.time))
    })

    return map
  })

  const allTimeSlots = computed((): string[] => {
    const slots = new Set<string>()
    allClasses.value.forEach(c => {
      if (c.time) slots.add(c.time)
    })
    return Array.from(slots).sort((a, b) => {
      const hourA = parseInt(a.split(':')[0] || '0')
      const hourB = parseInt(b.split(':')[0] || '0')
      return hourA - hourB
    })
  })

  const classMatrix = computed((): Record<EventDay, Record<string, EventItem | null>> => {
    const matrix: Partial<Record<EventDay, Record<string, EventItem | null>>> = {}
    
    weekDays.forEach(day => {
      matrix[day] = {}
      allTimeSlots.value.forEach(slot => {
        if (matrix[day]) {
          matrix[day]![slot] = null
        }
      })
    })

    allClasses.value.forEach(c => {
      const dayMatrix = matrix[c.day]
      if (dayMatrix && c.time && dayMatrix[c.time] === null) {
        dayMatrix[c.time] = c
      }
    })
    
    return matrix as Record<EventDay, Record<string, EventItem | null>>
  })

  const getClassesByDay = (day: EventDay): EventItem[] => {
    return classesByDay.value.get(day) || []
  }

  // CORRIGIDO: Garantindo que retorna null em vez de undefined
  const getClassAtTimeSlot = (day: EventDay, timeSlot: string): EventItem | null => {
    const dayMatrix = classMatrix.value[day]
    if (!dayMatrix) return null
    const classItem = dayMatrix[timeSlot]
    // Garantir que retornamos null se for undefined
    return classItem === undefined ? null : classItem
  }

  const totalClasses = computed((): number => allClasses.value.length)
  
  const totalSubjects = computed((): number => {
    const subjects = new Set(allClasses.value.map(c => c.code))
    return subjects.size
  })

  const getTodayClasses = (): EventItem[] => {
    const today = new Date()
    const weekDaysMap: Record<number, EventDay | 'Domingo'> = {
      0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 
      4: 'Quinta', 5: 'Sexta', 6: 'Sábado'
    }
    const todayName = weekDaysMap[today.getDay()]
    if (!todayName || todayName === 'Domingo') return []
    return getClassesByDay(todayName as EventDay)
  }

  const getNextClass = (): EventItem | undefined => {
    const now = new Date()
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    const weekDaysMap: (EventDay | 'Domingo')[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const todayName = weekDaysMap[now.getDay()]
    
    if (!todayName || todayName === 'Domingo') return undefined
    
    const todayClassesList = getClassesByDay(todayName as EventDay)
    const nextToday = todayClassesList.find(c => c.time > currentTimeStr)
    if (nextToday) return nextToday

    const todayIndex = weekDaysMap.indexOf(todayName)
    for (let i = 1; i <= 6; i++) {
      const nextDayIndex = (todayIndex + i) % 7
      const nextDayName = weekDaysMap[nextDayIndex]
      if (nextDayName && nextDayName !== 'Domingo') {
        const nextDayClasses = getClassesByDay(nextDayName as EventDay)
        if (nextDayClasses.length > 0) {
          return nextDayClasses[0]
        }
      }
    }
    return undefined
  }

  const getRemainingToday = (): number => {
    const now = new Date()
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    const todayClassesList = getTodayClasses()
    return todayClassesList.filter(c => c.time > currentTimeStr).length
  }

  return {
    allClasses,
    weekDays,
    classesByDay,
    allTimeSlots,
    classMatrix,
    getClassesByPeriod,
    getClassesByType,
    getClassesByDay,
    getClassAtTimeSlot,
    getTodayClasses,
    getNextClass,
    getRemainingToday,
    totalClasses,
    totalSubjects
  }
})