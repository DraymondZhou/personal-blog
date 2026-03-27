<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleOverlayClick">
        <div class="modal-container" :style="{ maxWidth: maxWidth }">
          <div class="modal-header" v-if="title">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="$emit('close')">✕</button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  title: String,
  maxWidth: {
    type: String,
    default: '500px'
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  color: var(--text-secondary);
  font-size: 18px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

/* Transition */
.modal-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .modal-overlay {
    padding: 20px;
  }

  .modal-container {
    max-height: 88vh;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-container {
    max-height: 92vh;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-width: none !important;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-title {
    font-size: 16px;
  }

  .modal-body {
    padding: 16px 20px;
  }

  .modal-footer {
    padding: 12px 20px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  /* 手机端从底部滑入 */
  .modal-enter-from .modal-container {
    transform: translateY(100%);
    opacity: 1;
  }

  .modal-leave-to .modal-container {
    transform: translateY(100%);
    opacity: 1;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .modal-header {
    padding: 14px 16px;
  }

  .modal-title {
    font-size: 15px;
  }

  .modal-body {
    padding: 14px 16px;
  }

  .modal-footer {
    padding: 10px 16px;
    padding-bottom: max(10px, env(safe-area-inset-bottom));
    flex-wrap: wrap;
  }

  .modal-footer .btn {
    flex: 1;
    min-width: 0;
  }
}
</style>