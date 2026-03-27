import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// ES Module 下获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

// ===== 配置 =====
const JWT_SECRET = 'techblog-secret-key-2024'
const ADMIN_USER = { username: 'admin', password: 'admin123' }

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(__dirname, 'uploads')
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json')

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
if (!fs.existsSync(BLOGS_FILE)) fs.writeFileSync(BLOGS_FILE, '[]', 'utf-8')

// ===== 中间件 =====
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))

// Multer 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    cb(null, name)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的图片格式'), false)
    }
  }
})

// ===== 工具函数 =====
function readBlogs() {
  try {
    const data = fs.readFileSync(BLOGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeBlogs(blogs) {
  fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8')
}

// JWT 验证中间件
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供认证令牌' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: '认证令牌无效或已过期' })
  }
}

// ===== 认证接口 =====

// POST /api/auth/login - 管理员登录
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: '请填写用户名和密码' })
  }

  // 验证用户名
  if (username !== ADMIN_USER.username) {
    return res.status(401).json({ message: '用户名不存在' })
  }

  // 验证密码
  if (password !== ADMIN_USER.password) {
    return res.status(401).json({ message: '密码错误' })
  }

  // 生成 JWT Token（24小时有效）
  const token = jwt.sign(
    { username: ADMIN_USER.username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  res.json({
    data: {
      token,
      user: { username: ADMIN_USER.username, role: 'admin' }
    }
  })
})

// GET /api/auth/verify - 验证 Token
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ data: { valid: true, user: req.user } })
})

// ===== 博客接口 =====

// GET /api/blogs - 获取博客列表（公开）
app.get('/api/blogs', (req, res) => {
  const blogs = readBlogs()
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  // 按创建时间倒序排列
  const sorted = blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const total = sorted.length
  const start = (page - 1) * limit
  const paginated = sorted.slice(start, start + limit)

  res.json({
    data: {
      blogs: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  })
})

// GET /api/blogs/:id - 获取单篇博客（公开）
app.get('/api/blogs/:id', (req, res) => {
  const blogs = readBlogs()
  const blog = blogs.find(b => b.id === req.params.id)

  if (!blog) {
    return res.status(404).json({ message: '文章未找到' })
  }

  res.json({ data: blog })
})

// POST /api/blogs - 创建博客（需认证）
app.post('/api/blogs', authMiddleware, upload.single('coverImage'), (req, res) => {
  const { title, content, tag } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: '标题和内容不能为空' })
  }

  const blogs = readBlogs()
  const newBlog = {
    id: `blog-${Date.now()}`,
    title: title.trim(),
    content: content.trim(),
    tag: tag ? tag.trim() : '',
    coverImage: req.file ? `/uploads/${req.file.filename}` : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  blogs.push(newBlog)
  writeBlogs(blogs)

  res.status(201).json({ data: newBlog })
})

// DELETE /api/blogs/:id - 删除博客（需认证）
app.delete('/api/blogs/:id', authMiddleware, (req, res) => {
  let blogs = readBlogs()
  const index = blogs.findIndex(b => b.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ message: '文章未找到' })
  }

  // 删除关联的封面图片
  const blog = blogs[index]
  if (blog.coverImage) {
    const imagePath = path.join(__dirname, blog.coverImage)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
  }

  blogs.splice(index, 1)
  writeBlogs(blogs)

  res.json({ message: '文章已删除' })
})

// POST /api/upload - 上传图片（需认证）
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择要上传的图片' })
  }

  res.json({
    data: {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size
    }
  })
})

// ===== 错误处理 =====
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: '文件大小不能超过 5MB' })
    }
    return res.status(400).json({ message: '文件上传失败' })
  }
  
  console.error('服务器错误:', err)
  res.status(500).json({ message: '服务器内部错误' })
})

// ===== 启动服务器 =====
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   TechBlog API Server                 ║
  ║   运行在: http://localhost:${PORT}        ║
  ║   管理员: admin / admin123            ║
  ╚════════════════════════════════════════╝
  `)
})
