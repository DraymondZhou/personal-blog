<template>
  <Teleport to="body">
    <transition name="overlay">
      <div v-if="visible" class="sidebar-overlay" @click="$emit('close')"></div>
    </transition>
    <transition name="sidebar-slide">
      <aside v-if="visible" class="sidebar glass-effect">
        <div class="sidebar-header">
          <span class="sidebar-title gradient-text">导航菜单</span>
          <button class="sidebar-close" @click="$emit('close')">✕</button>
        </div>

        <nav class="sidebar-nav">
          <router-link
            v-for="link in sideLinks"
            :key="link.path"
            :to="link.path"
            class="sidebar-link"
            :class="{ active: isActive(link.path) }"
            @click="$emit('close')"
          >
            <span class="sidebar-link-icon">{{ link.icon }}</span>
            <span class="sidebar-link-text">{{ link.name }}</span>
            <span class="sidebar-link-arrow">→</span>
          </router-link>
        </nav>

        <div class="sidebar-divider"></div>

        <div class="sidebar-section">
          <span class="sidebar-section-title">快速操作</span>
          <template v-if="authStore.isAuthenticated">
            <router-link to="/admin" class="sidebar-link" @click="$emit('close')">
              <span class="sidebar-link-icon">⚙</span>
              <span class="sidebar-link-text">管理后台</span>
              <span class="sidebar-link-arrow">→</span>
            </router-link>
            <button class="sidebar-link sidebar-btn" @click="handleLogout">
              <span class="sidebar-link-icon">⏻</span>
              <span class="sidebar-link-text">退出登录</span>
            </button>
          </template>
          <router-link v-else to="/login" class="sidebar-link" @click="$emit('close')">
            <span class="sidebar-link-icon">🔐</span>
            <span class="sidebar-link-text">管理员登录</span>
            <span class="sidebar-link-arrow">→</span>
          </router-link>
        </div>

        <div class="sidebar-footer">
          <p class="sidebar-copyright">© 2026 TechBlog</p>
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  visible: Boolean
})

defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sideLinks = [
  { name: '首页', path: '/', icon: '◈' },
  { name: '博客', path: '/blog', icon: '✦' },
  { name: '关于我', path: '/about', icon: '◎' }
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: 1100;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
}

.sidebar-close {
  background: none;
  color: var(--text-secondary);
  font-size: 18px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.sidebar-close:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
  transform: rotate(90deg);
}

.sidebar-nav {
  padding: 12px;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-main);
}

.sidebar-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--accent-gradient);
  transform: scaleY(0);
  transition: transform var(--transition-normal);
  border-radius: 0 3px 3px 0;
}

.sidebar-link:hover {
  color: var(--text-primary);
  background: rgba(108, 92, 231, 0.08);
  padding-left: 22px;
}

.sidebar-link:hover::before {
  transform: scaleY(1);
}

.sidebar-link:active {
  transform: scale(0.98);
  background: rgba(108, 92, 231, 0.15);
}

.sidebar-link.active {
  color: var(--accent-secondary);
  background: rgba(108, 92, 231, 0.12);
}

.sidebar-link.active::before {
  transform: scaleY(1);
}

.sidebar-link-icon {
  font-size: 16px;
  min-width: 20px;
  text-align: center;
  transition: transform var(--transition-normal);
}

.sidebar-link:hover .sidebar-link-icon {
  transform: scale(1.2);
}

.sidebar-link-arrow {
  margin-left: auto;
  opacity: 0;
  transform: translateX(-8px);
  transition: all var(--transition-normal);
  font-size: 12px;
}

.sidebar-link:hover .sidebar-link-arrow {
  opacity: 1;
  transform: translateX(0);
}

.sidebar-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 20px;
}

.sidebar-section {
  padding: 8px 12px;
}

.sidebar-section-title {
  display: block;
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.sidebar-copyright {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}
</style>
