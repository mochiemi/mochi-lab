<template>
  <div class="catalog-container">
    <CatalogHeader />
    
    <Tabs v-model="activeTab" :tabs="tabs" class="catalog-tabs">
      <template #tab-0>
        <FormsTab />
      </template>

      <template #tab-1>
        <FeedbackTab />
      </template>

      <template #tab-2>
        <NavigationTab />
      </template>

      <template #tab-3>
        <LayoutTab />
      </template>

      <template #tab-4>
        <OverlaysTab />
      </template>

      <template #tab-5>
        <CarouselTab />
      </template>

    </Tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from '@/components/ui/Tabs.vue'
import CatalogHeader from '@/components/layout/component-library/CatalogHeader.vue'
import FormsTab from '@/components/layout/component-library/FormsTab.vue'
import FeedbackTab from '@/components/layout/component-library/FeedbackTab.vue'
import NavigationTab from '@/components/layout/component-library/NavigationTab.vue'
import LayoutTab from '@/components/layout/component-library/LayoutTab.vue'
import OverlaysTab from '@/components/layout/component-library/OverlaysTab.vue'
import CarouselTab from '@/components/layout/component-library/CarouselTab.vue'


const activeTab = ref(0)
const tabs = ref([
  { label: 'Input/Forms' },
  { label: 'Alert/Toast'},
  { label: 'Navigation'},
  { label: 'Layout'},
  { label: 'Overlays'},
  { label: 'Carousel'},
])
</script>

<style scoped>
.catalog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.catalog-tabs {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .catalog-container {
    padding: 1rem;
  }
}
</style>