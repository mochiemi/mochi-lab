<!-- views/GradeHorariaView.vue -->
<template>
  <div class="schedule-view">
    <!-- Header -->
    <div class="schedule-header">
      <h1 class="schedule-title">
        <OhVueIcon name="bi-calendar-heart" class="title-icon" />
        {{ $t('schedule.farmacy') }} · 2026/1
        <Badge variant="primary" size="medium" class="period-badge">
          {{ selectedPeriod === 'all' ? $t('schedule.allPeriods') : `${selectedPeriod}º ${$t('schedule.period')}` }}
        </Badge>
      </h1>

      <div class="schedule-info">
        <div class="info-row">
          <OhVueIcon name="hi-clock" class="info-icon" />
          <span>02/03/2026 – 16/07/2026</span>
        </div>
        <div class="info-row">
          <OhVueIcon name="bi-clipboard-data-fill" class="info-icon" />
          <span>{{ totalSubjects }} {{ $t('schedule.subjects') }} · {{ totalClasses }} {{ $t('schedule.classesPerWeek') }}</span>
        </div>
      </div>

      <div class="period-filters">
        <Badge
          variant="primary"
          size="medium"
          :outlined="selectedPeriod !== 'all'"
          :class="{ 'active-filter': selectedPeriod === 'all' }"
          @click="selectedPeriod = 'all'"
        >
          <OhVueIcon name="oi-eye" /> {{ $t('schedule.all') }}
        </Badge>
        <Badge
          v-for="period in availablePeriods"
          :key="period"
          variant="primary"
          size="medium"
          :outlined="selectedPeriod !== period"
          :class="{ 'active-filter': selectedPeriod === period }"
          @click="selectedPeriod = period"
        >
          <OhVueIcon :name="getPeriodIcon(period)" /> {{ period }}º {{ $t('schedule.period') }}
        </Badge>
        <Badge
          variant="primary"
          size="medium"
          :outlined="selectedPeriod !== 'elective'"
          :class="{ 'active-filter': selectedPeriod === 'elective' }"
          @click="selectedPeriod = 'elective'"
        >
          <OhVueIcon name="gi-erlenmeyer" /> {{ $t('schedule.electives') }}
        </Badge>
      </div>
    </div>

    <div class="schedule-grid">
      <div class="mobile-view">
        <Accordion
          :items="accordionItems"
          variant="primary"
          :bordered="true"
          :multiple="false"
          v-model="expandedDays"
        >
          <template #content="{ item }: any">
            <div class="class-list">
              <ClassCard
                v-for="(classItem, index) in item.classes"
                :key="`mobile-${item.day}-${index}`"
                :classItem="classItem"
              />
              <div v-if="item.classes.length === 0" class="empty-state">
                <OhVueIcon name="oi-sun" class="empty-icon" />
                <p>{{ $t('schedule.noClass') }}</p>
              </div>
            </div>
          </template>
        </Accordion>
      </div>

      <div class="desktop-view">
        <div class="table-container">
          <table class="schedule-table">
            <thead>
              <tr>
                <th class="time-header">{{ $t('schedule.time') }}</th>
                <th v-for="day in weekDays" :key="day" class="day-header">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="timeSlot in filteredTimeSlots" :key="timeSlot" class="time-row">
                <td class="time-cell">
                  <Badge variant="primary" size="medium">
                    <OhVueIcon name="hi-clock" class="time-icon"/> {{ timeSlot }}
                  </Badge>
                </td>
                <td v-for="day in weekDays" :key="`${day}-${timeSlot}`" class="schedule-cell" :data-day="day">
                  <template v-if="getClassAtTimeSlot(day, timeSlot)">
                    <ClassCard
                      :classItem="getClassAtTimeSlot(day, timeSlot)!"
                      :compact="true"
                    />
                  </template>
                  <div v-else class="cell-empty">
                    —
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { OhVueIcon } from 'oh-vue-icons'
import { useEventsStore } from '@/stores/events'
import Badge from '@/components/ui/Badge.vue'
import Accordion from '@/components/ui/Accordion.vue'
import ClassCard from '@/components/layout/cards/ClassCard.vue'
import type { EventItem, EventDay } from '@/types/events'

const { t } = useI18n()
const eventsStore = useEventsStore()
const expandedDays = ref<string[]>([])
const selectedPeriod = ref<string | number>('all')

const weekDays: EventDay[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const availablePeriods = computed<number[]>(() => {
  const periods = new Set<number>()
  eventsStore.allEvents
    .filter((e: EventItem) => e.event_type === 'class')
    .forEach((c: EventItem) => {
      if (c.period && c.period > 0) periods.add(c.period)
    })
  return Array.from(periods).sort((a: number, b: number) => a - b)
})

const totalSubjects = computed<number>(() => {
  const codes = new Set(eventsStore.allEvents.map((c: EventItem) => c.code))
  return codes.size
})

const totalClasses = computed<number>(() => eventsStore.allEvents.length)

const filteredEvents = computed<EventItem[]>(() => {
  let result: EventItem[] = eventsStore.allEvents
  
  if (selectedPeriod.value === 'all') {
    // mantem tudo
  } else if (selectedPeriod.value === 'elective') {
    result = result.filter((e: EventItem) => 
      e.event_type === 'class' && e.class_type === 'elective'
    )
  } else {
    result = result.filter((e: EventItem) => 
      e.event_type === 'class' && e.period === Number(selectedPeriod.value)
    )
  }
  
  return result
})

const filteredTimeSlots = computed<string[]>(() => {
  const slots = new Set<string>()
  filteredEvents.value.forEach((c: EventItem) => {
    if (c.time) slots.add(c.time)
  })
  return Array.from(slots).sort((a: string, b: string) => {
    const hourA = parseInt(a.split(':')[0] || '0')
    const hourB = parseInt(b.split(':')[0] || '0')
    return hourA - hourB
  })
})

const filteredClassesByDay = computed<Map<EventDay, EventItem[]>>(() => {
  const map = new Map<EventDay, EventItem[]>()
  weekDays.forEach((day: EventDay) => map.set(day, []))

  filteredEvents.value.forEach((c: EventItem) => {
    const dayKey = c.day as EventDay
    const dayList = map.get(dayKey)
    if (dayList) {
      dayList.push(c)
    }
  })

  map.forEach((list: EventItem[]) => {
    list.sort((a: EventItem, b: EventItem) => a.time.localeCompare(b.time))
  })

  return map
})

const accordionItems = computed(() => {
  return weekDays.map((day: EventDay) => ({
    id: day,
    day: day,
    title: `${day} · ${getFilteredClassesByDay(day).length} ${t('schedule.classes')}`,
    icon: 'oi-sun',
    classes: getFilteredClassesByDay(day)
  }))
})

const getFilteredClassesByDay = (day: EventDay): EventItem[] => {
  return filteredClassesByDay.value.get(day) || []
}

const filteredClassMatrix = computed<Record<string, Record<string, EventItem | null>>>(() => {
  const matrix: Record<string, Record<string, EventItem | null>> = {}

  weekDays.forEach((day: EventDay) => {
    matrix[day] = {}
    filteredTimeSlots.value.forEach((slot: string) => {
      if (matrix[day]) {
        matrix[day]![slot] = null
      }
    })
  })

  filteredEvents.value.forEach((c: EventItem) => {
    const dayMatrix = matrix[c.day]
    if (dayMatrix && c.time && dayMatrix[c.time] === null) {
      dayMatrix[c.time] = c
    }
  })

  return matrix
})

const getClassAtTimeSlot = (day: string, timeSlot: string): EventItem | null => {
  const dayData = filteredClassMatrix.value[day]
  if (dayData && dayData[timeSlot]) {
    return dayData[timeSlot]
  }
  return null
}

const getPeriodIcon = (period: number | string): string => {
  if (typeof period === 'string') {
    return 'bi-calendar-heart'
  }
  const icons: string[] = ['bi-1-circle', 'bi-2-circle', 'bi-3-circle', 'bi-4-circle', 'bi-5-circle', 'bi-6-circle']
  const index = period - 1
  if (index >= 0 && index < icons.length) {
    return icons[index] || 'bi-calendar-heart'
  }
  return 'bi-calendar-heart'
}

onMounted(() => {
  eventsStore.fetchEvents()
})
</script>

<style scoped>
.schedule-view {
  max-width: 1400px;
  margin: 3rem auto;
  padding: 0.5em;
  width: 100%;
}

.schedule-header {
  margin-bottom: 1.5em;
}

.schedule-title {
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
  color: var(--title-secondary);
}

.title-icon {
  color: var(--strong-rose);
  font-size: 1.5em;
  transform: scale(2);
  margin-right: 0.5em;
}

.period-badge {
  margin-left: 1.5em;
  font-size: 0.7em;
}

.schedule-info {
  background: var(--sky-blue-surface);
  padding: 1em;
  border-radius: 12px;
  border: 2px dashed var(--border-secondary);
  margin-bottom: 1em;
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: var(--text-primary);
  font-size: 0.9em;
}

.info-icon {
  color: var(--title-primary);
}

.period-filters {
  display: flex;
  gap: 0.75em;
  flex-wrap: wrap;
  margin-top: 1em;
  justify-content: center;
}

.period-filters .badge {
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.9;
  border-width: 2px;
}

.period-filters .badge:hover {
  transform: translateY(-2px);
  opacity: 1;
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.period-filters .active-filter {
  opacity: 1;
  transform: scale(1.05);
  border-width: 3px;
  box-shadow: 0 4px 12px var(--shadow-hover);
  background: var(--primary) !important;
  color: var(--text-contrast) !important;
  border-color: var(--border-contrast) !important;
}

.schedule-grid {
  margin: 1em 0;
  width: 100%;
}

.mobile-view {
  display: block;
}

.mobile-view :deep(.accordion-header) {
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 1.2em;
  padding: 1em;
}

.mobile-view :deep(.accordion-icon) {
  color: var(--secondary);
}

.class-list {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 0.5em 0;
}

.empty-state {
  text-align: center;
  padding: 2em 1em;
  color: var(--text-disabled);
}

.empty-icon {
  font-size: 2em;
  margin-bottom: 0.5em;
  color: var(--border);
}

.desktop-view {
  display: none;
}

.table-container {
  width: 100%;
  overflow-x: visible;
  border-radius: 16px;
}

.schedule-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
  border: 2px dashed var(--border-contrast);
}

.schedule-table thead tr {
  background: var(--rose-surface);
}

.schedule-table th {
  padding: 1em 0.5em;
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 1.2em;
  color: var(--title-primary);
  text-align: center;
  white-space: nowrap;
  border: 1px solid var(--border-primary);
  border-bottom: 3px solid var(--border-primary);
}

.schedule-table th:first-child {
  border-top-left-radius: 16px;
}

.schedule-table th:last-child {
  border-top-right-radius: 16px;
}

.schedule-table td {
  padding: 0.5em;
  vertical-align: top;
  border: 1px dotted var(--border-secondary);
  position: relative;
  overflow: visible;
}

.time-cell {
  width: 120px;
  min-width: 120px;
  max-width: 120px;
  text-align: center;
  background: var(--sky-blue-surface);
  font-weight: 600;
  white-space: nowrap;
}

.time-cell .badge {
  background: transparent;
  border: 1px solid var(--border-secondary);
  color: var(--text-primary);
}

.time-icon {
  margin: 0.1rem;
}

.schedule-table td:not(.time-cell),
.schedule-table th:not(.time-header) {
  width: calc((100% - 120px) / 5);
}

.day-header {
  width: calc((100% - 120px) / 5);
}

.schedule-cell {
  overflow: visible;
  position: relative;
  min-height: 100px;
  background-color: var(--surface-primary);
  padding: 0;
  transition: background-color 0.2s ease;
}

.schedule-cell:hover {
  background-color: var(--rose-surface);
}

.schedule-cell :deep(.class-card) {
  width: 100%;
  margin: 0;
  padding: 0.5em;
  font-size: 0.9em;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.schedule-cell :deep(.class-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-hover);
}

.schedule-cell :deep(.class-card .class-code) {
  font-size: 0.8em;
  padding: 0.1rem 0.4rem;
}

.schedule-cell :deep(.class-card .class-name) {
  font-size: 0.75em;
  white-space: normal;
  word-break: break-word;
  margin: 0.2em 0;
}

.schedule-cell :deep(.class-card .class-info) {
  font-size: 0.7em;
}

.schedule-cell :deep(.class-card .info-icon) {
  font-size: 0.7em;
}

.cell-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  height: 100%;
  color: var(--text-disabled);
  font-style: italic;
  font-size: 0.9em;
  background-color: transparent;
  border-radius: 4px;
}

@media (min-width: 768px) {
  .schedule-view {
    padding: 1.5em;
  }

  .schedule-title {
    font-size: 1.8em;
  }

  .period-filters {
    justify-content: flex-start;
  }
}

@media (min-width: 1024px) {
  .mobile-view {
    display: none;
  }

  .desktop-view {
    display: block;
    width: 100%;
  }

  .schedule-view {
    padding: 1em;
  }

  .schedule-title {
    font-size: 2em;
  }

  .schedule-table {
    font-size: 0.85em;
  }

  .schedule-table th {
    padding: 1em;
  }

  .time-cell {
    width: 140px;
    min-width: 140px;
    max-width: 140px;
  }

  .schedule-table td:not(.time-cell),
  .schedule-table th:not(.time-header) {
    width: calc((100% - 140px) / 5);
  }
}

@media (min-width: 1280px) {
  .schedule-table {
    font-size: 0.9em;
  }

  .time-cell {
    width: 160px;
    min-width: 160px;
    max-width: 160px;
  }

  .schedule-table td:not(.time-cell),
  .schedule-table th:not(.time-header) {
    width: calc((100% - 160px) / 5);
  }
}

@media (min-width: 1400px) {
  .schedule-table {
    font-size: 1em;
  }

  .time-cell {
    width: 180px;
    min-width: 180px;
    max-width: 180px;
  }

  .schedule-table td:not(.time-cell),
  .schedule-table th:not(.time-header) {
    width: calc((100% - 180px) / 5);
  }
}

@media (max-width: 480px) {
  .schedule-title {
    font-size: 1.2em;
  }

  .period-filters .badge {
    font-size: 0.8em;
  }

  .info-row {
    font-size: 0.8em;
  }
}
</style>