<template>
  <div class="moderation-panel">
    <!-- Header com logout -->
    <div class="admin-header">
      <h1>🛡️ Painel de Moderação</h1>
      <Button variant="secondary" size="small" @click="logout">
        🚪 Sair
      </Button>
    </div>
    
    <!-- Card sem slot tipado -->
    <Card class="main-card">
      <div class="card-header">
        <h2>Moderação</h2>
        <div class="stats">
          <span class="stat">⏳ Pendentes: {{ pendingComments.length }}</span>
          <span class="stat">✅ Auto-aprovados hoje: {{ approvedToday }}</span>
          <span class="stat">❌ Rejeitados: {{ rejectedToday }}</span>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <Loading size="large" />
      </div>

      <!-- PENDENTES -->
      <div v-else-if="pendingComments.length" class="comments-list">
        <h3>⏳ Aguardando revisão manual:</h3>
        
        <div v-for="item in pendingComments" :key="item.id" class="comment-card">
          <div class="suspicious-badge" v-if="item.moderation_queue?.[0]?.reason">
            ⚠️ {{ item.moderation_queue[0].reason }}
          </div>
          
          <div class="comment-info">
            <h4>{{ item.author_name }}</h4>
            <small>{{ item.author_email }}</small>
            <small>Post: {{ item.post_id }}</small>
            <small>{{ formatDate(item.created_at) }}</small>
          </div>
          
          <div class="comment-content">
            <p>{{ item.content }}</p>
          </div>

          <div class="actions">
            <Button 
              variant="primary" 
              @click="approveComment(item.id)"
              :loading="processing === item.id"
            >
              ✅ Aprovar
            </Button>
            <Button 
              variant="secondary" 
              @click="rejectComment(item.id)"
              :loading="processing === item.id"
            >
              ❌ Rejeitar
            </Button>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        <p>🎉 Nenhum comentário pendente!</p>
        <small>Comentários limpos são aprovados automaticamente.</small>
      </div>
    </Card>

    <!-- HISTÓRICO - Card sem slot tipado -->
    <Card class="history-section">
      <h2 class="history-title">📋 Histórico (últimos 20)</h2>
      
      <div class="history-list">
        <div 
          v-for="item in history" 
          :key="item.id" 
          :class="['history-item', item.reviewed ? 'reviewed' : 'pending']"
        >
          <span :class="['status', getStatusClass(item)]">
            {{ getStatusIcon(item) }}
          </span>
          <div class="history-info">
            <strong>{{ item.comments?.author_name || 'Deletado' }}</strong>
            <small>{{ item.reason }}</small>
            <small v-if="item.reviewed_at">
              {{ formatDate(item.reviewed_at) }}
            </small>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAdminStore } from '@/stores/admin'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'

// Tipos simplificados
interface QueueItem {
  comment_id: string
  reason: string
  [key: string]: any
}

interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  created_at: string
  moderation_queue?: QueueItem[]
}

interface HistoryItem {
  id: string
  comment_id: string
  reason: string
  reviewed: boolean
  reviewed_by?: string
  reviewed_at?: string
  created_at?: string
  comments?: { author_name: string }
  [key: string]: any
}

// Router e Store
const router = useRouter()
const adminStore = useAdminStore()

// Estados
const pendingComments = ref<Comment[]>([])
const history = ref<HistoryItem[]>([])
const loading = ref<boolean>(true)
const processing = ref<string | null>(null)

// Logout
const logout = (): void => {
  adminStore.logout()
  router.push('/admin/login')
}

// Buscar pendentes
const fetchPending = async (): Promise<void> => {
  const { data: queueData, error: queueErr } = await supabase
    .from('moderation_queue')
    .select('comment_id, reason')
    .eq('reviewed', false)

  if (queueErr) {
    console.error('Erro queue:', queueErr)
    return
  }

  if (!queueData?.length) {
    pendingComments.value = []
    return
  }

  const commentIds = queueData.map((q: any) => q.comment_id)
  
  const { data: commentsData, error: commentsErr } = await supabase
    .from('comments')
    .select('*')
    .in('id', commentIds)
    .eq('is_approved', false)

  if (commentsErr) {
    console.error('Erro comments:', commentsErr)
    return
  }

  // Tipagem any para evitar conflitos
  pendingComments.value = (commentsData || []).map((c: any) => ({
    ...c,
    moderation_queue: queueData.filter((q: any) => q.comment_id === c.id)
  })) as Comment[]
}

// Buscar histórico
const fetchHistory = async (): Promise<void> => {
  const { data, error } = await supabase
    .from('moderation_queue')
    .select(`
      *,
      comments (author_name)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  if (!error) history.value = (data || []) as HistoryItem[]
}

// Computed
const approvedToday = computed((): number => {
  const today = new Date().toDateString()
  return history.value.filter((q) => 
    q.reviewed && 
    q.reason?.includes('APROVADO') &&
    (q.reviewed_at ? new Date(q.reviewed_at).toDateString() === today : false)
  ).length
})

const rejectedToday = computed((): number => {
  return history.value.filter((q) => 
    q.reviewed && q.reason?.includes('REJEITADO')
  ).length
})

// Helpers
const getStatusClass = (item: HistoryItem): string => {
  if (!item.reviewed) return 'pending'
  if (item.reason?.includes('APROVADO')) return 'approved'
  if (item.reason?.includes('REJEITADO')) return 'rejected'
  return 'manual'
}

const getStatusIcon = (item: HistoryItem): string => {
  if (!item.reviewed) return '⏳'
  if (item.reason?.includes('APROVADO')) return '✅'
  if (item.reason?.includes('REJEITADO')) return '❌'
  return '👤'
}

// Ações
const approveComment = async (id: string): Promise<void> => {
  processing.value = id
  
  await supabase.from('comments').update({ is_approved: true }).eq('id', id)
  
  await supabase.from('moderation_queue').update({ 
    reviewed: true, 
    reviewed_at: new Date().toISOString(),
    reviewed_by: 'admin',
    reason: 'Aprovado manualmente'
  }).eq('comment_id', id)
  
  await refresh()
  processing.value = null
}

const rejectComment = async (id: string): Promise<void> => {
  if (!confirm('Rejeitar este comentário?')) return
  
  processing.value = id
  
  await supabase.from('moderation_queue').update({ 
    reviewed: true, 
    reviewed_at: new Date().toISOString(),
    reviewed_by: 'admin',
    reason: 'Rejeitado manualmente'
  }).eq('comment_id', id)
  
  await supabase.from('comments').delete().eq('id', id)
  
  await refresh()
  processing.value = null
}

const refresh = async (): Promise<void> => {
  loading.value = true
  await Promise.all([fetchPending(), fetchHistory()])
  loading.value = false
}

const formatDate = (date: string | undefined): string => {
  if (!date) return ''
  return new Date(date).toLocaleString('pt-BR')
}

onMounted(() => {
  // O router já deve ter barrado, mas verificamos novamente por segurança
  adminStore.checkAuth()
  if (!adminStore.isAuthenticated) {
    router.push('/admin')
    return
  }
  refresh()
})
</script>

<style scoped>
.moderation-panel {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.main-card, .history-section {
  margin-bottom: 2rem;
}

.card-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.history-title {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.stat {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.comments-list {
  margin-top: 1rem;
}

.comment-card {
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fffbeb;
}

.suspicious-badge {
  background: #ffc107;
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.comment-info h4 {
  margin: 0 0 0.25rem 0;
}

.comment-info small {
  display: block;
  color: #666;
  font-size: 0.85rem;
}

.comment-content {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  border-left: 3px solid #ffc107;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 4px;
  background: #f5f5f5;
}

.history-item.reviewed {
  opacity: 0.7;
}

.status {
  font-size: 1.25rem;
}

.status.approved { color: #4caf50; }
.status.rejected { color: #f44336; }
.status.pending { color: #ff9800; }

.history-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.history-info small {
  color: #666;
  font-size: 0.85rem;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading {
  text-align: center;
  padding: 3rem;
}
</style>