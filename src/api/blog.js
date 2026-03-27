import http from './index'

/**
 * 获取博客列表
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Promise}
 */
export function fetchBlogs(page = 1, limit = 10) {
  return http.get('/blogs', { params: { page, limit } })
}

/**
 * 获取单篇博客详情
 * @param {string} id - 博客 ID
 * @returns {Promise}
 */
export function fetchBlogById(id) {
  return http.get(`/blogs/${id}`)
}

/**
 * 创建新博客（需要管理员权限）
 * @param {FormData} formData - 包含 title, content, coverImage 等
 * @returns {Promise}
 */
export function createBlog(formData) {
  return http.post('/blogs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 删除博客（需要管理员权限）
 * @param {string} id - 博客 ID
 * @returns {Promise}
 */
export function deleteBlog(id) {
  return http.delete(`/blogs/${id}`)
}

/**
 * 上传图片（需要管理员权限）
 * @param {File} file - 图片文件
 * @returns {Promise}
 */
export function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  return http.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
