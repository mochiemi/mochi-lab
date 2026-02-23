<template>
  <div class="moderation-panel">
    <Card>
      <template #header>
        <h1>🛡️ Painel de Moderação</h1>
        <p>Comentários pendentes: {{ pendingComments.length }}</p>
      </template>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <Loading size="large" text="Carregando..." />
      </div>

      <!-- Lista de pendentes -->
      <div v-else-if="pendingComments.length" class="comments-list">
        <div v-for="comment in pendingComments" :key="comment.id" class="comment-card">
          <div class="comment-info">
            <h4>{{ comment.author_name }}</h4>
            <small>{{ comment.author_email }}</small>
            <small>Post: {{ comment.post_id }}</small>
            <small>Enviado: {{ formatDate(comment.created_at) }}</small>
          </div>
          
          <div class="comment-content">
            <p>{{ comment.content }}</p>
          </div>

          <div class="actions">
            <Button 
              variant="primary" 
              @click="approveComment(comment.id)"
              :loading="processing === comment.id"
            >
              ✅ Aprovar
            </Button>
            <Button 
              variant="secondary" 
              @click="rejectComment(comment.id)"
              :loading="processing === comment.id"
            >
              ❌ Rejeitar
            </Button>
          </div>
        </div>
      </div>

      <!-- Vazio -->
      <div v-else class="empty">
        <p>🎉 Nenhum comentário pendente!</p>
      </div>
    </Card>

    <!-- Comentários já aprovados (últimos 10) -->
    <Card class="approved-section">
      <template #header>
        <h2>✅ Últimos Aprovados</h2>
      </template>
      
      <div v-if="approvedComments.length" class="comments-list">
        <div v-for="comment in approvedComments" :key="comment.id" class="comment-card approved">
          <div class="comment-info">
            <strong>{{ comment.author_name }}</strong>
            <small>{{ formatDate(comment.created_at) }}</small>
          </div>
          <p>{{ comment.content.substring(0, 100) }}...</p>
        </div>
      </div>
      <p v-else>Nenhum comentário aprovado ainda.</p>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'

const pendingComments = ref([])
const approvedComments = ref([])
const loading = ref(true)
const processing = ref(null)

// Buscar comentários pendentes (não aprovados)
const fetchPending = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  if (!error) pendingComments.value = data || []
}

// Buscar comentários aprovados (últimos 10)
const fetchApproved = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(10)

  if (!error) approvedComments.value = data || []
}

// Aprovar comentário
const approveComment = async (id) => {
  processing.value = id
  const { error } = await supabase
    .from('comments')
    .update({ is_approved: true })
    .eq('id', id)

  if (!error) {
    pendingComments.value = pendingComments.value.filter(c => c.id !== id)
    await fetchApproved() // Recarrega aprovados
  } else {
    alert('Erro ao aprovar: ' + error.message)
  }
  processing.value = null
}

// Rejeitar (deletar) comentário
const rejectComment = async (id) => {
  if (!confirm('Tem certeza que deseja rejeitar este comentário?')) return
  
  processing.value = id
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)

  if (!error) {
    pendingComments.value = pendingComments.value.filter(c => c.id !== id)
  } else {
    alert('Erro ao rejeitar: ' + error.message)
  }
  processing.value = null
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('pt-BR')
}

onMounted(async () => {
  await Promise.all([fetchPending(), fetchApproved()])
  loading.value = false
})
</script>

<style scoped>
.moderation-panel {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.comment-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
}

.comment-card.approved {
  opacity: 0.7;
  border-color: #4caf50;
}

.comment-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  color: #666;
}

.comment-info h4 {
  margin: 0;
  color: #333;
}

.comment-content {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.approved-section {
  margin-top: 2rem;
}

.empty, .loading {
  text-align: center;
  padding: 3rem;
}
</style>