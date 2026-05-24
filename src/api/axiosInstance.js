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

    // Attach Token FIRST before logging or sending so it's fully populated and visible in the logs
    let token = useAuthStore.getState().token
    
    // Fallback 1: Read from the plain 'token' key in localStorage (synchronous and always fresh)
    if (!token) {
      token = localStorage.getItem('token')
    }
    
    // Fallback 2: If Zustand hasn't finished hydrating yet, synchronously read the token from localStorage
    if (!token) {
      const storedAuth = localStorage.getItem('auth-storage')
      if (storedAuth) {
        try {
          token = JSON.parse(storedAuth)?.state?.token
        } catch (e) {
          console.error('[Axios Request Interceptor] Failed to parse auth-storage fallback:', e)
        }
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers.Authorization = `Bearer ${token}`
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
    }

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
        : (originalRequest.baseURL?.startsWith('http://') || originalRequest.baseURL?.startsWith('https://')
          ? fullPath
          : `${window.location.origin}${fullPath}`))
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

    // Trigger refresh for 401 Unauthorized or 403 Forbidden with 'Not authenticated' detail
    const isTokenError = error.response?.status === 401 || 
                         (error.response?.status === 403 && 
                          (error.response?.data?.detail === 'Not authenticated' || 
                           error.response?.data?.detail === 'Could not validate credentials' ||
                           error.response?.data?.detail?.toLowerCase()?.includes('token')));

    if (isTokenError && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true
      try {
        const customIp = localStorage.getItem('VITE_BACKEND_IP') || '192.168.1.42:8000'
        const formatted = customIp.trim()
        const apiBase = formatted.startsWith('http://') || formatted.startsWith('https://') 
          ? `${formatted}/api/v1` 
          : `http://${formatted}/api/v1`

        let storedRefreshToken = localStorage.getItem('refreshToken')
        if (!storedRefreshToken) {
          storedRefreshToken = useAuthStore.getState().refreshToken
        }
        if (!storedRefreshToken) {
          const storedAuth = localStorage.getItem('auth-storage')
          if (storedAuth) {
            try {
              storedRefreshToken = JSON.parse(storedAuth)?.state?.refreshToken
            } catch (e) {}
          }
        }
        
        console.log('[Axios Session Manager] Attempting Session Refresh with Token:', storedRefreshToken)
        
        const response = await axios.post(`${apiBase}/auth/refresh-token`, {
          refresh_token: storedRefreshToken,
          refreshToken: storedRefreshToken
        }, {
          headers: {
            'Authorization': `Bearer ${storedRefreshToken}`,
            'X-Refresh-Token': storedRefreshToken
          }
        })
        
        const responseData = response.data
        const newToken = responseData.token || 
                         responseData.accessToken || 
                         responseData.data?.token || 
                         responseData.data?.accessToken
        
        const newRefreshToken = responseData.refresh_token || 
                                responseData.refreshToken || 
                                responseData.data?.refresh_token || 
                                responseData.data?.refreshToken ||
                                storedRefreshToken

        console.log('[Axios Session Manager] Session successfully refreshed. New Token:', newToken)
        
        // Save to plain localStorage keys for easy external access
        if (newToken) {
          localStorage.setItem('token', newToken)
          console.log('[Axios Session Manager] Saved plain Refreshed Access Token in localStorage:', `Bearer ${newToken.substring(0, 15)}...`)
        }
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
          console.log('[Axios Session Manager] Saved plain Refreshed Refresh Token in localStorage:', `${newRefreshToken.substring(0, 15)}...`)
        }

        useAuthStore.setState({ token: newToken, refreshToken: newRefreshToken })
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('[Axios Session Manager] Refresh token failed or expired. Logging out...', refreshError)
        logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // 403: toast("You don't have permission to do this") if it is a genuine forbidden error, not an expired/missing token error
    if (error.response?.status === 403 && !isTokenError) {
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
