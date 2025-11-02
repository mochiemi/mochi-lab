<template>
  <div class="home">

    <Card class="hero-card">
      <div class="hero-content">
        <div class="hero-text">
          <p class="welcome">{{ $t('home.welcome') }}</p>
          <h1 class="title">Mochi Lab</h1>
          <p class="hero-description">{{ $t('home.description') }}</p>
        </div>
        <Tooltip :content="$t('home.tooltip')" position="right" size="lg" class="logo-tooltip">
          <router-link to="/about" class="nav-brand">
            <MochiLogo size="xlarge" clickable="true" />
          </router-link>
        </Tooltip>
      </div>
    </Card>
    
    <Card class="today-date" :flat="true" :padding="'medium'">
      <div class="date-content">
        <div class="date-text">
          <p>{{ $t('home.todayIs') }}</p>
          <span class="formatted-date">{{ formattedDate }}</span>
        </div>
      </div>
    </Card>
    
    <div class="home-grid">
      <Card class="featured-card" :clickable="true" @click="$router.push('/components')">
        <OhVueIcon name="oi-star" class="card-icon"/>
        <h3>{{ $t('home.featured.title') }}</h3>
        <p>{{ $t('home.featured.description') }}</p>
        <div class="card-badges">
          <Badge variant="primary" size="small">New</Badge>
          <Badge variant="outline" size="small">Vue 3</Badge>
        </div>
      </Card>
      
      <Card class="latest-card" :clickable="true" @click="$router.push('/blog')">
        <OhVueIcon name="oi-clock" class="card-icon"/>
        <h3>{{ $t('home.latest.title') }}</h3>
        <p>{{ $t('home.latest.description') }}</p>
        <div class="post-preview">
          <OhVueIcon name="oi-document" class="preview-icon" />
          <span class="preview-text">{{ $t('home.latest.preview') }}</span>
        </div>
      </Card>
      

      <Card class="interactive-card" :clickable="true" @click="$router.push('/poke-forms')">
        <OhVueIcon name="oi-puzzle-piece" class="card-icon"/>
        <h3>{{ $t('home.interactive.title') }}</h3>
        <p>{{ $t('home.interactive.description') }}</p>
        <Badge variant="secondary" class="fun-badge">
          <OhVueIcon name="oi-heart" class="badge-icon" />
          {{ $t('home.interactive.fun') }}
        </Badge>
      </Card>
    </div>
  
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLanguageStore } from '@/stores/language';
import Card from '@/components/ui/Card.vue';
import MochiLogo from '@/components/misc/Logo.vue'
import Badge from '@/components/ui/Badge.vue';
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.hero-card {
  width: min(95dvw, 1000px);
  margin: 1rem auto;
  background: var(--gradient-mix);
  border: none;
  overflow: hidden;
}

.hero-content {
  display: flex;
  gap: 3rem;
  padding: 2rem;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.welcome {
  font-size: clamp(1.1rem, 3vw, 1.3rem);
  font-weight: 700;
  letter-spacing: 0.1rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  letter-spacing: 0.2rem;
  color: var(--primary);
  margin-bottom: 1rem;
  text-shadow: 
    2px 2px 0 var(--border-primary),
    -2px 2px 0 var(--border-primary),
    2px -2px 0 var(--border-primary),
    -2px -2px 0 var(--border-primary);
}

.hero-description {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: var(--text-primary);
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.today-date {
  width: min(95dvw, 1000px);
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-weight: 600;
  text-align: center;
  margin: 1rem auto;
  color: var(--text-primary);
  background: var(--gradient-surface-1);
}

.date-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.date-text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.formatted-date {
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: bold;
}

.home-grid {
  display: grid;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.featured-card,
.latest-card,
.interactive-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-height: 220px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.featured-card:hover,
.latest-card:hover,
.stats-card:hover,
.interactive-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--shadow-hover);
}

.featured-card {
  background: var(--gradient-primary);
  color: white;
  border-color: var(--primary);
}

.latest-card {
  background: var(--gradient-surface-2);
  border-color: var(--border);
}

.stats-card {
  background: var(--gradient-surface-1);
  border-color: var(--border);
}

.interactive-card {
  background: var(--gradient-secondary);
  color: white;
  border-color: var(--secondary);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: inherit;
}

.featured-card h3,
.latest-card h3,
.stats-card h3,
.interactive-card h3 {
  margin: 0.5rem 0;
  font-size: 1.3rem;
  color: inherit;
}

.featured-card p,
.latest-card p,
.stats-card p,
.interactive-card p {
  margin: 0 0 1.5rem 0;
  opacity: 0.9;
  font-size: 0.95rem;
  line-height: 1.5;
  flex: 1;
}

.card-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.post-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 100%;
}

.preview-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.preview-text {
  font-size: 0.85rem;
  opacity: 0.9;
}

.fun-badge {
  margin-top: auto;
}

@media (max-width: 1080px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
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
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .hero-card,
  .today-date {
    width: 95dvw;
    margin: 0.5rem auto;
  }
  
  .hero-content {
    padding: 1.5rem;
  }
  
  .home-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .featured-card,
  .latest-card,
  .stats-card,
  .interactive-card {
    min-height: 200px;
    padding: 1.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .link-button {
    justify-content: center;
  }
  
  .stats-numbers {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .home {
    padding: 0.5rem;
  }
  
  .hero-content {
    padding: 1rem;
  }
  
  .featured-card,
  .latest-card,
  .stats-card,
  .interactive-card {
    min-height: 180px;
    padding: 1rem;
  }
  
  .card-icon {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .button {
    width: 100%;
    max-width: 250px;
  }
}
</style>