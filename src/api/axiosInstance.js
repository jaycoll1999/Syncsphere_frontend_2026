import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-toastify'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { logout } = useAuthStore.getState()

    // 401: attempt POST /auth/refresh-token, on failure logout + redirect /login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`)
        const { token } = response.data
        useAuthStore.setState({ token })
        originalRequest.headers.Authorization = `Bearer ${token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // 403: toast("You don't have permission to do this")
    if (error.response?.status === 403) {
      toast.error("You don't have permission to do this")
    }

    // 500: toast("Server error. Please try again.")
    if (error.response?.status === 500) {
      toast.error("Server error. Please try again.")
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
