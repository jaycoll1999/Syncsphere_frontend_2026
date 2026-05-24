import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-toastify'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.1.42:8000/api/v1"
console.log('Axios Base URL configured as:', BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Dynamically retrieve local network IP from localStorage to bypass hardcoded proxy targets
    const customIp = localStorage.getItem('VITE_BACKEND_IP') || '192.168.1.42:8000'
    const formatted = customIp.trim()
    const apiBase = formatted.startsWith('http://') || formatted.startsWith('https://') 
      ? `${formatted}/api/v1` 
      : `http://${formatted}/api/v1`
    
    config.baseURL = apiBase

    const fullPath = `${config.baseURL || ''}${config.url.startsWith('/') ? '' : '/'}${config.url}`
    const absoluteUrl = config.url.startsWith('http://') || config.url.startsWith('https://') 
      ? config.url 
      : (config.baseURL.startsWith('http://') || config.baseURL.startsWith('https://')
        ? fullPath
        : `${window.location.origin}${fullPath}`)
    
    console.log(`[Axios Outgoing Request]
  Method: ${config.method.toUpperCase()}
  Relative URL: ${config.url}
  Full Browser URL: ${absoluteUrl}
  Payload Data:`, config.data, `
  Headers:`, config.headers)

    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('[Axios Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response Success]
  Method: ${response.config.method.toUpperCase()}
  URL: ${response.config.url}
  Status: ${response.status}
  Data:`, response.data)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const fullPath = originalRequest ? `${originalRequest.baseURL || ''}${originalRequest.url.startsWith('/') ? '' : '/'}${originalRequest.url}` : ''
    const absoluteUrl = originalRequest 
      ? (originalRequest.url.startsWith('http://') || originalRequest.url.startsWith('https://') 
        ? originalRequest.url 
        : `${window.location.origin}${fullPath}`)
      : 'N/A'

    console.error(`[Axios Response Error]
  URL: ${absoluteUrl}
  Method: ${originalRequest?.method?.toUpperCase()}
  Status Code: ${error.response?.status || 'No response status'}
  Status Text: ${error.response?.statusText || 'N/A'}
  Error Message: ${error.message}
  Error Code: ${error.code}
  Response Data:`, error.response?.data, `
  Request Payload:`, originalRequest?.data)

    const { logout } = useAuthStore.getState()

    const isAuthRoute = originalRequest?.url?.includes('/auth/login') || 
                        originalRequest?.url?.includes('/auth/register') || 
                        originalRequest?.url?.includes('/auth/refresh-token')

    // 401: attempt POST /auth/refresh-token, on failure logout + redirect /login
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
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

    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. The server took too long to respond.')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
