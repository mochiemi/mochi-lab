<template>
  <div class="blog-post">
    <Card v-if="post" :padding="'large'">
      <template #header>
        <div class="post-header">
          <Button 
            variant="secondary" 
            size="small"
            @click="$router.push('/blog')"
            class="back-button"
          >
            <OhVueIcon name="fa-chevron-circle-left" class="btn-icon" />
            {{$t('blog.backToPosts')}}
          </Button>
        </div>
      </template>

      <article>
        <div class="post-title-section">
          <h1>{{ post.title }}</h1>
          <div class="post-badges">
            <Badge v-if="post.featured" variant="primary">
              <OhVueIcon name="oi-star" class="badge-icon" />
              {{$t('common.featured')}}
            </Badge>
          </div>
        </div>

        <div class="post-meta">
          <div class="meta-item">
            <OhVueIcon name="oi-person" class="meta-icon" />
            <span>{{ $t('blog.by', { author: post.author }) }}</span>
          </div>
          <div class="meta-item">
            <OhVueIcon name="bi-calendar-heart" class="meta-icon" />
            <span>{{ formatDate(post.date) }}</span>
          </div>
          <div class="meta-item">
            <OhVueIcon name="hi-clock" class="meta-icon" />
            <span>{{ $t('blog.minRead', { minutes: readingTime }) }}</span>
          </div>
        </div>

        <div class="post-content">
          <p 
            v-for="(paragraph, index) in contentParagraphs" 
            :key="index"
            class="content-paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </article>

      <template #footer>
        <div class="post-footer">
          <Button 
            variant="primary"
            size="small"
            @click="$router.push('/blog')"
          >
            <OhVueIcon name="hi-arrow-left" class="btn-icon" />
            {{$t('blog.backToBlog')}}
          </Button>
          <div class="action-buttons">
            <Button variant="outline" size="small" @click="likePost">
              <OhVueIcon name="fa-regular-heart" class="btn-icon" />
              {{$t('blog.like')}} ({{ likes }})
            </Button>
            <Button variant="outline" size="small" @click="sharePost">
              <OhVueIcon name="ri-share-forward-line" class="btn-icon" />
              {{$t('blog.share')}}
            </Button>
          </div>
        </div>
      </template>
    </Card>

    <!-- Loading State -->
    <Card v-else-if="loading" class="loading-card">
      <div class="loading-content">
        <Loading size="large" />
        <p>{{ $t('blog.loadingPost') }}</p>
      </div>
    </Card>

    <!-- Error State -->
    <Card v-else-if="error" class="error-card">
      <div class="error-content">
        <OhVueIcon name="hi-exclamation-circle" class="error-icon" />
        <h2>{{ $t('blog.errorLoadingPost') }}</h2>
        <p>{{ error }}</p>
        <div class="error-actions">
          <Button variant="primary" @click="fetchPost">
            <OhVueIcon name="hi-refresh" class="btn-icon" />
            {{ $t('blog.retry') }}
          </Button>
          <Button @click="$router.push('/blog')">
            <OhVueIcon name="oi-home" class="btn-icon" />
            {{$t('blog.backToPosts')}}
          </Button>
        </div>
      </div>
    </Card>

    <!-- Not Found State -->
    <Card v-else class="not-found-card">
      <div class="not-found">
        <OhVueIcon name="gi-cat" class="not-found-icon" />
        <h2>{{$t('blog.postNotFound')}}</h2>
        <p>{{$t('blog.postNotFoundDesc') }}</p>
        <div class="not-found-actions">
          <Button 
            variant="primary" 
            @click="$router.push('/blog')"
          >
            <OhVueIcon name="oi-arrow-left" class="btn-icon" />
            {{$t('blog.backToPosts')}}
          </Button>
          <Button 
            @click="$router.push('/')"
          >
            <OhVueIcon name="oi-home" class="btn-icon" />
            {{$t('common.backToHome')}}
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Loading from '@/components/ui/Loading.vue';
import { OhVueIcon } from 'oh-vue-icons';
import { useLanguageStore } from '@/stores/language.ts';

const languageStore = useLanguageStore();
const currentLanguage = computed(() => languageStore.currentLanguage);

const route = useRoute();
const postSlug = route.params.slug;

const post = ref(null);
const loading = ref(true);
const error = ref(null);
const likes = ref(0);

// Extract post ID from slug (post-1, post-2, etc.)
const extractPostId = (slug) => {
  const match = slug.match(/post-(\d+)/);
  return match ? parseInt(match[1]) : null;
};

const postId = extractPostId(postSlug);

const fetchPost = async () => {
  if (!postId) {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    
    if (!response.ok) {
      throw new Error('Post not found');
    }

    const apiPost = await response.json();
    
    // Transform API data to match our structure
    post.value = {
      id: apiPost.id,
      slug: `post-${apiPost.id}`,
      title: apiPost.title.charAt(0).toUpperCase() + apiPost.title.slice(1),
      content: apiPost.body,
      excerpt: apiPost.body.substring(0, 100) + '...',
      date: new Date(2024, 0, apiPost.id).toISOString().split('T')[0],
      author: `Author ${apiPost.userId}`,
      featured: apiPost.id % 5 === 0
    };

    // Load likes from localStorage
    const savedLikes = localStorage.getItem(`post-${postId}-likes`);
    likes.value = savedLikes ? parseInt(savedLikes) : 0;

  } catch (err) {
    error.value = err.message;
    console.error('Error fetching post:', err);
  } finally {
    loading.value = false;
  }
};

const contentParagraphs = computed(() => {
  return post.value ? post.value.content.split('\n').filter(p => p.trim()) : [];
});

const readingTime = computed(() => {
  if (!post.value) return 0;
  const wordsPerMinute = 100;
  const wordCount = post.value.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(currentLanguage.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const likePost = () => {
  likes.value++;
  localStorage.setItem(`post-${postId}-likes`, likes.value.toString());
};

const sharePost = () => {
  if (navigator.share) {
    navigator.share({
      title: post.value.title,
      text: post.value.excerpt,
      url: window.location.href,
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
.blog-post {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.post-header {
  margin-bottom: 1rem;
}

.back-button {
  margin-bottom: 1rem;
}

.post-title-section {
  margin: -0.5rem -2rem 1rem -2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.post-title-section h1 {
  color: var(--title-primary);
  font-size: 2.5rem;
  margin: 0;
  line-height: 1.2;
  text-shadow: none;
  text-align: center;
}

.post-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge-icon {
  margin-right: 0.25rem;
}

.post-meta {
  display: flex;
  justify-content: space-evenly;
  gap: 2rem;
  margin: 0.5rem -3.5rem;
  padding: 0.5rem 1rem;
  height: 3rem;
  background: var(--inner-surface);
  border-radius: 8px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 1rem;
}

.meta-icon {
  font-size: 0.9rem;
}

.post-content {
  line-height: 1.8;
  font-size: 1.1rem;
}

.content-paragraph {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  min-width: 300px;
}

.loading-card,
.error-card,
.not-found-card {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-content,
.error-content,
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon,
.not-found-icon {
  color: var(--title-secondary);
  margin-bottom: 1rem;
  transform: scale(3);
}

.error-icon {
  color: var(--error);
}

.error-actions,
.not-found-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.not-found h2 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.not-found p {
  color: var(--text-primary);
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.btn-icon {
  margin-right: 0.5rem;
}

.action-buttons .btn-icon{
  margin-right: 0.2rem;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .blog-post {
    padding: 0.5rem;
  }
  
  .post-title-section h1 {
    font-size: 2rem;
  }
  
  .post-meta {
    gap: 0.8rem;
    margin: 0.5rem -1rem;
  }

  .meta-item {
    font-size: 0.9rem;
  }
  
  .post-footer {
    flex-direction: column-reverse;
    align-items: center;
  }
  
  .action-buttons {
    justify-content: center;
    min-width: auto;
  }
  
  .error-actions,
  .not-found-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .post-title-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .post-meta {
    flex-direction: column;
    height: auto;
    gap: 0.5rem;
  }
}
</style>