<template>
  <footer class="footer">
    <div class="footer-inner container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-symbol">&lt;/&gt;</span>
            <span class="gradient-text">TechBlog</span>
          </div>
          <p class="footer-desc">一个关于前端开发与创意设计的个人技术博客。分享代码、思考与灵感。</p>
        </div>

        <div class="footer-links">
          <h4 class="footer-heading">导航</h4>
          <router-link to="/" class="footer-link">首页</router-link>
          <router-link to="/blog" class="footer-link">博客</router-link>
          <router-link to="/about" class="footer-link">关于</router-link>
        </div>

        <div class="footer-contact">
          <h4 class="footer-heading">联系</h4>
          <a href="mailto:admin@techblog.com" class="footer-link">1270123577@qq.com</a>
          <a href="https://github.com" target="_blank" class="footer-link">GitHub</a>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-line"></div>
        <p class="footer-copy">© {{ currentYear }} TechBlog. Built with Vue 3 & 💜</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 60px 0 30px;
  margin-top: 80px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 60px;
}

.footer-brand {
  max-width: 360px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.footer-logo .logo-symbol {
  font-family: var(--font-code);
  color: var(--accent-primary);
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.footer-heading {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.footer-link {
  display: block;
  color: var(--text-secondary);
  font-size: 14px;
  padding: 4px 0;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.footer-link:hover {
  color: var(--accent-secondary);
  transform: translateX(4px);
}

.footer-bottom {
  margin-top: 40px;
}

.footer-line {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--border-color) 20%,
    var(--accent-primary) 50%,
    var(--border-color) 80%,
    transparent
  );
  margin-bottom: 20px;
}

.footer-copy {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .footer {
    padding: 48px 0 24px;
    margin-top: 60px;
  }

  .footer-grid {
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 40px;
  }

  .footer-brand {
    max-width: none;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .footer {
    padding: 40px 0 20px;
    margin-top: 48px;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }

  .footer-bottom {
    margin-top: 28px;
  }

  .footer-copy {
    font-size: 12px;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .footer {
    padding: 32px 0 16px;
    margin-top: 36px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-brand {
    grid-column: auto;
    text-align: center;
  }

  .footer-logo {
    justify-content: center;
  }

  .footer-links,
  .footer-contact {
    text-align: center;
  }

  .footer-link:hover {
    transform: none;
  }
}
</style>
