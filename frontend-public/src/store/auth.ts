import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  setAuth: (isAuthenticated: boolean, user: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: null,
  setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ isAuthenticated: false, user: null })
  },
}))
