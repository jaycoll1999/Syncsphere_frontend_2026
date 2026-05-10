import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),
  markRead: (id) => set((state) => {
    const updatedNotifications = state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
    // Recalculate unread count
    const unreadCount = updatedNotifications.filter((n) => !n.read).length
    return { notifications: updatedNotifications, unreadCount }
  }),
  markAllRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0
  })),
  setUnreadCount: (count) => set({ unreadCount: count }),
}))
