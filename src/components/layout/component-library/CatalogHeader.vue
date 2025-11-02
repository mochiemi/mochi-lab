<template>
  <header class="catalog-header">
    <h1><OhVueIcon name="md-settingssuggest-outlined" class="icon"/> {{ $t('components.header.title')}}</h1>
    <p>{{$t('components.header.description')}}</p>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.catalog-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}

.icon {
  transform: scale(2);
  margin:0.5rem;
}

.catalog-header h1:hover {
  color: var(--accent);
}

.catalog-header p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .catalog-header h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .catalog-header h1 {
    font-size: 1.75rem;
  }
}
</style>