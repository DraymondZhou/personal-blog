import http from './index'

/**
 * 登录接口
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} - 返回 token 和用户信息
 */
export function loginApi(username, password) {
  return http.post('/auth/login', { username, password })
}

/**
 * 验证 Token 是否有效
 * @returns {Promise}
 */
export function verifyToken() {
  return http.get('/auth/verify')
}
