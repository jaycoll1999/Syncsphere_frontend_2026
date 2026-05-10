import { useEffect } from 'react'
import io from 'socket.io-client'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { toast } from 'react-toastify'

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore()
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    if (!isAuthenticated || !token) return

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    })

    socket.on('connect', () => {
      console.log('Connected to WebSocket')
    })

    socket.on('notification:new', (notification) => {
      addNotification(notification)
      toast.info(`New notification: ${notification.title}`)
    })

    socket.on('leave:status_changed', (data) => {
      toast.info(`Your leave request was ${data.status}`)
    })

    socket.on('event:reminder', (data) => {
      toast.info(`Reminder: ${data.title} starts soon`)
    })

    socket.on('event:updated', () => {
      console.log('Event updated')
      // You can add a custom event emitter or state update here if needed
    })

    return () => {
      socket.disconnect()
    }
  }, [isAuthenticated, token, addNotification])
}
