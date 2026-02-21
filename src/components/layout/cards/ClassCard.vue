<template>
  <div
    v-if="classItem"
    class="class-card"
    :class="{
      'special-period': hasSpecialPeriod,
      'compact': compact,
      'practical-1-0': practicalClassValue === 1.0,
      'practical-2-0': practicalClassValue === 2.0
    }"
  >

    <div v-if="!compact || showTime" class="class-time">
      <Badge :variant="timeBadgeVariant" size="small">
        <OhVueIcon name="wi-time2" /> {{ classItem.time || 'Horário' }}
      </Badge>
    </div>

    <div class="class-content">
      <div class="class-header">
        <h3 class="class-title" :title="classItem.subject || 'Disciplina'">
          {{ classItem.subject || 'Disciplina' }}
        </h3>
        <Badge 
          v-if="classItem.practicalClass" 
          :variant="practicalBadgeVariant" 
          size="small" 
          class="practical-badge"
        >
          <OhVueIcon name="gi-erlenmeyer" /> TP {{ classItem.practicalClass }}
        </Badge>
      </div>

      <div class="class-details">
        <div class="detail-item" v-if="classItem.room">
          <OhVueIcon name="fa-regular-map-marker-alt" class="detail-icon" />
          <Tooltip 
            :content="classItem.room" 
            position="top" 
            variant="primary"
            size="lg"
            :delay="300"
          >
            <span class="detail-text">{{ formatRoom(classItem.room) }}</span>
          </Tooltip>
        </div>

        <div class="detail-item" v-if="classItem.professor">
          <OhVueIcon name="fa-regular-user" class="detail-icon" />
          <Tooltip 
            :content="formatProfessorsTooltip(classItem.professor)" 
            position="top" 
            variant="secondary"
            size="lg"
            :delay="300"
          >
            <span class="detail-text">{{ formatProfessorSummary(classItem.professor) }}</span>
          </Tooltip>
        </div>
      </div>

      <div v-if="hasSpecialPeriod && !compact" class="special-notice">
        <OhVueIcon name="md-warning-round" class="notice-icon" />
        <span>Período especial (até 08/05)</span>
      </div>

      <div v-else-if="hasSpecialPeriod && compact" class="compact-special-indicator" 
           :title="'Período especial (até 08/05)'">
        <OhVueIcon name="md-warning-round" />
      </div>
    </div>
  </div>
  <div v-else class="class-card-error">
    <OhVueIcon name="md-warning-round" />
    <span>Dados indisponíveis</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Badge from '@/components/ui/Badge.vue'
import Tooltip from '@/components/ui/Tooltip.vue'

const props = defineProps({
  classItem: {
    type: Object,
    default: () => ({})
  },
  compact: {
    type: Boolean,
    default: false
  },
  showTime: {
    type: Boolean,
    default: false
  },
  showTooltips: {
    type: Boolean,
    default: true
  }
})

const hasSpecialPeriod = computed(() => {
  if (!props.classItem || !props.classItem.room) return false
  return props.classItem.room.includes('08/05/2026')
})

const practicalClassValue = computed(() => {
  if (!props.classItem || !props.classItem.practicalClass) return 0
  return parseFloat(props.classItem.practicalClass)
})

const timeBadgeVariant = computed(() => {
  return hasSpecialPeriod.value ? 'warning' : 'primary'
})

const practicalBadgeVariant = computed(() => {
  return practicalClassValue.value === 2.0 ? 'secondary' : 'primary'
})

const formatRoom = (room) => {
  if (!room) return ''
  return room.split('(')[0].trim()
}

const formatProfessorSummary = (professors) => {
  if (!professors) return ''
  const profList = formatProfessorsArray(professors)
  if (profList.length === 1) return profList[0]
  return `${profList[0]} +${profList.length - 1}`
}

const formatProfessorsTooltip = (professors) => {
  if (!professors) return ''
  const profList = formatProfessorsArray(professors)
  if (profList.length === 1) return profList[0]
  return profList.join(' · ')
}

const formatProfessorsArray = (professors) => {
  if (!professors) return []
  if (professors.includes('<br>')) {
    return professors.split('<br>').map(p => p.trim()).filter(p => p)
  }
  return professors.split(',').map(p => p.trim()).filter(p => p)
}
</script>

<style scoped>
.class-card {
  background: var(--surface-primary);
  padding: 0.5em;
  border: 2px dashed;
  border-color: var(--border-secondary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.class-card.practical-1-0 {
  border-color: var(--sky-blue);
}

.class-card.practical-2-0 {
  border-color: var(--rose);
}

.class-card.special-period {
  border-color: var(--orange);
}

.class-card.compact {
  padding: 0.5em;
  border-left-width: 4px;
}

.class-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.class-card-error {
  padding: 0.5em;
  color: var(--text-disabled);
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.8em;
  background: var(--surface-secondary);
  border-radius: 8px;
  border: 1px dashed var(--border);
}

.class-time {
  margin-bottom: 0.5em;
}

.class-content {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
}

.class-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5em;
  flex-wrap: wrap;
}

.class-title {
  font-size: 0.9em;
  color: var(--title-primary);
  margin: 0;
  line-height: 1.4;
  overflow: visible;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  flex: 1;
}

.compact .class-title {
  font-size: 0.8em;
}

.practical-badge {
  flex-shrink: 0;
}

.class-details {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  margin-top: 0.25em;
  z-index: 1000;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.75em;
  color: var(--text-secondary);
  min-width: 0;
}

.detail-icon {
  color: var(--primary);
  font-size: 0.8em;
  flex-shrink: 0;
}

.detail-text {
  white-space: nowrap;
  overflow: visible;
  cursor: help;
  border-bottom: 1px dashed var(--border);
  padding-bottom: 1px;
}

.special-notice {
  display: flex;
  align-items: center;
  gap: 0.25em;
  font-size: 0.7em;
  color: var(--orange);
  background: var(--inner-surface);
  padding: 0.25em 0.5em;
  border-radius: 6px;
  margin-top: 0.25em;
}

.compact-special-indicator {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
  color: var(--orange);
  font-size: 0.8em;
  opacity: 0.7;
}

.notice-icon {
  font-size: 0.8em;
  flex-shrink: 0;
}
</style>