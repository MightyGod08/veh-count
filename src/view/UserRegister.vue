<template>
  <div class="registration-container">
    <div class="registration-box">
      <h1>Vehicle Counter</h1>
      <h2 style="text-align: center">Register</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name:</label>
          <input id="name" v-model="form.name" type="text" placeholder="Enter your name" required />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm Password:</label>
          <input
            id="confirm-password"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" class="submit-btn">Register</button>
      </form>
      <p class="login-link">
        Already have an account? <router-link to="/loguser">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts" name="RegUserView">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleSubmit = async () => {
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  try {
    await authStore.register(form)
    const username = authStore.user?.name || 'user'
    // Redirect to dashboard with username as query parameter
    router.push(`/dashboard?user=${encodeURIComponent(username)}`)
  } catch {
    alert('Registration failed')
  }
}
</script>

<style scoped>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.registration-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.registration-box h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
