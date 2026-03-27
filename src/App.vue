<template>
  <div class="app" :class="{ 'sidebar-open': sidebarOpen }">
    <NavBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <SideBar :visible="sidebarOpen" @close="sidebarOpen = false" />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <FooterBar />
    <ToastMessage />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './components/layout/NavBar.vue'
import SideBar from './components/layout/SideBar.vue'
import FooterBar from './components/layout/FooterBar.vue'
import ToastMessage from './components/common/ToastMessage.vue'

const sidebarOpen = ref(false)
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.main-content {
  flex: 1;
  padding-top: var(--nav-height);
  min-height: calc(100vh - var(--nav-height));
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
