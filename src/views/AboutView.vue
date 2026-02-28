<template>
  <div class="about">
    <Card :padding="'large'" class="about-card">
      <template #header>
        <div class="about-header">
          <div class="header-content">
            <h1><OhVueIcon name="gi-health-potion" class="header-icon"/>{{ $t('nav.about') }} Mochi Lab<OhVueIcon name="gi-erlenmeyer" class="header-icon"/></h1>
          </div>
        </div>
      </template>

      <div class="about-content">
        <div class="intro-section">
          <div class="lab-section">
            <div class="lab-description">
              <p>{{ $t('about.labDescription1') }}</p>
              <p>{{ $t('about.labDescription2') }}</p>
              <p>{{ $t('about.labDescription3') }}</p>
            </div>
            <Tooltip size="xl" variant="secondary" position="right" :content="$t('about.puyuTooltip')" class="puyu-tooltip">
              <img src="@/assets/images/mochipuyu-2.png" alt="Scientist Puyu-chan" loading="lazy"/>
            </Tooltip>
          </div>
        </div>
        <hr />
        <section class="future-features">
      <h2>{{ $t('about.futureProjects') }}</h2>
        <p class="future-projects">{{ $t('about.futureProjectsDesc') }}</p>
        <div class="features-grid">
          <Card
            v-for="feature in futureFeatures"
            :key="feature.id"
            class="feature-card"
            :padding="'medium'"
          >
            <div class="feature-icon">
              <OhVueIcon :name="feature.icon" />
            </div>
            <h3>{{ $t(feature.titleKey) }}</h3>
            <p>{{ $t(feature.descriptionKey) }}</p>
          </Card>
        </div>
        </section>

        <hr />

        <section class="profile-section">
            <h2>{{ $t('about.aboutAuthor') }}</h2>
          <div class="profile-start">
            <div class="profile-image">
              <img src="@/assets/images/profile-selfie.jpg" alt="Mochiemi" />
            </div>
            <div class="profile-text">
              <p>{{ $t('about.authorBio1') }}</p>
              <p>{{ $t('about.authorBio2') }}</p>
              <p>{{ $t('about.authorBio3') }}</p>
              <p class="dory-quote"><q>{{ $t('about.doryQuote') }}</q><cite class="dory-cite"> {{ $t('about.doryCite') }}</cite></p>
            </div>
          </div>
          <hr />
          <div class="fun-facts">
            <h2>{{ $t('about.funFacts') }}</h2>
            <List
              :items="funFactsListItems"
              :custom-bullet="customBulletImage"
            />
          </div>
      </section>
        <hr />
        <div class="cats-slide">
          <MyCatsSlide />
        </div>
      </div>

      <template #footer>
        <div class="about-footer">
          <Button
            variant="primary"
            @click="$router.push('/')">
            <OhVueIcon name="hi-home" class="btn-icon" />
            {{ $t('nav.home') }}
          </Button>
          <Button
            variant="secondary"
            @click="$router.push('/contact')"
            class="footer-btn"
          >
            <OhVueIcon name="fa-regular-paper-plane" class="btn-icon" />
            {{ $t('nav.contact') }}
          </Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { OhVueIcon } from 'oh-vue-icons'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import List from '@/components/ui/List.vue'
import MyCatsSlide from '@/components/layout/misc/myCatsSlide.vue'
import customBullet from '@/assets/icons/mini-mochi.gif'

const { t } = useI18n()
const customBulletImage = customBullet;

const futureFeatures = [
  {
    id: 1,
    icon: 'la-pills-solid',
    titleKey: 'about.medicationList',
    descriptionKey: 'about.medicationListDesc',
  },
  {
    id: 2,
    icon: 'io-construct',
    titleKey: 'about.calculators',
    descriptionKey: 'about.calculatorsDesc',
  },
  {
    id: 3,
    icon: 'md-librarybooks-outlined',
    titleKey: 'about.scienceCommunication',
    descriptionKey: 'about.scienceCommunicationDesc',
  },
  {
    id: 4,
    icon: 'md-donotdisturb',
    titleKey: 'about.drugInteractions',
    descriptionKey: 'about.drugInteractionsDesc',
  }
]

const funFactsListItems = computed(() => [
  { 
    id: 1, 
    text: t('about.funFact1Title'), 
    description: t('about.funFact1Desc') 
  },
  { 
    id: 2, 
    text: t('about.funFact2Title'), 
    description: t('about.funFact2Desc') 
  },
  { 
    id: 3, 
    text: t('about.funFact3Title'), 
    description: t('about.funFact3Desc') 
  }
])

</script>

<style scoped>
.about {
  max-width: 1200px;
  width: 80dvw;
  margin: 3em auto;
}

.about-card {
  margin-top: 3em;
  background: var(--surface-primary);
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  gap: 1em;
  margin: 1em auto;
}

.header-content {
  flex: 1;
}

.header-content h1 {
  margin-bottom: -0.5em;
}

.header-icon {
  color: var(--badge-teal);
  transform: scale(3);
}

.about-content {
  color: var(--text-secondary);
}

.intro-section {
  margin-bottom: 2em;
}

.lab-section {
  display: flex;
  flex: row;
  align-items: center;
  justify-content: space-around;
  text-align: justify;
}

.lab-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.lab-description p {
  margin: 0.5em;
}

.lab-section img {
  margin: 0.5em;
  display: inline-block;
  max-width: 800px;
  min-width: 200px;
  width: 35%;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.profile-start {
  display: flex;
  flex: row;
  align-items: center;
  justify-content: space-between;
  text-align: justify;
}

.profile-image {
  display: inline-block;
  margin: 1rem;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary);
  box-shadow: 0px 0px 20px 6px var(--shadow);
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

.profile-text {
  display: flex;
  flex-direction: column;
  text-align: justify;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  max-width: 70%;
  color: var(--text-primary);
}

.profile-text p {
  margin-bottom: 1rem;
}

.dory-quote {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  text-align: right;
}

.dory-cite {
  font-size: 1.3rem;
}

hr {
  margin: 1rem;
}
h2 {
  color: var(--title-secondary);
  text-align: center;
}

.future-projects {
  text-align: center;
  margin: 1rem auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  margin-bottom: 4rem;
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
  background: var(--inner-surface);
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px var(--shadow-hover);
}

.feature-icon {
  color: var(--strong-rose);
  margin: 1rem;
  transform: scale(2);
}

.feature-card h3 {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.fun-facts {
  margin: 0;
}

.fun-facts h2 {
margin-bottom: 2rem;
}

.cats-slide {
  margin-top: 2rem;
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
    width: 150px;
    height: 150px;
  }


  .profile-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-icon {
    transform: scale(1.5);
  }
  .about {
    padding: 0.5rem;
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
    gap: 1rem;
  }

  .about-footer {
    flex-direction: column;
    align-items: center;
  }

  .footer-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .profile-image {
    width: 100px;
    height: 100px;
  }

  .facts-grid {
    grid-template-columns: 1fr;
  }

  .feature-icon {
    font-size: 2.5rem;
  }
}
</style>
