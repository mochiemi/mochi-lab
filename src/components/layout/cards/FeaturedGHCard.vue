<template>
  <Card class="feature-card schedule-card" :padding="'normal'">
    <template #header>
      <div class="feature-header">
        <div class="feature-icon-wrapper">
          <OhVueIcon name="bi-calendar-heart" class="feature-icon" />
        </div>
        <Badge variant="secondary" size="small">
          <OhVueIcon name="wi-time2" class="badge-icon" />
          2026/1
        </Badge>
      </div>
      <h3 class="feature-title">{{ $t('home.features.schedule') }}</h3>
    </template>

    <div class="feature-content">
      <div v-if="loading" class="feature-loading">
        <Loading size="md" :text="$t('schedule.loading')" />
      </div>

      <div v-else class="schedule-preview">
        <!-- Info do dia atual -->
        <div class="current-day-info">
          <span class="current-day-label">{{ $t('today') }}:</span>
          <span class="current-day">{{ currentDayName }}</span>
          <span class="current-date">{{ currentFormattedDate }}</span>
        </div>

        <!-- Próxima aula -->
        <div v-if="nextClass" class="next-class-section">
          <p class="next-class-label">
            <OhVueIcon name="hi-clock" class="next-class-icon" />
            {{ $t('nextClass') }}:
          </p>
          <div class="next-class-card">
            <Badge :variant="getClassBadgeVariant(nextClass)" size="small" class="class-time-badge">
              {{ nextClass.time }}
            </Badge>
            <div class="next-class-details">
              <span class="next-class-subject">{{ nextClass.subject }} ({{ nextClass.code }})</span>
              <span v-if="nextClass.practicalClass && nextClass.practicalClass !== 'A'" 
                    class="next-class-practical">
                TP {{ nextClass.practicalClass }}
              </span>
            </div>
            <Tooltip 
              v-if="nextClass.room"
              :content="nextClass.room"
              position="top"
              size="lg"
              class="room-tooltip"
            >
              <OhVueIcon name="fa-regular-map-marker-alt" class="room-icon" />
            </Tooltip>
          </div>
        </div>

        <!-- Aulas de hoje -->
        <div class="today-classes" v-if="todayClasses.length > 0">
          <p class="today-classes-label">
            <OhVueIcon name="bi-calendar-heart" class="today-icon" />
            {{ $t('todayClasses') }} ({{ todayClasses.length }}):
          </p>
          <div class="classes-list">
            <div 
              v-for="(classItem, index) in todayClasses.slice(0, 3)" 
              :key="index"
              class="today-class-item"
              :class="{ 'next-class-highlight': isNextClass(classItem) }"
            >
              <Badge :variant="getClassBadgeVariant(classItem)" size="small" class="class-time-badge">
                {{ classItem.time }}
              </Badge>
              <span class="today-class-subject">{{ classItem.subject }}</span>
              <Badge 
                v-if="classItem.practicalClass && classItem.practicalClass !== 'A'" 
                variant="tag" 
                size="small"
                class="class-type-badge"
              >
                {{ classItem.practicalClass }}
              </Badge>
            </div>
            <div v-if="todayClasses.length > 3" class="more-classes">
              <OhVueIcon name="oi-ellipsis" />
              +{{ todayClasses.length - 3 }} {{ $t('moreClasses') }}
            </div>
          </div>
        </div>
        <div v-else class="no-classes-today">
          <OhVueIcon name="oi-sun" class="sun-icon" />
          <p>{{ $t('noClassesToday') }}</p>
        </div>

        <!-- Estatísticas da semana -->
        <div class="schedule-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalClasses }}</span>
            <span class="stat-label">{{ $t('weeklyClasses') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalSubjects }}</span>
            <span class="stat-label">{{ $t('subjects') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ remainingToday }}</span>
            <span class="stat-label">{{ $t('remainingToday') }}</span>
          </div>
        </div>

        <div class="schedule-update">
          <OhVueIcon name="oi-check" class="update-icon" />
          <span>{{ $t('home.features.updated') }}: {{ lastUpdate }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="feature-footer">
        <Button 
          variant="outline" 
          size="small"
          @click="$router.push('/grade-horaria')"
        >
          <OhVueIcon name="bi-calendar-heart" class="btn-icon" />
          {{ $t('home.features.viewSchedule') }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useScheduleStore } from '@/stores/schedule'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Loading from '@/components/ui/Loading.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { OhVueIcon } from '@/plugins/icons'

const router = useRouter()
const languageStore = useLanguageStore()
const scheduleStore = useScheduleStore()

const loading = ref(false)
const currentTime = ref(new Date())

// Atualizar hora atual a cada minuto
let timer
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Data formatada
const currentDayName = computed(() => {
  return currentTime.value.toLocaleDateString(languageStore.currentLanguage, { weekday: 'long' })
})

const currentFormattedDate = computed(() => {
  return currentTime.value.toLocaleDateString(languageStore.currentLanguage, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Aulas de hoje
const todayClasses = computed(() => {
  return scheduleStore.getTodayClasses()
})

// Próxima aula
const nextClass = computed(() => {
  return scheduleStore.getNextClass()
})

// Verificar se é a próxima aula
const isNextClass = (classItem) => {
  if (!nextClass.value) return false
  return classItem.day === nextClass.value.day && 
         classItem.time === nextClass.value.time &&
         classItem.subject === nextClass.value.subject
}

// Estatísticas
const totalClasses = computed(() => scheduleStore.totalClasses)
const totalSubjects = computed(() => scheduleStore.totalSubjects)

// Aulas restantes hoje
const remainingToday = computed(() => {
  const now = currentTime.value
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
  
  return todayClasses.value.filter(c => c.time > currentTimeStr).length
})

// Última atualização
const lastUpdate = '02/03/2026'

// Variante do badge baseado no tipo de aula
const getClassBadgeVariant = (classItem) => {
  // Se for turma especial (T1, P1, etc), usar secondary
  if (classItem.practicalClass && classItem.practicalClass !== 'A') {
    return 'secondary'
  }
  return 'primary'
}
</script>

<style scoped>
.schedule-card {
  height: 100%;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon {
  font-size: 1.8em;
  color: var(--primary);
}

.feature-title {
  color: var(--title-primary);
  font-size: 1.3em;
  margin: 0.5em 0;
}

.feature-content {
  flex: 1;
  margin: 1em 0;
}

.feature-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2em;
}

.schedule-preview {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.current-day-info {
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
  padding: 0.5em;
  background: var(--inner-surface);
  border-radius: 8px;
}

.current-day-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.current-day {
  font-weight: 700;
  color: var(--title-primary);
  text-transform: capitalize;
}

.current-date {
  color: var(--text-secondary);
  font-size: 0.9em;
}

/* Próxima aula */
.next-class-section {
  padding: 1em;
  background: var(--sky-blue-surface);
  border-radius: 12px;
  border: 2px solid var(--primary);
}

.next-class-label {
  display: flex;
  align-items: center;
  gap: 0.3em;
  font-size: 0.85em;
  color: var(--text-secondary);
  margin-bottom: 0.5em;
}

.next-class-icon {
  color: var(--primary);
}

.next-class-card {
  display: flex;
  align-items: center;
  gap: 0.75em;
  flex-wrap: wrap;
}

.next-class-details {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  flex: 1;
}

.next-class-subject {
  font-weight: 600;
  color: var(--title-secondary);
  font-size: 0.9em;
}

.next-class-practical {
  font-size: 0.75em;
  color: var(--secondary);
  background: var(--rose-surface);
  padding: 0.1em 0.3em;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.room-tooltip {
  cursor: help;
}

.room-icon {
  color: var(--text-secondary);
  font-size: 1.1em;
}

/* Aulas de hoje */
.today-classes-label {
  display: flex;
  align-items: center;
  gap: 0.3em;
  font-size: 0.85em;
  color: var(--text-secondary);
  margin-bottom: 0.5em;
}

.today-icon {
  color: var(--secondary);
}

.classes-list {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.today-class-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  background: var(--surface-primary);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.today-class-item:hover {
  transform: translateX(4px);
  border-color: var(--primary);
}

.next-class-highlight {
  background: var(--sky-blue-surface);
  border: 2px solid var(--primary);
}

.class-time-badge {
  min-width: 90px;
  justify-content: center;
}

.today-class-subject {
  flex: 1;
  font-size: 0.85em;
  color: var(--text-primary);
}

.class-type-badge {
  font-size: 0.7em;
}

.more-classes {
  display: flex;
  align-items: center;
  gap: 0.25em;
  font-size: 0.8em;
  color: var(--text-secondary);
  padding: 0.25em 0.5em;
  background: var(--inner-surface);
  border-radius: 4px;
}

.no-classes-today {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 2em;
  color: var(--text-disabled);
  background: var(--inner-surface);
  border-radius: 8px;
}

.sun-icon {
  font-size: 1.5em;
  color: var(--orange);
}

/* Estatísticas */
.schedule-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5em;
  text-align: center;
  padding: 0.75em;
  background: var(--inner-surface);
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.stat-value {
  font-size: 1.4em;
  font-weight: 700;
  color: var(--title-primary);
}

.stat-label {
  font-size: 0.75em;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.schedule-update {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.8em;
  color: var(--text-secondary);
  padding: 0.5em;
  background: var(--surface-secondary);
  border-radius: 6px;
}

.update-icon {
  color: var(--green);
}

.feature-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-icon {
  margin-right: 0.5em;
}

.badge-icon {
  margin-right: 0.25em;
}

@media (max-width: 768px) {
  .current-day-info {
    font-size: 0.9em;
  }

  .today-class-item {
    flex-wrap: wrap;
  }

  .class-time-badge {
    min-width: 80px;
  }

  .stat-value {
    font-size: 1.2em;
  }
}
</style>