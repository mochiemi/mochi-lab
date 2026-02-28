<template>
  <div class="admin-login">
    <Card class="login-card">
      <h2>🔐 Área Administrativa</h2>
      <p>Digite a senha para continuar</p>
      
      <form @submit.prevent="handleLogin">
        <Input
          v-model="password"
          type="password"
          label="Senha"
          placeholder="••••••"
          :error="adminStore.authError"
          required
        />
        <Button 
          type="submit" 
          variant="primary" 
          :loading="loading"
        >
          Entrar
        </Button>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()
const password = ref<string>('')
const loading = ref<boolean>(false)

const handleLogin = (): void => {
  loading.value = true
  const success = adminStore.login(password.value)
  loading.value = false
  
  if (success) {
    const redirect = route.query.redirect as string;
    router.push(redirect)
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-card form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>