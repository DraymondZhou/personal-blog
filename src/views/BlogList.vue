<template>
  <div class="blog-list-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title animate-fadeInUp">
          <span class="gradient-text">博客</span>文章
        </h1>
        <p class="page-desc animate-fadeInUp" style="animation-delay: 0.1s">
          浏览所有技术文章、开发心得和创意灵感
        </p>
      </div>
    </section>

    <section class="blog-content container">
      <div v-if="blogStore.loading" class="blog-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton-image skeleton-shimmer"></div>
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-shimmer" style="width: 40%"></div>
            <div class="skeleton-line skeleton-shimmer" style="width: 90%"></div>
            <div class="skeleton-line skeleton-shimmer" style="width: 65%"></div>
          </div>
        </div>
      </div>

      <template v-else>
        <div v-if="blogStore.blogs.length > 0" class="blog-grid">
          <BlogCard
            v-for="blog in blogStore.blogs"
            :key="blog.id"
            :blog="blog"
          />
        </div>

        <div v-else class="empty-state">
          <div class="empty-visual">
            <span class="empty-code">&lt;/&gt;</span>
          </div>
          <h3 class="empty-title">暂无博客文章</h3>
          <p class="empty-desc">管理员可以登录后台发布新文章</p>
          <router-link to="/" class="btn btn-outline">返回首页</router-link>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
          >
            ← 上一页
          </button>
          <div class="pagination-info">
            <span class="pagination-current">{{ currentPage }}</span>
            <span class="pagination-divider">/</span>
            <span class="pagination-total">{{ totalPages }}</span>
          </div>
          <button
            class="pagination-btn"
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页 →
          </button>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { updateMeta } from '@/utils/seo'
import BlogCard from '@/components/blog/BlogCard.vue'

const blogStore = useBlogStore()
const currentPage = ref(1)
const pageSize = 9

const totalPages = computed(() => Math.ceil(blogStore.total / pageSize))

function changePage(page) {
  currentPage.value = page
  blogStore.getBlogs(page, pageSize)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  updateMeta({
    title: '博客列表',
    description: '浏览所有技术文章和开发心得'
  })
  blogStore.getBlogs(1, pageSize)
})
</script>

<style scoped>
.blog-list-page {
  min-height: 100vh;
}

.page-hero {
  padding: 60px 0 40px;
  text-align: center;
}

.page-title {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  margin-bottom: 12px;
}

.page-desc {
  font-size: 16px;
  color: var(--text-secondary);
}

.blog-content {
  padding: 20px 24px 80px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Skeleton */
.skeleton-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.skeleton-image {
  height: 200px;
}

.skeleton-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
  border-radius: 7px;
}

.skeleton-shimmer {
  background: linear-gradient(90deg, var(--bg-input) 25%, var(--bg-card-hover) 50%, var(--bg-input) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 100px 24px;
}

.empty-visual {
  margin-bottom: 24px;
}

.empty-code {
  font-family: var(--font-code);
  font-size: 64px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.3;
}

.empty-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 48px;
  padding: 20px 0;
}

.pagination-btn {
  padding: 10px 20px;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.pagination-btn:hover:not(:disabled) {
  color: var(--text-primary);
  border-color: var(--accent-primary);
  box-shadow: var(--accent-glow);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-code);
  font-size: 14px;
}

.pagination-current {
  color: var(--accent-secondary);
  font-weight: 700;
}

.pagination-divider {
  color: var(--text-muted);
}

.pagination-total {
  color: var(--text-muted);
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .page-hero {
    padding: 48px 0 32px;
  }

  .page-title {
    font-size: 36px;
  }

  .blog-content {
    padding: 16px 20px 60px;
  }

  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .page-hero {
    padding: 32px 0 24px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-desc {
    font-size: 14px;
  }

  .blog-content {
    padding: 12px 16px 48px;
  }

  .blog-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .pagination {
    gap: 12px;
    margin-top: 32px;
  }

  .pagination-btn {
    padding: 8px 14px;
    font-size: 13px;
  }

  .empty-state {
    padding: 60px 16px;
  }

  .empty-code {
    font-size: 48px;
  }

  .empty-title {
    font-size: 18px;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .page-hero {
    padding: 20px 0 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .blog-content {
    padding: 8px 12px 40px;
  }

  .pagination-btn {
    padding: 7px 10px;
    font-size: 12px;
  }
}
</style>