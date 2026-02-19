import { create } from 'zustand'

interface AuthState {
  isAdmin: boolean | null
  isLoading: boolean
  checkAdmin: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: null,
  isLoading: true,

  checkAdmin: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ isAdmin: false, isLoading: false })
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        set({ isAdmin: false, isLoading: false })
        return
      }

      const data = await response.json()
      set({ isAdmin: data.role === 'admin', isLoading: false })
    } catch {
      set({ isAdmin: false, isLoading: false })
    }
  },
}))
