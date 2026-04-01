// types/events.ts
export type EventDay = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo'
export type EventType = 'class' | 'tutoring' | 'study' | 'exam' | 'other'

export interface BaseEvent {
  id: string
  code: string
  title: string
  day: EventDay
  time: string
  room: string
  event_type: EventType
  professor?: string
  description?: string
  period?: number
  practical_class?: string
  class_type?: 'required' | 'elective' | 'optional'
  credits?: number
  tutor_name?: string
  subject_target?: string
  color_tag?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface EventItem extends BaseEvent {
  is_active: boolean
  created_at: string
  updated_at: string
}