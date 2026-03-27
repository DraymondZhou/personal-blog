<template>
  <div class="blog-detail-page">
    <div v-if="blogStore.loading" class="loading-state container">
      <div class="skeleton-detail">
        <div class="skeleton-line skeleton-shimmer" style="width: 30%; height: 16px"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 70%; height: 40px; margin: 16px 0"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 100%; height: 300px; border-radius: 12px"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 100%; height: 16px; margin-top: 24px"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 90%; height: 16px"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 95%; height: 16px"></div>
      </div>
    </div>

    <template v-else-if="blog">
      <article class="article container">
        <header class="article-header">
          <router-link to="/blog" class="back-link animate-fadeInUp">
            ← 返回博客列表
          </router-link>
          <div class="article-meta animate-fadeInUp" style="animation-delay: 0.1s">
            <span class="meta-date">{{ formatDate(blog.createdAt) }}</span>
            <span class="meta-tag" v-if="blog.tag">{{ blog.tag }}</span>
          </div>
          <h1 class="article-title animate-fadeInUp" style="animation-delay: 0.15s">
            {{ blog.title }}
          </h1>
        </header>

        <div
          v-if="blog.coverImage"
          class="article-cover animate-fadeInUp"
          style="animation-delay: 0.2s"
        >
          <img :src="blog.coverImage" :alt="blog.title" />
        </div>

        <div
          class="article-body animate-fadeInUp"
          style="animation-delay: 0.25s"
          v-html="renderedContent"
        ></div>

        <footer class="article-footer animate-fadeInUp" style="animation-delay: 0.3s">
          <div class="footer-line"></div>
          <div class="footer-nav">
            <router-link to="/blog" class="btn btn-outline">
              ← 返回博客列表
            </router-link>
          </div>
        </footer>
      </article>
    </template>

    <div v-else class="not-found container">
      <div class="not-found-content">
        <span class="not-found-code">404</span>
        <h2 class="not-found-title">文章未找到</h2>
        <p class="not-found-desc">该文章可能已被删除或链接无效</p>
        <router-link to="/blog" class="btn btn-primary">返回博客列表</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { updateMeta, setBlogPostSchema } from '@/utils/seo'

const route = useRoute()
const blogStore = useBlogStore()
const blog = ref(null)

const renderedContent = computed(() => {
  if (!blog.value?.content) return ''
  // 简单将换行转为段落
  return blog.value.content
    .split('\n\n')
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
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

onMounted(async () => {
  const id = route.params.id
  const data = await blogStore.getBlogById(id)
  if (data) {
    blog.value = data
    updateMeta({
      title: data.title,
      description: data.content?.substring(0, 160),
      ogTitle: data.title,
      ogImage: data.coverImage
    })
    setBlogPostSchema(data)
  }
})
</script>

<style scoped>
.blog-detail-page {
  min-height: 100vh;
  padding: 40px 0 80px;
}

/* Loading */
.loading-state {
  padding: 60px 24px;
}

.skeleton-detail {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  border-radius: 6px;
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

/* Article */
.article {
  max-width: 800px;
}

.article-header {
  margin-bottom: 32px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 24px;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--accent-secondary);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.meta-date {
  font-size: 14px;
  color: var(--text-secondary);
}

.meta-tag {
  font-size: 12px;
  padding: 3px 12px;
  background: rgba(108, 92, 231, 0.15);
  color: var(--accent-secondary);
  border-radius: var(--radius-full);
  font-weight: 500;
}

.article-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.article-cover {
  margin-bottom: 36px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.article-cover img {
  width: 100%;
  height: auto;
  display: block;
}

/* Article Content */
.article-body {
  font-size: 16px;
  line-height: 1.85;
  color: var(--text-secondary);
}

.article-body :deep(p) {
  margin-bottom: 20px;
}

.article-body :deep(h2) {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 40px 0 16px;
}

.article-body :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 32px 0 12px;
}

.article-body :deep(code) {
  font-family: var(--font-code);
  background: var(--bg-input);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: var(--accent-secondary);
}

.article-body :deep(pre) {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  overflow-x: auto;
  margin: 24px 0;
}

.article-body :deep(pre code) {
  background: none;
  padding: 0;
}

.article-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-md);
  margin: 24px 0;
}

.article-body :deep(blockquote) {
  border-left: 3px solid var(--accent-primary);
  padding-left: 16px;
  margin: 24px 0;
  color: var(--text-muted);
  font-style: italic;
}

.article-body :deep(a) {
  color: var(--accent-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Footer */
.article-footer {
  margin-top: 48px;
}

.footer-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color) 20%, var(--accent-primary) 50%, var(--border-color) 80%, transparent);
  margin-bottom: 24px;
}

.footer-nav {
  display: flex;
  justify-content: center;
}

/* Not Found */
.not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
}

.not-found-code {
  font-family: var(--font-code);
  font-size: 80px;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.3;
  display: block;
  margin-bottom: 16px;
}

.not-found-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.not-found-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .blog-detail-page {
    padding: 32px 0 60px;
  }

  .article {
    max-width: 700px;
  }

  .article-title {
    font-size: clamp(24px, 4vw, 36px);
  }

  .article-body {
    font-size: 15px;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .blog-detail-page {
    padding: 20px 0 48px;
  }

  .article {
    max-width: none;
  }

  .article-header {
    margin-bottom: 24px;
  }

  .back-link {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .article-title {
    font-size: 24px;
  }

  .article-cover {
    margin-bottom: 24px;
    border-radius: var(--radius-md);
  }

  .article-body {
    font-size: 14px;
    line-height: 1.75;
  }

  .article-body :deep(h2) {
    font-size: 20px;
    margin: 28px 0 12px;
  }

  .article-body :deep(h3) {
    font-size: 17px;
    margin: 24px 0 10px;
  }

  .article-body :deep(pre) {
    padding: 14px;
    font-size: 12px;
    border-radius: var(--radius-sm);
  }

  .article-footer {
    margin-top: 32px;
  }

  .not-found-code {
    font-size: 60px;
  }

  .not-found-title {
    font-size: 20px;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .blog-detail-page {
    padding: 12px 0 36px;
  }

  .article-title {
    font-size: 20px;
  }

  .article-body {
    font-size: 14px;
    line-height: 1.7;
  }

  .article-body :deep(p) {
    margin-bottom: 14px;
  }

  .article-body :deep(blockquote) {
    padding-left: 12px;
    margin: 16px 0;
    font-size: 13px;
  }

  .meta-date {
    font-size: 12px;
  }

  .meta-tag {
    font-size: 11px;
    padding: 2px 8px;
  }

  .not-found-code {
    font-size: 48px;
  }
}
</style>
