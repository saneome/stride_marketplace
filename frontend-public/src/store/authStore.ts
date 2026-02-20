import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  displayName: string | null
  phone: string | null
  avatarUrl: string | null
  createdAt?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName?: string) => Promise<void>
  logout: () => void
  clearError: () => void
  updateUser: (userData: Partial<User>) => void
  verifyToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const formData = new FormData()
          formData.append('username', email)
          formData.append('password', password)

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Ошибка входа')
          }

          const data = await response.json()
          // Save token to localStorage
          localStorage.setItem('access_token', data.access_token)
          set({
            user: {
              ...data.user,
              displayName: data.user.firstName,
              phone: data.user.phone || null,
              createdAt: data.user.createdAt,
            },
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Ошибка входа',
            isLoading: false,
          })
          throw error
        }
      },

      register: async (email: string, password: string, firstName: string, lastName?: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              first_name: firstName,
              last_name: lastName || null,
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Ошибка регистрации')
          }

          const data = await response.json()
          // Save token to localStorage
          localStorage.setItem('access_token', data.access_token)
          set({
            user: {
              ...data.user,
              displayName: data.user.firstName,
              phone: data.user.phone || null,
              createdAt: data.user.createdAt,
            },
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Ошибка регистрации',
            isLoading: false,
          })
          throw error
        }
      },

      logout: async () => {
        try {
          const token = localStorage.getItem('access_token')
          if (token) {
            // Call logout endpoint to blacklist token
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            })
          }
        } catch (error) {
          console.error('Logout API call failed:', error)
        } finally {
          // Clear local state regardless of API call result
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }))
      },

      verifyToken: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false })
          return
        }
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
          if (!response.ok) throw new Error('invalid')
          const data = await response.json()
          set({
            user: {
              id: data.id,
              email: data.email,
              firstName: data.firstName || data.first_name || null,
              lastName: data.lastName || data.last_name || null,
              displayName: data.displayName || data.display_name || data.firstName || data.first_name || null,
              phone: data.phone || null,
              avatarUrl: data.avatarUrl || data.avatar_url || null,
              createdAt: data.createdAt || data.created_at,
            },
            token,
            isAuthenticated: true,
          })
        } catch {
          localStorage.removeItem('access_token')
          set({ user: null, token: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
