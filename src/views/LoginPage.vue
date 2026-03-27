<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="login-glow login-glow-1"></div>
      <div class="login-glow login-glow-2"></div>
    </div>

    <div class="login-container">
      <div class="login-card glass-effect animate-fadeInUp">
        <div class="login-header">
          <div class="login-icon">
            <span>&lt;/&gt;</span>
          </div>
          <h1 class="login-title">管理员登录</h1>
          <p class="login-subtitle">请输入管理员凭证以访问后台</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group" :class="{ error: errors.username }">
            <label class="form-label">用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                v-model="form.username"
                type="text"
                class="form-input"
                placeholder="请输入用户名"
                autocomplete="username"
                @input="clearError('username')"
              />
            </div>
            <transition name="error-fade">
              <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
            </transition>
          </div>

          <div class="form-group" :class="{ error: errors.password }">
            <label class="form-label">密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请输入密码"
                autocomplete="current-password"
                @input="clearError('password')"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁' }}
              </button>
            </div>
            <transition name="error-fade">
              <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
            </transition>
          </div>

          <button
            type="submit"
            class="btn btn-primary login-btn"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="btn-loader"></span>
            <span v-else>登 录</span>
          </button>
        </form>

        <div class="login-footer">
          <router-link to="/" class="back-home">← 返回首页</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const form = reactive({
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

const showPassword = ref(false)
const isSubmitting = ref(false)

function clearError(field) {
  errors[field] = ''
}

function validate() {
  let valid = true

  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    valid = false
  } else if (form.username.trim().length < 3) {
    errors.username = '用户名至少需要3个字符'
    valid = false
  }

  if (!form.password) {
    errors.password = '请输入密码'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少需要6个字符'
    valid = false
  }

  return valid
}

async function handleLogin() {
  // 清除之前的错误
  errors.username = ''
  errors.password = ''

  if (!validate()) return

  isSubmitting.value = true

  try {
    const success = await authStore.login(form.username, form.password)
    if (success) {
      const redirect = route.query.redirect || '/admin'
      router.push(redirect)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.login-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.12;
}

.login-glow-1 {
  width: 500px;
  height: 500px;
  background: var(--accent-primary);
  top: -200px;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.login-glow-2 {
  width: 400px;
  height: 400px;
  background: #a29bfe;
  bottom: -150px;
  right: -100px;
  animation: float 6s ease-in-out infinite reverse;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: 24px;
}

.login-card {
  padding: 40px 36px;
  border-radius: var(--radius-lg);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: var(--accent-gradient);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-code);
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 14px;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  transition: all var(--transition-fast);
}

.form-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
}

.form-group.error .form-input {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(225, 112, 85, 0.15);
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  font-size: 14px;
  padding: 4px;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.toggle-password:hover {
  opacity: 1;
}

.form-error {
  font-size: 12px;
  color: var(--error);
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.login-btn {
  width: 100%;
  padding: 13px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 8px;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

.back-home {
  font-size: 13px;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.back-home:hover {
  color: var(--accent-secondary);
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .login-container {
    max-width: 400px;
  }

  .login-card {
    padding: 36px 30px;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .login-page {
    padding-top: var(--nav-height);
    align-items: flex-start;
  }

  .login-container {
    max-width: none;
    padding: 16px;
    margin-top: 24px;
  }

  .login-card {
    padding: 28px 20px;
    border-radius: var(--radius-md);
  }

  .login-icon {
    width: 50px;
    height: 50px;
    font-size: 17px;
  }

  .login-title {
    font-size: 20px;
  }

  .login-subtitle {
    font-size: 13px;
  }

  .login-header {
    margin-bottom: 28px;
  }

  .form-input {
    padding: 11px 14px 11px 38px;
    font-size: 16px; /* 避免 iOS 自动缩放 */
  }

  .login-btn {
    padding: 12px;
    font-size: 15px;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .login-container {
    padding: 12px;
    margin-top: 16px;
  }

  .login-card {
    padding: 24px 16px;
  }

  .login-form {
    gap: 16px;
  }

  .login-icon {
    width: 44px;
    height: 44px;
    font-size: 15px;
    margin-bottom: 12px;
  }

  .login-title {
    font-size: 18px;
  }
}
</style>