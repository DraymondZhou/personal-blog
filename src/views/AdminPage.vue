<template>
  <div class="admin-page container">
    <div class="admin-header animate-fadeInUp">
      <div class="admin-header-left">
        <h1 class="admin-title">管理后台</h1>
        <p class="admin-subtitle">管理你的博客内容</p>
      </div>
      <button class="btn btn-primary" @click="showEditor = true">
        ＋ 发布新文章
      </button>
    </div>

    <!-- 博客列表管理 -->
    <section class="admin-section">
      <h2 class="section-title">文章管理</h2>
      
      <div v-if="blogStore.loading" class="admin-loading">
        <div v-for="n in 3" :key="n" class="skeleton-row skeleton-shimmer"></div>
      </div>

      <div v-else-if="blogStore.blogs.length > 0" class="blog-table">
        <div class="table-header">
          <span class="col-title">标题</span>
          <span class="col-date">发布日期</span>
          <span class="col-actions">操作</span>
        </div>
        <div
          v-for="blog in blogStore.blogs"
          :key="blog.id"
          class="table-row"
        >
          <div class="col-title">
            <router-link :to="`/blog/${blog.id}`" class="blog-link">
              {{ blog.title }}
            </router-link>
          </div>
          <div class="col-date">
            {{ formatDate(blog.createdAt) }}
          </div>
          <div class="col-actions">
            <button
              class="action-btn action-delete"
              @click="confirmDelete(blog)"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      <div v-else class="admin-empty">
        <p>暂无文章，点击上方按钮发布第一篇博客</p>
      </div>
    </section>

    <!-- 博客编辑器弹窗 -->
    <ModalDialog
      :visible="showEditor"
      title="发布新文章"
      max-width="700px"
      @close="resetEditor"
    >
      <form class="editor-form" @submit.prevent="handlePublish">
        <div class="form-group">
          <label class="form-label">文章标题 *</label>
          <input
            v-model="newBlog.title"
            type="text"
            class="form-input"
            placeholder="输入文章标题"
          />
          <span v-if="editorErrors.title" class="form-error">{{ editorErrors.title }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">标签</label>
          <input
            v-model="newBlog.tag"
            type="text"
            class="form-input"
            placeholder="例如：Vue, JavaScript, CSS"
          />
        </div>

        <div class="form-group">
          <label class="form-label">封面图片</label>
          <div
            class="image-upload"
            :class="{ 'has-image': previewImage, 'dragging': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileSelect"
            />
            <div v-if="previewImage" class="image-preview">
              <img :src="previewImage" alt="预览" />
              <button
                type="button"
                class="remove-image"
                @click.stop="removeImage"
              >✕</button>
            </div>
            <div v-else class="upload-placeholder">
              <span class="upload-icon">📷</span>
              <span class="upload-text">点击或拖拽上传封面图片</span>
              <span class="upload-hint">支持 JPG、PNG、WebP，最大 5MB</span>
            </div>
          </div>
          <span v-if="editorErrors.image" class="form-error">{{ editorErrors.image }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">文章内容 *</label>
          <textarea
            v-model="newBlog.content"
            class="form-textarea"
            rows="12"
            placeholder="在这里输入文章内容...&#10;&#10;支持使用双换行分段"
          ></textarea>
          <span v-if="editorErrors.content" class="form-error">{{ editorErrors.content }}</span>
        </div>

        <div class="editor-actions">
          <button type="button" class="btn btn-ghost" @click="resetEditor">取消</button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isPublishing"
          >
            <span v-if="isPublishing" class="btn-loader"></span>
            <span v-else>发布文章</span>
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- 删除确认弹窗 -->
    <ModalDialog
      :visible="showDeleteConfirm"
      title="确认删除"
      max-width="420px"
      @close="showDeleteConfirm = false"
    >
      <p class="delete-message">
        确定要删除文章「<strong>{{ deletingBlog?.title }}</strong>」吗？此操作无法撤销。
      </p>
      <template #footer>
        <button class="btn btn-ghost" @click="showDeleteConfirm = false">取消</button>
        <button class="btn btn-danger" @click="handleDelete">确认删除</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useToastStore } from '@/stores/toast'
import { uploadImage } from '@/api/blog'
import ModalDialog from '@/components/common/ModalDialog.vue'

const blogStore = useBlogStore()
const toastStore = useToastStore()

const showEditor = ref(false)
const showDeleteConfirm = ref(false)
const deletingBlog = ref(null)
const isPublishing = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)
const previewImage = ref('')
const selectedFile = ref(null)

const newBlog = reactive({
  title: '',
  tag: '',
  content: ''
})

const editorErrors = reactive({
  title: '',
  content: '',
  image: ''
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e) {
  const file = e.target.files[0]
  processFile(file)
}

function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  processFile(file)
}

function processFile(file) {
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    toastStore.show('请选择图片文件', 'error')
    editorErrors.image = '仅支持图片文件'
    return
  }

  // 验证文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toastStore.show('图片大小不能超过 5MB', 'error')
    editorErrors.image = '图片大小不能超过 5MB'
    return
  }

  editorErrors.image = ''
  selectedFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  previewImage.value = ''
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function validateEditor() {
  let valid = true
  editorErrors.title = ''
  editorErrors.content = ''

  if (!newBlog.title.trim()) {
    editorErrors.title = '请输入文章标题'
    valid = false
  }

  if (!newBlog.content.trim()) {
    editorErrors.content = '请输入文章内容'
    valid = false
  } else if (newBlog.content.trim().length < 10) {
    editorErrors.content = '文章内容至少需要10个字符'
    valid = false
  }

  return valid
}

async function handlePublish() {
  if (!validateEditor()) return

  isPublishing.value = true

  try {
    const formData = new FormData()
    formData.append('title', newBlog.title.trim())
    formData.append('content', newBlog.content.trim())
    if (newBlog.tag) formData.append('tag', newBlog.tag.trim())
    if (selectedFile.value) formData.append('coverImage', selectedFile.value)

    const success = await blogStore.publishBlog(formData)
    if (success) {
      resetEditor()
      blogStore.getBlogs()
    }
  } finally {
    isPublishing.value = false
  }
}

function resetEditor() {
  showEditor.value = false
  newBlog.title = ''
  newBlog.tag = ''
  newBlog.content = ''
  previewImage.value = ''
  selectedFile.value = null
  editorErrors.title = ''
  editorErrors.content = ''
  editorErrors.image = ''
}

function confirmDelete(blog) {
  deletingBlog.value = blog
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!deletingBlog.value) return
  await blogStore.removeBlog(deletingBlog.value.id)
  showDeleteConfirm.value = false
  deletingBlog.value = null
}

onMounted(() => {
  blogStore.getBlogs()
})
</script>

<style scoped>
.admin-page {
  padding: 40px 24px 80px;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.admin-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.admin-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

/* Blog Table */
.blog-table {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 150px 100px;
  padding: 14px 20px;
  background: var(--bg-input);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 150px 100px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  align-items: center;
  transition: background var(--transition-fast);
}

.table-row:hover {
  background: var(--bg-card-hover);
}

.blog-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.blog-link:hover {
  color: var(--accent-secondary);
}

.col-date {
  font-size: 13px;
  color: var(--text-secondary);
}

.action-btn {
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  background: none;
  font-family: var(--font-main);
}

.action-delete {
  color: var(--error);
  border: 1px solid rgba(225, 112, 85, 0.3);
}

.action-delete:hover {
  background: rgba(225, 112, 85, 0.1);
  border-color: var(--error);
}

/* Loading */
.admin-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  height: 56px;
  border-radius: var(--radius-sm);
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

/* Empty */
.admin-empty {
  text-align: center;
  padding: 60px 24px;
  color: var(--text-secondary);
  font-size: 14px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
}

/* Editor Form */
.editor-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  transition: all var(--transition-fast);
}

.form-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
}

.form-textarea {
  width: 100%;
  padding: 14px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  resize: vertical;
  min-height: 200px;
  line-height: 1.7;
  font-family: var(--font-main);
  transition: border-color var(--transition-fast);
}

.form-textarea:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
}

.form-error {
  font-size: 12px;
  color: var(--error);
}

/* Image Upload */
.image-upload {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.image-upload:hover {
  border-color: var(--accent-primary);
}

.image-upload.dragging {
  border-color: var(--accent-secondary);
  background: rgba(108, 92, 231, 0.05);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
}

.upload-icon {
  font-size: 32px;
  opacity: 0.5;
}

.upload-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.upload-hint {
  font-size: 12px;
  color: var(--text-muted);
}

.image-preview {
  position: relative;
}

.image-preview img {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  display: block;
}

.remove-image {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.remove-image:hover {
  background: var(--error);
  transform: scale(1.1);
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
}

.btn-loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Delete Confirmation */
.delete-message {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.delete-message strong {
  color: var(--text-primary);
}

.btn-danger {
  background: var(--error);
  color: white;
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.btn-danger:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

/* ===== 平板端 (768px - 1024px) ===== */
@media (max-width: 1024px) {
  .admin-page {
    padding: 32px 20px 60px;
  }

  .admin-title {
    font-size: 24px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr 120px 90px;
  }
}

/* ===== 手机端 (< 768px) ===== */
@media (max-width: 768px) {
  .admin-page {
    padding: 24px 16px 48px;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
    padding-bottom: 20px;
  }

  .admin-header .btn {
    width: 100%;
    justify-content: center;
  }

  .admin-title {
    font-size: 22px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr 80px;
    padding: 12px 14px;
  }

  .col-date {
    display: none;
  }

  .blog-link {
    font-size: 13px;
  }

  .upload-placeholder {
    padding: 24px;
  }

  .upload-icon {
    font-size: 24px;
  }

  .upload-text {
    font-size: 13px;
  }

  .editor-actions {
    flex-direction: column-reverse;
  }

  .editor-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .form-textarea {
    min-height: 160px;
  }
}

/* ===== 超小屏 (< 480px) ===== */
@media (max-width: 480px) {
  .admin-page {
    padding: 16px 12px 36px;
  }

  .admin-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr 60px;
    padding: 10px 12px;
    font-size: 12px;
  }

  .action-btn {
    padding: 4px 8px;
    font-size: 11px;
  }

  .upload-placeholder {
    padding: 20px 12px;
  }

  .form-input,
  .form-textarea {
    font-size: 16px; /* 避免 iOS 自动缩放 */
  }
}
</style>