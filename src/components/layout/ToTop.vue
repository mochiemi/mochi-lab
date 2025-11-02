<template>
  <transition name="to-top-fade">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="to-top-button"
      :aria-label="t('toTop.ariaLabel')"
      :class="{ 'pulse': showPulse }"
    >
      <OhVueIcon name="hi-arrow-circle-up" class="to-top-icon" />
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isVisible = ref(false)
const showPulse = ref(false)

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  isVisible.value = scrollTop > 200
  
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollPosition = window.scrollY + windowHeight
  showPulse.value = scrollPosition >= documentHeight - 100
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.to-top-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--surface);
  border: 3px solid var(--secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px var(--shadow);
  transition: all 0.3s ease;
  z-index: 1000;
}

.to-top-button:hover {
  transform: translateY(-3px);
  background: var(--primary);
  border-color: var(--primary);
  box-shadow: 0 6px 20px var(--shadow-hover);
}

.to-top-button:active {
  transform: translateY(-1px);
}

.to-top-button.pulse {
  animation: pulse 2s infinite;
}

.to-top-button :deep(svg) {
  color: var(--secondary) !important;
  transform: scale(2.0);
  transition: color 0.3s ease;
}

.to-top-button:hover :deep(svg) {
  color: var(--white) !important;
}

.to-top-fade-enter-active,
.to-top-fade-leave-active {
  transition: all 0.3s ease;
}

.to-top-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}


@media (max-width: 768px) {
  .to-top-button {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 55px;
    height: 55px;
  }
  
  .to-top-icon {
    font-size: 2rem !important;
  }
}

@media (max-width: 480px) {
  .to-top-button {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
  }
  
  .to-top-icon {
    font-size: 1.8rem !important;
  }
}
</style>