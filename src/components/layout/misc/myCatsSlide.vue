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

import romeow from '@/assets/images/romeow.jpg'
import pure from '@/assets/images/pure.jpg'
import hana from '@/assets/images/hana.jpg'
import morgan from '@/assets/images/morgan.jpg'
import gina from '@/assets/images/gina.jpg'

const { t } = useI18n()

const imageSlides = computed(() =>[
  {
    title: 'Romeow',
    description: t('myCats.romeow'),
    image: romeow  
  },
  {
    title: 'Pure',
    description: t('myCats.pure'),
    image: pure
  },
  {
    title: 'Hana',
    description: t('myCats.hana'),
    image: hana
  },
  {
    title: 'Morgan',
    description: t('myCats.morgan'),
    image: morgan
  },
  {
    title: 'Gina',
    description: t('myCats.gina'),
    image: gina
  }
])
</script>

<style scoped>
</style>