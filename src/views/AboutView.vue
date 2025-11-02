<template>
  <div class="about">
    <Card :padding="'large'" class="about-card">
      <template #header>
        <div class="about-header">
          <div class="header-content">
            <h1>{{ $t('about.title') }}</h1>
            <p class="subtitle">{{ $t('about.subtitle') }}</p>
          </div>
        </div>
      </template>
      
      <div class="about-content">
        <div class="intro-section">
          <div class="profile-section">
            <div class="profile-image">
              <img src="@/assets/images/profile-selfie.jpg" alt="Mochiemi" />
            </div>
            <div class="profile-content">
              <h2>{{ $t('about.welcome') }}</h2>
              <p class="intro-text">
                {{ $t('about.description') }}
              </p>
            </div>
          </div>
        </div>
        <hr />
        <section class="features">
      <h2>{{ $t('about.features.title') }}</h2>
        <div class="features-grid">
          <Card 
            v-for="feature in features" 
            :key="feature.id"
            class="feature-card"
            :padding="'medium'"
          >
            <div class="feature-icon">
              <OhVueIcon :name="feature.icon" />
            </div>
            <h3>{{ $t(feature.titleKey) }}</h3>
            <p>{{ $t(feature.descriptionKey) }}</p>
            <div class="feature-tags">
              <Badge 
                v-for="tag in feature.tags" 
                :key="tag"
                variant="tag"
                size="small"
              >
                {{ tag }}
              </Badge>
            </div>
          </Card>
        </div>
        </section>
        <hr />
        <div class="tech-stack">
          <h2>{{ $t('about.techStack') }}</h2>
          <p class="tech-description">{{ $t('about.techDescription') }}</p>
          <div class="tech-badges">
            <Badge 
              v-for="tech in techStack" 
              :key="tech.name"
              :variant="tech.variant"
              class="tech-badge"
            >
              <OhVueIcon :name="tech.icon" class="tech-icon" />
              {{ tech.name }}
            </Badge>
          </div>
        </div>
        <hr />
      <Card class="fun-fact" :padding="'normal'">
        <div class="fun-fact-content">
          <OhVueIcon name="gi-capybara" class="fun-fact-icon" />
          <p><strong>{{ $t('abouts.contact.header.funFact.title') }}</strong> {{ $t('abouts.contact.header.funFact.description') }}</p>
        </div>
      </Card>

        <div class="fun-facts">
          <h2>{{ $t('about.funFacts') }}</h2>  
          <div class="facts-grid">
            <Card class="fact-card" :padding="'small'">
              <OhVueIcon name="gi-cat" class="fact-icon" />
              <h4>{{ $t('about.fact1.title') }}</h4>
              <p>{{ $t('about.fact1.description') }}</p>
            </Card>
            <Card class="fact-card" :padding="'small'">
              <OhVueIcon name="co-gamepad" class="fact-icon" />
              <h4>{{ $t('about.fact2.title') }}</h4>
              <p>{{ $t('about.fact2.description') }}</p>
            </Card>
            <Card class="fact-card" :padding="'small'">
              <OhVueIcon name="io-construct" class="fact-icon" />
              <h4>{{ $t('about.fact3.title') }}</h4>
              <p>{{ $t('about.fact3.description') }}</p>
            </Card>
            <Card class="fact-card" :padding="'small'">
              <OhVueIcon name="ri-stethoscope-line" class="fact-icon" />
              <h4>{{ $t('about.fact4.title') }}</h4>
              <p>{{ $t('about.fact4.description') }}</p>
            </Card>
          </div>
        </div>
        <hr />
        <div class="cats-slide">
          <MyCatsSlide />
        </div>
      </div>

      <template #footer>
        <div class="about-footer">
          <Button 
            variant="primary" 
            @click="$router.push('/')"
            class="footer-btn"
          >
            <OhVueIcon name="hi-home" class="btn-icon" />
            {{ $t('about.backToHome') }}
          </Button>
          <Button 
            variant="secondary"
            @click="$router.push('/contact')"
            class="footer-btn"
          >
            <OhVueIcon name="fa-regular-paper-plane" class="btn-icon" />
            {{ $t('about.getInTouch') }}
          </Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { OhVueIcon } from 'oh-vue-icons'
import MyCatsSlide from '@/components/layout/misc/myCatsSlide.vue'

const features = [
  {
    id: 1,
    icon: 'md-rocketlaunch-round',
    titleKey: 'about.features.fastNavigation.title',
    descriptionKey: 'about.features.fastNavigation.description',
    tags: ['Vue Router', 'SPA', 'Performance']
  },
  {
    id: 2,
    icon: 'md-settingssuggest-outlined',
    titleKey: 'about.features.components.title',
    descriptionKey: 'about.features.components.description',
    tags: ['Reusable', 'Customizable', 'TypeScript']
  },
  {
    id: 3,
    icon: 'oi-star',
    titleKey: 'about.features.modernDesign.title',
    descriptionKey: 'about.features.modernDesign.description',
    tags: ['CSS Variables', 'Responsive', 'Accessibility']
  },
  {
    id: 4,
    icon: 'gi-world',
    titleKey: 'about.features.internationalization.title',
    descriptionKey: 'about.features.internationalization.description',
    tags: ['i18n', 'Multi-language', 'Localization']
  }
]

const techStack = [
  { name: 'Vue 3', variant: 'primary', icon: 'vi-file-type-vue' },
  { name: 'Vue Router', variant: 'secondary', icon: 'bi-window' },
  { name: 'Pinia', variant: 'primary', icon: 'gi-pineapple' },
  { name: 'TypeScript', variant: 'secondary', icon: 'si-typescript' },
  { name: 'CSS', variant: 'primary', icon: 'fa-paint-brush' },
  { name: 'Vite', variant: 'secondary', icon: 'vi-file-type-vite' },
]
</script>

<style scoped>
.about {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.about-card {
  background: var(--gradient-surface-1);
  border: 1px solid var(--border);
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.header-content {
  flex: 1;
}

.header-content h1 {
  color: var(--secondary);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.about-content {
  color: var(--text-secondary);
}

.intro-section {
  margin-bottom: 4rem;
}

.profile-section {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: start;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary);
  box-shadow: 0 8px 32px var(--shadow);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(80%);
  transform: rotate(180deg);
  transition: all 0.8s ease;
}

.profile-image img:hover {
  filter: grayscale(0%);
  transform: rotate(0deg);
}

.profile-content h2 {
  color: var(--title-primary);
  text-align: left;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.intro-text {
  font-size: 1.2rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

hr {
  margin: 1rem;
}
h2 {
  color: var(--title-secondary);
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
  background: var(--surface);
  border: 1px solid var(--border);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px var(--shadow-hover);
}

.feature-icon {
  color: var(--title-secondary);
  margin: 1rem;
  transform: scale(2);
}

.feature-card h3 {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.feature-tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tech-stack {
  margin: 3rem 0;
  text-align: center;
}

.tech-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.tech-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.tech-badge {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}

.tech-icon {
  margin-right: 0.5rem;
}

.fun-fact {
  margin: 2rem 0;
  background: var(--gradient-primary);
  text-align: center;
}

.fun-fact-content {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.fun-fact-icon {
  margin: 1rem;
  color: var(--title-primary);
  transform: scale(2);
}

.fun-fact p {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.6;
}

.fun-facts {
  margin: 4rem 0;
}

.fun-facts h2 {
margin-bottom: 2rem;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.fact-card {
  text-align: center;
  transition: transform 0.3s ease;
  background: var(--inner-surface);
}

.fact-card:hover {
  transform: scale(1.05);
}

.fact-icon {
  font-size: 2.5rem;
  color: var(--secondary);
  margin-bottom: 1rem;
}

.fact-card h4 {
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.fact-card p {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.cats-slide {
  margin: 1rem;
}

.about-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.footer-btn {
  min-width: 160px;
}

.btn-icon {
  margin-right: 0.5rem;
}

@media (max-width: 968px) {
  .profile-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .profile-image {
    margin: 0 auto;
  }
  
  .profile-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }
  
  .about-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .header-content h1 {
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .profile-stats {
    gap: 1rem;
  }
  
  .stat {
    min-width: 80px;
    padding: 0.75rem;
  }
  
  .about-footer {
    flex-direction: column;
    align-items: center;
  }
  
  .footer-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .tech-badges {
    gap: 0.5rem;
  }
  
  .tech-badge {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .profile-image {
    width: 150px;
    height: 150px;
  }
  
  .facts-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-icon {
    font-size: 2.5rem;
  }
}
</style>