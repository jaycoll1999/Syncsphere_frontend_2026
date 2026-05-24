import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loginTime: null,
      userRoles: {}, // Maps userId -> display role (INTERN / EMPLOYEE / ADMIN)
      login: (user, token) => set({ user, token, isAuthenticated: true, loginTime: new Date().toISOString() }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, loginTime: null })
        localStorage.removeItem('auth-storage') // Clear storage on logout
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
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loginTime: state.loginTime,
        userRoles: state.userRoles
      }),
    }
  )
)
