<template>
  <article class="blog-card" @click="goToDetail">
    <div class="card-image-wrap">
      <LazyImage
        v-if="blog.coverImage"
        :src="blog.coverImage"
        :alt="blog.title"
      />
      <div v-else class="card-image-placeholder">
        <span class="placeholder-icon">✦</span>
      </div>
      <div class="card-overlay">
        <span class="card-read-btn">阅读全文 →</span>
      </div>
    </div>
    <div class="card-content">
      <div class="card-meta">
        <span class="card-date">{{ formatDate(blog.createdAt) }}</span>
        <span class="card-tag" v-if="blog.tag">{{ blog.tag }}</span>
      </div>
      <h3 class="card-title">{{ blog.title }}</h3>
      <p class="card-excerpt">{{ excerpt }}</p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import LazyImage from '@/components/common/LazyImage.vue'

const props = defineProps({
  blog: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const excerpt = computed(() => {
  const text = props.blog.content?.replace(/<[^>]*>/g, '') || ''
  return text.length > 120 ? text.substring(0, 120) + '...' : text
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function goToDetail() {
  router.push(`/blog/${props.blog.id}`)
}
</script>

<style scoped>
.blog-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-6px);
  border-color: rgba(108, 92, 231, 0.3);
  box-shadow: var(--shadow-glow);
}

.blog-card:active {
  transform: translateY(-2px);
}

.card-image-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/10;
}

.card-image-wrap :deep(.lazy-image-wrapper) {
  height: 100%;
  min-height: unset;
  border-radius: 0;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}

.placeholder-icon {
  font-size: 48px;
  color: white;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 15, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.blog-card:hover .card-overlay {
  opacity: 1;
}

.card-read-btn {
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.blog-card:hover .card-read-btn {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.card-date {
  font-size: 12px;
  color: var(--text-muted);
}

.card-tag {
  font-size: 11px;
  padding: 2px 10px;
  background: rgba(108, 92, 231, 0.15);
  color: var(--accent-secondary);
  border-radius: var(--radius-full);
  font-weight: 500;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.blog-card:hover .card-title {
  color: var(--accent-secondary);
}

.card-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
  }

  .card-excerpt {
    font-size: 13px;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .blog-card:hover {
    transform: translateY(-3px);
  }

  .blog-card:active {
    transform: translateY(0);
  }

  .card-image-wrap {
    aspect-ratio: 16/9;
  }

  .card-content {
    padding: 14px;
  }

  .card-title {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .card-excerpt {
    font-size: 13px;
    line-height: 1.5;
    /* 限制移动端显示行数 */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-overlay {
    display: none;
  }

  .card-date {
    font-size: 11px;
  }

  .card-tag {
    font-size: 10px;
    padding: 1px 8px;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .card-content {
    padding: 12px;
  }

  .card-title {
    font-size: 14px;
  }

  .card-excerpt {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }

  .placeholder-icon {
    font-size: 32px;
  }
}
</style>