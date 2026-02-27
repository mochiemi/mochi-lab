<!-- src/components/layout/cards/FutureGHCard.vue -->
<template>
  <Card class="future-gh-card" :variant="variant" :padding="padding">
    <div class="card-header">
      <div class="header-left">
        <OhVueIcon :name="icon" class="title-icon" />
        <h3 class="card-title">{{ title }}</h3>
      </div>
      <Badge v-if="badge" :variant="badgeVariant" size="small">
        {{ badge }}
      </Badge>
    </div>

    <!-- Dia da semana em destaque (próximo dia com aula) -->
    <div v-if="nextDayWithClass" class="next-day-header">
      <h4 class="next-day-title">
        <OhVueIcon :name="headerDayIcon" class="day-icon" />
        {{ nextDayWithClass }}
      </h4>
      <span v-if="formattedNextDate" class="next-date">{{ formattedNextDate }}</span>
    </div>

    <div class="card-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <Loading :text="loadingText" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <OhVueIcon name="md-warning-round" class="error-icon" />
        <p>{{ error }}</p>
        <Button variant="secondary" size="small" @click="$emit('retry')">
          <OhVueIcon name="fa-redo-alt" /> {{ $t('common.retry') }}
        </Button>
      </div>

      <!-- Content States -->
      <template v-else>
        <!-- Próximo dia com aulas -->
        <div v-if="nextDayClasses.length > 0" class="next-day-classes-section">
          <div class="section-header">
            <span class="section-label">
              <OhVueIcon :name="nextDayIcon" class="label-icon" />
              {{ $t('schedule.nextDayClasses') }}
            </span>
            <span class="classes-count">
              {{ nextDayClasses.length }} {{ $t('schedule.classes') }}
            </span>
          </div>

          <!-- Lista completa das aulas do próximo dia com horários -->
          <div class="classes-list">
            <div
              v-for="(classItem, index) in nextDayClasses"
              :key="`${classItem.day}-${classItem.time}-${index}`"
              class="class-item-wrapper"
            >
              <div class="class-time">
                <OhVueIcon name="hi-clock" class="time-icon" />
                <span>{{ classItem.time }}</span>
              </div>
              <ClassCard
                :classItem="classItem"
                :compact="true"
                class="class-card"
                @click="$emit('class-click', classItem)"
              />
            </div>
          </div>
        </div>

        <!-- Sem aulas nos próximos dias -->
        <div v-else class="no-future-classes">
          <OhVueIcon name="bi-calendar-heart" class="no-classes-icon" />
          <span>{{ $t('schedule.noFutureClasses') }}</span>
        </div>
      </template>
    </div>

    <!-- Footer com botão para grade completa -->
    <div class="card-footer">
      <Button 
        variant="secondary" 
        size="small" 
        class="view-full-schedule-btn"
        @click="$emit('view-full-schedule')"
      >
        <OhVueIcon name="bi-calendar-week" class="btn-icon" />
        {{ $t('schedule.viewSchedule') }}
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import ClassCard from './ClassCard.vue'
import type { ClassItem } from '@/stores/schedule'
import { useLanguageStore } from '@/stores/language'

const props = withDefaults(defineProps<{
  title: string
  icon?: string
  variant?: 'default' | 'primary' | 'secondary'
  padding?: 'none' | 'small' | 'medium' | 'large'
  badge?: string
  badgeVariant?: string
  classes?: ClassItem[]
  loading?: boolean
  loadingText?: string
  error?: string | null
}>(), {
  icon: 'bi-calendar-heart',
  variant: 'default',
  padding: 'medium',
  badgeVariant: 'secondary',
  classes: () => [],
  loadingText: 'Carregando próximas aulas...',
  error: null
})

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'class-click', classItem: ClassItem): void
  (e: 'view-full-schedule'): void
}>()

const languageStore = useLanguageStore()

const today = new Date()
const weekDaysMap: string[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const currentDayIndex: number = today.getDay()

const classesByDay = computed((): Map<string, ClassItem[]> => {
  const map = new Map<string, ClassItem[]>()
  weekDaysMap.forEach(day => map.set(day, []))
  
  props.classes.forEach(c => {
    const dayClasses = map.get(c.day)
    if (dayClasses) {
      dayClasses.push(c)
    }
  })

  map.forEach(classes => {
    classes.sort((a, b) => a.time.localeCompare(b.time))
  })
  
  return map
})

const nextDayWithClass = computed((): string | undefined => {
  for (let i = 1; i <= 7; i++) {
    const nextIndex = (currentDayIndex + i) % 7
    const nextDay = weekDaysMap[nextIndex]
    const dayClasses = classesByDay.value.get(nextDay) || []
    if (dayClasses.length > 0) {
      return nextDay
    }
  }
  return undefined
})

const nextDate = computed((): Date | undefined => {
  if (!nextDayWithClass.value) return undefined
  
  const daysToAdd = (() => {
    for (let i = 1; i <= 7; i++) {
      const nextIndex = (currentDayIndex + i) % 7
      const nextDay = weekDaysMap[nextIndex]
      if (nextDay === nextDayWithClass.value) {
        return i
      }
    }
    return 0
  })()

  if (daysToAdd === 0) return undefined
  
  const nextDateObj = new Date(today)
  nextDateObj.setDate(today.getDate() + daysToAdd)
  return nextDateObj
})

const formattedNextDate = computed((): string => {
  if (!nextDate.value) return ''
  return nextDate.value.toLocaleDateString(languageStore.currentLanguage, {
    day: 'numeric',
    month: 'long'
  })
})

const nextDayClasses = computed((): ClassItem[] => {
  if (!nextDayWithClass.value) return []
  const classes = classesByDay.value.get(nextDayWithClass.value) || []
  return [...classes].sort((a, b) => a.time.localeCompare(b.time))
})

const headerDayIcon = computed((): string => {
  const currentDay = nextDayWithClass.value
  
  if (currentDay === undefined) return 'bi-calendar-heart'
  
  const dayIcons: Record<string, string> = {
    'Domingo': 'wi-time2',
    'Segunda': 'hi-clock',
    'Terça': 'bi-calendar-heart',
    'Quarta': 'wi-time2',
    'Quinta': 'hi-clock',
    'Sexta': 'bi-calendar-heart',
    'Sábado': 'wi-time2'
  }
  
  return dayIcons[currentDay] ?? 'bi-calendar-heart'
})

const nextDayIcon = computed((): string => {
  return headerDayIcon.value
})
</script>

<style scoped>
.future-gh-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-primary);
  border-style: dashed;
  border-color: var(--border-secondary);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title {
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 1.1rem;
  color: var(--title-primary);
  margin: 0;
}

.title-icon {
  color: var(--secondary);
  font-size: 1.1rem;
}

/* Next Day Header */
.next-day-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin-bottom: 0.75rem;
  border-bottom: 2px dashed var(--border-secondary);
  background-color: var(--surface-secondary);
  border-radius: 8px;
  padding: 0.75rem;
}

.next-day-title {
  font-family: 'Shantell Sans', cursive;
  font-size: 1rem;
  color: var(--title-secondary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.day-icon {
  color: var(--secondary);
  font-size: 0.9rem;
}

.next-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.card-content {
  flex: 1;
  min-height: 200px;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 200px;
  text-align: center;
  color: var(--text-secondary);
}

.error-icon {
  font-size: 2rem;
  color: var(--red);
}

/* Next Day Classes Section */
.next-day-classes-section {
  margin-top: 0.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.label-icon {
  color: var(--secondary);
}

.classes-count {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background-color: var(--surface-secondary);
  border-radius: 12px;
  color: var(--text-secondary);
}

/* Classes List */
.classes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.class-item-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.class-time {
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding-top: 0.5rem;
}

.time-icon {
  color: var(--secondary);
  font-size: 0.8rem;
}

.class-card {
  flex: 1;
}

/* No Future Classes */
.no-future-classes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--text-disabled);
  font-style: italic;
  font-size: 0.9rem;
  background-color: var(--surface-secondary);
  border-radius: 8px;
  justify-content: center;
  flex-direction: column;
}

.no-classes-icon {
  font-size: 2rem;
  color: var(--border);
}

.card-footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 2px dashed var(--border);
  display: flex;
  justify-content: center;
}

.view-full-schedule-btn {
  width: 100%;
  max-width: 250px;
}

.btn-icon {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .next-day-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .view-full-schedule-btn {
    max-width: 100%;
  }

  .class-item-wrapper {
    flex-direction: column;
    gap: 0.25rem;
  }

  .class-time {
    min-width: auto;
    padding-top: 0;
  }

  .class-card {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>