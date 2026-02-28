<template>
  <div class="home">
    <Card class="today-date" :flat="true">
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
          <img class="hero-img" src="../assets/images/mochipuyu-1.png" alt="Puyu" />
          <p class="hero-description">{{ $t('home.description') }}</p>
        </div>
        <Tooltip :content="$t('home.tooltip')" position="right" size="lg" class="logo-tooltip">
          <router-link to="/about" class="nav-brand"></router-link>
        </Tooltip>
      </div>
    </Card>

    <section class="features-section">
      <div class="features-header">
        <h2 class="features-title">
          <OhVueIcon name="gi-erlenmeyer" class="features-icon" />
          {{ $t('home.features.title') }}
        </h2>
        <p class="features-description">{{ $t('home.features.description') }}</p>
      </div>

      <div class="features-grid">
        <Card class="feature-card"  >
          <template #header>
            <div class="feature-header">
              <div class="feature-icon-wrapper">
                <OhVueIcon name="oi-pencil" class="feature-icon" />
              </div>
              <Badge v-if="latestPost" variant="primary" size="small">
                <OhVueIcon name="oi-star" class="badge-icon" />
                {{ $t('home.features.featured') }}
              </Badge>
            </div>
            <h3 class="feature-title">{{ $t('home.features.latestPost') }}</h3>
          </template>

          <div class="feature-content">
            <div v-if="loading" class="feature-loading">
              <Loading size="md" :text="$t('blog.loading')" />
            </div>

            <div v-else-if="error" class="feature-error">
              <OhVueIcon name="hi-exclamation-circle" class="error-icon-small" />
              <span>{{ error }}</span>
            </div>

            <div v-else-if="latestPost" class="post-preview">
              <h4 class="post-preview-title" v-html="latestPost.title"></h4>

              <div class="post-preview-meta">
                <div class="meta-item">
                  <OhVueIcon name="oi-person" class="meta-icon-small" />
                  <span>{{ latestPost.author }}</span>
                </div>
                <span class="separator-dot">•</span>
                <div class="meta-item">
                  <OhVueIcon name="bi-calendar-heart" class="meta-icon-small" />
                  <span>{{ formatDate(latestPost.published) }}</span>
                </div>
              </div>

              <p class="post-preview-excerpt">{{ latestPost.excerpt }}</p>

              <div class="post-preview-tags" v-if="latestPost.labels && latestPost.labels.length > 0">
                <span class="tags-text">Tags: </span>
                <Badge
                  v-for="label in latestPost.labels.slice(0, 2)"
                  :key="label"
                  variant="secondary"
                  size="small"
                >
                  {{ label }}
                </Badge>
                <span v-if="latestPost.labels.length > 2" class="more-tags">
                  +{{ latestPost.labels.length - 2 }}
                </span>
              </div>
            </div>

            <div v-else class="feature-empty">
              <OhVueIcon name="gi-cat" class="empty-icon-small" />
              <p>{{ $t('home.features.noPosts') }}</p>
            </div>
          </div>

          <template #footer>
            <div class="feature-footer">
              <Button
                variant="primary"
                size="small"
                :disabled="!latestPost || loading"
                @click="goToLatestPost"
              >
                <OhVueIcon name="fa-chevron-circle-right" class="btn-icon" />
                {{ $t('home.features.readPost') }}
              </Button>
            </div>
          </template>
        </Card>

        <TodayGHCard
          :title="$t('home.features.schedule')"
          icon="bi-calendar-heart"
          badge="2026/1"
          badge-variant="primary"
          :classes="scheduleStore.allClasses"
          :loading="false"
          @view-full-schedule="goToFullSchedule"
          @class-click="handleClassClick"
        />

        <FutureGHCard
          :title="$t('home.features.nextClasses')"
          icon="bi-calendar-week"
          :badge="$t('schedule.nextDayClasses')"
          badge-variant="secondary"
          :classes="scheduleStore.allClasses"
          :loading="false"
          @view-full-schedule="goToFullSchedule"
          @class-click="handleClassClick"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/language';
import { useScheduleStore } from '@/stores/schedule';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Loading from '@/components/ui/Loading.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import TodayGHCard from '@/components/layout/cards/TodayGHCard.vue';
import FutureGHCard from '@/components/layout/cards/FutureGHCard.vue';
import { OhVueIcon } from '@/plugins/icons';

const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;

const router = useRouter();
const languageStore = useLanguageStore();
const scheduleStore = useScheduleStore();
const today = new Date();

const latestPost = ref(null);
const loading = ref(true);
const error = ref(null);

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

const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const fetchLatestPost = async () => {
  try {
    loading.value = true;
    error.value = null;

    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=1`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch latest post');
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      const plainTextExcerpt = stripHtml(item.content).substring(0, 120);

      latestPost.value = {
        id: item.id,
        title: item.title,
        excerpt: plainTextExcerpt + (plainTextExcerpt.length >= 120 ? '...' : ''),
        published: item.published,
        author: item.author?.displayName || 'Mochi Lab',
        labels: item.labels || []
      };
    }
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching latest post:', err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(languageStore.currentLanguage, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const goToLatestPost = () => {
  if (latestPost.value) {
    router.push(`/post/${latestPost.value.id}`);
  }
};

const goToFullSchedule = () => {
  router.push('/grade-horaria');
};

const handleClassClick = (classItem) => {
  console.log('Class clicked:', classItem);
};

onMounted(() => {
  fetchLatestPost();
});
</script>

<style scoped>

.home {
  max-width: 1400px;
  margin: 2em auto;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
  letter-spacing: 1px;
}

.hero-card {
  width: min(95dvw, 1000px);
  margin: 0 auto;
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
  margin-bottom: 0;
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

.hero-img {
  display: inline-block;
  max-width: 50dvw;
  margin-left: -5em;
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
  gap: 1em;
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

.features-section {
  width: min(95dvw, 1200px);
  margin: 2em auto;
}

.features-header {
  text-align: center;
  margin-bottom: 2em;
}

.features-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  color: var(--title-primary);
  font-size: 2em;
  margin-bottom: 0.5em;
}

.features-icon {
  color: var(--primary);
  font-size: 1.2em;
}

.features-description {
  color: var(--text-secondary);
  font-size: 1.1em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5em;
}

.feature-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  background-color: var(--surface-primary)
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px var(--shadow-hover);
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon-wrapper.future {
  background: var(--surface-secondary);
  opacity: 0.7;
}

.feature-icon {
  font-size: 1.8em;
  color: var(--primary);
}

.feature-icon.future-icon {
  color: var(--text-disabled);
}

.feature-title {
  color: var(--title-primary);
  font-size: 1.3em;
  margin: 0.5em 0;
}

.feature-title.future-title {
  color: var(--text-disabled);
}

.feature-content {
  flex: 1;
  margin: 1em 0;
}

.feature-loading,
.feature-error,
.feature-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 2em;
  text-align: center;
  color: var(--text-secondary);
}

.error-icon-small {
  color: var(--error);
  font-size: 1.2em;
}

.empty-icon-small {
  color: var(--text-disabled);
  font-size: 2em;
}

.post-preview-title {
  color: var(--title-secondary);
  font-size: 1.1em;
  margin-bottom: 0.75em;
  line-height: 1.4;
}

.post-preview-meta {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.75em;
  font-size: 0.85em;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3em;
}

.meta-icon-small {
  font-size: 0.8em;
  color: var(--primary);
}

.separator-dot {
  color: var(--border);
}

.post-preview-excerpt {
  color: var(--text-primary);
  font-size: 0.9em;
  line-height: 1.6;
  margin-bottom: 1em;
}

.post-preview-tags {
  display: flex;
  gap: 0.3em;
  flex-wrap: wrap;
}

.more-tags {
  font-size: 0.75em;
  color: var(--text-secondary);
  padding: 0.15em 0.3em;
  background: var(--inner-surface);
  border-radius: 4px;
}

.future-card {
  opacity: 0.8;
  background: var(--surface-secondary);
  border-style: dashed;
}

.future-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  padding: 1.5em;
  text-align: center;
  color: var(--text-disabled);
}

.future-main-icon {
  font-size: 3em;
  color: var(--border);
}

.feature-footer {
  display: flex;
  justify-content: flex-end;
}

.badge-icon {
  margin-right: 0.25em;
}

.btn-icon {
  margin-right: 0.5em;
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

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .home {
    margin-top: 2em;
    padding: 0.1em;
    gap: 1em;
  }

  .hero-card,
  .today-date,
  .features-section {
    width: 95dvw;
  }

  .hero-content {
    padding: 1em;
  }

  .hero-img {
    margin-left: -2em;
  }

  .title {
    font-size: 2.5em;
  }

  .features-title {
    font-size: 1.2em;
  }

  .features-description {
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .home {
    padding: 0.25em;
  }

  .hero-content {
    padding: 0.5em;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .post-preview-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25em;
  }

  .separator-dot {
    display: none;
  }
}
</style>
