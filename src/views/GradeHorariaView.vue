<template>
  <div class="schedule-view">
    <!-- Header -->
    <div class="schedule-header">
      <h1 class="schedule-title">
        <OhVueIcon name="bi-calendar-heart" class="title-icon" />
        Farmácia · 2026/1
        <Badge variant="secondary" size="medium" class="period-badge">
          {{ selectedPeriod === 'all' ? 'Todas' : `${selectedPeriod}º Período` }}
        </Badge>
      </h1>

      <div class="schedule-info">
        <div class="info-row">
          <OhVueIcon name="hi-clock" class="info-icon" />
          <span>02/03/2026 – 16/07/2026</span>
        </div>
        <div class="info-row">
          <OhVueIcon name="wi-time2" class="info-icon" />
          <span>{{ totalSubjects }} disciplinas · {{ totalClasses }} aulas/semana</span>
        </div>
      </div>

      <!-- Filtros por período -->
      <div class="period-filters">
        <Badge 
          variant="primary" 
          size="medium"
          :class="{ 'active-filter': selectedPeriod === 'all' }"
          @click="selectedPeriod = 'all'"
        >
          <OhVueIcon name="oi-eye" /> Todas
        </Badge>
        <Badge 
          v-for="period in availablePeriods" 
          :key="period"
          :variant="getPeriodVariant(period)"
          size="medium"
          :class="{ 'active-filter': selectedPeriod === period }"
          @click="selectedPeriod = period"
        >
          <OhVueIcon :name="getPeriodIcon(period)" /> {{ period }}º Período
        </Badge>
        <Badge 
          variant="tag" 
          size="medium"
          :class="{ 'active-filter': selectedPeriod === 'elective' }"
          @click="selectedPeriod = 'elective'"
        >
          <OhVueIcon name="gi-erlenmeyer" /> Eletivas
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
                :showTooltips="true"
              />
              <div v-if="item.classes.length === 0" class="empty-state">
                <OhVueIcon name="oi-sun" class="empty-icon" />
                <p>sem aula</p>
              </div>
            </div>
          </template>
        </Accordion>
      </div>

      <!-- Desktop View (Matrix Table) -->
      <div class="desktop-view">
        <div class="table-container">
          <table class="schedule-table">
            <thead>
              <tr>
                <th class="time-header">Horário</th>
                <th v-for="day in weekDays" :key="day" class="day-header">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="timeSlot in filteredTimeSlots" :key="timeSlot" class="time-row">
                <td class="time-cell">
                  <Badge :variant="'primary'" size="small">
                    <OhVueIcon name="wi-time2" /> {{ timeSlot }}
                  </Badge>
                </td>
                <td v-for="day in weekDays" :key="`${day}-${timeSlot}`" class="schedule-cell" :data-day="day">
                  <template v-if="getClassAtTimeSlot(day, timeSlot)">
                    <ClassCard
                      :classItem="getClassAtTimeSlot(day, timeSlot)"
                      :compact="true"
                      :showTooltips="true"
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

    <!-- Legenda -->
    <div class="schedule-legend">
      <div class="legend-item">
        <span class="legend-color required"></span>
        <span>Obrigatórias</span>
      </div>
      <div class="legend-item">
        <span class="legend-color elective"></span>
        <span>Eletivas</span>
      </div>
      <div class="legend-item">
        <span class="legend-color practical-1"></span>
        <span>Prática P1</span>
      </div>
      <div class="legend-item">
        <span class="legend-color practical-2"></span>
        <span>Prática T1</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import { useScheduleStore } from '@/stores/schedule'
import Badge from '@/components/ui/Badge.vue'
import Accordion from '@/components/ui/Accordion.vue'
import ClassCard from '@/components/layout/cards/ClassCard.vue'
import type { ClassItem } from '@/stores/schedule'

// Interface para o item do accordion
interface AccordionItem {
  id: string
  day: string
  title: string
  icon: string
  classes: ClassItem[]
}

const scheduleStore = useScheduleStore()
const expandedDays = ref<string[]>([])
const selectedPeriod = ref<string | number>('all') // 'all', 3, 4, 6, 'elective'

// Dias da semana
const weekDays = scheduleStore.weekDays

// Períodos disponíveis
const availablePeriods = computed(() => {
  const periods = new Set<number>()
  scheduleStore.allClasses.forEach((c: ClassItem) => periods.add(c.period))
  return Array.from(periods).filter((p: number) => p > 0).sort((a: number, b: number) => a - b)
})

// Total de disciplinas e aulas
const totalSubjects = computed(() => scheduleStore.totalSubjects)
const totalClasses = computed(() => scheduleStore.totalClasses)

// Filtrar classes baseado no período selecionado
const filteredClasses = computed(() => {
  if (selectedPeriod.value === 'all') {
    return scheduleStore.allClasses
  } else if (selectedPeriod.value === 'elective') {
    return scheduleStore.getClassesByType('elective')
  } else {
    // CORREÇÃO: usar Number() em vez de "as number"
    return scheduleStore.getClassesByPeriod(Number(selectedPeriod.value))
  }
})

// Horários únicos filtrados
const filteredTimeSlots = computed(() => {
  const slots = new Set<string>()
  filteredClasses.value.forEach((c: ClassItem) => slots.add(c.time))
  return Array.from(slots).sort((a: string, b: string) => {
    const hourA = parseInt(a.split(':')[0] || '0')
    const hourB = parseInt(b.split(':')[0] || '0')
    return hourA - hourB
  })
})

// Classes por dia (filtradas)
const filteredClassesByDay = computed(() => {
  const map = new Map<string, ClassItem[]>()
  weekDays.forEach((day: string) => map.set(day, []))
  
  filteredClasses.value.forEach((c: ClassItem) => {
    if (map.has(c.day)) {
      map.get(c.day)!.push(c)
    }
  })

  map.forEach((list: ClassItem[]) => {
    list.sort((a: ClassItem, b: ClassItem) => a.time.localeCompare(b.time))
  })
  
  return map
})

// Items para accordion mobile
const accordionItems = computed(() => {
  return weekDays.map((day: string) => ({
    id: day,
    day: day,
    title: `${day} · ${getFilteredClassesByDay(day).length} aula(s)`,
    icon: 'oi-sun',
    classes: getFilteredClassesByDay(day)
  }))
})

// Helper para pegar classes filtradas por dia
const getFilteredClassesByDay = (day: string): ClassItem[] => {
  return filteredClassesByDay.value.get(day) || []
}

// Matriz filtrada
const filteredClassMatrix = computed(() => {
  const matrix: Record<string, Record<string, ClassItem | null>> = {}
  
  weekDays.forEach((day: string) => {
    matrix[day] = {}
    filteredTimeSlots.value.forEach((slot: string) => {
      if (matrix[day]) {
        matrix[day][slot] = null
      }
    })
  })

  filteredClasses.value.forEach((c: ClassItem) => {
    const dayMatrix = matrix[c.day]
    if (dayMatrix && dayMatrix[c.time] === null) {
      dayMatrix[c.time] = c
    }
  })
  
  return matrix
})

// Pegar aula em dia/horário específico
const getClassAtTimeSlot = (day: string, timeSlot: string): ClassItem | null => {
  return filteredClassMatrix.value[day]?.[timeSlot] || null
}

// Variantes e ícones para os filtros
const getPeriodVariant = (period: number): string => {
  const variants = ['primary', 'secondary', 'success', 'warning', 'error']
  return variants[(period - 1) % variants.length] || 'primary'
}

const getPeriodIcon = (period: number): string => {
  const icons = ['bi-1-circle', 'bi-2-circle', 'bi-3-circle', 'bi-4-circle', 'bi-5-circle', 'bi-6-circle', 'bi-7-circle', 'bi-8-circle', 'bi-9-circle']
  return icons[(period - 1) % icons.length] || 'bi-calendar-heart'
}
</script>

<style scoped>
.schedule-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.5em;
  width: 100%;
}

.schedule-header {
  margin-bottom: 1.5em;
}

.schedule-title {
  font-size: 1.5em;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
  color: var(--title-secondary);
}

.title-icon {
  color: var(--primary);
  font-size: 1.5em;
  transform: scale(1.5);
  margin-right: 0.5em;
}

.period-badge {
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
  color: var(--primary);
}

/* Period Filters */
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
  opacity: 0.8;
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
}

/* Schedule Grid */
.schedule-grid {
  margin: 1em 0;
  width: 100%;
}

.mobile-view {
  display: block;
}

.mobile-view :deep(.accordion-header) {
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 1.1em;
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

/* Container da tabela para desktop */
.table-container {
  width: 100%;
  overflow-x: visible;
  border-radius: 16px;
  box-shadow: 0 4px 12px var(--shadow);
}

.schedule-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate; /* Mudado de collapse para separate */
  border-spacing: 0; /* Remove espaçamento entre células */
  background: var(--surface-primary);
  border-radius: 16px;
  overflow: hidden;
}

/* Estilização dos cabeçalhos */
.schedule-table thead tr {
  background: var(--rose-surface);
}

.schedule-table th {
  padding: 1em 0.5em;
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 1.1em;
  color: var(--title-primary);
  text-align: center;
  white-space: nowrap;
  border: 1px solid var(--border);
  border-bottom: 3px solid var(--border-primary);
}

/* Remove bordas duplicadas */
.schedule-table th:first-child {
  border-top-left-radius: 16px;
}

.schedule-table th:last-child {
  border-top-right-radius: 16px;
}

/* Células do corpo */
.schedule-table td {
  padding: 0.5em;
  vertical-align: top;
  border: 1px solid var(--border);
  position: relative;
  overflow: visible;
}

/* Coluna de horário - largura fixa e bem definida */
.time-cell {
  width: 120px; /* Largura fixa para a coluna de horário */
  min-width: 120px;
  max-width: 120px;
  text-align: center;
  background: var(--sky-blue-surface);
  font-weight: 600;
  white-space: nowrap;
  border-right: 2px solid var(--border-primary); /* Destaque na separação */
}

/* Colunas de dias da semana - distribuição igual do espaço restante */
.schedule-table td:not(.time-cell),
.schedule-table th:not(.time-header) {
  width: calc((100% - 120px) / 5); /* Subtrai a largura fixa do horário e divide pelos 5 dias */
}

/* Ajuste específico para os cabeçalhos dos dias */
.day-header {
  width: calc((100% - 120px) / 5);
}

.schedule-cell {
  overflow: visible;
  position: relative;
  min-height: 100px;
  background-color: var(--surface-primary);
}

/* Efeito hover nas células */
.schedule-cell:hover {
  background-color: var(--surface-hover);
  transition: background-color 0.2s ease;
}

/* Ajustes para o ClassCard dentro da tabela */
.schedule-cell :deep(.class-card) {
  max-width: 100%;
  margin: 0;
  padding: 0.5em;
  font-size: 0.9em;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow);
}

.schedule-cell :deep(.class-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-hover);
}

.schedule-cell :deep(.class-card .class-code) {
  font-size: 0.9em;
  font-weight: bold;
  white-space: normal;
  word-break: break-word;
}

.schedule-cell :deep(.class-card .class-name) {
  font-size: 0.8em;
  white-space: normal;
  word-break: break-word;
  margin: 0.25em 0;
}

.schedule-cell :deep(.class-card .class-info) {
  font-size: 0.75em;
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
  background-color: var(--surface-secondary);
  border-radius: 4px;
}

/* Linhas alternadas para melhor legibilidade */
.schedule-table tbody tr:nth-child(even) .schedule-cell {
  background-color: var(--surface-secondary);
}

.schedule-table tbody tr:nth-child(even) .time-cell {
  background-color: var(--sky-blue-surface);
  filter: brightness(0.95);
}

/* Legenda */
.schedule-legend {
  display: flex;
  gap: 1.5em;
  flex-wrap: wrap;
  margin-top: 2em;
  padding: 1em;
  background: var(--surface-secondary);
  border-radius: 8px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.9em;
  color: var(--text-secondary);
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px dashed;
}

.legend-color.required {
  background: var(--surface-primary);
  border-color: var(--border-secondary);
}

.legend-color.elective {
  background: var(--surface-primary);
  border-color: var(--secondary);
}

.legend-color.practical-1 {
  background: var(--sky-blue-surface);
  border-color: var(--sky-blue);
}

.legend-color.practical-2 {
  background: var(--rose-surface);
  border-color: var(--rose);
}

/* Responsividade */
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
  
  /* Ajuste da largura da coluna de horário em telas maiores */
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