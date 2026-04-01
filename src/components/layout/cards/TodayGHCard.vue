<!-- components/layout/cards/TodayGHCard.vue -->
<template>
  <Card class="today-gh-card" :variant="variant" :padding="padding">
    <div class="card-header">
      <div class="header-left">
        <OhVueIcon :name="icon" class="title-icon" />
        <h3 class="card-title">{{ title }}</h3>
      </div>
      <Badge v-if="badge" :variant="badgeVariant" size="small">
        {{ badge }}
      </Badge>
    </div>

    <div class="current-day-header">
      <h4 class="current-day-title">
        {{ currentDay }}
      </h4>
      <span class="current-date">{{ formattedCurrentDate }}</span>
    </div>

    <div class="card-content">
      <div v-if="loading" class="loading-state">
        <Loading :text="loadingText" />
      </div>

      <div v-else-if="error" class="error-state">
        <OhVueIcon name="md-warning-round" class="error-icon" />
        <p>{{ error }}</p>
        <Button variant="secondary" size="small" @click="$emit('retry')">
          <OhVueIcon name="fa-redo-alt" /> {{ $t('blog.retry') }}
        </Button>
      </div>

      <template v-else>
        <div v-if="nextClass" class="next-class-section">
          <span class="next-class-label">
            <OhVueIcon name="bi-alarm" class="label-icon" />
            {{ $t('schedule.nextClass') }}
          </span>
          <ClassCard 
            :classItem="nextClass" 
            :compact="false"
            class="next-class-card"
            @click="$emit('class-click', nextClass)"
          />
        </div>

        <div class="today-classes-section">
          <div class="section-header">
            <span class="section-label">
              <OhVueIcon name="bi-sun" class="label-icon" />
              {{ $t('schedule.todayClasses') }}
            </span>
            <span v-if="sortedTodayClasses.length > 0" class="classes-count">
              {{ sortedTodayClasses.length }} {{ $t('schedule.classes') }}
            </span>
          </div>

          <div v-if="sortedTodayClasses.length > 0" class="classes-list">
            <div
              v-for="(classItem, index) in sortedTodayClasses"
              :key="`${classItem.day}-${classItem.time}-${index}`"
              class="class-item-wrapper"
              :class="{ 'next-class-highlight': classItem === nextClass }"
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
          
          <div v-else class="no-classes-today">
            <OhVueIcon name="oi-sun" class="no-classes-icon" />
            <span>{{ $t('schedule.noClassesToday') }}</span>
          </div>
        </div>
      </template>
    </div>

    <div class="card-footer">
      <Button 
        variant="primary" 
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
import type { EventItem, EventDay } from '@/types/events'
import { useLanguageStore } from '@/stores/language'

const props = withDefaults(defineProps<{
  title: string
  icon?: string
  variant?: 'default' | 'primary' | 'secondary'
  padding?: 'none' | 'small' | 'medium' | 'large'
  badge?: string
  badgeVariant?: string
  classes?: EventItem[]
  loading?: boolean
  loadingText?: string
  error?: string | null
}>(), {
  icon: 'bi-calendar-heart',
  variant: 'default',
  padding: 'medium',
  badgeVariant: 'primary',
  classes: () => [],
  loadingText: 'Carregando grade...',
  error: null
})

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'class-click', classItem: EventItem): void
  (e: 'view-full-schedule'): void
}>()

const languageStore = useLanguageStore()

const weekDaysMap: EventDay[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const today = new Date()
const currentDay = weekDaysMap[today.getDay()]

const formattedCurrentDate = computed(() => {
  return today.toLocaleDateString(languageStore.currentLanguage, {
    day: 'numeric',
    month: 'long'
  })
})

const todayClasses = computed(() => {
  return props.classes.filter(c => c.day === currentDay)
})

const sortedTodayClasses = computed(() => {
  return [...todayClasses.value].sort((a, b) => {
    return a.time.localeCompare(b.time)
  })
})

const currentTimeStr = computed(() => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
})

const nextClass = computed((): EventItem | null => {
  return sortedTodayClasses.value.find(c => {
    const classStartTime = c.time.split(' - ')[0] || c.time
    return classStartTime > currentTimeStr.value
  }) || null
})
</script>

<style scoped>
.today-gh-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-primary);
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
  color: var(--primary);
  font-size: 1.1rem;
}

.current-day-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin-bottom: 0.75rem;
  border-bottom: 2px dashed var(--border-secondary);
}

.current-day-title {
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

.current-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.card-content {
  flex: 1;
  min-height: 200px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

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

.next-class-section {
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.next-class-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.label-icon {
  font-size: 0.9rem;
}

.next-class-card {
  background-color: var(--sky-blue-surface);
  border: 2px solid var(--primary);
  transform: scale(1.02);
  transition: all 0.2s ease;
}

.next-class-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.today-classes-section {
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

.classes-count {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background-color: var(--surface-secondary);
  border-radius: 12px;
  color: var(--text-secondary);
}

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
  color: var(--primary);
  font-size: 0.8rem;
}

.class-card {
  flex: 1;
}

.next-class-highlight .class-time {
  color: var(--primary);
  font-weight: 600;
}

.no-classes-today {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--text-disabled);
  font-style: italic;
  font-size: 0.9rem;
  background-color: var(--surface-secondary);
  border-radius: 8px;
  justify-content: center;
}

.no-classes-icon {
  font-size: 1.2rem;
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
  .current-day-header {
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