<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toast-item"
          :class="[`toast-${toast.type}`, { 'toast-hide': !toast.visible }]"
          @click="toastStore.dismiss(toast.id)"
        >
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click.stop="toastStore.dismiss(toast.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

function getIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 90px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-lg);
}

.toast-item:hover {
  transform: translateX(-4px);
}

.toast-icon {
  font-size: 16px;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: none;
  color: inherit;
  opacity: 0.5;
  font-size: 12px;
  padding: 4px;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

/* Toast Types */
.toast-success {
  background: rgba(0, 184, 148, 0.15);
  border-color: rgba(0, 184, 148, 0.3);
  color: #00b894;
}

.toast-success .toast-icon {
  background: rgba(0, 184, 148, 0.2);
}

.toast-error {
  background: rgba(225, 112, 85, 0.15);
  border-color: rgba(225, 112, 85, 0.3);
  color: #e17055;
}

.toast-error .toast-icon {
  background: rgba(225, 112, 85, 0.2);
}

.toast-warning {
  background: rgba(253, 203, 110, 0.15);
  border-color: rgba(253, 203, 110, 0.3);
  color: #fdcb6e;
}

.toast-warning .toast-icon {
  background: rgba(253, 203, 110, 0.2);
}

.toast-info {
  background: rgba(116, 185, 255, 0.15);
  border-color: rgba(116, 185, 255, 0.3);
  color: #74b9ff;
}

.toast-info .toast-icon {
  background: rgba(116, 185, 255, 0.2);
}

/* Transition */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .toast-container {
    top: calc(var(--nav-height) + 16px);
    right: 20px;
    max-width: 360px;
  }

  .toast-item {
    padding: 12px 16px;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .toast-container {
    top: calc(var(--nav-height) + 12px);
    left: 12px;
    right: 12px;
    max-width: none;
  }

  .toast-item {
    padding: 12px 14px;
    gap: 10px;
  }

  .toast-message {
    font-size: 13px;
  }

  .toast-item:hover {
    transform: none;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .toast-container {
    left: 8px;
    right: 8px;
    gap: 6px;
  }

  .toast-item {
    padding: 10px 12px;
    border-radius: var(--radius-sm);
  }

  .toast-icon {
    min-width: 20px;
    height: 20px;
    font-size: 12px;
  }

  .toast-message {
    font-size: 12px;
  }
}
</style>