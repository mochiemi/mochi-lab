<template>
  <div class="tab-content">
    <!-- Dropdown -->
    <section class="catalog-section">
      <h2><OhVueIcon name="oi-folder" /> Dropdown</h2>
      <p class="section-description">Menus suspensos para organizar ações e navegação.</p>
      
      <div class="component-demo">
        <div class="dropdown-demo-grid">
          <Dropdown label="Menu Principal" dropdown-id="main-menu-sample">
            <div class="dropdown-content">
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-person" /> Perfil</a>
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-gear" /> Configurações</a>
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-sign-out" /> Sair</a>
            </div>
          </Dropdown>

          <Dropdown label="Ações Rápidas" dropdown-id="quick-actions">
            <div class="dropdown-content">
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-download" /> Exportar</a>
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-upload" /> Importar</a>
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-reload" /> Atualizar</a>
            </div>
          </Dropdown>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="oi-file" /> Abas</h2>
      <p class="section-description">Organize conteúdo em abas para melhor navegação.</p>
      
      <div class="component-demo">
        <Tabs v-model="demoActiveTab" :tabs="demoTabs" class="demo-tabs">
          <template #tab-0>
            <div class="tab-content-inner">
              <h3>Conteúdo da Aba 1</h3>
              <p>Este é o conteúdo da primeira aba. Você pode colocar qualquer componente aqui.</p>
              <Button variant="primary">Ação 1</Button>
            </div>
          </template>
          
          <template #tab-1>
            <div class="tab-content-inner">
              <h3>Conteúdo da Aba 2</h3>
              <p>Conteúdo da segunda aba com informações diferentes.</p>
              <Button variant="secondary">Ação 2</Button>
            </div>
          </template>
          
          <template #tab-2>
            <div class="tab-content-inner">
              <h3>Conteúdo da Aba 3</h3>
              <p>Mais conteúdo na terceira aba do componente.</p>
              <Button variant="success">Ação 3</Button>
            </div>
          </template>
        </Tabs>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dropdown from '@/components/ui/Dropdown.vue'
import Tabs from '@/components/ui/Tabs.vue'
import Button from '@/components/ui/Button.vue'

const demoActiveTab = ref(0)
const demoTabs = ref([
  { label: 'Aba 1', badge: '3' },
  { label: 'Aba 2', badge: '5' },
  { label: 'Aba 3', badge: '1' }
])
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

.dropdown-demo-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.dropdown-content {
  padding: 0.5rem;
  min-width: 200px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: var(--primary-10);
  color: var(--primary);
}

.demo-tabs {
  margin-top: 1rem;
}

.tab-content-inner {
  padding: 1.5rem;
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.tab-content-inner h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.tab-content-inner p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 1rem;
  }
  
  .dropdown-demo-grid {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>