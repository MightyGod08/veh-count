import { defineStore } from 'pinia'

interface UserData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface Credentials {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) || '',
    isAuthenticated: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    // Check if user is authenticated
    checkAuth(): boolean {
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
          return true
        }
      }
      return false
    },

    // Registration action
    async register(userData: UserData) {
      try {
        // Mock registration - replace with actual API call
        this.token = 'mock-token-' + Date.now()
        this.user = {
          id: '1',
          email: userData.email,
          name: userData.name,
        }
        this.isAuthenticated = true
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        }
        return true
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },

    // Login action
    async login(credentials: Credentials) {
      try {
        // Mock login - replace with actual API call
        this.token = 'mock-token-' + Date.now()
        this.user = {
          id: '1',
          email: credentials.email,
          name: credentials.email?.split('@')[0] || 'user',
        }
        this.isAuthenticated = true
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        }
        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = ''
      this.isAuthenticated = false
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
  },
})
