<template>
  <div 
    class="carousel" 
    role="region" 
    :aria-label="title || 'Image carousel'"
    :aria-roledescription="'carousel'"
  >

    <div class="carousel-header" v-if="$slots.header || title">
      <slot name="header">
        <h3 class="carousel-title">{{ title }}</h3>
      </slot>
    </div>

    <div 
      class="carousel-container" 
      ref="carouselRef"
      tabindex="0"
      @keydown="handleKeydown"
      aria-live="polite"
    >
      <div 
        class="carousel-track" 
        :style="trackStyle"
        role="list"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          :class="[
            'carousel-slide',
            { 
              'slide-active': currentSlide === index,
              'slide-prev': currentSlide === index + 1,
              'slide-next': currentSlide === index - 1
            }
          ]"
          :aria-hidden="currentSlide !== index"
          :aria-label="`Slide ${index + 1} of ${totalSlides}`"
          role="listitem"
        >
          <slot name="slide" :slide="slide" :index="index">
            <Card :class="['slide-card', slideCardClasses]">
              <template #header v-if="slide.title || slide.image">
                <div class="slide-header">
                  <img 
                    v-if="slide.image" 
                    :src="slide.image" 
                    :alt="slide.alt || slide.title || 'Slide image'"
                    class="slide-image"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                  />
                  <h4 v-if="slide.title">{{ slide.title }}</h4>
                </div>
              </template>
              
              <div class="slide-content">
                <p v-if="slide.content">{{ slide.content }}</p>
                <p v-else-if="slide.description">{{ slide.description }}</p>
              </div>
              
              <template #footer v-if="slide.action">
                <div class="slide-footer">
                  <Button 
                    :variant="slide.actionVariant || 'primary'" 
                    size="small"
                    @click="handleSlideAction(slide)"
                    :aria-label="`${slide.action} for ${slide.title || 'this slide'}`"
                  >
                    {{ slide.action }}
                  </Button>
                </div>
              </template>
            </Card>
          </slot>
        </div>
      </div>
    </div>

    <div class="carousel-controls-container" v-if="showControls || showIndicators">
      <div class="carousel-controls" v-if="showControls" role="group" aria-label="Carousel navigation">
        <Button 
          variant="secondary" 
          size="small" 
          @click="prevSlide"
          :disabled="!canGoPrev"
          class="control-button"
          :aria-label="`Previous slide`"
          :aria-keyshortcuts="ArrowLeft"
        >
          <OhVueIcon name="hi-solid-chevron-double-left" />
          <span class="sr-only">Previous slide</span>
        </Button>
        
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          Slide {{ currentSlide + 1 }} of {{ totalSlides }}: {{ getCurrentSlideDescription }}
        </div>
              <div class="carousel-indicators" v-if="showIndicators" role="tablist" aria-label="Slide indicators">
        <button
          v-for="index in totalSlides"
          :key="index"
          :class="['indicator', { 'indicator-active': currentSlide === index - 1 }]"
          @click="goToSlide(index - 1)"
          :aria-label="`Go to slide ${index}`"
          :aria-selected="currentSlide === index - 1"
          role="tab"
          :tabindex="currentSlide === index - 1 ? 0 : -1"
        />
      </div>
        <Button 
          variant="secondary" 
          size="small" 
          @click="nextSlide"
          :disabled="!canGoNext"
          class="control-button"
          :aria-label="`Next slide`"
          :aria-keyshortcuts="ArrowRight"
        >
          <OhVueIcon name="hi-solid-chevron-double-right" />
          <span class="sr-only">Next slide</span>
        </Button>
      </div>
      

    </div>

    <div class="carousel-status" v-if="autoplay && showStatus" role="status" aria-live="polite">
      <Badge :variant="isPlaying ? 'success' : 'secondary'">
        {{ isPlaying ? 'Playing' : 'Paused' }}
      </Badge>
      <Button 
        variant="outline" 
        size="small" 
        @click="toggleAutoplay"
        class="autoplay-toggle"
        :aria-label="isPlaying ? 'Pause autoplay' : 'Play autoplay'"
      >
        <OhVueIcon :name="isPlaying ? 'bi-pause-fill' : 'bi-play-fill'" />
        <span class="sr-only">{{ isPlaying ? 'Pause' : 'Play' }}</span>
      </Button>
    </div>

    <div class="sr-only" id="carousel-instructions">
      Use arrow keys to navigate slides. Press numbers 1-{{ Math.min(totalSlides, 9) }} to jump to specific slides.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Button from './Button.vue'
import Card from './Card.vue'
import Badge from './Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'

const props = defineProps({
  slides: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  autoplayInterval: {
    type: Number,
    default: 5000
  },
  showControls: {
    type: Boolean,
    default: true
  },
  showIndicators: {
    type: Boolean,
    default: true
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  loop: {
    type: Boolean,
    default: true
  },
  slidesPerView: {
    type: Number,
    default: 1
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  cardVariant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'image', 'testimonial', 'service'].includes(value)
  },

  pauseOnHover: {
    type: Boolean,
    default: true
  },
  reducedMotion: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['slide-change', 'slide-action'])

const currentSlide = ref(0)
const isPlaying = ref(props.autoplay)
const autoplayTimer = ref(null)
const carouselRef = ref(null)
const touchStartX = ref(0)
const touchEndX = ref(0)
const isHovering = ref(false)

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

const responsiveSlidesPerView = computed(() => {
  if (windowWidth.value < 768) {
    return 1
  }
  return props.slidesPerView
})


const totalSlides = computed(() => props.slides.length)
const canGoPrev = computed(() => props.loop || currentSlide.value > 0)
const canGoNext = computed(() => {
  const maxSlide = Math.max(0, totalSlides.value - responsiveSlidesPerView.value)
  return props.loop || currentSlide.value < maxSlide
})


const getCurrentSlideDescription = computed(() => {
  const slide = props.slides[currentSlide.value]
  return slide?.title || slide?.description || `Slide ${currentSlide.value + 1}`
})

const trackStyle = computed(() => {
  const translateX = -currentSlide.value * (100 / responsiveSlidesPerView.value)
  const transition = props.reducedMotion ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  return {
    transform: `translateX(${translateX}%)`,
    width: `${(totalSlides.value / responsiveSlidesPerView.value) * 100}%`,
    transition: transition
  }
})

const slideCardClasses = computed(() => {
  return {
    'slide-card-small': props.size === 'small',
    'slide-card-medium': props.size === 'medium',
    'slide-card-large': props.size === 'large',
    'slide-card-image': props.cardVariant === 'image',
    'slide-card-testimonial': props.cardVariant === 'testimonial',
    'slide-card-service': props.cardVariant === 'service',
    'reduced-motion': props.reducedMotion
  }
})

const nextSlide = () => {
  const maxSlide = Math.max(0, totalSlides.value - responsiveSlidesPerView.value)
  if (currentSlide.value < maxSlide) {
    currentSlide.value++
  } else if (props.loop) {
    currentSlide.value = 0
  }
  emit('slide-change', currentSlide.value)
  resetAutoplay()

  setTimeout(() => {
    const activeIndicator = carouselRef.value?.querySelector('.indicator-active')
    if (activeIndicator) {
      activeIndicator.focus()
    }
  }, 100)
}

const prevSlide = () => {
  const maxSlide = Math.max(0, totalSlides.value - responsiveSlidesPerView.value)
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else if (props.loop) {
    currentSlide.value = maxSlide
  }
  emit('slide-change', currentSlide.value)
  resetAutoplay()

  setTimeout(() => {
    const activeIndicator = carouselRef.value?.querySelector('.indicator-active')
    if (activeIndicator) {
      activeIndicator.focus()
    }
  }, 100)
}

const goToSlide = (index) => {
  const maxSlide = Math.max(0, totalSlides.value - responsiveSlidesPerView.value)
  if (index >= 0 && index <= maxSlide) {
    currentSlide.value = index
    emit('slide-change', currentSlide.value)
    resetAutoplay()
  }
}

const startAutoplay = () => {
  if (props.autoplay && isPlaying.value && !isHovering.value) {
    autoplayTimer.value = setInterval(() => {
      nextSlide()
    }, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

const resetAutoplay = () => {
  if (props.autoplay) {
    stopAutoplay()
    startAutoplay()
  }
}

const toggleAutoplay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
}

const handleSlideAction = (slide) => {
  emit('slide-action', slide)
}

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  const diff = touchStartX.value - touchEndX.value
  const minSwipeDistance = 50

  if (Math.abs(diff) > minSwipeDistance) {
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
}

const handleKeydown = (e) => {
  switch(e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      prevSlide()
      break
    case 'ArrowRight':
      e.preventDefault()
      nextSlide()
      break
    case 'Home':
      e.preventDefault()
      goToSlide(0)
      break
    case 'End':
      e.preventDefault()
      goToSlide(totalSlides.value - 1)
      break
    case ' ':
    case 'Enter':
      if (e.target.classList.contains('indicator')) {
        e.preventDefault()
        const index = Array.from(e.target.parentNode.children).indexOf(e.target)
        goToSlide(index)
      }
      break
    default:
      if (e.key >= '1' && e.key <= '9') {
        const slideIndex = parseInt(e.key) - 1
        if (slideIndex < totalSlides.value) {
          e.preventDefault()
          goToSlide(slideIndex)
        }
      }
  }
}

const handleMouseEnter = () => {
  isHovering.value = true
  if (props.autoplay && props.pauseOnHover) {
    stopAutoplay()
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
  if (props.autoplay) {
    startAutoplay()
  }
}

onMounted(() => {
  if (props.autoplay) {
    startAutoplay()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWindowWidth)
  }
  
  carouselRef.value?.addEventListener('keydown', handleKeydown)
  carouselRef.value?.addEventListener('mouseenter', handleMouseEnter)
  carouselRef.value?.addEventListener('mouseleave', handleMouseLeave)
})

onBeforeUnmount(() => {
  stopAutoplay()

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth)
  }
  
  carouselRef.value?.removeEventListener('keydown', handleKeydown)
  carouselRef.value?.removeEventListener('mouseenter', handleMouseEnter)
  carouselRef.value?.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<style scoped>
.carousel {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.carousel-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
}

.carousel-title {
  font-size: 1.5rem;
  color: var(--title-secondary);
  margin: 0;
  text-align: center;
}

.carousel-container {
  overflow: hidden;
  border-radius: 12px;
  position: relative;
  max-width: 100%;
  display: flex;
  justify-content: center;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  width: 100%;
}

.carousel-slide {
  flex: 0 0 calc(100% / v-bind(responsiveSlidesPerView));
  padding: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.carousel-controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.control-button {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-indicators {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: var(--text-secondary);
}

.indicator-active {
  background: var(--primary);
  transform: scale(1.2);
}

.slide-card {
  height: 100%;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  margin: 0 auto; 
}

.slide-card-small {
  max-width: 400px;
  min-height: 200px;
  width: 100%;
}

.slide-card-medium {
  max-width: 600px;
  min-height: 300px;
  width: 100%;
}

.slide-card-large {
  max-width: 800px;
  min-height: 400px;
  width: 100%;
}

.slide-card-image {
  padding: 1rem;
  overflow: hidden;
}

.slide-card-testimonial {
  text-align: center;
  padding: 2rem;
  justify-content: center;
}

.slide-card-service {
  text-align: center;
  padding: 1.5rem;
  justify-content: flex-start;
}

.slide-header {
  text-align: center;
}

.slide-image {
  width: 30%;
  object-fit: contain;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.slide-card-image .slide-image {
  width: 90%;
  object-fit: contain;
}

.slide-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.slide-footer {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

.slide-active .slide-card {
  transform: scale(1.02);
  box-shadow: 0 0 20px var(--shadow);
}

.slide-prev .slide-card,
.slide-next .slide-card {
  opacity: 0.7;
  transform: scale(0.95);
}

.carousel-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--inner-surface);
  border-radius: 8px;
}

.autoplay-toggle {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .carousel-header {
    text-align: center;
  }
  
  .carousel-controls-container {
    gap: 0.75rem;
  }
  
  .carousel-controls {
    width: 100%;
    justify-content: center;
  }
  
  .carousel-indicators {
    width: 100%;
  }
  
  .slide-card-small,
  .slide-card-medium,
  .slide-card-large {
    max-width: 90vw;
    min-height: auto;
  }

  .slide-card-service {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .carousel-slide {
    padding: 0.25rem;
  }
  
  .slide-active .slide-card {
    transform: none;
  }
  
  .carousel-controls {
    gap: 0.5rem;
  }
  
  .slide-card-small,
  .slide-card-medium,
  .slide-card-large {
    max-width: 95vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  
    .carousel-track {
    transition: none;
  }
  
  .carousel-slide,
  .slide-card {
    transition: none;
  }
}

.reduced-motion .carousel-track {
  transition: none;
}

.control-button:focus,
.indicator:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.indicator:focus {
  transform: scale(1.3);
}

@media (prefers-contrast: high) {
  .indicator {
    border: 1px solid currentColor;
  }
  
  .indicator-active {
    background: currentColor;
  }
}


</style>