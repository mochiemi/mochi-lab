<template>
  <div class="tab-content">
    <section class="catalog-section">
      <h2><OhVueIcon name="bi-play-circle" /> {{ $t('components.carousel.title') }}</h2>
      <p class="section-description">{{ $t('components.carousel.description') }}</p>
      <Alert type="warning" dismissible>
        <OhVueIcon name="io-construct" class="alert-icon"/> {{ $t('components.carousel.warning') }}
      </Alert>
      <div class="component-demo">

        <h3>{{ $t('components.carousel.demos.basic.title') }}</h3>
        <Carousel 
          :slides="basicSlides" 
          :title="$t('components.carousel.demos.basic.carouselTitle')"
          :autoplay="false"
          size="medium"
          @slide-change="handleSlideChange"
          @slide-action="handleSlideAction"
        />


        <h3>{{ $t('components.carousel.demos.autoplay.title') }}</h3>
        <Carousel 
          :slides="autoplaySlides" 
          :title="$t('components.carousel.demos.autoplay.carouselTitle')"
          :autoplay="true"
          :autoplay-interval="4000"
          :show-status="true"
          card-variant="testimonial"
          size="medium"
          @slide-change="handleSlideChange"
        />


        <h3>{{ $t('components.carousel.demos.multiple.title') }}</h3>
        <Carousel 
          :slides="multiSlides" 
          :title="$t('components.carousel.demos.multiple.carouselTitle')"
          :slides-per-view="2"
          :autoplay="true"
          :autoplay-interval="3500"
          card-variant="service"
          size="small"
        />


        <h3>{{ $t('components.carousel.demos.images.title') }}</h3>
        <Carousel 
          :slides="imageSlides" 
          :title="$t('components.carousel.demos.images.carouselTitle')"
          :show-indicators="true"
          :show-controls="true"
          card-variant="image"
          size="large"
        />

      </div>

      <div class="demo-controls">
        <h3>{{ $t('components.carousel.demos.disabled.title') }}</h3>
        <Carousel 
          :slides="basicSlides" 
          :title="$t('components.carousel.demos.disabled.carouselTitle')"
          :show-controls="false"
          :show-indicators="false"
          :autoplay="true"
          size="small"
        />
        <h4>{{ $t('components.carousel.demoControls.title') }}</h4>
        <div class="controls-grid">
          <Button size="small" @click="toggleAutoplay">
            {{ isAutoplayEnabled ? 
                $t('components.carousel.demoControls.disableAutoplay') : 
                $t('components.carousel.demoControls.enableAutoplay') 
            }}
          </Button>
          <Button size="small" variant="secondary" @click="resetCarousel">
            {{ $t('components.carousel.demoControls.reset') }}
          </Button>
          <Badge variant="primary">
            {{ $t('components.carousel.demoControls.currentSlide', { current: currentSlide + 1 }) }}
          </Badge>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="oi-pencil" /> {{ $t('components.carousel.documentation.title') }}</h2>
      
      <div class="props-documentation">
        <h3>{{ $t('components.carousel.documentation.props.title') }}</h3>
        <div class="props-grid">
          <div 
            v-for="prop in propsList" 
            :key="prop.name"
            class="prop-item"
          >
            <strong>{{ prop.name }}</strong>
            <span>{{ prop.type }}</span>
            <span>{{ $t(prop.description) }}</span>
            <code>{{ prop.default }}</code>
          </div>
        </div>

        <h3>{{ $t('components.carousel.documentation.events.title') }}</h3>
        <div class="events-grid">
          <div 
            v-for="event in eventsList" 
            :key="event.name"
            class="event-item"
          >
            <strong>{{ event.name }}</strong>
            <span>{{ $t(event.description) }}</span>
            <code>{{ event.signature }}</code>
          </div>
        </div>

        <h3>{{ $t('components.carousel.documentation.slots.title') }}</h3>
        <div class="slots-grid">
          <div 
            v-for="slot in slotsList" 
            :key="slot.name"
            class="slot-item"
          >
            <strong>{{ slot.name }}</strong>
            <span>{{ $t(slot.description) }}</span>
            <code>{{ slot.scope }}</code>
          </div>
        </div>

        <h3>{{ $t('components.carousel.documentation.usage.title') }}</h3>
        <div class="usage-examples">
          <div class="example">
            <h4>{{ $t('components.carousel.documentation.usage.basicExample.title') }}</h4>
            <pre><code>{{ basicExampleCode }}</code></pre>
          </div>
          <div class="example">
            <h4>{{ $t('components.carousel.documentation.usage.customSlide.title') }}</h4>
            <pre><code>{{ customSlideExampleCode }}</code></pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Carousel from '@/components/ui/Carousel.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Alert from '@/components/ui/Alert.vue'

const { t } = useI18n()

const currentSlide = ref(0)
const isAutoplayEnabled = ref(false)

const basicSlides = computed(() => [
  {
    title: t('components.carousel.slides.basic.project1.title'),
    description: t('components.carousel.slides.basic.project1.description'),
    image: '/src/assets/images/mochilab-logo.png',
    status: 'completed',
    action: t('components.carousel.slides.basic.project1.action')
  },
  {
    title: t('components.carousel.slides.basic.project2.title'),
    description: t('components.carousel.slides.basic.project2.description'),
    image: '/src/assets/images/Mochisprofile.png',
    status: 'in-progress',
    action: t('components.carousel.slides.basic.project2.action')
  },
  {
    title: t('components.carousel.slides.basic.project3.title'),
    description: t('components.carousel.slides.basic.project3.description'),
    image: '/src/assets/images/profile-selfie.jpg',
    status: 'completed',
    action: t('components.carousel.slides.basic.project3.action')
  }
])

const autoplaySlides = computed(() =>[
  {
    content: t('components.carousel.slides.testimonials.testimonial1.content'),
    author: t('components.carousel.slides.testimonials.testimonial1.author'),
    role: t('components.carousel.slides.testimonials.testimonial1.role')
  },
  {
    content: t('components.carousel.slides.testimonials.testimonial2.content'),
    author: t('components.carousel.slides.testimonials.testimonial2.author'),
    role: t('components.carousel.slides.testimonials.testimonial2.role')
  },
  {
    content: t('components.carousel.slides.testimonials.testimonial3.content'),
    author: t('components.carousel.slides.testimonials.testimonial3.author'),
    role: t('components.carousel.slides.testimonials.testimonial3.role')
  }
])

const multiSlides = computed(() => [
  {
    title: t('components.carousel.slides.services.service1.title'),
    description: t('components.carousel.slides.services.service1.description'),
    icon: 'oi-pencil',
    action: t('components.carousel.slides.services.learnMore')
  },
  {
    title: t('components.carousel.slides.services.service2.title'),
    description: t('components.carousel.slides.services.service2.description'),
    icon: 'hi-solid-code',
    action: t('components.carousel.slides.services.learnMore')
  },
  {
    title: t('components.carousel.slides.services.service3.title'),
    description: t('components.carousel.slides.services.service3.description'),
    icon: 'oi-check',
    action: t('components.carousel.slides.services.learnMore')
  },
  {
    title: t('components.carousel.slides.services.service4.title'),
    description: t('components.carousel.slides.services.service4.description'),
    icon: 'md-librarybooks-outlined',
    action: t('components.carousel.slides.services.learnMore')
  }
])

const imageSlides = computed(() =>[
  {
    title: t('components.carousel.slides.images.image1.title'),
    description: t('components.carousel.slides.images.image1.description'),
    image: '/src/assets/images/mochilab-logo.png'
  },
  {
    title: t('components.carousel.slides.images.image2.title'),
    description: t('components.carousel.slides.images.image2.description'),
    image: '/src/assets/images/Mochisprofile.png'
  },
  {
    title: t('components.carousel.slides.images.image3.title'),
    description: t('components.carousel.slides.images.image3.description'),
    image: '/src/assets/images/profile-selfie.jpg'
  }
])

const propsList = computed(() => [
  {
    name: 'slides',
    type: 'Array',
    description: 'components.carousel.documentation.props.slides',
    default: '[]'
  },
  {
    name: 'title',
    type: 'String',
    description: 'components.carousel.documentation.props.title',
    default: "''"
  },
  {
    name: 'autoplay',
    type: 'Boolean',
    description: 'components.carousel.documentation.props.autoplay',
    default: 'false'
  },
  {
    name: 'autoplayInterval',
    type: 'Number',
    description: 'components.carousel.documentation.props.autoplayInterval',
    default: '5000'
  },
  {
    name: 'showControls',
    type: 'Boolean',
    description: 'components.carousel.documentation.props.showControls',
    default: 'true'
  },
  {
    name: 'showIndicators',
    type: 'Boolean',
    description: 'components.carousel.documentation.props.showIndicators',
    default: 'true'
  },
  {
    name: 'showStatus',
    type: 'Boolean',
    description: 'components.carousel.documentation.props.showStatus',
    default: 'false'
  },
  {
    name: 'loop',
    type: 'Boolean',
    description: 'components.carousel.documentation.props.loop',
    default: 'true'
  },
  {
    name: 'slidesPerView',
    type: 'Number',
    description: 'components.carousel.documentation.props.slidesPerView',
    default: '1'
  },
  {
    name: 'size',
    type: 'String',
    description: 'components.carousel.documentation.props.size',
    default: "'medium'"
  },
  {
    name: 'cardVariant',
    type: 'String',
    description: 'components.carousel.documentation.props.cardVariant',
    default: "'default'"
  }
])

const eventsList = computed(() => [
  {
    name: '@slide-change',
    description: 'components.carousel.documentation.events.slideChange',
    signature: '(index: number) => void'
  },
  {
    name: '@slide-action',
    description: 'components.carousel.documentation.events.slideAction',
    signature: '(slide: object) => void'
  }
])

const slotsList = computed(() => [
  {
    name: '#slide',
    description: 'components.carousel.documentation.slots.slide',
    scope: '{ slide, index }'
  },
  {
    name: '#header',
    description: 'components.carousel.documentation.slots.header',
    scope: '-'
  }
])

const basicExampleCode = computed(() => `<Carousel
  :slides="slides"
  title="My Carousel"
  :autoplay="true"
  :autoplay-interval="3000"
  size="medium"
  @slide-change="handleSlideChange"
/>`)

const customSlideExampleCode = computed(() => `<Carousel :slides="slides" title="Custom Slides">
  <template #slide="{ slide }">
    <Card class="custom-slide">
      <img :src="slide.image" :alt="slide.title" />
      <h3>{{ slide.title }}</h3>
      <p>{{ slide.description }}</p>
    </Card>
  </template>
</Carousel>`)

const handleSlideChange = (index) => {
  currentSlide.value = index
  console.log('Slide changed to:', index)
}

const handleSlideAction = (slide) => {
  console.log('Slide action:', slide.title)
}

const toggleAutoplay = () => {
  isAutoplayEnabled.value = !isAutoplayEnabled.value
}

const resetCarousel = () => {
  currentSlide.value = 0
}
</script>

<style scoped>
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.catalog-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.alert-icon :deep(svg) {
  color: var(--text-secondary);
  transform: scale(1.2);
}

.alert-icon {
  margin: 0 0.5rem;
}

.component-demo {
  padding: 1.5rem;
  background: var(--inner-surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.component-demo h3 {
  margin: 2rem 0 1rem;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.component-demo h3:first-child {
  margin-top: 0;
}

.demo-controls {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--inner-surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.demo-controls h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.controls-grid {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.props-documentation {
  padding: 1.5rem;
  background: var(--inner-surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.props-documentation h3 {
  margin: 1.5rem 0 1rem;
  color: var(--text-primary);
}

.props-documentation h3:first-child {
  margin-top: 0;
}

.props-grid, .events-grid, .slots-grid {
  display: grid;
  gap: 1rem;
}

.prop-item, .event-item, .slot-item {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface);
  border-radius: 6px;
  border: 1px solid var(--border);
  align-items: center;
}

.prop-item strong, .event-item strong, .slot-item strong {
  color: var(--text-primary);
  font-family: 'Fira Code', monospace;
}

.prop-item code, .event-item code, .slot-item code {
  background: var(--code-bg);
  color: var(--code-text);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: 'Fira Code', monospace;
}

.usage-examples {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.example {
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.example h4 {
  padding: 1rem;
  margin: 0;
  background: var(--inner-surface);
  color: var(--text-primary);
  font-size: 1rem;
}

.example pre {
  margin: 0;
  padding: 1rem;
  background: var(--code-bg);
  overflow-x: auto;
}

.example code {
  color: var(--code-text);
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 0;
  }

  .component-demo {
    padding: 0.5rem;
  }
  
  .prop-item, .event-item, .slot-item {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 0.5rem;
  }
  
  .controls-grid {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .component-demo {
    padding: 0.1rem;
  }
  
  .props-documentation {
    padding: 1rem;
  }
  
  .example pre {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>