import axios from 'axios'

const api = axios.create({
  // Strip any trailing dots/slashes so a misconfigured VITE_API_URL
  // (e.g. ".../api/v1.") can never produce 404s on every request.
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/[.\/]+$/, ''),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 and refresh
let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Single-flight refresh: one shared request, all queued callers await it.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${api.defaults.baseURL}/auth/refresh`,
            {},
            { withCredentials: true }
          )
          .then((response) => {
            const { accessToken } = response.data.data
            localStorage.setItem('accessToken', accessToken)
            return accessToken
          })
          .catch((refreshError) => {
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
            throw refreshError
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      try {
        const accessToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
