<template>
  <nav class="navbar glass-effect">
    <div class="navbar-inner">
      <div class="nav-left">
        <button class="menu-toggle" @click="$emit('toggle-sidebar')" aria-label="菜单">
          <span class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <router-link to="/" class="logo">
          <span class="logo-symbol">&lt;/&gt;</span>
          <span class="logo-text">TechBlog</span>
        </router-link>
      </div>

      <div class="nav-center">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: isActive(link.path) }"
        >
          <span class="nav-link-icon">{{ link.icon }}</span>
          <span class="nav-link-text">{{ link.name }}</span>
          <span class="nav-link-bar"></span>
        </router-link>
      </div>

      <div class="nav-right">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/admin" class="btn btn-ghost nav-admin-btn">
            <span>管理后台</span>
          </router-link>
          <button class="btn btn-outline nav-logout-btn" @click="handleLogout">
            退出
          </button>
        </template>
        <router-link v-else to="/login" class="btn btn-primary nav-login-btn">
          管理员登录
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navLinks = [
  { name: '首页', path: '/', icon: '◈' },
  { name: '博客', path: '/blog', icon: '✦' },
  { name: '关于', path: '/about', icon: '◎' }
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
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
}

.navbar-inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  display: none;
  background: none;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 20px;
}

.hamburger span {
  display: block;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all var(--transition-normal);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 20px;
  transition: all var(--transition-normal);
}

.logo:hover {
  color: var(--accent-secondary);
}

.logo:hover .logo-symbol {
  text-shadow: 0 0 20px var(--accent-primary);
  transform: scale(1.1);
}

.logo-symbol {
  font-family: var(--font-code);
  color: var(--accent-primary);
  font-size: 22px;
  transition: all var(--transition-normal);
}

.logo-text {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(108, 92, 231, 0.08);
}

.nav-link:active {
  transform: scale(0.96);
}

.nav-link-icon {
  font-size: 12px;
  transition: transform var(--transition-normal);
}

.nav-link:hover .nav-link-icon {
  transform: rotate(15deg) scale(1.2);
}

.nav-link-bar {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: var(--accent-gradient);
  border-radius: 2px;
  transition: transform var(--transition-normal);
}

.nav-link:hover .nav-link-bar,
.nav-link.active .nav-link-bar {
  transform: translateX(-50%) scaleX(1);
}

.nav-link.active {
  color: var(--accent-secondary);
  background: rgba(108, 92, 231, 0.1);
}

.nav-link.active .nav-link-icon {
  color: var(--accent-primary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-login-btn {
  font-size: 13px;
  padding: 7px 18px;
}

.nav-admin-btn {
  font-size: 13px;
  padding: 7px 14px;
}

.nav-logout-btn {
  font-size: 13px;
  padding: 7px 14px;
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .navbar-inner {
    padding: 0 20px;
  }

  .nav-link {
    padding: 7px 12px;
    font-size: 13px;
  }

  .nav-link-icon {
    display: none;
  }

  .logo {
    font-size: 18px;
  }

  .logo-symbol {
    font-size: 20px;
  }

  .nav-login-btn,
  .nav-admin-btn,
  .nav-logout-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .navbar-inner {
    padding: 0 16px;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-center {
    display: none;
  }

  .logo {
    font-size: 16px;
  }

  .logo-symbol {
    font-size: 18px;
  }

  .nav-right .nav-admin-btn {
    display: none;
  }

  .nav-login-btn {
    font-size: 12px;
    padding: 6px 14px;
  }

  .nav-logout-btn {
    font-size: 12px;
    padding: 6px 10px;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .navbar-inner {
    padding: 0 12px;
  }

  .logo-text {
    display: none;
  }

  .logo-symbol {
    font-size: 22px;
  }

  .nav-login-btn {
    font-size: 11px;
    padding: 5px 10px;
  }
}
</style>
