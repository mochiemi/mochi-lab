<template>
  <div class="container">
    <Card class="hero-card" :flat="true">
      <template #header>
        <h1>{{ $t('blog.title') }}</h1>
        <img class="hero-img" src="../assets/images/mochipuyu-blog.png" alt="Happy Puyu with a laptop and coffee" />
        <p class="hero-subtitle">{{ $t('blog.description') }}</p>
        <p class="hero-subtitle2">{{ $t('blog.description2') }}</p>
      </template>
    </Card>

    <Card v-if="availableTags.length > 0" class="tags-filter-card">
      <div class="tags-filter">
        <span class="filter-label">{{ $t('blog.filterByTags') }}</span>
        <div class="tags-list">
          <Badge
            v-for="tag in availableTags"
            :key="tag"
            :variant="selectedTags.includes(tag) ? 'primary' : 'secondary'"
            @click="toggleTag(tag)"
            class="clickable-badge"
          >
            {{ tag }}
          </Badge>
          <Button
            v-if="selectedTags.length > 0"
            variant="secondary"
            size="small"
            @click="clearFilters"
          >
            <OhVueIcon name="oi-x-circle" class="btn-icon" />
            {{ $t('blog.clearFilters') }}
          </Button>
        </div>
      </div>
    </Card>

    <div v-if="loading" class="loading-state">
      <Card>
        <div class="loading-content">
          <Loading size="large" />
          <p>{{ $t('blog.loading') }}</p>
        </div>
      </Card>
    </div>

    <div v-else-if="error" class="error-state">
      <Card>
        <div class="error-content">
          <OhVueIcon name="hi-exclamation-circle" class="error-icon" />
          <h3>{{ $t('blog.errorTitle') }}</h3>
          <p>{{ error }}</p>
          <Button @click="fetchPosts()" variant="primary">
            <OhVueIcon name="hi-refresh" class="btn-icon" />
            {{ $t('blog.retry') }}
          </Button>
        </div>
      </Card>
    </div>

    <div v-else class="posts-grid">
      <Card
        v-for="post in filteredPosts"
        :key="post.id"
        class="post-card"
        :clickable="true"
        @click="$router.push(`/post/${post.id}`)"
      >
        <template #header>
          <div class="post-header">
            <h3 class="post-title" v-html="post.title"></h3>
            <Badge v-if="post.featured" variant="primary">
              <OhVueIcon name="oi-star" class="badge-icon" />
              {{ $t('common.featured') }}
            </Badge>
          </div>
        </template>

        <div class="post-meta">
          <div class="meta-item">
            <OhVueIcon name="oi-person" class="icon" />
            <span>{{ post.author }}</span>
          </div>
          <span class="separator">•</span>
          <div class="meta-item">
            <OhVueIcon name="bi-calendar-heart" class="icon" />
            <span>{{ formatDate(post.published) }}</span>
          </div>
          <span class="separator">•</span>
          <div class="meta-item">
            <OhVueIcon name="hi-clock" class="icon" />
            <span>{{ $t('blog.minRead', { minutes: post.readingTime }) }}</span>
          </div>
        </div>

        <div class="post-excerpt" v-html="post.excerpt"></div>

        <div class="post-tags" v-if="post.labels && post.labels.length > 0">
          <Badge
            v-for="label in post.labels.slice(0, 3)"
            :key="label"
            variant="secondary"
            size="small"
            @click.stop="filterByTag(label)"
            class="tag-badge"
          >
            {{ label }}
          </Badge>
          <span v-if="post.labels.length > 3" class="more-tags">
            +{{ post.labels.length - 3 }}
          </span>
        </div>

        <template #footer>
          <div class="post-footer">
            <Button variant="outline" size="small">
              {{ $t('blog.readMore') }}
              <OhVueIcon name="fa-chevron-circle-right" class="btn-icon" />
            </Button>
          </div>
        </template>
      </Card>
    </div>

    <div v-if="!loading && !error && filteredPosts.length === 0" class="no-posts">
      <Card>
        <div class="no-posts-content">
          <OhVueIcon name="gi-cat" class="no-posts-icon" />
          <h3>{{ $t('blog.noPosts') }}</h3>
          <p>{{ selectedTags.length > 0 ? $t('blog.noPostsForTags') : $t('blog.noPostsDesc') }}</p>
          <Button v-if="selectedTags.length > 0" @click="clearFilters" variant="primary">
            {{ $t('blog.clearFilters') }}
          </Button>
        </div>
      </Card>
    </div>

    <div v-if="!loading && !error && (prevPageToken || nextPageToken)" class="pagination">
      <Button
        :disabled="!prevPageToken"
        @click="goToPage('prev')"
        variant="outline"
        size="small"
      >
        <OhVueIcon name="fa-chevron-circle-left" class="btn-icon" />
        {{ $t('blog.previous') }}
      </Button>

      <div class="page-info">
        {{ $t('blog.showingPosts', {
          start: startItem,
          end: endItem,
          total: filteredTotalPosts
        }) }}
      </div>

      <Button
        :disabled="!nextPageToken"
        @click="goToPage('next')"
        variant="outline"
        size="small"
      >
        {{ $t('blog.next') }}
        <OhVueIcon name="fa-chevron-circle-right" class="btn-icon" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/language';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Loading from '@/components/ui/Loading.vue';
import { OhVueIcon } from '@/plugins/icons';

const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;
const POSTS_PER_PAGE = 6;

const route = useRoute();
const router = useRouter();
const languageStore = useLanguageStore();

const posts = ref([]);
const allPosts = ref([]);
const loading = ref(true);
const error = ref(null);
const totalPosts = ref(0);
const filteredTotalPosts = ref(0);
const nextPageToken = ref(null);
const prevPageToken = ref(null);
const currentPageTokens = ref([]);
const selectedTags = ref([]);
const availableTags = ref([]);

const initTagsFromUrl = () => {
  const tagParam = route.query.tag;
  if (tagParam) {
    selectedTags.value = [decodeURIComponent(tagParam)];
  } else {
    selectedTags.value = [];
  }
};

const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) {
    filteredTotalPosts.value = posts.value.length;
    return posts.value;
  }

  const filtered = posts.value.filter(post =>
    post.labels && selectedTags.value.every(tag => post.labels.includes(tag))
  );
  filteredTotalPosts.value = filtered.length;
  return filtered;
});

const extractAvailableTags = (postsList) => {
  const tags = new Set();
  postsList.forEach(post => {
    if (post.labels && post.labels.length > 0) {
      post.labels.forEach(tag => tags.add(tag));
    }
  });
  availableTags.value = Array.from(tags).sort();
};

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }

  updateUrlWithTags();
};

const filterByTag = (tag) => {
  selectedTags.value = [tag];
  updateUrlWithTags();
};

const clearFilters = () => {
  selectedTags.value = [];
  updateUrlWithTags();
};

const updateUrlWithTags = () => {
  const query = { ...route.query };
  if (selectedTags.value.length === 1) {
    query.tag = encodeURIComponent(selectedTags.value[0]);
  } else {
    delete query.tag;
  }
  router.replace({ query });
};

const startItem = computed(() => {
  return (currentPageTokens.value.length * POSTS_PER_PAGE) + 1;
});

const endItem = computed(() => {
  return Math.min(startItem.value + posts.value.length - 1, totalPosts.value);
});

const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const calculateReadingTime = (htmlContent) => {
  const text = stripHtml(htmlContent);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const fetchPosts = async (pageToken = null) => {
  try {
    loading.value = true;
    error.value = null;

    let url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=${POSTS_PER_PAGE}`;

    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Falha ao buscar posts');
    }

    const data = await response.json();

    const mappedPosts = data.items.map(item => {
      const plainTextExcerpt = stripHtml(item.content).substring(0, 200);

      return {
        id: item.id,
        title: item.title,
        content: item.content,
        excerpt: plainTextExcerpt + (plainTextExcerpt.length >= 200 ? '...' : ''),
        published: item.published,
        updated: item.updated,
        author: item.author?.displayName || 'Mochi Lab',
        authorId: item.author?.id,
        authorImage: item.author?.image?.url,
        authorUrl: item.author?.url,
        url: item.url,
        labels: item.labels || [],
        featured: item.labels?.includes('Destaque') || item.labels?.includes('Featured'),
        readingTime: calculateReadingTime(item.content),
        repliesCount: item.replies?.totalItems || 0
      };
    });

    posts.value = mappedPosts;
    allPosts.value = mappedPosts;

    extractAvailableTags(mappedPosts);

    totalPosts.value = data.totalItems;
    nextPageToken.value = data.nextPageToken;

    if (pageToken) {
      if (!currentPageTokens.value.includes(pageToken)) {
        currentPageTokens.value.push(pageToken);
      }
    } else {
      currentPageTokens.value = [];
    }

    const currentIndex = currentPageTokens.value.indexOf(pageToken);
    prevPageToken.value = currentIndex > 0 ? currentPageTokens.value[currentIndex - 1] : null;

  } catch (err) {
    error.value = err.message;
    console.error('Erro ao buscar posts:', err);
  } finally {
    loading.value = false;
  }
};

const goToPage = (direction) => {
  if (direction === 'next' && nextPageToken.value) {
    fetchPosts(nextPageToken.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (direction === 'prev' && prevPageToken.value) {
    fetchPosts(prevPageToken.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(languageStore.currentLanguage, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

watch(() => route.query.tag, (newTag) => {
  if (newTag) {
    selectedTags.value = [decodeURIComponent(newTag)];
  } else {
    selectedTags.value = [];
  }
});

onMounted(() => {
  initTagsFromUrl();
  fetchPosts();
});

</script>

<style scoped>
.container {
  max-width: 1200px;
  width: 85dvw;
  margin: 3em auto;
  padding: 2rem;
}

.hero-card {
  text-align: center;
  margin-bottom: 2em;
  background: var(--rose-surface);
}

.hero-img {
  max-width: 480px;
  width: 30%;
}

.hero-subtitle {
  font-size: 1.2em;
  margin: 0;
  color: var(--text-primary);
}

.hero-subtitle2 {
  font-size: 1em;
  opacity: 0.9;
  color: var(--text-primary);
}

.tags-filter-card {
  margin-bottom: 1.5em;
  background-color: var(--sky-blue-surface);
}

.tags-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.tags-list {
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
  flex: 1;
}

.clickable-badge {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-badge:hover {
  transform: translateY(-2px);
  border-color: white;
  background-color: var(--dark-rose);
  color: white;
}

.loading-state,
.error-state,
.no-posts {
  margin: 2rem 0;
}

.loading-content,
.error-content,
.no-posts-content {
  text-align: center;
  padding: 3rem 2rem;
}

.error-icon,
.no-posts-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--title-secondary);
}

.error-icon {
  color: var(--error);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.post-card {
  height: 100%;
  transition: all 0.3s ease;
  background-color: var(--surface-primary);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.7em;
}

.post-title {
  color: var(--title-primary);
  margin: 0;
  flex: 1;
  margin-right: 1em;
  font-size: 1.3em;
  line-height: 1.4;
}

.post-meta {
  color: var(--text-secondary);
  background-color: var(--sky-blue-surface);
  font-size: 0.9em;
  display: flex;
  align-items: center;
  padding: 0.3em 1.5em;
  gap: 0.5em;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.separator {
  opacity: 0.5;
}

.icon {
  font-size: 0.8rem;
}

.post-excerpt {
  color: var(--text-primary);
  line-height: 1.6;
  margin: 1rem 0;
}

.post-tags {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  margin: 0.5rem 0;
}

.tag-badge {
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.tag-badge:hover {
  transform: translateY(-2px);
}

.more-tags {
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding: 0.2rem 0.5rem;
  background: var(--inner-surface);
  border-radius: 4px;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.page-info {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.btn-icon {
  margin: 0 0.5rem;
}

.badge-icon {
  margin-right: 0.25rem;
}

@media (max-width: 768px) {

  .hero-img {
    width: 45%;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 1rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .post-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .post-title {
    margin-right: 0;
  }

  .tags-filter {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0.8rem;
  }

  .post-meta {
    flex-direction: column;
    gap: 0.3rem;
    align-items: flex-start;
  }

  .separator {
    display: none;
  }
}
</style>
