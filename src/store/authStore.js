import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loginTime: null,
      userRoles: {}, // Maps userId -> display role (INTERN / EMPLOYEE / ADMIN)
      login: (user, token, refreshToken) => set({ user, token, refreshToken, isAuthenticated: true, loginTime: new Date().toISOString() }),
      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, loginTime: null })
        localStorage.removeItem('auth-storage') // Clear storage on logout
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        console.log('[Auth Logout] Cleared all authentication tokens from localStorage successfully.')
      },
      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
      // Save the real display-role for a user so EventsPage can show correct creator role
      setUserRole: (userId, role) => set((state) => ({
        userRoles: { ...state.userRoles, [String(userId)]: role }
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loginTime: state.loginTime,
        userRoles: state.userRoles
      }),
    }
  )
)
