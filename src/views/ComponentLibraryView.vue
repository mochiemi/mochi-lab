<template>
  <div class="catalog-container">
    <div class="catalog-header-wrapper">
      <CatalogHeader />
      <Button variant="secondary" size="small" @click="logout" class="logout-button">
        🚪 Sair
      </Button>
    </div>
    
    <Tabs v-model="activeTab" :tabs="tabs" class="catalog-tabs">
      <!-- Usando a sintaxe de slot com # e string literal -->
      <template #[`tab-${0}`]>
        <FormsTab />
      </template>

      <template #[`tab-${1}`]>
        <FeedbackTab />
      </template>

      <template #[`tab-${2}`]>
        <NavigationTab />
      </template>

      <template #[`tab-${3}`]>
        <LayoutTab />
      </template>

      <template #[`tab-${4}`]>
        <OverlaysTab />
      </template>

      <template #[`tab-${5}`]>
        <CarouselTab />
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import Tabs from '@/components/ui/Tabs.vue'
import Button from '@/components/ui/Button.vue'
import CatalogHeader from '@/components/layout/component-library/CatalogHeader.vue'
import FormsTab from '@/components/layout/component-library/FormsTab.vue'
import FeedbackTab from '@/components/layout/component-library/FeedbackTab.vue'
import NavigationTab from '@/components/layout/component-library/NavigationTab.vue'
import LayoutTab from '@/components/layout/component-library/LayoutTab.vue'
import OverlaysTab from '@/components/layout/component-library/OverlaysTab.vue'
import CarouselTab from '@/components/layout/component-library/CarouselTab.vue'

interface Tab {
  label: string
}

const router = useRouter()
const adminStore = useAdminStore()

const activeTab = ref<number>(0)
const tabs = ref<Tab[]>([
  { label: 'Input/Forms' },
  { label: 'Alert/Toast' },
  { label: 'Navigation' },
  { label: 'Layout' },
  { label: 'Overlays' },
  { label: 'Carousel' },
])

const logout = (): void => {
  adminStore.logout()
  router.push('/admin')
}

onMounted((): void => {
  adminStore.checkAuth()
  if (!adminStore.isAuthenticated) {
    router.push('/admin')
  }
})
</script>

<style scoped>
.catalog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.catalog-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.logout-button {
  flex-shrink: 0;
}

.catalog-tabs {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .catalog-container {
    padding: 1rem;
  }
  
  .catalog-header-wrapper {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .logout-button {
    align-self: flex-end;
  }
}
</style>