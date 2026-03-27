<template>
  <div class="home-page">
    <!-- Hero Section - 不对称设计 -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-grid-lines"></div>
        <div class="hero-glow hero-glow-1"></div>
        <div class="hero-glow hero-glow-2"></div>
      </div>

      <div class="hero-content container">
        <div class="hero-left">
          <div class="hero-tag animate-fadeInUp">
            <span class="tag-dot"></span>
            <span>全栈开发者 / 创意设计</span>
          </div>
          <h1 class="hero-title animate-fadeInUp" style="animation-delay: 0.1s">
            用代码<br />
            <span class="gradient-text">构建未来</span>
          </h1>
          <p class="hero-desc animate-fadeInUp" style="animation-delay: 0.2s">
            探索前端开发的无限可能。这里记录着我的技术思考、编程实践与创意灵感。
            每一行代码都是通往更好解决方案的阶梯。
          </p>
          <div class="hero-actions animate-fadeInUp" style="animation-delay: 0.3s">
            <router-link to="/blog" class="btn btn-primary">
              浏览博客 →
            </router-link>
            <router-link to="/about" class="btn btn-outline">
              了解更多
            </router-link>
          </div>
          <div class="hero-stats animate-fadeInUp" style="animation-delay: 0.4s">
            <div class="stat-item">
              <span class="stat-number">{{ blogStore.total || '10' }}+</span>
              <span class="stat-label">篇文章</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">Vue 3</span>
              <span class="stat-label">技术栈</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">∞</span>
              <span class="stat-label">创造力</span>
            </div>
          </div>
        </div>

        <div class="hero-right animate-fadeIn" style="animation-delay: 0.3s">
          <div class="hero-code-card glass-effect">
            <div class="code-header">
              <div class="code-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <span class="code-filename">hello.vue</span>
            </div>
            <pre class="code-body"><code><span class="code-tag">&lt;template&gt;</span>
  <span class="code-tag">&lt;div</span> <span class="code-attr">class=</span><span class="code-string">"welcome"</span><span class="code-tag">&gt;</span>
    <span class="code-tag">&lt;h1&gt;</span>{{ message }}<span class="code-tag">&lt;/h1&gt;</span>
  <span class="code-tag">&lt;/div&gt;</span>
<span class="code-tag">&lt;/template&gt;</span>

<span class="code-tag">&lt;script setup&gt;</span>
<span class="code-keyword">const</span> message = <span class="code-string">'欢迎来到我的博客'</span>
<span class="code-tag">&lt;/script&gt;</span></code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新文章 - 不对称网格 -->
    <section class="recent-section container">
      <div class="section-header">
        <div class="section-header-left">
          <span class="section-badge">最新发布</span>
          <h2 class="section-title">近期文章</h2>
          <p class="section-desc">阅读最新的技术文章和开发心得</p>
        </div>
        <router-link to="/blog" class="section-more btn btn-ghost">
          查看全部 →
        </router-link>
      </div>

      <div v-if="blogStore.loading" class="loading-grid">
        <div v-for="n in 3" :key="n" class="skeleton-card">
          <div class="skeleton-image skeleton-shimmer"></div>
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-shimmer" style="width: 40%"></div>
            <div class="skeleton-line skeleton-shimmer" style="width: 80%"></div>
            <div class="skeleton-line skeleton-shimmer" style="width: 60%"></div>
          </div>
        </div>
      </div>

      <div v-else class="blog-grid-asymmetric">
        <BlogCard
          v-for="(blog, index) in blogStore.recentBlogs.slice(0, 3)"
          :key="blog.id"
          :blog="blog"
          :class="'grid-item-' + index"
        />
        <div v-if="blogStore.recentBlogs.length === 0" class="empty-state">
          <span class="empty-icon">✦</span>
          <p class="empty-text">暂无博客文章</p>
          <p class="empty-sub">管理员可以登录后台发布新文章</p>
        </div>
      </div>
    </section>

    <!-- 特性展示 -->
    <section class="features-section container">
      <div class="features-grid">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="feature-card glass-effect"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <span class="feature-icon">{{ feature.icon }}</span>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { updateMeta } from '@/utils/seo'
import BlogCard from '@/components/blog/BlogCard.vue'

const blogStore = useBlogStore()

const features = [
  { icon: '⚡', title: '高性能', desc: '基于 Vite 构建，极速的开发与加载体验' },
  { icon: '🎨', title: '现代设计', desc: '不对称布局与流畅动画，打造沉浸式阅读' },
  { icon: '🔒', title: '安全管理', desc: 'JWT 认证保护，安全的后台管理系统' },
  { icon: '📱', title: '响应式', desc: '完美适配各种屏幕尺寸，随时随地阅读' }
]

onMounted(() => {
  updateMeta({
    title: '个人技术博客',
    description: '一个关于前端开发与创意设计的个人技术博客'
  })
  blogStore.getBlogs()
})
</script>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 40px 0;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(108, 92, 231, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108, 92, 231, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
}

.hero-glow-1 {
  width: 600px;
  height: 600px;
  background: var(--accent-primary);
  top: -200px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.hero-glow-2 {
  width: 400px;
  height: 400px;
  background: #a29bfe;
  bottom: -100px;
  left: -50px;
  animation: float 6s ease-in-out infinite reverse;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(108, 92, 231, 0.1);
  border: 1px solid rgba(108, 92, 231, 0.2);
  border-radius: var(--radius-full);
  font-size: 13px;
  color: var(--accent-secondary);
  margin-bottom: 24px;
}

.tag-dot {
  width: 6px;
  height: 6px;
  background: var(--success);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.hero-title {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.hero-desc {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 500px;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-code);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-color);
}

/* Code Card */
.hero-code-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
  transition: transform var(--transition-slow);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.hero-code-card:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.code-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--border-color);
}

.code-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #febc2e; }
.dot-green { background: #28c840; }

.code-filename {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-code);
}

.code-body {
  padding: 20px;
  font-size: 13px;
  line-height: 1.8;
  font-family: var(--font-code);
  overflow-x: auto;
}

.code-body code {
  color: var(--text-secondary);
}

.code-tag { color: #e17055; }
.code-attr { color: #fdcb6e; }
.code-string { color: #00b894; }
.code-keyword { color: #6c5ce7; }

/* Recent Section */
.recent-section {
  padding: 80px 24px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 48px;
}

.section-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-secondary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

.section-more {
  font-size: 14px;
  white-space: nowrap;
}

/* Asymmetric Blog Grid */
.blog-grid-asymmetric {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  grid-template-rows: auto auto;
  gap: 24px;
}

.grid-item-0 {
  grid-row: 1 / 3;
}

.grid-item-0 :deep(.card-image-wrap) {
  aspect-ratio: 4/3;
}

/* Loading Skeleton */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

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
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-text {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.empty-sub {
  font-size: 14px;
  color: var(--text-muted);
}

/* Features Section */
.features-section {
  padding: 40px 24px 80px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-card {
  padding: 28px 24px;
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(108, 92, 231, 0.3);
  box-shadow: var(--shadow-glow);
}

.feature-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .hero {
    min-height: auto;
    padding: 48px 0 32px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }

  .hero-right {
    display: none;
  }

  .hero-desc {
    max-width: none;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .blog-grid-asymmetric {
    grid-template-columns: 1fr 1fr;
  }

  .grid-item-0 {
    grid-row: auto;
    grid-column: 1 / -1;
  }

  .grid-item-0 :deep(.card-image-wrap) {
    aspect-ratio: 16/8;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recent-section {
    padding: 60px 20px;
  }

  .section-title {
    font-size: 26px;
  }

  .loading-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .hero {
    padding: 32px 0 24px;
  }

  .hero-title {
    font-size: clamp(28px, 8vw, 40px);
  }

  .hero-desc {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .hero-actions .btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .hero-stats {
    gap: 20px;
  }

  .stat-number {
    font-size: 18px;
  }

  .stat-label {
    font-size: 11px;
  }

  .stat-divider {
    height: 28px;
  }

  .recent-section {
    padding: 40px 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 22px;
  }

  .blog-grid-asymmetric {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .feature-card {
    padding: 20px;
  }

  .feature-card:hover {
    transform: none;
  }

  .loading-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 48px 16px;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .hero {
    padding: 20px 0 16px;
  }

  .hero-tag {
    font-size: 11px;
    padding: 4px 12px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 28px;
    margin-bottom: 14px;
  }

  .hero-desc {
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }

  .hero-actions {
    margin-bottom: 24px;
  }

  .recent-section {
    padding: 32px 12px;
  }

  .features-section {
    padding: 24px 12px 48px;
  }
}
</style>