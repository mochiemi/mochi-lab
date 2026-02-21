<template>
  <div class="schedule-view">
    <!-- Header -->
    <div class="schedule-header">
      <h1 class="schedule-title">
        <OhVueIcon name="bi-calendar-heart" class="title-icon" />
        Farmácia · 2026/1
        <Badge variant="secondary" size="medium" class="turma-badge">Turma A</Badge>
      </h1>

      <div class="schedule-info">
        <div class="info-row">
          <OhVueIcon name="hi-clock" class="info-icon" />
          <span>02/03/2026 – 16/07/2026</span>
        </div>
        <div class="info-row">
          <OhVueIcon name="wi-time2" class="info-icon" />
          <span>Aulas práticas e teóricas</span>
        </div>
      </div>
    </div>

    <!-- Schedule Grid -->
    <div class="schedule-grid">
      <!-- Mobile View (Accordion) -->
      <div class="mobile-view">
        <Accordion
          :items="accordionItems"
          variant="primary"
          :bordered="true"
          :multiple="false"
          v-model="expandedDays"
        >
          <template #content="{ item }">
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
        <table class="schedule-table">
          <thead>
            <tr>
              <th>Horário</th>
              <th v-for="day in weekDays" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="timeSlot in sortedTimeSlots" :key="timeSlot">
              <td class="time-cell">
                <Badge :variant="'primary'" size="small">
                  <OhVueIcon name="wi-time2" /> {{ timeSlot }}
                </Badge>
              </td>
              <td v-for="day in weekDays" :key="`${day}-${timeSlot}`" class="schedule-cell">
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
</template>

<script setup>
import { computed, ref } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Badge from '@/components/ui/Badge.vue'
import Accordion from '@/components/ui/Accordion.vue'
import ClassCard from '@/components/layout/cards/ClassCard.vue'

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
const expandedDays = ref([])

const classes = [
  { day: 'Segunda', time: '09:00 - 10:00', subject: 'Biossegurança e Primeiros Socorros (DF117)', practicalClass: '1', room: 'AL-PCA-203 (02/03/2026 a 13/07/2026, semanalmente)', professor: 'Sônia Aparecida Figueiredo' },
  { day: 'Segunda', time: '10:00 - 11:00', subject: 'Biossegurança e Primeiros Socorros (DF117)', practicalClass: '1', room: 'AL-PCA-203 (02/03/2026 a 13/07/2026, semanalmente)', professor: 'Sônia Aparecida Figueiredo' },
  { day: 'Segunda', time: '13:00 - 14:00', subject: 'Anatomia Humana (DCB224)', practicalClass: '1', room: 'AL-N-103 (02/03/2026 a 13/07/2026, semanalmente)', professor: 'Camila Pinhata' },
  { day: 'Segunda', time: '14:00 - 15:00', subject: 'Anatomia Humana (DCB224)', practicalClass: '1', room: 'AL-N-103 (02/03/2026 a 13/07/2026, semanalmente)', professor: 'Camila Pinhata' },
  { day: 'Segunda', time: '15:00 - 16:00', subject: 'Química Geral (DCE410)', practicalClass: '1', room: 'AL-PCA-305 (02/03/2026 a 13/07/2026, semanalmente)', professor: 'Márcia Regina Cordeiro' },
  { day: 'Segunda', time: '16:00 - 17:00', subject: 'Química Geral (DCE410)', practicalClass: '1', room: 'AL-PCA-305 (02/03/2026 a 13/07/2026, semanalmente)', professor: 'Márcia Regina Cordeiro' },
  { day: 'Terça', time: '09:00 - 10:00', subject: 'Química Geral Experimental (DCE411)', practicalClass: '2', room: 'AL-Q-212 (03/03/2026 a 14/07/2026, semanalmente)', professor: 'Márcia Regina Cordeiro' },
  { day: 'Terça', time: '10:00 - 11:00', subject: 'Química Geral Experimental (DCE411)', practicalClass: '2', room: 'AL-Q-212 (03/03/2026 a 14/07/2026, semanalmente)', professor: 'Márcia Regina Cordeiro' },
  { day: 'Terça', time: '13:00 - 14:00', subject: 'Anatomia Humana (DCB224)', practicalClass: '1', room: 'AL-N-214 (03/03/2026 a 14/07/2026, semanalmente)', professor: 'Camila Pinhata' },
  { day: 'Terça', time: '14:00 - 15:00', subject: 'Anatomia Humana (DCB224)', practicalClass: '1', room: 'AL-N-214 (03/03/2026 a 14/07/2026, semanalmente)', professor: 'Camila Pinhata' },
  { day: 'Quarta', time: '07:00 - 08:00', subject: 'Histologia Básica (DCB78)', practicalClass: '1', room: 'AL-O-307 (04/03/2026 a 15/07/2026, semanalmente)', professor: 'Manuella Carvalho da Costa' },
  { day: 'Quarta', time: '08:00 - 09:00', subject: 'Histologia Básica (DCB78)', practicalClass: '1', room: 'AL-O-307 (04/03/2026 a 15/07/2026, semanalmente)', professor: 'Manuella Carvalho da Costa' },
  { day: 'Quarta', time: '09:00 - 10:00', subject: 'Histologia Básica (DCB78)', practicalClass: '1', room: 'AL-N-408 (04/03/2026 a 15/07/2026, semanalmente)', professor: 'Manuella Carvalho da Costa' },
  { day: 'Quarta', time: '09:00 - 10:00', subject: 'Práticas Farmacêuticas (DF118)', practicalClass: '2', room: 'AL-PCA-203 (04/03/2026 a 15/07/2026, semanalmente)', professor: 'Sônia Aparecida Figueiredo' },
  { day: 'Quarta', time: '10:00 - 11:00', subject: 'Histologia Básica (DCB78)', practicalClass: '1', room: 'AL-N-408 (04/03/2026 a 15/07/2026, semanalmente)', professor: 'Manuella Carvalho da Costa' },
  { day: 'Quarta', time: '10:00 - 11:00', subject: 'Práticas Farmacêuticas (DF118)', practicalClass: '2', room: 'AL-PCA-203 (04/03/2026 a 15/07/2026, semanalmente)', professor: 'Sônia Aparecida Figueiredo' },
  { day: 'Quarta', time: '15:00 - 16:00', subject: 'Biologia Celular (DCB225)', practicalClass: '1', room: 'AL-E-303 (04/03/2026 a 15/07/2026, semanalmente)', professor: 'Angel Roberto Barchuk <br> Ester Siqueira Caixeta Nogueira' },
  { day: 'Quarta', time: '16:00 - 17:00', subject: 'Biologia Celular (DCB225)', practicalClass: '1', room: 'AL-E-303 (04/03/2026 a 15/07/2026, semanalmente)', professor: 'Angel Roberto Barchuk <br> Ester Siqueira Caixeta Nogueira' },
  { day: 'Quinta', time: '08:00 - 09:00', subject: 'Biologia Celular (DCB225)', practicalClass: '1', room: 'AL-PCA-305 (05/03/2026 a 16/07/2026, semanalmente)', professor: 'Angel Roberto Barchuk <br> Ester Siqueira Caixeta Nogueira' },
  { day: 'Quinta', time: '09:00 - 10:00', subject: 'Biologia Celular (DCB225)', practicalClass: '1', room: 'AL-PCA-305 (05/03/2026 a 16/07/2026, semanalmente)', professor: 'Angel Roberto Barchuk <br> Ester Siqueira Caixeta Nogueira' },
  { day: 'Quinta', time: '10:00 - 11:00', subject: 'Biologia Celular (DCB225)', practicalClass: '1', room: 'AL-PCA-305 (05/03/2026 a 16/07/2026, semanalmente)', professor: 'Angel Roberto Barchuk <br> Ester Siqueira Caixeta Nogueira' },
  { day: 'Quinta', time: '13:00 - 14:00', subject: 'Psicologia Aplicada à Saúde (DCH149)', practicalClass: '1', room: 'AL-PCA-203 (05/03/2026 a 16/07/2026, semanalmente)', professor: 'Alexia Thamy Gomes de Oliveira' },
  { day: 'Quinta', time: '14:00 - 15:00', subject: 'Psicologia Aplicada à Saúde (DCH149)', practicalClass: '1', room: 'AL-PCA-203 (05/03/2026 a 16/07/2026, semanalmente)', professor: 'Alexia Thamy Gomes de Oliveira' },
  { day: 'Quinta', time: '15:00 - 16:00', subject: 'Anatomia Humana (DCB224)', practicalClass: '1', room: 'AL-N-103 (05/03/2026 a 16/07/2026, semanalmente)', professor: 'Camila Pinhata' },
  { day: 'Quinta', time: '16:00 - 17:00', subject: 'Anatomia Humana (DCB224)', practicalClass: '1', room: 'AL-N-103 (05/03/2026 a 16/07/2026, semanalmente)', professor: 'Camila Pinhata' },
  { day: 'Sexta', time: '07:00 - 08:00', subject: 'Introdução às Ciências Farmacêuticas (DF69)', practicalClass: '1', room: 'AL-PCA-203 (06/03/2026 a 08/05/2026, semanalmente)', professor: 'Ricardo Radighieri Rascado' },
  { day: 'Sexta', time: '08:00 - 09:00', subject: 'Introdução às Ciências Farmacêuticas (DF69)', practicalClass: '1', room: 'AL-PCA-203 (06/03/2026 a 08/05/2026, semanalmente)', professor: 'Ricardo Radighieri Rascado' },
  { day: 'Sexta', time: '09:00 - 10:00', subject: 'Química Geral (DCE410)', practicalClass: '1', room: 'AL-PCA-305 (06/03/2026 a 10/07/2026, semanalmente)', professor: 'Márcia Regina Cordeiro' },
  { day: 'Sexta', time: '10:00 - 11:00', subject: 'Química Geral (DCE410)', practicalClass: '1', room: 'AL-PCA-305 (06/03/2026 a 10/07/2026, semanalmente)', professor: 'Márcia Regina Cordeiro' }
]

const classesByDay = computed(() => {
  const map = new Map()
  weekDays.forEach(day => map.set(day, []))
  classes.forEach(c => {
    if (map.has(c.day)) {
      map.get(c.day).push(c)
    }
  })

  map.forEach(list => {
    list.sort((a, b) => a.time.localeCompare(b.time))
  })
  return map
})

const accordionItems = computed(() => {
  return weekDays.map(day => ({
    id: day,
    day: day,
    title: `${day} · ${getClassesByDay(day).length} aula(s)`,
    icon: 'oi-sun',
    classes: getClassesByDay(day)
  }))
})

const getClassesByDay = (day) => {
  const classes = classesByDay.value.get(day)
  return classes || []
}

const allTimeSlots = computed(() => {
  const slots = new Set()
  classes.forEach(c => slots.add(c.time))
  return Array.from(slots).sort((a, b) => a.localeCompare(b))
})

const sortedTimeSlots = computed(() => {
  return allTimeSlots.value.sort((a, b) => {
    const hourA = parseInt(a.split(':')[0])
    const hourB = parseInt(b.split(':')[0])
    return hourA - hourB
  })
})

const classMatrix = computed(() => {
  const matrix = {}
  

  weekDays.forEach(day => {
    matrix[day] = {}
    allTimeSlots.value.forEach(slot => {
      matrix[day][slot] = null
    })
  })


  classes.forEach(c => {
    if (matrix[c.day] && matrix[c.day][c.time] === null) {
      matrix[c.day][c.time] = c
    }

    else if (matrix[c.day] && matrix[c.day][c.time] !== null) {
      console.warn(`Multiple classes at ${c.day} ${c.time}`)
    }
  })
  
  return matrix
})

const getClassAtTimeSlot = (day, timeSlot) => {
  if (!classMatrix.value[day]) return null
  return classMatrix.value[day][timeSlot] || null
}
</script>

<style scoped>
.schedule-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.5em;
}

.schedule-header {
  margin-bottom: 1.5em;
}

.schedule-title {
  font-size: 1.5em;
  margin-bottom: 1em;
  flex-wrap: wrap;
  gap: 0.5em;
  justify-content: flex-start;
}

.title-icon{
  color: var(--primary);
  font-size: 2em;
  transform: scale(2);
}

.turma-badge {
  font-size: 0.7em;
}

.schedule-info {
  background: var(--sky-blue-surface);
  padding: 1em;
  border-radius: 12px;
  border: 2px dashed var(--border-secondary);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: var(--text-primary);
  font-size: 0.9em;
}

.info-row:first-child {
  margin-bottom: 0.5em;
}

.info-icon {
  color: var(--primary);
  font-size: 1em;
  transform: scale(1.1em);
}

.schedule-grid {
  margin: 1em 0;
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
  transform: scale(2em);
}

.desktop-view {
  display: none;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--surface-primary);
  border-radius: 16px;
  overflow: visible;
  box-shadow: 0 4px 12px var(--shadow);
}

.schedule-table thead tr {
  background: var(--rose-surface);
  border-bottom: 3px solid var(--border-primary);
}

.schedule-table th {
  padding: 0.5em;
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 1.1em;
  color: var(--title-primary);
  text-align: center;
}

.schedule-table td {
  padding: 0.75em;
  vertical-align: top;
}

.time-cell {
  width: 120px;
  text-align: center;
  background: var(--sky-blue-surface);
  font-weight: 600;
}

.schedule-cell {
  min-width: 200px;
}

.cell-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 80px;
  color: var(--text-disabled);
  font-style: italic;
}

@media (min-width: 768px) {
  .schedule-view {
    padding: 1.5em;
  }

  .schedule-title {
    font-size: 1.8em;
  }

  .schedule-info {
    display: flex;
    gap: 1em;
  }

  .info-row:first-child {
    margin-bottom: 0;
  }
}

@media (min-width: 1024px) {
  .mobile-view {
    display: none;
  }

  .desktop-view {
    display: block;
    overflow-x: visible;
  }

  .schedule-view {
    padding: 1em;
  }

  .schedule-title {
    font-size: 2em;
  }

  .schedule-table {
    font-size: 0.9em;
  }

  .schedule-table th {
    font-size: 1.1em;
    padding: 1em;
  }

  .schedule-table td {
    padding: 0.5em;
    border: 1px solid var(--border);
  }

  .time-cell {
    width: 140px;
  }
}

@media (min-width: 1280px) {
  .schedule-table {
    font-size: 1em;
  }
}
</style>