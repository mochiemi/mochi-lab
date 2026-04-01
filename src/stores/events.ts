// stores/events.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { EventItem, EventType, EventDay, BaseEvent } from '@/types/events'

export const useEventsStore = defineStore('events', () => {
  // State
  const events = ref<EventItem[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<Date | null>(null)

  // Constants
  const weekDays: EventDay[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  // Getters
  const allEvents = computed<EventItem[]>(() => 
    events.value.filter((e: EventItem) => e.is_active !== false)
  )
  
  const getEventsByType = (type: EventType): EventItem[] => 
    allEvents.value.filter((e: EventItem) => e.event_type === type)

  const getEventsByDay = (day: EventDay): EventItem[] => {
    if (!day) return []
    return allEvents.value
      .filter((e: EventItem) => e.day === day)
      .sort((a: EventItem, b: EventItem) => a.time.localeCompare(b.time))
  }

  const getClassesByPeriod = (period: number | 'all'): EventItem[] => {
    if (period === 'all') return allEvents.value.filter((e: EventItem) => e.event_type === 'class')
    return allEvents.value.filter((e: EventItem) => 
      e.event_type === 'class' && e.period === period
    )
  }

  const todayClasses = computed<EventItem[]>(() => {
    const today = new Date()
    const weekDaysMap: Record<number, EventDay | 'Domingo'> = {
      0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 
      4: 'Quinta', 5: 'Sexta', 6: 'Sábado'
    }
    const todayName = weekDaysMap[today.getDay()]
    if (!todayName || todayName === 'Domingo') return []
    return getEventsByDay(todayName as EventDay)
  })

  // Corrigindo o computed nextClass - garantindo que nunca retorna undefined
  const nextClass = computed<EventItem | null>(() => {
    const now = new Date()
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    const weekDaysMap: (EventDay | 'Domingo')[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const todayName = weekDaysMap[now.getDay()]
    
    if (!todayName || todayName === 'Domingo') return null
    
    const todayEvents = getEventsByDay(todayName as EventDay)
    const todayRemaining = todayEvents.filter((c: EventItem) => c.time > currentTimeStr)
    if (todayRemaining.length > 0) {
      const firstEvent = todayRemaining[0]
      return firstEvent || null
    }

    const todayIndex = weekDaysMap.indexOf(todayName)
    
    for (let i = 1; i <= 6; i++) {
      const nextIndex = (todayIndex + i) % 7
      const nextDay = weekDaysMap[nextIndex]
      if (nextDay && nextDay !== 'Domingo') {
        const nextDayEvents = getEventsByDay(nextDay as EventDay)
        if (nextDayEvents.length > 0) {
          const firstEvent = nextDayEvents[0]
          return firstEvent || null
        }
      }
    }
    return null
  })

  const allTimeSlots = computed<string[]>(() => {
    const slots = new Set<string>()
    allEvents.value.forEach((e: EventItem) => {
      if (e.time) slots.add(e.time)
    })
    return Array.from(slots).sort((a: string, b: string) => {
      const [hA = ''] = a.split(':');
      const [hB = ''] = b.split(':');      
      const hourA = parseInt(hA)
      const hourB = parseInt(hB)
      return hourA - hourB
    })
  })

  // Actions
  const fetchEvents = async (force = false): Promise<void> => {
    if (!force && lastFetch.value && (new Date().getTime() - lastFetch.value.getTime()) < 300000) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: supaError } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('time', { ascending: true })

      if (supaError) throw supaError
      
      events.value = (data || []) as EventItem[]
      lastFetch.value = new Date()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar eventos'
      console.error('Fetch events error:', err)
    } finally {
      loading.value = false
    }
  }

  const createEvent = async (
    eventData: Omit<BaseEvent, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean; data?: EventItem; error?: string }> => {
    loading.value = true
    try {
      const insertData: any = {
        code: eventData.code,
        title: eventData.title,
        day: eventData.day,
        time: eventData.time,
        room: eventData.room,
        event_type: eventData.event_type,
        is_active: true
      }
      
      if (eventData.professor !== undefined) insertData.professor = eventData.professor
      if (eventData.description !== undefined) insertData.description = eventData.description
      if (eventData.period !== undefined) insertData.period = eventData.period
      if (eventData.practical_class !== undefined) insertData.practical_class = eventData.practical_class
      if (eventData.class_type !== undefined) insertData.class_type = eventData.class_type
      if (eventData.credits !== undefined) insertData.credits = eventData.credits
      if (eventData.tutor_name !== undefined) insertData.tutor_name = eventData.tutor_name
      if (eventData.subject_target !== undefined) insertData.subject_target = eventData.subject_target
      if (eventData.color_tag !== undefined) insertData.color_tag = eventData.color_tag

      const { data, error: supaError } = await supabase
        .from('events')
        .insert([insertData])
        .select()
        .single()

      if (supaError) {
        console.error('Supabase error:', supaError)
        throw supaError
      }
      
      if (data) {
        events.value.push(data as EventItem)
      }
      return { success: true, data: data as EventItem }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar evento'
      console.error('Create event error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateEvent = async (
    id: string, 
    updates: Partial<BaseEvent>
  ): Promise<{ success: boolean; data?: EventItem; error?: string }> => {
    loading.value = true
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      if (updates.code !== undefined) updateData.code = updates.code
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.day !== undefined) updateData.day = updates.day
      if (updates.time !== undefined) updateData.time = updates.time
      if (updates.room !== undefined) updateData.room = updates.room
      if (updates.event_type !== undefined) updateData.event_type = updates.event_type
      if (updates.professor !== undefined) updateData.professor = updates.professor
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.period !== undefined) updateData.period = updates.period
      if (updates.practical_class !== undefined) updateData.practical_class = updates.practical_class
      if (updates.class_type !== undefined) updateData.class_type = updates.class_type
      if (updates.credits !== undefined) updateData.credits = updates.credits
      if (updates.tutor_name !== undefined) updateData.tutor_name = updates.tutor_name
      if (updates.subject_target !== undefined) updateData.subject_target = updates.subject_target
      if (updates.color_tag !== undefined) updateData.color_tag = updates.color_tag

      const { data, error: supaError } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (supaError) {
        console.error('Supabase error:', supaError)
        throw supaError
      }

      const index = events.value.findIndex((e: EventItem) => e.id === id)
      if (index !== -1 && data) {
        events.value[index] = data as EventItem
      }
      return { success: true, data: data as EventItem }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar evento'
      console.error('Update event error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
    loading.value = true
    try {
      const { error: supaError } = await supabase
        .from('events')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (supaError) {
        console.error('Supabase error:', supaError)
        throw supaError
      }

      const index = events.value.findIndex((e: EventItem) => e.id === id)
      if (index !== -1) {
        events.value.splice(index, 1)
      }
      return { success: true }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao deletar evento'
      console.error('Delete event error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const hardDeleteEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: supaError } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (supaError) return { success: false, error: supaError.message }
      
      const index = events.value.findIndex((e: EventItem) => e.id === id)
      if (index !== -1) events.value.splice(index, 1)
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro' }
    }
  }

  return {
    events,
    loading,
    error,
    weekDays,
    allEvents,
    getEventsByType,
    getEventsByDay,
    getClassesByPeriod,
    todayClasses,
    nextClass,
    allTimeSlots,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    hardDeleteEvent
  }
})