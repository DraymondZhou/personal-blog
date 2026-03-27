import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchBlogs, fetchBlogById, createBlog, deleteBlog } from '@/api/blog'
import { useToastStore } from './toast'

export const useBlogStore = defineStore('blog', () => {
  const blogs = ref([])
  const currentBlog = ref(null)
  const loading = ref(false)
  const total = ref(0)

  const recentBlogs = computed(() => {
    return [...blogs.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  })

  /**
   * 获取博客列表
   */
  async function getBlogs(page = 1, limit = 10) {
    loading.value = true
    try {
      const res = await fetchBlogs(page, limit)
      blogs.value = res.data.blogs
      total.value = res.data.total
    } catch (error) {
      console.error('获取博客列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取单篇博客
   */
  async function getBlogById(id) {
    loading.value = true
    try {
      const res = await fetchBlogById(id)
      currentBlog.value = res.data
      return res.data
    } catch (error) {
      console.error('获取博客详情失败:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 发布新博客
   */
  async function publishBlog(formData) {
    const toast = useToastStore()
    try {
      const res = await createBlog(formData)
      blogs.value.unshift(res.data)
      toast.show('博客发布成功！', 'success')
      return true
    } catch (error) {
      const msg = error.response?.data?.message || '发布失败，请重试'
      toast.show(msg, 'error')
      return false
    }
  }

  /**
   * 删除博客
   */
  async function removeBlog(id) {
    const toast = useToastStore()
    try {
      await deleteBlog(id)
      blogs.value = blogs.value.filter(b => b.id !== id)
      toast.show('博客已删除', 'success')
      return true
    } catch (error) {
      toast.show('删除失败，请重试', 'error')
      return false
    }
  }

  return {
    blogs,
    currentBlog,
    loading,
    total,
    recentBlogs,
    getBlogs,
    getBlogById,
    publishBlog,
    removeBlog
  }
})
