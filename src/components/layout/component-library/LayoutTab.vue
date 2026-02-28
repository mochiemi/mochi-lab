<template>
  <div class="tab-content">
    <!-- Loading -->
     <section class="catalog-section">
      <h2><OhVueIcon name="oi-reload" /> Loading</h2>
      <p class="section-description">Indicadores visuais de carregamento com diferentes animações e tamanhos.</p>
      
      <div class="component-demo">
        <div class="loading-grid">
          <div class="loading-group">
            <h4>Círculo</h4>
            <div class="loading-examples">
              <Loading size="sm" animation="circle" variant="secondary"/>
              <Loading size="md" animation="circle" />
              <Loading size="lg" animation="circle" variant="secondary"/>
              <Loading size="xl" animation="circle" />
            </div>
          </div>
          <div class="loading-group">
            <h4>Bounce</h4>
            <div class="loading-examples">
              <Loading size="sm" animation="bounce" />
              <Loading size="md" animation="bounce" variant="secondary"/>
              <Loading size="lg" animation="bounce" />
              <Loading size="xl" animation="bounce" variant="secondary"/>
            </div>
          </div>

          <div class="loading-group">
            <h4>Com Texto</h4>
            <div class="loading-examples">
              <Loading animation="circle" text="Carregando..." />
              <Loading animation="bounce" text="Processando..." />
            </div>
          </div>

          <div class="loading-group">
            <h4>Velocidade de Animação</h4>
            <div class="loading-examples">
              <Loading animation="circle" speed="slow" text="Lento" />
              <Loading animation="circle" speed="normal" text="Normal" />
              <Loading animation="circle" speed="fast" text="Rápido" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="bi-card-checklist" /> Barras de Progresso</h2>
      <p class="section-description">Componentes para visualizar o progresso de tarefas e processos.</p>
      
      <div class="component-demo">
        <div class="progress-grid">
          <!-- Basic Progress -->
          <Card title="Básico" padding="normal">
            <Progress :value="75" label="Conclusão do Projeto" />
          </Card>

          <Card title="Variantes" padding="normal">
            <Progress :value="45" label="Primário" variant="primary" class="progress-demo" />
            <Progress :value="60" label="Secundário" variant="secondary" class="progress-demo" />
            <Progress :value="85" label="Gradiente" variant="gradient" class="progress-demo" />
          </Card>

          <Card title="Tamanhos" padding="normal">
            <Progress :value="65" label="Pequeno" size="small" class="progress-demo" />
            <Progress :value="65" label="Médio" size="medium" class="progress-demo" />
            <Progress :value="65" label="Grande" size="large" class="progress-demo" />
          </Card>

          <Card title="Efeitos" padding="normal">
            <Progress :value="80" label="Listrado" striped class="progress-demo" />
            <Progress :value="70" label="Listras Animadas" striped animated class="progress-demo" />
          </Card>

          <Card title="Interativo" padding="normal">
            <Progress 
              :value="progressValue" 
              :label="`Progresso: ${progressValue}%`" 
              variant="secondary" 
              striped 
              animated 
              class="progress-demo"
            />
            <div class="progress-controls">
              <Button size="small" @click="decreaseProgress" variant="secondary">
                <OhVueIcon name="fa-minus" />
              </Button>
              <span class="progress-value-display">{{ progressValue }}%</span>
              <Button size="small" @click="increaseProgress">
                <OhVueIcon name="fa-plus" />
              </Button>
            </div>
          </Card>

          <Card title="Com Descrições" padding="normal">
            <Progress 
              :value="35" 
              label="Download de Arquivos" 
              description="3 de 10 arquivos baixados" 
              class="progress-demo"
            />
            <Progress 
              :value="75" 
              label="Upload" 
              description="75% concluído" 
              variant="success"
              class="progress-demo"
            />
          </Card>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="bi-card-checklist" /> Listas</h2>
      <p class="section-description">Componentes para exibir listas de itens com diferentes estilos e funcionalidades.</p>
      
      <div class="component-demo">
        <div class="lists-grid">

          <Card title="Lista Básica" padding="normal">
            <List :items="basicListItems" />
          </Card>

          <Card title="Lista Ordenada" padding="normal">
            <List :items="orderedListItems" :ordered="true" />
          </Card>

          <Card title="Lista Clicável" padding="normal">
            <List 
              :items="clickableListItems" 
              :clickable="true" 
              @item-click="handleListItemClick"
            />
          </Card>

          <Card title="Lista Estilizada" padding="normal">
            <List 
              :items="styledListItems" 
              :striped="true"
              :bordered="true"
              variant="primary"
            />
          </Card>

          <Card title="Marcador Personalizado" padding="normal">
            <List 
              :items="customBulletListItems" 
              :custom-bullet="customBulletImage"
              :divided="true"
            />
          </Card>
        </div>
      </div>
      <div class="component-demo">
        <Card title="Com Ações" padding="normal">
          <List 
            :items="actionListItems" 
            :divided="true"
            @action-click="handleListActionClick"
          />
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'
import List from '@/components/ui/List.vue'
import Progress from '@/components/ui/Progress.vue'

const progressValue = ref(50)

const increaseProgress = () => {
  if (progressValue.value < 100) {
    progressValue.value += 10
  }
}

const decreaseProgress = () => {
  if (progressValue.value > 0) {
    progressValue.value -= 10
  }
}

const handleListItemClick = (event) => {
  console.log('Item da lista clicado:', event)
}

const handleListActionClick = (event) => {
  console.log('Ação da lista clicada:', event)
}

const basicListItems = [
  { id: 1, text: 'Item 1 da lista' },
  { id: 2, text: 'Item 2 com descrição', description: 'Esta é uma descrição adicional' },
  { id: 3, text: 'Item 3 com metadado', meta: 'Novo' },
  { id: 4, text: 'Item 4 com ícone', icon: 'oi-check' }
]

const orderedListItems = [
  { id: 1, text: 'Primeiro passo' },
  { id: 2, text: 'Segundo passo', description: 'Continue para o próximo' },
  { id: 3, text: 'Terceiro passo' }
]

const clickableListItems = [
  { id: 1, text: 'Item clicável 1' },
  { id: 2, text: 'Item clicável 2', description: 'Clique para selecionar' },
  { id: 3, text: 'Item desabilitado', disabled: true },
  { id: 4, text: 'Item clicável 3' }
]

const actionListItems = [
  { 
    id: 1, 
    text: 'Documento.pdf', 
    description: 'PDF • 2.5 MB',
    actions: [
      { id: 'edit', label: 'Editar', variant: 'secondary', icon: 'oi-pencil' },
      { id: 'delete', label: 'Excluir', variant: 'danger', icon: 'oi-ri-delete-back-2-line' }
    ]
  },
  { 
    id: 2, 
    text: 'imagem.jpg', 
    description: 'JPEG • 1.2 MB',
    actions: [
      { id: 'view', label: 'Visualizar', variant: 'primary' },
      { id: 'share', label: 'Compartilhar', variant: 'secondary' }
    ]
  }
]

const styledListItems = [
  { id: 1, text: 'Item estilizado 1', description: 'Com fundo alternado' },
  { id: 2, text: 'Item estilizado 2', description: 'Com bordas' },
  { id: 3, text: 'Item estilizado 3', description: 'Tema primário' }
]

const customBulletListItems = [
  { id: 1, text: 'Item com marcador personalizado' },
  { id: 2, text: 'Item com descrição', description: 'Descrição do item' },
  { id: 3, text: 'Outro item' }
]

const customBulletImage = '/src/assets/icons/bullet.gif'
</script>

<style scoped>
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.catalog-section {
  padding: 2rem;
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px var(--shadow);
}

.catalog-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
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

.component-demo {
  padding: 1.5rem;
  background: var(--inner-surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.loading-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-group h4 {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.loading-examples {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: var(--surface-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-primary);
}

.progress-demo {
  margin-bottom: 1rem;
}

.progress-demo:last-child {
  margin-bottom: 0;
}

.progress-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.progress-value-display {
  font-weight: 600;
  color: var(--text-primary);
  min-width: 3rem;
  text-align: center;
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 1rem;
  }
  
  .cards-grid,
  .lists-grid,
  .progress-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-controls {
    flex-direction: column;
    gap: 0.5rem;
  }

  .loading-examples {
    gap: 1rem;
  }
  
}
</style>