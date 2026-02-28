<template>
  <div class="blog-post">
    <Card v-if="loading" class="loading-card">
      <div class="loading-content">
        <Loading size="large" />
        <p>{{ $t('blog.loadingPost') }}</p>
      </div>
    </Card>

    <Card v-else-if="error" class="error-card">
      <div class="error-content">
        <OhVueIcon name="hi-exclamation-circle" class="error-icon" />
        <h2>{{ $t('blog.errorLoadingPost') }}</h2>
        <p>{{ error }}</p>
        <Button variant="primary" @click="fetchPost">{{ $t('blog.retry') }}</Button>
        <Button @click="$router.push('/blog')">{{ $t('blog.backToBlog') }}</Button>
      </div>
    </Card>

    <template v-else-if="post">
      <Card class="post-card">
        <template #header>
          <Button variant="secondary" size="small" @click="$router.push('/blog')">
            <OhVueIcon name="fa-chevron-circle-left" class="btn-icon" />
            {{ $t('common.back') }}
          </Button>
        </template>

        <article>
          <h1>{{ post.title }}</h1>

          <div class="post-meta">
            <span v-if="post.author">{{ post.author }}</span>
            <span v-if="post.published">{{ formatDate(post.published) }}</span>
            <span v-if="readingTime">{{ readingTime }} {{ $t('blog.minRead', { minutes: '' }) }}</span>
          </div>

          <div class="post-content" v-html="post.content"></div>
        </article>
      </Card>

      <Card class="comments-card">
        <template #header>
          <h3>{{ $t('blog.tags') }} ({{ comments.length }})</h3>
        </template>

        <div v-if="commentsLoading" class="comments-loading">
          <Loading size="md" :text="$t('blog.loadingComments')" />
        </div>

        <div v-else-if="commentsError" class="comments-error">
          <Alert type="error">
            <OhVueIcon name="hi-exclamation-circle" />
            {{ commentsError }}
          </Alert>
          <Button @click="fetchComments" size="small">{{ $t('blog.retry') }}</Button>
        </div>

        <div v-else-if="comments.length" class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <strong>{{ comment.author_name }}</strong>
              <small>{{ formatDate(comment.created_at) }}</small>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>

        <div v-else class="no-comments">
          <p>{{ $t('blog.beFirstToComment') }}</p>
        </div>

        <div class="comment-form">
          <h4>{{ $t('blog.leaveComment') }}</h4>
          <form @submit.prevent="submitComment">
            <Input
              v-model="form.name"
              :label="$t('blog.name') + ' *'"
              :placeholder="$t('blog.yourName')"
              :error="formErrors.name"
              required
            />
            <Input
              v-model="form.email"
              :label="$t('blog.email')"
              type="email"
              :placeholder="$t('blog.yourEmail')"
              :error="formErrors.email"
            />
            <Textarea
              v-model="form.content"
              :label="$t('blog.comment') + ' *'"
              :placeholder="$t('blog.writeComment')"
              :rows="4"
              :maxlength="4000"
              show-counter
              :error="formErrors.content"
              required
            />
            <Button
              type="submit"
              variant="primary"
              :loading="submitting"
              :disabled="submitting"
            >
              {{ $t('blog.publishComment') }}
            </Button>
          </form>
        </div>
      </Card>
    </template>

    <Card v-else class="not-found-card">
      <h2>{{ $t('blog.postNotFound') }}</h2>
      <Button @click="$router.push('/blog')">{{ $t('blog.backToBlog') }}</Button>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { supabase } from '@/lib/supabase'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'
import { OhVueIcon } from '@/plugins/icons'

const route = useRoute()
const router = useRouter()
const languageStore = useLanguageStore()
const postId = route.params.slug

// Estados
const post = ref(null)
const loading = ref(true)
const error = ref(null)
const comments = ref([])
const commentsLoading = ref(false)
const commentsError = ref(null)

// Form
const form = ref({ name: '', email: '', content: '' })
const formErrors = ref({ name: '', email: '', content: '' })
const submitting = ref(false)

const readingTime = computed(() => {
  if (!post.value?.content) return 0
  const text = post.value.content.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).filter(w => w.length > 0).length
  return Math.ceil(words / 200) || 1
})

const fetchPost = async () => {
  try {
    loading.value = true
    error.value = null

    const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY
    const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID

    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${postId}?key=${API_KEY}`
    const res = await fetch(url)

    if (!res.ok) throw new Error(res.status === 404 ? 'Post não encontrado' : 'Erro ao carregar')

    const data = await res.json()
    post.value = {
      id: data.id,
      title: data.title,
      content: data.content,
      published: data.published,
      author: data.author?.displayName,
      labels: data.labels || []
    }

    await fetchComments()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const fetchComments = async () => {
  try {
    commentsLoading.value = true
    commentsError.value = null

    const { data, error: err } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .is('parent_id', null)
      .eq('is_approved', true)
      .order('created_at', { ascending: true })

    if (err) throw err
    comments.value = data || []
  } catch (err) {
    commentsError.value = err.message
  } finally {
    commentsLoading.value = false
  }
}

const submitComment = async () => {
  formErrors.value = {}
  if (!form.value.name.trim()) formErrors.value.name = 'Nome obrigatório'
  if (!form.value.email.trim() || !/^[^\s@]+@[^\s@]+$/.test(form.value.email)) {
    formErrors.value.email = 'Email inválido'
  }
  if (!form.value.content.trim()) formErrors.value.content = 'Comentário obrigatório'

  if (Object.values(formErrors.value).some(e => e)) return

  submitting.value = true
  try {
    const { error: err } = await supabase.from('comments').insert({
      post_id: postId,
      author_name: form.value.name.trim().substring(0, 100),
      author_email: form.value.email.trim().toLowerCase(),
      content: form.value.content.trim().substring(0, 4000),
      is_approved: false
    })

    if (err) throw err

    form.value = { name: '', email: '', content: '' }
    alert('Comentário enviado, se aprovado logo aparecerá!')
    await fetchComments()
  } catch (err) {
    alert('Erro: ' + err.message)
  } finally {
    submitting.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString(languageStore.currentLanguage, {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

onMounted(fetchPost)
</script>

<style scoped>
.blog-post {
  max-width: 1200px;
  width: 80dvw;
  margin: 3em auto;
}

.post-card, .comments-card {
  background-color: var(--surface-primary);
}

.post-header {
  margin-bottom: 1em;
}

.post-title-section {
  margin-bottom: 1.5em;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 2em;
  margin-bottom: 2em;
  padding: 0.75em 1.5em;
  background: var(--sky-blue-surface);
  border-radius: 8px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: var(--text-secondary);
  font-size: 0.95em;
}

.meta-icon {
  font-size: 1em;
  color: var(--primary);
}

.post-content {
  line-height: 1.8;
  font-size: 1.1em;
  margin-bottom: 2em;
}

.post-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.post-update {
  margin: 2rem 0;
}

.update-icon {
  margin-right: 0.5rem;
}

.post-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-badges {
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
}

.footer-label {
  font-weight: 600;
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.clickable-badge {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-badge:hover {
  transform: translateY(-2px);
}

.comments-card {
  margin-top: 2rem;
}

.comments-header {
  margin-bottom: 1rem;
}

.comments-header h3 {
  color: var(--title-primary);
  margin: 0;
}

.comments-section {
  padding: 1rem 0;
}

.comments-loading,
.comments-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.comment-item {
  border-bottom: 1px solid var(--border);
  padding-bottom: 1.5rem;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  margin-bottom: 1rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 1.5rem;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.1em;
}

.comment-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.comment-content {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
  padding-left: 4rem;
  white-space: pre-wrap;
}

.comment-footer {
  padding-left: 4rem;
}

.reply-form {
  margin: 1rem 0 1rem 4rem;
  padding: 1rem;
  background: var(--inner-surface);
  border-radius: 8px;
}

.replies-list {
  margin-top: 1rem;
  margin-left: 4rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border);
}

.reply-item {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--inner-surface);
  border-radius: 8px;
}

.reply-header {
  margin-bottom: 0.5rem;
}

.reply-author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.reply-avatar {
  font-size: 1rem;
  color: var(--primary);
}

.reply-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.reply-content {
  color: var(--text-primary);
  line-height: 1.5;
  font-size: 0.95em;
  white-space: pre-wrap;
  padding-left: 1.5rem;
}

.no-comments {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--inner-surface);
  border-radius: 12px;
  margin-bottom: 3rem;
}

.no-comments-icon {
  font-size: 3rem;
  color: var(--title-secondary);
  margin-bottom: 1rem;
}

.no-comments h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.no-comments p {
  color: var(--text-secondary);
}

.new-comment-form {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border);
}

.new-comment-form h4 {
  color: var(--title-primary);
  margin-bottom: 1.5rem;
  font-size: 1.2em;
}

.form-row {
  margin-bottom: 1.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0 1rem;
}

.feedback-alert {
  margin-top: 1rem;
}

.alert-icon {
  margin-right: 0.5rem;
}

.btn-icon {
  margin-right: 0.5rem;
}

.loading-card,
.error-card,
.not-found-card {
  text-align: center;
  padding: 4em 2em;
}

.loading-content,
.error-content,
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
}

.error-icon,
.not-found-icon {
  color: var(--title-secondary);
  margin-bottom: 1em;
  font-size: 4em;
}

.error-icon {
  color: var(--error);
}

.error-actions,
.not-found-actions {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1em;
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .blog-post {
    width: 95dvh;
    padding: 0.5em;
  }

  .post-title-section h1 {
    font-size: 2em;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75em;
    padding: 1em;
  }

  .post-content {
    font-size: 1em;
  }

  .comment-content,
  .comment-footer,
  .reply-form,
  .replies-list {
    padding-left: 0;
    margin-left: 0;
  }

  .reply-form {
    margin-left: 0;
  }

  .replies-list {
    margin-left: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .comment-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .reply-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .post-meta {
    gap: 0.5em;
  }

  .comment-author {
    flex-wrap: wrap;
  }

  .author-avatar {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .comment-footer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
