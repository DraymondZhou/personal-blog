<template>
  <div class="lazy-image-wrapper" :class="{ loaded: isLoaded, error: hasError }">
    <div v-if="!isLoaded && !hasError" class="lazy-placeholder">
      <div class="lazy-shimmer"></div>
    </div>
    <img
      v-show="isLoaded"
      ref="imgRef"
      :src="currentSrc"
      :alt="alt"
      class="lazy-image"
      @load="onLoad"
      @error="onError"
    />
    <div v-if="hasError" class="lazy-error">
      <span class="lazy-error-icon">🖼</span>
      <span class="lazy-error-text">图片加载失败</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
})

const imgRef = ref(null)
const isLoaded = ref(false)
const hasError = ref(false)
const currentSrc = ref('')
let observer = null

function onLoad() {
  isLoaded.value = true
}

function onError() {
  hasError.value = true
}

onMounted(() => {
  // 使用 IntersectionObserver 实现图片懒加载
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            currentSrc.value = props.src
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '100px' }
    )

    if (imgRef.value) {
      observer.observe(imgRef.value.parentElement)
    }
  } else {
    // 降级处理：直接加载
    currentSrc.value = props.src
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--bg-input);
  width: 100%;
  min-height: 200px;
}

.lazy-placeholder {
  position: absolute;
  inset: 0;
}

.lazy-shimmer {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--bg-input) 25%,
    var(--bg-card-hover) 50%,
    var(--bg-input) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
}

.lazy-image-wrapper.loaded .lazy-image {
  opacity: 1;
}

.lazy-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: var(--text-muted);
}

.lazy-error-icon {
  font-size: 32px;
  opacity: 0.5;
}

.lazy-error-text {
  font-size: 13px;
}
</style>