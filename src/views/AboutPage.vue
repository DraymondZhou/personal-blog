<template>
  <div class="about-page">
    <section class="about-hero">
      <div class="container">
        <div class="about-hero-grid">
          <div class="about-hero-left">
            <span class="about-badge animate-fadeInUp">关于我</span>
            <h1 class="about-title animate-fadeInUp" style="animation-delay: 0.1s">
              一个热爱<br />
              <span class="gradient-text">代码与设计</span><br />
              的开发者
            </h1>
            <p class="about-desc animate-fadeInUp" style="animation-delay: 0.2s">
              我是一名全栈开发者，专注于前端技术和用户体验设计。
              相信技术的力量可以让复杂变简单，让世界更美好。
              在这里，我分享我的学习笔记、项目经验和技术思考。
            </p>
          </div>
          <div class="about-hero-right animate-slideInRight" style="animation-delay: 0.3s">
            <div class="about-avatar-card glass-effect">
              <div class="avatar-glow"></div>
              <div class="avatar-placeholder">
                <span class="avatar-text">&lt;Dev/&gt;</span>
              </div>
              <div class="avatar-info">
                <span class="avatar-name">Blog Admin</span>
                <span class="avatar-role">Full-Stack Developer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="skills-section container">
      <h2 class="skills-title">技术栈</h2>
      <div class="skills-grid">
        <div
          v-for="(skill, index) in skills"
          :key="index"
          class="skill-item glass-effect"
        >
          <span class="skill-icon">{{ skill.icon }}</span>
          <span class="skill-name">{{ skill.name }}</span>
          <div class="skill-bar">
            <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="timeline-section container">
      <h2 class="timeline-title">经历</h2>
      <div class="timeline">
        <div
          v-for="(item, index) in timeline"
          :key="index"
          class="timeline-item"
          :class="{ 'timeline-right': index % 2 !== 0 }"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-effect">
            <span class="timeline-year">{{ item.year }}</span>
            <h3 class="timeline-heading">{{ item.title }}</h3>
            <p class="timeline-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { updateMeta } from '@/utils/seo'

const skills = [
  { name: 'Vue.js', icon: '💚', level: 90 },
  { name: 'JavaScript', icon: '⚡', level: 85 },
  { name: 'CSS/SCSS', icon: '🎨', level: 88 },
  { name: 'Node.js', icon: '🟢', level: 75 },
  { name: 'Git', icon: '📦', level: 80 },
  { name: 'Nginx', icon: '🌐', level: 70 }
]

const timeline = [
  { year: '2024', title: '技术博客上线', desc: '使用 Vue 3 + Vite 构建个人技术博客，记录学习与成长' },
  { year: '2023', title: '全栈开发', desc: '深入学习 Node.js 和数据库，成为全栈开发者' },
  { year: '2022', title: '前端进阶', desc: '掌握 Vue 3、React 等现代前端框架，专注用户体验' },
  { year: '2021', title: '开始编程', desc: '踏入编程世界，学习 HTML、CSS、JavaScript 基础' }
]

onMounted(() => {
  updateMeta({
    title: '关于我',
    description: '了解更多关于博客作者的信息'
  })
})
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}

.about-hero {
  padding: 60px 0 80px;
}

.about-hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 60px;
  align-items: center;
}

.about-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-secondary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.about-title {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.about-desc {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 480px;
}

/* Avatar Card */
.about-avatar-card {
  padding: 40px;
  border-radius: var(--radius-lg);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.avatar-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: var(--accent-primary);
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  background: var(--accent-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-family: var(--font-code);
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.avatar-name {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.avatar-role {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Skills */
.skills-section {
  padding: 40px 24px 80px;
}

.skills-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.skill-item {
  padding: 20px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all var(--transition-normal);
}

.skill-item:hover {
  transform: translateY(-3px);
  border-color: rgba(108, 92, 231, 0.3);
}

.skill-icon {
  font-size: 24px;
}

.skill-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.skill-bar {
  height: 4px;
  background: var(--bg-input);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--accent-gradient);
  border-radius: 4px;
  transition: width 1s ease;
}

/* Timeline */
.timeline-section {
  padding: 0 24px 80px;
}

.timeline-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 48px;
  text-align: center;
}

.timeline {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  display: flex;
  justify-content: flex-start;
  padding-right: 55%;
  margin-bottom: 32px;
}

.timeline-item.timeline-right {
  justify-content: flex-end;
  padding-right: 0;
  padding-left: 55%;
}

.timeline-dot {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 12px;
  height: 12px;
  background: var(--accent-primary);
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 0 4px var(--bg-primary), 0 0 0 6px var(--accent-primary);
  z-index: 1;
}

.timeline-content {
  padding: 20px;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  width: 100%;
}

.timeline-content:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-glow);
}

.timeline-year {
  display: inline-block;
  font-family: var(--font-code);
  font-size: 12px;
  color: var(--accent-secondary);
  font-weight: 600;
  margin-bottom: 6px;
}

.timeline-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.timeline-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .about-hero {
    padding: 48px 0 60px;
  }

  .about-hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }

  .about-desc {
    max-width: none;
    margin: 0 auto;
  }

  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .skills-section {
    padding: 32px 20px 60px;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .about-hero {
    padding: 32px 0 40px;
  }

  .about-title {
    font-size: 28px;
  }

  .about-desc {
    font-size: 14px;
  }

  .about-avatar-card {
    padding: 28px;
  }

  .avatar-placeholder {
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
  }

  .avatar-text {
    font-size: 15px;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skills-section {
    padding: 24px 16px 48px;
  }

  .skills-title,
  .timeline-title {
    font-size: 22px;
    margin-bottom: 32px;
  }

  .timeline-section {
    padding: 0 16px 48px;
  }

  .timeline::before {
    left: 0;
  }

  .timeline-item,
  .timeline-item.timeline-right {
    padding-left: 36px;
    padding-right: 0;
    justify-content: flex-start;
  }

  .timeline-dot {
    left: 0;
  }

  .timeline-content {
    padding: 16px;
  }

  .timeline-content:hover {
    transform: none;
  }

  .skill-item:hover {
    transform: none;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .about-hero {
    padding: 20px 0 28px;
  }

  .about-title {
    font-size: 24px;
  }

  .about-desc {
    font-size: 13px;
    line-height: 1.7;
  }

  .about-avatar-card {
    padding: 24px 16px;
  }

  .avatar-placeholder {
    width: 80px;
    height: 80px;
  }

  .avatar-name {
    font-size: 17px;
  }

  .skills-section,
  .timeline-section {
    padding-left: 12px;
    padding-right: 12px;
  }

  .timeline-item {
    margin-bottom: 20px;
  }

  .timeline-heading {
    font-size: 14px;
  }

  .timeline-desc {
    font-size: 12px;
  }
}
</style>
