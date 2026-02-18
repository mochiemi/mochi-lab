<template>
<<<<<<< HEAD
  <div class="home">

    <Card class="today-date" :flat="true" :padding="'medium'">
      <div class="date-content">
        <div class="date-text">
          <p class="today">{{ $t('home.todayIs') }}</p>
          <span class="formatted-date">{{ formattedDate }}</span>
        </div>
      </div>
    </Card>

    <Card class="hero-card">
      <div class="hero-content">
        <div class="hero-text">
          <p class="welcome">{{ $t('home.welcome') }}</p>
          <h1 class="title">Mochi Lab</h1>
          <img class="hero-img" src="../assets/images/mochipuyu.png" />
          <p class="hero-description">{{ $t('home.description') }}</p>
        </div>
        <Tooltip :content="$t('home.tooltip')" position="right" size="lg" class="logo-tooltip">
          <router-link to="/about" class="nav-brand">
          </router-link>
        </Tooltip>
      </div>
    </Card>



  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLanguageStore } from '@/stores/language';
import Card from '@/components/ui/Card.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import { OhVueIcon } from 'oh-vue-icons';

const languageStore = useLanguageStore();
const today = new Date();

const formattedDate = computed(() => {
  const locale = languageStore.currentLanguage;

  const weekday = today.toLocaleDateString(locale, { weekday: 'long' });
  const date = today.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `${weekday}, ${date}`;
});


</script>

<style scoped>

.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  letter-spacing: 1px;
}

.hero-card {
  width: min(95dvw, 1000px);
  margin: 1em auto;
  background: var(--rose-surface);
  overflow: hidden;
}

.hero-content {
  display: flex;
  gap: 3em;
  padding: 2em;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.welcome {
  font-size: 1.2em;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  margin-bottom: 1.5em;
}

.title {
  font-size: 4cqmax;
  color: var(--title-secondary);
  font-family: 'Finger Paint';
  margin-bottom: 1em;
  text-shadow:
    2px 2px 0 var(--primary),
    -2px 2px 0 var(--primary),
    2px -2px 0 var(--primary),
    -2px -2px 0 var(--primary);
}

.hero-description {
  font-size: 1em;
  color: var(--text-primary);
  margin-bottom: 2em;
  line-height: 1.6;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-img{
  display: inline-block;
  max-width: 50dvw;
  transition: all 0.5s ease;
}

.today-date {
  width: min(95dvw, 1000px);
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-weight: 600;
  text-align: center;
  margin: 1em auto;
  color: var(--text-primary);
  background: var(--sky-blue-surface);
}

.date-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.date-text p {
  font-weight: 400;
  margin: 0.6em 0;
  font-size: 1.4em;
  color: var(--text-primary);
}

.formatted-date {
  font-size: 1.4em;
  color: var(--text-secondary);
  font-family: "Comfortaa", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  margin-bottom: 1em;
}


@media (max-width: 1080px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2em;
  }

  .hero-text {
    text-align: center;
  }
  .hero-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .home {
    margin-top: 2em;
    padding: 0.1em;
    gap: 1em;
  }

  .hero-card,
  .today-date {
    width: 95dvw;
    margin: 0.25em auto;
  }

  .hero-content {
    padding: 1em;
  }

  .home-grid {
    grid-template-columns: 1fr;
    gap: 1em;
  }

  .hero-img{
    display: inline-block;

}

  .title {
    font-size: 2.5em;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  .link-button {
    justify-content: center;
  }

}

@media (max-width: 480px) {
  .home {
    padding: 0.25em;
  }
  .hero-content {
    padding: 0.5em;
  }
}

</style>
