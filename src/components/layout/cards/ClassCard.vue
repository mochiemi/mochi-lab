<!-- components/layout/cards/ClassCard.vue -->
<template>
  <div
    ref="cardRef"
    class="class-card"
    :class="{ compact: compact }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="class-content">
      <div class="class-header">
        <h4 class="class-code">{{ classItem.code }}</h4>
        <Badge
          v-if="classItem.practical_class && classItem.practical_class !== 'A'"
          variant="primary"
          size="small"
          class="practical-badge"
        >
          <OhVueIcon name="gi-erlenmeyer" /> TP {{ classItem.practical_class }}
        </Badge>
      </div>

      <h5 class="class-name">{{ classItem.title }}</h5>

      <div class="class-info">
        <div class="info-item">
          <OhVueIcon name="fa-regular-map-marker-alt" class="info-icon" />
          <span>{{ formatRoom(classItem.room) }}</span>
        </div>
        <div v-if="classItem.event_type !== 'class'" class="info-item type-item">
          <Badge size="small" :variant="classItem.event_type === 'tutoring' ? 'warning' : 'success'">
            {{ getEventTypeLabel(classItem.event_type) }}
          </Badge>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showTooltip"
        ref="tooltipRef"
        class="class-tooltip"
        :style="tooltipPosition"
      >
        <div class="tooltip-arrow"></div>
        <div class="tooltip-content">
          <h4>{{ classItem.code }} - {{ classItem.title }}</h4>

          <div class="tooltip-details">
            <p v-if="classItem.professor">
              <strong>Professor(es):</strong> {{ formatProfessors(classItem.professor) }}
            </p>
            <p><strong>Sala:</strong> {{ classItem.room }}</p>
            <p><strong>Horario:</strong> {{ classItem.time }}</p>
            <p v-if="classItem.period">
              <strong>Periodo:</strong> {{ classItem.period }}o periodo
            </p>
            <p v-if="classItem.class_type">
              <strong>Tipo:</strong> {{ getClassTypeLabel(classItem.class_type) }}
            </p>
            <p v-if="classItem.credits">
              <strong>Creditos:</strong> {{ classItem.credits }}
            </p>
            <p v-if="classItem.tutor_name">
              <strong>Monitor:</strong> {{ classItem.tutor_name }}
            </p>
            <p v-if="classItem.subject_target">
              <strong>Apoio em:</strong> {{ classItem.subject_target }}
            </p>
            <p v-if="classItem.description" class="description">
              {{ classItem.description }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Badge from '@/components/ui/Badge.vue'
import type { EventItem } from '@/types/events'

const props = defineProps<{
  classItem: EventItem
  compact?: boolean
}>()

const showTooltip = ref(false)
const tooltipPosition = ref<Record<string, string>>({})
const cardRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)

const formatRoom = (room: string): string => {
  if (!room) return ''
  const [c = ''] = room.split('(')
  return c.trim()
}

const formatProfessors = (professors: string | undefined): string => {
  if (!professors) return ''
  if (professors.includes('<br>')) {
    return professors.split('<br>').map(p => p.trim()).join(', ')
  }
  return professors
}

const getClassTypeLabel = (type: string | undefined): string => {
  if (!type) return ''
  const labels: Record<string, string> = {
    required: 'Obrigatoria',
    elective: 'Eletiva',
    optional: 'Optativa'
  }
  return labels[type] || type
}

const getEventTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    class: 'Aula',
    tutoring: 'Monitoria',
    study: 'Estudo',
    exam: 'Prova',
    other: 'Evento'
  }
  return labels[type] || type
}

const updateTooltipPosition = async (): Promise<void> => {
  if (!showTooltip.value || !cardRef.value) return

  await nextTick()
  const currentTooltip = tooltipRef.value
  if (!currentTooltip) return

  const cardRect = cardRef.value.getBoundingClientRect()
  const tooltipRect = currentTooltip.getBoundingClientRect()
  const viewportWidth = window.innerWidth

  let top = cardRect.top - tooltipRect.height - 10
  let left = cardRect.left + (cardRect.width / 2) - (tooltipRect.width / 2)

  if (left < 10) left = 10
  if (left + tooltipRect.width > viewportWidth - 10) {
    left = viewportWidth - tooltipRect.width - 10
  }
  
  if (top < 10) {
    top = cardRect.bottom + 10
    // Adiciona verificação explícita para o TypeScript
    if (currentTooltip) {
      currentTooltip.classList.add('tooltip-bottom')
    }
  } else {
    // Adiciona verificação explícita para o TypeScript
    if (currentTooltip) {
      currentTooltip.classList.remove('tooltip-bottom')
    }
  }

  tooltipPosition.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

const handleMouseEnter = (): void => {
  showTooltip.value = true
  updateTooltipPosition()
}

const handleMouseLeave = (): void => {
  showTooltip.value = false
}

const handleResize = (): void => {
  if (showTooltip.value) updateTooltipPosition()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize, true)
})
</script>

<style scoped>
.class-card {
  background: var(--surface-primary);
  border: 2px dashed var(--border-secondary);
  border-radius: 12px;
  padding: 0.75rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  height: 100%;
  cursor: help;
  box-shadow: 0 2px 4px var(--shadow);
}

.class-card:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: var(--primary);
  box-shadow: 0 0 8px 16px var(--shadow-hover);
  background: var(--surface-contrast);
}

.class-card.compact {
  padding: 0.5rem;
}

.class-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.class-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.class-code {
  font-family: 'Shantell Sans', cursive;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--title-primary);
  margin: 0;
  background: var(--rose-surface);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  border: 1px solid var(--border-strong);
  display: inline-block;
}

.class-name {
  font-family: 'Comfortaa', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.compact .class-name {
  font-size: 0.8rem;
}

.class-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.info-icon {
  color: var(--secondary);
  font-size: 0.8rem;
}

.practical-badge {
  background: var(--sky-blue-surface) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-secondary) !important;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
}

.class-tooltip {
  position: fixed;
  z-index: 9999;
  background: var(--surface-primary);
  border: 2px solid var(--primary);
  border-radius: 16px;
  padding: 1rem;
  width: 320px;
  max-width: 90vw;
  box-shadow: 0 0 14px 6px var(--shadow-hover);
  pointer-events: none;
  transition: opacity 0.2s ease;
  border-top-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.tooltip-arrow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 16px;
  height: 16px;
  background: var(--surface-primary);
  border-right: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  border-bottom-right-radius: 4px;
}

.class-tooltip.tooltip-bottom .tooltip-arrow {
  top: -8px;
  bottom: auto;
  transform: translateX(-50%) rotate(45deg);
  border-right: 2px solid var(--primary);
  border-top: 2px solid var(--primary);
  border-bottom: none;
  border-bottom-right-radius: 0;
  border-top-left-radius: 4px;
}

.tooltip-content h4 {
  font-family: 'Shantell Sans', cursive;
  font-size: 1rem;
  color: var(--title-primary);
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed var(--border);
}

.tooltip-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tooltip-details p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--text-primary);
}

.tooltip-details strong {
  color: var(--title-secondary);
  font-family: 'Shantell Sans', cursive;
  font-weight: 600;
}

.description {
  margin-top: 0.5rem !important;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border);
  font-style: italic;
  color: var(--text-secondary);
}
</style>