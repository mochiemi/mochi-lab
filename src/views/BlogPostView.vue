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
            {{ $t('blog.backToPosts') }}
          </Button>
        </div>
      </template>

      <article>
        <div class="post-title-section">
          <h1 v-html="post.title"></h1>
        </div>

        <div class="post-meta">
          <div class="meta-item" v-if="post.author">
            <OhVueIcon name="oi-person" class="meta-icon" />
            <span>{{ post.author }}</span>
          </div>
          <div class="meta-item">
            <OhVueIcon name="bi-calendar-heart" class="meta-icon" />
            <span>{{ $t('blog.publishedOn') }} {{ formatDate(post.published) }}</span>
          </div>
          <div class="meta-item">
            <OhVueIcon name="hi-clock" class="meta-icon" />
            <span>{{ $t('blog.minRead', { minutes: readingTime }) }}</span>
          </div>
        </div>

        <!-- Conteúdo do post (HTML do Blogger) -->
        <div class="post-content" v-html="post.content"></div>

        <!-- Atualizações do post -->
        <div v-if="post.updated !== post.published" class="post-update">
          <Alert type="info" :dismissible="false">
            <OhVueIcon name="hi-pencil" class="update-icon" />
            <span>{{ $t('blog.updatedOn') }} {{ formatDate(post.updated) }}</span>
          </Alert>
        </div>
      </article>

      <template #footer>
        <div class="post-footer">
          <div class="post-badges" v-if="post.labels && post.labels.length > 0">
            <span class="footer-label">{{ $t('blog.tags') }}:</span>
            <Badge 
              v-for="label in post.labels" 
              :key="label"
              variant="secondary"
              @click="navigateToTag(label)"
              class="clickable-badge"
            >
              {{ label }}
            </Badge>
          </div>
        </div>
      </template>
    </Card>

    <!-- Seção de Comentários -->
    <Card v-if="post" class="comments-card">
      <template #header>
        <div class="comments-header">
          <h3>{{ $t('blog.comments') }} ({{ totalComments }})</h3>
        </div>
      </template>

      <!-- Lista de Comentários -->
      <div class="comments-section">
        <!-- Loading State -->
        <div v-if="commentsLoading" class="comments-loading">
          <Loading size="md" :text="$t('blog.loadingComments')" />
        </div>

        <!-- Error State -->
        <div v-else-if="commentsError" class="comments-error">
          <Alert type="error" :dismissible="false">
            <OhVueIcon name="hi-exclamation-circle" class="alert-icon" />
            <span>{{ $t('blog.errorLoadingComments') }}: {{ commentsError }}</span>
          </Alert>
          <Button @click="fetchComments" size="small" variant="secondary">
            <OhVueIcon name="hi-refresh" class="btn-icon" />
            {{ $t('blog.retry') }}
          </Button>
        </div>

        <!-- Comments List -->
        <div v-else-if="comments.length > 0" class="comments-list">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-header">
              <div class="comment-author">
                <div class="author-avatar">
                  <OhVueIcon name="oi-person" />
                </div>
                <div class="author-info">
                  <span class="author-name">{{ comment.author_name }}</span>
                  <span class="comment-date">{{ formatCommentDate(comment.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="comment-content">{{ comment.content }}</div>

            <!-- Botão Responder -->
            <div class="comment-footer">
              <Button 
                size="small" 
                variant="secondary"
                @click="toggleReplyForm(comment.id)"
              >
                <OhVueIcon name="fa-regular-comment-dots" class="btn-icon" />
                {{ $t('blog.reply') }}
              </Button>
            </div>

            <!-- Formulário de Resposta -->
            <div v-if="activeReplyForm === comment.id" class="reply-form">
              <form @submit.prevent="submitReply(comment.id)">
                <div class="form-row">
                  <Input
                    v-model="replyAuthorName"
                    :label="$t('blog.name') + ' *'"
                    :placeholder="$t('blog.yourName')"
                    :required="true"
                    :error="replyNameError"
                  />
                </div>
                <div class="form-row">
                  <Input
                    v-model="replyAuthorEmail"
                    :label="$t('blog.email') + ' *'"
                    type="email"
                    :placeholder="$t('blog.yourEmail')"
                    :required="true"
                    :error="replyEmailError"
                  />
                </div>
                <Textarea
                  v-model="replyText"
                  :placeholder="$t('blog.writeReply')"
                  :rows="3"
                  :maxlength="2000"
                  show-counter
                  :required="true"
                  :error="replyContentError"
                />
                
                <div class="form-actions">
                  <Button type="submit" size="small" variant="primary" :loading="submittingReply">
                    <OhVueIcon name="fa-regular-paper-plane" class="btn-icon" />
                    {{ $t('blog.sendReply') }}
                  </Button>
                  <Button 
                    type="button" 
                    size="small" 
                    variant="secondary"
                    @click="cancelReply"
                  >
                    {{ $t('common.cancel') }}
                  </Button>
                </div>
              </form>
            </div>

            <!-- Respostas -->
            <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
              <div 
                v-for="reply in comment.replies" 
                :key="reply.id"
                class="reply-item"
              >
                <div class="reply-header">
                  <div class="reply-author-info">
                    <OhVueIcon name="oi-person" class="reply-avatar" />
                    <span class="author-name">{{ reply.author_name }}</span>
                    <span class="reply-date">{{ formatCommentDate(reply.created_at) }}</span>
                  </div>
                </div>
                <div class="reply-content">{{ reply.content }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Comments -->
        <div v-else class="no-comments">
          <OhVueIcon name="fa-regular-comment" class="no-comments-icon" />
          <h3>{{ $t('blog.noComments') }}</h3>
          <p>{{ $t('blog.beFirstToComment') }}</p>
        </div>

        <!-- Formulário de Novo Comentário -->
        <div class="new-comment-form">
          <h4>{{ $t('blog.leaveComment') }}</h4>
          <form @submit.prevent="submitComment">
            <div class="form-row">
              <Input
                v-model="commentAuthorName"
                :label="$t('blog.name') + ' *'"
                :placeholder="$t('blog.yourName')"
                :required="true"
                :error="nameError"
              />
            </div>

            <div class="form-row">
              <Input
                v-model="commentAuthorEmail"
                :label="$t('blog.email') + ' *'"
                type="email"
                :placeholder="$t('blog.yourEmail')"
                :required="true"
                :error="emailError"
              />
            </div>

            <div class="form-row">
              <Input
                v-model="commentAuthorUrl"
                :label="$t('blog.website')"
                type="url"
                :placeholder="$t('blog.yourWebsite')"
              />
            </div>

            <div class="form-row">
              <Textarea
                v-model="commentText"
                :label="$t('blog.comment') + ' *'"
                :placeholder="$t('blog.writeComment')"
                :rows="5"
                :maxlength="4000"
                show-counter
                :required="true"
                :error="commentError"
              />
            </div>

            <div class="form-actions">
              <Button 
                type="submit" 
                variant="primary" 
                :loading="submittingComment"
                :disabled="submittingComment"
              >
                <OhVueIcon name="fa-regular-paper-plane" class="btn-icon" />
                {{ $t('blog.publishComment') }}
              </Button>
            </div>

            <!-- Mensagens de feedback -->
            <transition name="alert-fade">
              <Alert 
                v-if="commentSuccess" 
                type="success" 
                :dismissible="true"
                @dismiss="commentSuccess = false"
                class="feedback-alert"
              >
                <OhVueIcon name="oi-check" class="alert-icon" />
                {{ $t('blog.commentSent') }}
              </Alert>
            </transition>

            <transition name="alert-fade">
              <Alert 
                v-if="submitError" 
                type="error" 
                :dismissible="true"
                @dismiss="submitError = ''"
                class="feedback-alert"
              >
                <OhVueIcon name="hi-exclamation-circle" class="alert-icon" />
                {{ submitError }}
              </Alert>
            </transition>
          </form>
        </div>
      </div>
    </Card>

    <!-- Estados de Carregamento e Erro -->
    <Card v-else-if="loading" class="loading-card">
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
        <div class="error-actions">
          <Button variant="primary" @click="fetchPost">
            <OhVueIcon name="hi-refresh" class="btn-icon" />
            {{ $t('blog.retry') }}
          </Button>
          <Button @click="$router.push('/blog')">
            <OhVueIcon name="oi-arrow-left" class="btn-icon" />
            {{ $t('blog.backToPosts') }}
          </Button>
        </div>
      </div>
    </Card>

    <Card v-else class="not-found-card">
      <div class="not-found">
        <OhVueIcon name="gi-cat" class="not-found-icon" />
        <h2>{{ $t('blog.postNotFound') }}</h2>
        <p>{{ $t('blog.postNotFoundDesc') }}</p>
        <div class="not-found-actions">
          <Button 
            variant="primary" 
            @click="$router.push('/blog')"
          >
            <OhVueIcon name="oi-arrow-left" class="btn-icon" />
            {{ $t('blog.backToPosts') }}
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/language.ts';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Loading from '@/components/ui/Loading.vue';
import Input from '@/components/ui/Input.vue';
import Textarea from '@/components/ui/Textarea.vue';
import Alert from '@/components/ui/Alert.vue';
import { OhVueIcon } from '@/plugins/icons';

// Configurações da API
const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;

const route = useRoute();
const router = useRouter();
const languageStore = useLanguageStore();
const postId = route.params.slug;

// Estados do post
const post = ref(null);
const loading = ref(true);
const error = ref(null);

// Estados dos comentários
const comments = ref([]);
const commentsLoading = ref(false);
const commentsError = ref(null);

// Estados do formulário de comentário
const commentAuthorName = ref('');
const commentAuthorEmail = ref('');
const commentAuthorUrl = ref('');
const commentText = ref('');
const submittingComment = ref(false);
const commentSuccess = ref(false);
const submitError = ref('');
const nameError = ref('');
const emailError = ref('');
const commentError = ref('');

// Estados do formulário de resposta
const activeReplyForm = ref(null);
const replyText = ref('');
const replyAuthorName = ref('');
const replyAuthorEmail = ref('');
const submittingReply = ref(false);
const replyNameError = ref('');
const replyEmailError = ref('');
const replyContentError = ref('');

// Total de comentários
const totalComments = computed(() => {
  return comments.value.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);
});

// Helper para limpar HTML
const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Validar email
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Buscar post
const fetchPost = async () => {
  if (!postId) {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${postId}?key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(languageStore.currentLanguage === 'pt-BR' ? 'Post não encontrado' : 'Post not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.error?.message || (languageStore.currentLanguage === 'pt-BR' ? 'Erro ao carregar o post' : 'Error loading post'));
    }

    const apiPost = await response.json();
    
    post.value = {
      id: apiPost.id,
      title: apiPost.title,
      content: apiPost.content,
      published: apiPost.published,
      updated: apiPost.updated,
      author: apiPost.author?.displayName || 'Mochi Lab',
      authorId: apiPost.author?.id,
      authorImage: apiPost.author?.image?.url,
      authorUrl: apiPost.author?.url,
      url: apiPost.url,
      labels: apiPost.labels || [],
    };

    // Buscar comentários após carregar o post
    await fetchComments();

  } catch (err) {
    error.value = err.message;
    console.error('Erro ao buscar post:', err);
  } finally {
    loading.value = false;
  }
};

// Buscar comentários
const fetchComments = async () => {
  if (!post.value) return;
  
  try {
    commentsLoading.value = true;
    commentsError.value = null;

    const response = await fetch(`/.netlify/functions/comments?postId=${postId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao carregar comentários');
    }

    comments.value = data.comments || [];

  } catch (err) {
    commentsError.value = err.message;
    console.error('Erro ao carregar comentários:', err);
  } finally {
    commentsLoading.value = false;
  }
};

// Enviar comentário
const submitComment = async () => {
  // Limpar erros
  nameError.value = '';
  emailError.value = '';
  commentError.value = '';
  submitError.value = '';

  // Validações
  if (!commentAuthorName.value.trim()) {
    nameError.value = languageStore.currentLanguage === 'pt-BR' ? 'Nome é obrigatório' : 'Name is required';
    return;
  }

  if (!commentAuthorEmail.value.trim()) {
    emailError.value = languageStore.currentLanguage === 'pt-BR' ? 'Email é obrigatório' : 'Email is required';
    return;
  }

  if (!isValidEmail(commentAuthorEmail.value)) {
    emailError.value = languageStore.currentLanguage === 'pt-BR' ? 'Email inválido' : 'Invalid email';
    return;
  }

  if (!commentText.value.trim()) {
    commentError.value = languageStore.currentLanguage === 'pt-BR' ? 'Comentário não pode estar vazio' : 'Comment cannot be empty';
    return;
  }

  submittingComment.value = true;

  try {
    const response = await fetch('/.netlify/functions/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: postId,
        authorName: commentAuthorName.value.trim(),
        authorEmail: commentAuthorEmail.value.trim(),
        authorUrl: commentAuthorUrl.value?.trim() || null,
        content: commentText.value.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        if (data.errors.authorName) nameError.value = data.errors.authorName;
        if (data.errors.authorEmail) emailError.value = data.errors.authorEmail;
        if (data.errors.content) commentError.value = data.errors.content;
      }
      throw new Error(data.error || 'Erro ao enviar comentário');
    }

    // Limpar formulário
    commentAuthorName.value = '';
    commentAuthorEmail.value = '';
    commentAuthorUrl.value = '';
    commentText.value = '';
    
    commentSuccess.value = true;
    
    // Esconder mensagem de sucesso
    setTimeout(() => {
      commentSuccess.value = false;
    }, 5000);

    // Recarregar comentários
    await fetchComments();

  } catch (err) {
    submitError.value = err.message;
    console.error('Erro:', err);
  } finally {
    submittingComment.value = false;
  }
};

// Enviar resposta
const submitReply = async (commentId) => {
  // Limpar erros
  replyNameError.value = '';
  replyEmailError.value = '';
  replyContentError.value = '';

  // Validações
  if (!replyAuthorName.value.trim()) {
    replyNameError.value = languageStore.currentLanguage === 'pt-BR' ? 'Nome é obrigatório' : 'Name is required';
    return;
  }

  if (!replyAuthorEmail.value.trim()) {
    replyEmailError.value = languageStore.currentLanguage === 'pt-BR' ? 'Email é obrigatório' : 'Email is required';
    return;
  }

  if (!isValidEmail(replyAuthorEmail.value)) {
    replyEmailError.value = languageStore.currentLanguage === 'pt-BR' ? 'Email inválido' : 'Invalid email';
    return;
  }

  if (!replyText.value.trim()) {
    replyContentError.value = languageStore.currentLanguage === 'pt-BR' ? 'Resposta não pode estar vazia' : 'Reply cannot be empty';
    return;
  }

  submittingReply.value = true;

  try {
    const response = await fetch('/.netlify/functions/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: postId,
        parentId: commentId,
        authorName: replyAuthorName.value.trim(),
        authorEmail: replyAuthorEmail.value.trim(),
        content: replyText.value.trim()
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar resposta');
    }

    // Limpar formulário
    replyText.value = '';
    replyAuthorName.value = '';
    replyAuthorEmail.value = '';
    activeReplyForm.value = null;

    // Recarregar comentários
    await fetchComments();

  } catch (err) {
    console.error('Erro:', err);
    alert(languageStore.currentLanguage === 'pt-BR' ? 'Erro ao enviar resposta. Tente novamente.' : 'Error sending reply. Please try again.');
  } finally {
    submittingReply.value = false;
  }
};

// Toggle formulário de resposta
const toggleReplyForm = (commentId) => {
  if (activeReplyForm.value === commentId) {
    activeReplyForm.value = null;
  } else {
    activeReplyForm.value = commentId;
    replyText.value = '';
    replyAuthorName.value = '';
    replyAuthorEmail.value = '';
    replyNameError.value = '';
    replyEmailError.value = '';
    replyContentError.value = '';
  }
};

// Cancelar resposta
const cancelReply = () => {
  activeReplyForm.value = null;
  replyText.value = '';
  replyAuthorName.value = '';
  replyAuthorEmail.value = '';
};

// Tempo de leitura
const readingTime = computed(() => {
  if (!post.value) return 0;
  const text = stripHtml(post.value.content);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Formatar data
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(languageStore.currentLanguage, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formatar data do comentário
const formatCommentDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return languageStore.currentLanguage === 'pt-BR' ? 'Agora mesmo' : 'Just now';
  if (diffMins < 60) {
    return diffMins === 1 
      ? (languageStore.currentLanguage === 'pt-BR' ? 'Há 1 minuto' : '1 minute ago')
      : (languageStore.currentLanguage === 'pt-BR' ? `Há ${diffMins} minutos` : `${diffMins} minutes ago`);
  }
  if (diffHours < 24) {
    return diffHours === 1
      ? (languageStore.currentLanguage === 'pt-BR' ? 'Há 1 hora' : '1 hour ago')
      : (languageStore.currentLanguage === 'pt-BR' ? `Há ${diffHours} horas` : `${diffHours} hours ago`);
  }
  if (diffDays < 7) {
    return diffDays === 1
      ? (languageStore.currentLanguage === 'pt-BR' ? 'Há 1 dia' : '1 day ago')
      : (languageStore.currentLanguage === 'pt-BR' ? `Há ${diffDays} dias` : `${diffDays} days ago`);
  }
  
  return date.toLocaleDateString(languageStore.currentLanguage, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Navegar para tag
const navigateToTag = (tag) => {
  router.push({
    path: '/blog',
    query: { tag: encodeURIComponent(tag) }
  });
};

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
.blog-post {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1em;
}

.post-header {
  margin-bottom: 1em;
}

.post-title-section {
  margin-bottom: 1.5em;
}

.post-title-section h1 {
  color: var(--title-primary);
  margin: 0 0 0.5em 0;
  line-height: 1.2;
  font-size: 2.5em;
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

.post-content :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary);
}

.post-content :deep(a:hover) {
  border-bottom: 1px solid var(--primary);
}

.post-content :deep(blockquote) {
  border-left: 4px solid var(--primary);
  margin: 1.5rem 0;
  padding: 0.5rem 0 0.5rem 1.5rem;
  background: var(--inner-surface);
  font-style: italic;
}

.post-content :deep(pre) {
  background: var(--code-bg, #2d2d2d);
  color: var(--code-text, #f8f8f2);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.post-content :deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
  color: var(--title-primary);
  margin: 2rem 0 1rem 0;
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

/* Loading e Error States */
.comments-loading,
.comments-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
}

/* Lista de Comentários */
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

/* Formulário de Resposta */
.reply-form {
  margin: 1rem 0 1rem 4rem;
  padding: 1rem;
  background: var(--inner-surface);
  border-radius: 8px;
}

/* Lista de Respostas */
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

/* Sem comentários */
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

/* Formulário de Novo Comentário */
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

/* Botões */
.btn-icon {
  margin-right: 0.5rem;
}

/* Estados de Carregamento e Erro */
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

/* Transições */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .blog-post {
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