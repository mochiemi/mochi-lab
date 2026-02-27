<template>
  <div class="tab-content">
    <section class="catalog-section">
      <h2><OhVueIcon name="bi-play-circle" /> Carrossel</h2>
      <p class="section-description">Componente de carrossel para exibir slides interativos com suporte a autoplay, múltiplos slides e diferentes variações de cartões.</p>
      <Alert type="warning" dismissible>
        <OhVueIcon name="io-construct" class="alert-icon"/> Este componente está em desenvolvimento e pode sofrer alterações.
      </Alert>
      <div class="component-demo">

        <h3>Básico</h3>
        <Carousel 
          :slides="basicSlides" 
          title="Projetos Recentes"
          :autoplay="false"
          size="medium"
          @slide-change="handleSlideChange"
          @slide-action="handleSlideAction"
        />

        <h3>Com Autoplay</h3>
        <Carousel 
          :slides="autoplaySlides" 
          title="Depoimentos"
          :autoplay="true"
          :autoplay-interval="4000"
          :show-status="true"
          card-variant="testimonial"
          size="medium"
          @slide-change="handleSlideChange"
        />

        <h3>Múltiplos Slides</h3>
        <Carousel 
          :slides="multiSlides" 
          title="Nossos Serviços"
          :slides-per-view="2"
          :autoplay="true"
          :autoplay-interval="3500"
          card-variant="service"
          size="small"
        />

        <h3>Galeria de Imagens</h3>
        <Carousel 
          :slides="imageSlides" 
          title="Galeria"
          :show-indicators="true"
          :show-controls="true"
          card-variant="image"
          size="large"
        />

      </div>

      <div class="demo-controls">
        <h3>Carrossel Desabilitado</h3>
        <Carousel 
          :slides="basicSlides" 
          title="Controles Desabilitados"
          :show-controls="false"
          :show-indicators="false"
          :autoplay="true"
          size="small"
        />
        <h4>Controles de Demonstração</h4>
        <div class="controls-grid">
          <Button size="small" @click="toggleAutoplay">
            {{ isAutoplayEnabled ? 'Desabilitar Autoplay' : 'Habilitar Autoplay' }}
          </Button>
          <Button size="small" variant="secondary" @click="resetCarousel">
            Reiniciar
          </Button>
          <Badge variant="primary">
            Slide Atual: {{ currentSlide + 1 }}
          </Badge>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="oi-pencil" /> Documentação</h2>
      
      <div class="props-documentation">
        <h3>Propriedades</h3>
        <div class="props-grid">
          <div 
            v-for="prop in propsList" 
            :key="prop.name"
            class="prop-item"
          >
            <strong>{{ prop.name }}</strong>
            <span>{{ prop.type }}</span>
            <span>{{ prop.description }}</span>
            <code>{{ prop.default }}</code>
          </div>
        </div>

        <h3>Eventos</h3>
        <div class="events-grid">
          <div 
            v-for="event in eventsList" 
            :key="event.name"
            class="event-item"
          >
            <strong>{{ event.name }}</strong>
            <span>{{ event.description }}</span>
            <code>{{ event.signature }}</code>
          </div>
        </div>

        <h3>Slots</h3>
        <div class="slots-grid">
          <div 
            v-for="slot in slotsList" 
            :key="slot.name"
            class="slot-item"
          >
            <strong>{{ slot.name }}</strong>
            <span>{{ slot.description }}</span>
            <code>{{ slot.scope }}</code>
          </div>
        </div>

        <h3>Exemplos de Uso</h3>
        <div class="usage-examples">
          <div class="example">
            <h4>Exemplo Básico</h4>
            <pre><code>{{ basicExampleCode }}</code></pre>
          </div>
          <div class="example">
            <h4>Slide Personalizado</h4>
            <pre><code>{{ customSlideExampleCode }}</code></pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Carousel from '@/components/ui/Carousel.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Alert from '@/components/ui/Alert.vue'

const currentSlide = ref(0)
const isAutoplayEnabled = ref(false)

const basicSlides = [
  {
    title: 'Mochilab',
    description: 'Plataforma de gerenciamento de projetos',
    image: '/src/assets/images/mochilab-logo.png',
    status: 'Concluído',
    action: 'Ver Projeto'
  },
  {
    title: 'Mochis Profile',
    description: 'Perfil de usuário interativo',
    image: '/src/assets/images/Mochisprofile.png',
    status: 'Em Andamento',
    action: 'Ver Projeto'
  },
  {
    title: 'Selfie Profile',
    description: 'Galeria de perfil personalizada',
    image: '/src/assets/images/profile-selfie.jpg',
    status: 'Concluído',
    action: 'Ver Projeto'
  }
]

const autoplaySlides = [
  {
    content: 'Excelente componente! Muito fácil de usar e altamente customizável.',
    author: 'João Silva',
    role: 'Desenvolvedor Front-end'
  },
  {
    content: 'A funcionalidade de autoplay é perfeita para minhas apresentações.',
    author: 'Maria Santos',
    role: 'Designer UI/UX'
  },
  {
    content: 'Suporte a múltiplos slides por visualização é incrível!',
    author: 'Pedro Costa',
    role: 'Gerente de Produto'
  }
]

const multiSlides = [
  {
    title: 'Design UI/UX',
    description: 'Criação de interfaces modernas e intuitivas',
    icon: 'oi-pencil',
    action: 'Saiba Mais'
  },
  {
    title: 'Desenvolvimento Web',
    description: 'Sites e aplicações responsivas',
    icon: 'hi-solid-code',
    action: 'Saiba Mais'
  },
  {
    title: 'Consultoria',
    description: 'Orientação especializada em tecnologia',
    icon: 'oi-check',
    action: 'Saiba Mais'
  },
  {
    title: 'Treinamentos',
    description: 'Cursos e workshops personalizados',
    icon: 'md-librarybooks-outlined',
    action: 'Saiba Mais'
  }
]

const imageSlides = [
  {
    title: 'Logo Mochilab',
    description: 'Identidade visual do projeto',
    image: '/src/assets/images/mochilab-logo.png'
  },
  {
    title: 'Perfil Mochis',
    description: 'Interface de perfil de usuário',
    image: '/src/assets/images/Mochisprofile.png'
  },
  {
    title: 'Selfie Profile',
    description: 'Exemplo de imagem de perfil',
    image: '/src/assets/images/profile-selfie.jpg'
  }
]

const propsList = [
  {
    name: 'slides',
    type: 'Array',
    description: 'Array de objetos contendo os dados dos slides',
    default: '[]'
  },
  {
    name: 'title',
    type: 'String',
    description: 'Título do carrossel',
    default: "''"
  },
  {
    name: 'autoplay',
    type: 'Boolean',
    description: 'Ativa a reprodução automática',
    default: 'false'
  },
  {
    name: 'autoplayInterval',
    type: 'Number',
    description: 'Intervalo entre slides em milissegundos',
    default: '5000'
  },
  {
    name: 'showControls',
    type: 'Boolean',
    description: 'Mostra os botões de navegação',
    default: 'true'
  },
  {
    name: 'showIndicators',
    type: 'Boolean',
    description: 'Mostra os indicadores de slide',
    default: 'true'
  },
  {
    name: 'showStatus',
    type: 'Boolean',
    description: 'Mostra o status atual do slide',
    default: 'false'
  },
  {
    name: 'loop',
    type: 'Boolean',
    description: 'Permite loop infinito',
    default: 'true'
  },
  {
    name: 'slidesPerView',
    type: 'Number',
    description: 'Número de slides visíveis por vez',
    default: '1'
  },
  {
    name: 'size',
    type: 'String',
    description: 'Tamanho do carrossel (small, medium, large)',
    default: "'medium'"
  },
  {
    name: 'cardVariant',
    type: 'String',
    description: 'Variante do cartão (default, testimonial, service, image)',
    default: "'default'"
  }
]

const eventsList = [
  {
    name: '@slide-change',
    description: 'Emitido quando o slide atual muda',
    signature: '(index: number) => void'
  },
  {
    name: '@slide-action',
    description: 'Emitido quando uma ação do slide é acionada',
    signature: '(slide: object) => void'
  }
]

const slotsList = [
  {
    name: '#slide',
    description: 'Template personalizado para cada slide',
    scope: '{ slide, index }'
  },
  {
    name: '#header',
    description: 'Template personalizado para o cabeçalho',
    scope: '-'
  }
]

const basicExampleCode = `<Carousel
  :slides="slides"
  title="Meu Carrossel"
  :autoplay="true"
  :autoplay-interval="3000"
  size="medium"
  @slide-change="handleSlideChange"
/>`

const customSlideExampleCode = `<Carousel :slides="slides" title="Slides Personalizados">
  <template #slide="{ slide }">
    <Card class="custom-slide">
      <img :src="slide.image" :alt="slide.title" />
      <h3>{{ slide.title }}</h3>
      <p>{{ slide.description }}</p>
    </Card>
  </template>
</Carousel>`

const handleSlideChange = (index) => {
  currentSlide.value = index
  console.log('Slide alterado para:', index)
}

const handleSlideAction = (slide) => {
  console.log('Ação do slide:', slide.title)
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
  gap: 2em;
}

.catalog-section h2 {
  font-size: 1.75em;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.section-description {
  font-size: 1.1em;
  color: var(--text-secondary);
  margin-bottom: 2em;
  line-height: 1.6;
}

.alert-icon :deep(svg) {
  color: var(--text-secondary);
  transform: scale(1.2);
}

.alert-icon {
  margin: 0 0.5em;
}

.component-demo {
  padding: 1.5em;
  background: var(--inner-surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.component-demo h3 {
  margin: 2em 0 1em;
  color: var(--text-primary);
  font-size: 1.1em;
}

.component-demo h3:first-child {
  margin-top: 0;
}

.demo-controls {
  margin-top: 2em;
  padding: 1.5em;
  background: var(--inner-surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.demo-controls h4 {
  margin: 0 0 1em 0;
  color: var(--text-primary);
}

.controls-grid {
  display: flex;
  gap: 1em;
  align-items: center;
  flex-wrap: wrap;
}

.props-documentation {
  padding: 1.5em;
  background: var(--inner-surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.props-documentation h3 {
  margin: 1.5em 0 1em;
  color: var(--text-primary);
}

.props-documentation h3:first-child {
  margin-top: 0;
}

.props-grid, .events-grid, .slots-grid {
  display: grid;
  gap: 1em;
}

.prop-item, .event-item, .slot-item {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr;
  gap: 1em;
  padding: 1em;
  background: var(--surface);
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
  padding: 0.25em 0.5em;
  border-radius: 4px;
  font-size: 0.8em;
  font-family: 'Fira Code', monospace;
}

.usage-examples {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.example {
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.example h4 {
  padding: 1em;
  margin: 0;
  background: var(--inner-surface);
  color: var(--text-primary);
  font-size: 1em;
}

.example pre {
  margin: 0;
  padding: 1em;
  background: var(--code-bg);
  overflow-x: auto;
}

.example code {
  color: var(--code-text);
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 0;
  }

  .component-demo {
    padding: 0.5em;
  }
  
  .prop-item, .event-item, .slot-item {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 0.5em;
  }
  
  .controls-grid {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .component-demo {
    padding: 0.1em;
  }
  
  .props-documentation {
    padding: 1em;
  }
  
  .example pre {
    padding: 0.75em;
    font-size: 0.8em;
  }
}
</style>