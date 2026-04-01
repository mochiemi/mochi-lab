<template>
  <div class="admin-gateway">
    <div v-if="!adminStore.isAuthenticated" class="login-box">
      <h1>🔐 Área Administrativa</h1>
      <p class="subtitle">Acesso restrito</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Digite a senha..."
            :class="{ 'error': adminStore.authError }"
            @input="adminStore.authError = ''"
          />
          <span v-if="adminStore.authError" class="error-text">
            {{ adminStore.authError }}
          </span>
        </div>
        
        <button type="submit" :disabled="!password || isLoading">
          {{ isLoading ? 'Verificando...' : 'Entrar' }}
        </button>
      </form>
    </div>

    <div v-else class="admin-dashboard">
      <div class="dashboard-header">
        <h1>🎛️ Painel Administrativo</h1>
        <button @click="logout" class="btn-secondary">Sair</button>
      </div>

      <div class="admin-grid">
        <router-link to="/admin/moderacao" class="admin-card">
          <div class="card-icon">🛡️</div>
          <h3>Moderação</h3>
          <p>Gerenciar comentários pendentes</p>
          <span class="arrow">→</span>
        </router-link>

        <router-link to="/admin/components" class="admin-card">
          <div class="card-icon">🧩</div>
          <h3>Biblioteca de Componentes</h3>
          <p>Visualizar e testar UI</p>
          <span class="arrow">→</span>
        </router-link>

        <router-link to="/admin/icons" class="admin-card">
          <div class="card-icon">🎨</div>
          <h3>Biblioteca de Ícones</h3>
          <p>Catálogo de ícones disponíveis</p>
          <span class="arrow">→</span>
        </router-link>
        <router-link to="/admin/events" class="admin-card">
          <div class="card-icon">📅</div>
          <h3>Grade Horária</h3>
          <p>Gerenciar aulas, monitorias e eventos</p>
          <Badge v-if="pendingCount > 0" variant="error" class="notification-badge">
            {{ pendingCount }}
          </Badge>
          <span class="arrow">→</span>
      </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import Badge from '@/components/ui/Badge.vue'

const router = useRouter()
const adminStore = useAdminStore()
const password = ref('')
const isLoading = ref(false)

onMounted(() => {
  adminStore.checkAuth()
})

const handleLogin = async () => {
  isLoading.value = true
  isLoading.value = false
  
}

const logout = () => {
  adminStore.logout()
  router.push('/admin')
}

const pendingCount = ref(0) 

</script>

<style scoped>
.admin-gateway {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Comfortaa', sans-serif;
}

.login-box {
  background: var(--surface-primary);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 12px var(--shadow);
  max-width: 400px;
  margin: 4rem auto;
}

.login-box h1 {
  font-family: 'Gloria Hallelujah', cursive;
  color: var(--title-primary);
  margin-bottom: 0.5rem;
  font-size: 1.8em;
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 0.9em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--surface-secondary);
  font-family: inherit;
  font-size: 1em;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--sky-blue);
  box-shadow: 0 0 0 3px var(--sky-blue-surface);
}

input.error {
  border-color: var(--red);
}

.error-text {
  color: var(--red);
  font-size: 0.85em;
  font-weight: 600;
}

button {
  background: var(--dull-blue);
  color: white;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--sky-blue);
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Comic Neue', cursive;
  font-weight: 700;
  font-size: 1.1em;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

button:hover:not(:disabled) {
  background: var(--dull-rose);
  border-color: var(--rose);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-hover);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.admin-dashboard {
  animation: fadeIn 0.3s ease;
}

.notification-badge {
  position: absolute;
  top: 1rem;
  right: 3rem;
}

.admin-card {
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px dashed var(--border);
}

.dashboard-header h1 {
  font-family: 'Gloria Hallelujah', cursive;
  color: var(--title-primary);
  margin: 0;
  font-size: 2em;
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border);
  padding: 0.5rem 1rem;
  font-size: 0.9em;
  margin: 0;
}

.btn-secondary:hover {
  background: var(--surface-error);
  border-color: var(--orange);
  color: var(--text-primary);
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.admin-card {
  background: var(--surface-primary);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow);
  display: flex;
  flex-direction: column;
}

.admin-card:hover {
  border-color: var(--rose);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px var(--shadow-hover);
  text-decoration: none;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.admin-card h3 {
  font-family: 'Shantell Sans', cursive;
  color: var(--title-secondary);
  margin: 0 0 0.5rem 0;
  font-size: 1.3em;
}

.admin-card p {
  color: var(--text-secondary);
  font-size: 0.9em;
  margin: 0;
  line-height: 1.4;
}

.arrow {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  font-size: 1.5rem;
  color: var(--rose);
  opacity: 0;
  transition: all 0.3s ease;
}

.admin-card:hover .arrow {
  opacity: 1;
  transform: translateX(4px);
}

@media (max-width: 600px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>