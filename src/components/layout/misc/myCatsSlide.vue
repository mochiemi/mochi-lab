<template>
    
        <Carousel 
          :slides="imageSlides" 
          :title="$t('myCats.title')"
          :show-indicators="true"
          :show-controls="true"
          :autoplay="true"
          card-variant="image"
          size="medium"
        />

</template>

<script setup>
import { computed } from 'vue'
import Carousel from '@/components/ui/Carousel.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const imageSlides = computed(() =>[
  {
    title: 'Romeow',
    description: t('myCats.romeow'),
    image: '/src/assets/images/romeow.jpg'
  },
  {
    title: 'Pure',
    description: t('myCats.pure'),
    image: '/src/assets/images/pure.jpg'
  },
  {
    title: 'Hana',
    description: t('myCats.hana'),
    image: '/src/assets/images/hana.jpg'
  },
    {
    title: 'Morgan',
    description: t('myCats.morgan'),
    image: '/src/assets/images/morgan.jpg'
  },
    {
    title: 'Gina',
    description: t('myCats.gina'),
    image: '/src/assets/images/gina.jpg'
  }
])

</script>


<style scoped>
</style>