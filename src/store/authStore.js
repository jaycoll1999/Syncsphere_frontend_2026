import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('auth-storage') // Clear storage on logout
      },
      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: 'auth-storage',
      // The prompt says "Persist token to localStorage", but usually we persist the whole auth state or just token.
      // Let's persist token and user if needed, or just token.
      // If we only persist token, we need to fetch user on mount.
      // Let's persist the whole state for simplicity unless specified otherwise.
      // The prompt says "Persist token to localStorage". So I'll persist the token.
      partialize: (state) => ({ token: state.token }),
    }
  )
)
