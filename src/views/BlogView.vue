<template>
  <div class="container">
    <Card class="hero-card" :flat="true">
      <template #header>
        <h1>{{ $t('blog.title') }}</h1>
        <p class="hero-subtitle">{{ $t('blog.description') }}</p>
        <p class="hero-subtitle2">{{ $t('blog.description2') }}</p>
      </template>
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
          <Button @click="fetchPosts(currentPage)" variant="primary">
            <OhVueIcon name="hi-refresh" class="btn-icon" />
            {{ $t('blog.retry') }}
          </Button>
        </div>
      </Card>
    </div>

    <div v-else class="posts-grid">
      <Card 
        v-for="post in posts" 
        :key="post.id" 
        class="post-card"
        :clickable="true"
        @click="$router.push(`/post/${post.slug}`)"
      >
        <template #header>
          <div class="post-header">
            <h3 class="post-title">{{ post.title }}</h3>
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
            <span>{{ formatDate(post.date) }}</span>
          </div>
          <span class="separator">•</span>
          <div class="meta-item">
            <OhVueIcon name="hi-clock" class="icon" />
            <span>{{ $t('blog.minRead', { minutes: post.readingTime }) }}</span>
          </div>
        </div>

        <p class="post-excerpt">{{ post.excerpt }}</p>

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


    <div v-if="!loading && !error && posts.length === 0" class="no-posts">
      <Card>
        <div class="no-posts-content">
          <OhVueIcon name="gi-cat" class="no-posts-icon" />
          <h3>{{ $t('blog.noPosts') }}</h3>
          <p>{{ $t('blog.noPostsDesc') }}</p>
        </div>
      </Card>
    </div>


    <div v-if="!loading && !error && totalPages > 1" class="pagination">
      <Button 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        variant="outline"
        size="small"
      >
        <OhVueIcon name="fa-chevron-circle-left" class="btn-icon" />
        {{ $t('blog.previous') }}
      </Button>

      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['page-btn', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
        
        <span v-if="showEllipsis" class="ellipsis">...</span>
        
        <button
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          :class="['page-btn', { active: totalPages === currentPage }]"
        >
          {{ totalPages }}
        </button>
      </div>

      <Button 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        variant="outline"
        size="small"
      >
        {{ $t('blog.next') }}
        <OhVueIcon name="fa-chevron-circle-right" class="btn-icon" />
      </Button>
    </div>


    <div v-if="!loading && !error && posts.length > 0" class="page-info">
      {{ $t('blog.showingPosts', { 
        start: startItem, 
        end: endItem, 
        total: totalPosts 
      }) }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useLanguageStore } from '@/stores/language.ts';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Loading from '@/components/ui/Loading.vue';
import { OhVueIcon } from 'oh-vue-icons';

const languageStore = useLanguageStore();
const currentLanguage = computed(() => languageStore.currentLanguage);


const currentPage = ref(1);
const postsPerPage = ref(6);
const totalPosts = ref(0);
const posts = ref([]);
const loading = ref(true);
const error = ref(null);


const totalPages = computed(() => {
  return Math.ceil(totalPosts.value / postsPerPage.value);
});

const startItem = computed(() => {
  return (currentPage.value - 1) * postsPerPage.value + 1;
});

const endItem = computed(() => {
  const end = currentPage.value * postsPerPage.value;
  return end > totalPosts.value ? totalPosts.value : end;
});


const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

const showEllipsis = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1;
});

const showLastPage = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < totalPages.value;
});


const calculateReadingTime = (content) => {
  const wordsPerMinute = 100;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};


const fetchPosts = async (page = 1) => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${postsPerPage.value}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    

    const totalCount = response.headers.get('x-total-count');
    totalPosts.value = totalCount ? parseInt(totalCount) : 100;
    
    const apiPosts = await response.json();
    

    posts.value = apiPosts.map(post => {
      const readingTime = calculateReadingTime(post.body);
      
      return {
        id: post.id,
        slug: `post-${post.id}`,
        title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
        excerpt: post.body.substring(0, 120) + '...',
        content: post.body,
        date: new Date(2024, 0, post.id).toISOString().split('T')[0],
        author: `Author ${post.userId}`,
        featured: post.id % 5 === 0,
        readingTime: readingTime
      };
    });
    
    currentPage.value = page;
    
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching posts:', err);
  } finally {
    loading.value = false;
  }
};


const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  fetchPosts(1);
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(currentLanguage.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-card {
  text-align: center;
  margin-bottom: 3rem;
  background: var(--gradient-primary);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin: 0;
  color: var(--text-primary);
}

.hero-subtitle2 {
  font-size: 1rem;
  opacity: 0.9;
  color: var(--text-primary);
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
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.7rem;
}

.post-title {
  color: var(--title-primary);
  margin: 0;
  flex: 1;
  margin-right: 1rem;
  font-size: 1.3rem;
  line-height: 1.4;
}

.post-meta {
  color: var(--text-secondary);
  background-color: var(--inner-surface);
  font-size: 0.9rem;
  margin: 0.5rem -1rem;
  display: flex;
  align-items: center;
  padding: 0.3rem 1.5rem;
  gap: 0.5rem;
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

.page-numbers {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 3rem;
}

.page-btn:hover:not(.active) {
  background: var(--inner-surface);
  border-color: var(--primary);
}

.page-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ellipsis {
  padding: 0.5rem;
  color: var(--text-secondary);
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
  
  .page-numbers {
    order: -1;
  }
  
  .page-btn {
    padding: 0.4rem 0.8rem;
    min-width: 2.5rem;
  }
  
  .post-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .post-title {
    margin-right: 0;
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