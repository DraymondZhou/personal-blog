import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

/**
 * 创建 Axios 实例
 * 基础配置：baseURL、超时时间、请求头
 */
const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 * 在每个请求发出前自动附加 token
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blog_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理错误，如 token 过期自动登出
 */
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token 过期或无效，自动登出
          const authStore = useAuthStore()
          authStore.logout()
          window.location.href = '/login'
          break
        case 403:
          console.error('没有权限访问该资源')
          break
        case 500:
          console.error('服务器内部错误')
          break
      }
    }
    return Promise.reject(error)
  }
)

export default http
