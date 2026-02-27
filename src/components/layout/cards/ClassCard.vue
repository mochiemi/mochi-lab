<!-- src/components/layout/cards/ClassCard.vue -->
<template>
  <div
    ref="cardRef"
    class="class-card"
    :class="{ 'compact': compact }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="class-content">
      <div class="class-header">
        <h4 class="class-code">{{ classItem.code }}</h4>
        <Badge
          v-if="classItem.practicalClass && classItem.practicalClass !== 'A'"
          variant="primary"
          size="small"
          class="practical-badge"
        >
          <OhVueIcon name="gi-erlenmeyer" /> TP {{ classItem.practicalClass }}
        </Badge>
      </div>

      <h5 class="class-name">{{ classItem.subject }}</h5>

      <div class="class-info">
        <div class="info-item">
          <OhVueIcon name="fa-regular-map-marker-alt" class="info-icon" />
          <span>{{ formatRoom(classItem.room) }}</span>
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
          <h4>{{ classItem.code }} - {{ classItem.subject }}</h4>

          <div class="tooltip-details">
            <p><strong>Professor(es):</strong> {{ formatProfessors(classItem.professor) }}</p>
            <p><strong>Sala:</strong> {{ classItem.room }}</p>
            <p><strong>Horário:</strong> {{ classItem.time }}</p>
            <p><strong>Período:</strong> {{ classItem.period }}º período</p>
            <p><strong>Tipo:</strong> {{ getClassTypeLabel(classItem.type) }}</p>
            <p v-if="classItem.details?.credits"><strong>Créditos:</strong> {{ classItem.details.credits }}</p>
            <p v-if="classItem.details?.description" class="description">
              {{ classItem.details.description }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps({
  classItem: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const showTooltip = ref(false)
const tooltipPosition = ref({})
const cardRef = ref(null)
const tooltipRef = ref(null)

// Funções de formatação (inalteradas)
const formatRoom = (room) => {
  if (!room) return ''
  return room.split('(')[0].trim()
}

const formatProfessors = (professors) => {
  if (!professors) return ''
  if (professors.includes('<br>')) {
    return professors.split('<br>').map(p => p.trim()).join(', ')
  }
  return professors
}

const getClassTypeLabel = (type) => {
  const labels = {
    required: 'Obrigatória',
    elective: 'Eletiva',
    optional: 'Optativa'
  }
  return labels[type] || type
}

const updateTooltipPosition = async () => {
  if (!showTooltip.value || !cardRef.value) return

  // Aguarda o tooltip ser renderizado para pegar suas dimensões
  await nextTick()
  if (!tooltipRef.value) return

  const cardRect = cardRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Posiciona o tooltip acima do card por padrão
  let top = cardRect.top - tooltipRect.height - 10
  let left = cardRect.left + (cardRect.width / 2) - (tooltipRect.width / 2)

  // Ajusta se estiver saindo pela esquerda
  if (left < 10) {
    left = 10
  }
  // Ajusta se estiver saindo pela direita
  if (left + tooltipRect.width > viewportWidth - 10) {
    left = viewportWidth - tooltipRect.width - 10
  }

  // Se não couber em cima, coloca embaixo
  if (top < 10) {
    top = cardRect.bottom + 10
    // Ajusta a seta para apontar para cima (classe será alterada via style)
    tooltipRef.value.classList.add('tooltip-bottom')
  } else {
    tooltipRef.value.classList.remove('tooltip-bottom')
  }

  tooltipPosition.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

const handleMouseEnter = () => {
  showTooltip.value = true
  updateTooltipPosition()
}

const handleMouseLeave = () => {
  showTooltip.value = false
}

const handleResize = () => {
  if (showTooltip.value) {
    updateTooltipPosition()
  }
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
  border-radius: 12px; /* Bordas um pouco mais arredondadas */
  padding: 0.75rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  height: 100%;
  cursor: help;
  box-shadow: 0 2px 4px var(--shadow);
}

/* Estilo unificado no hover */
.class-card:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: var(--primary);
  box-shadow: 0 8px 16px var(--shadow-hover);
  background: var(--surface-contrast); /* Leve destaque no fundo */
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
  border-radius: 20px; /* Estilo de pílula para o código */
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

/* Badge para turma prática - agora com um visual mais integrado */
.practical-badge {
  background: var(--sky-blue-surface) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-secondary) !important;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
}

/* Estilos do Tooltip (ajustados) */
.class-tooltip {
  position: fixed;
  z-index: 9999;
  background: var(--surface-primary);
  border: 2px solid var(--primary);
  border-radius: 16px;
  padding: 1rem;
  width: 320px;
  max-width: 90vw;
  box-shadow: 0 12px 28px var(--shadow-hover);
  pointer-events: none;
  transition: opacity 0.2s ease;
  border-top-left-radius: 4px; /* Detalhe divertido */
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

/* Quando o tooltip estiver embaixo do card, a seta aponta para cima */
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