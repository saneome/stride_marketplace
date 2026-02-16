import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
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
          set({
            user: data.user,
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
          set({
            user: data.user,
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

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
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
