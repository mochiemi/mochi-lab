<template>
  <div class="tab-content">
    <!-- Dropdown -->
    <section class="catalog-section">
      <h2><OhVueIcon name="oi-folder" /> {{ $t('components.tabs.navigation.dropdown.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.navigation.dropdown.description') }}</p>
      
      <div class="component-demo">
        <div class="dropdown-demo-grid">
          <Dropdown :label="$t('components.tabs.navigation.dropdown.examples.mainMenu')" dropdown-id="main-menu-sample">
            <div class="dropdown-content">
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-person" /> {{ $t('components.tabs.navigation.dropdown.examples.profile') }}</a>
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-gear" /> {{ $t('components.tabs.navigation.dropdown.examples.settings') }}</a>
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-sign-out" /> {{ $t('components.tabs.navigation.dropdown.examples.logout') }}</a>
            </div>
          </Dropdown>

          <Dropdown :label="$t('components.tabs.navigation.dropdown.examples.quickActions')" dropdown-id="quick-actions">
            <div class="dropdown-content">
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-download" /> {{ $t('components.tabs.navigation.dropdown.examples.export') }}</a>
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-upload" /> {{ $t('components.tabs.navigation.dropdown.examples.import') }}</a>
              <a href="#" class="dropdown-item"><OhVueIcon name="oi-reload" /> {{ $t('components.tabs.navigation.dropdown.examples.refresh') }}</a>
            </div>
          </Dropdown>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <h2><OhVueIcon name="oi-file" /> {{ $t('components.tabs.navigation.tabs.title') }}</h2>
      <p class="section-description">{{ $t('components.tabs.navigation.tabs.description') }}</p>
      
      <div class="component-demo">
        <Tabs v-model="demoActiveTab" :tabs="demoTabs" class="demo-tabs">
          <template #tab-0>
            <div class="tab-content-inner">
              <h3>{{ $t('components.tabs.navigation.tabs.examples.tab1') }}</h3>
              <p>{{ $t('components.tabs.navigation.tabs.examples.tab1Content') }}</p>
              <Button variant="primary">{{ $t('components.tabs.navigation.tabs.examples.action1') }}</Button>
            </div>
          </template>
          
          <template #tab-1>
            <div class="tab-content-inner">
              <h3>{{ $t('components.tabs.navigation.tabs.examples.tab2') }}</h3>
              <p>{{ $t('components.tabs.navigation.tabs.examples.tab2Content') }}</p>
              <Button variant="secondary">{{ $t('components.tabs.navigation.tabs.examples.action2') }}</Button>
            </div>
          </template>
          
          <template #tab-2>
            <div class="tab-content-inner">
              <h3>{{ $t('components.tabs.navigation.tabs.examples.tab3') }}</h3>
              <p>{{ $t('components.tabs.navigation.tabs.examples.tab3Content') }}</p>
              <Button variant="success">{{ $t('components.tabs.navigation.tabs.examples.action3') }}</Button>
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