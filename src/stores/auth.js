import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi } from '@/api/auth'
import { useToastStore } from './toast'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('blog_token') || '')
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  /**
   * 登录
   * @param {string} username
   * @param {string} password
   */
  async function login(username, password) {
    const toast = useToastStore()

    try {
      const res = await loginApi(username, password)
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('blog_token', res.data.token)
      toast.show('登录成功！欢迎回来', 'success')
      return true
    } catch (error) {
      const msg = error.response?.data?.message || '登录失败'
      toast.show(msg, 'error')
      return false
    }
  }

  /**
   * 退出登录
   */
  function logout() {
    const toast = useToastStore()
    token.value = ''
    user.value = null
    localStorage.removeItem('blog_token')
    toast.show('已退出登录', 'info')
  }

  /**
   * 检查 token 是否有效
   */
  function checkAuth() {
    const savedToken = localStorage.getItem('blog_token')
    if (savedToken) {
      token.value = savedToken
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})
