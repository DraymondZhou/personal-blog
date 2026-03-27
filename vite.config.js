import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    // 代码分割：将第三方库单独打包，利用浏览器缓存
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'axios-vendor': ['axios']
        }
      }
    },
    // 使用默认的 esbuild 压缩（无需额外依赖，速度更快）
    minify: 'esbuild',
    // 生产环境移除 console 和 debugger
    esbuild: {
      drop: ['console', 'debugger']
    }
  }
})
