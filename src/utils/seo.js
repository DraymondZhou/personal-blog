/**
 * SEO 工具函数
 * 动态更新页面 meta 信息，提升搜索引擎优化效果
 */

export function updateMeta(options = {}) {
  const {
    title = '个人技术博客',
    description = '分享前端开发、编程技术与创意设计',
    keywords = '博客,前端开发,Vue,技术分享',
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl
  } = options

  // 更新页面标题
  document.title = title.includes('博客') ? title : `${title} | 个人技术博客`

  // 更新 meta description
  updateMetaTag('description', description)
  
  // 更新 meta keywords
  updateMetaTag('keywords', keywords)

  // 更新 Open Graph 标签
  updateMetaTag('og:title', ogTitle || title, 'property')
  updateMetaTag('og:description', ogDescription || description, 'property')
  
  if (ogImage) {
    updateMetaTag('og:image', ogImage, 'property')
  }
  
  if (ogUrl) {
    updateMetaTag('og:url', ogUrl, 'property')
  }
}

function updateMetaTag(name, content, attr = 'name') {
  if (!content) return
  
  let meta = document.querySelector(`meta[${attr}="${name}"]`)
  
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attr, name)
    document.head.appendChild(meta)
  }
  
  meta.setAttribute('content', content)
}

/**
 * 生成结构化数据 (JSON-LD)
 * 帮助搜索引擎理解页面内容
 */
export function setJsonLd(data) {
  let script = document.querySelector('script[type="application/ld+json"]')
  
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  
  script.textContent = JSON.stringify(data)
}

/**
 * 为博客文章生成结构化数据
 */
export function setBlogPostSchema(post) {
  setJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary || post.content?.substring(0, 160),
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: 'Blog Admin'
    },
    image: post.coverImage || undefined
  })
}
