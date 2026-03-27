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
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                            return 'vue-vendor'
                        }
                        if (id.includes('axios')) {
                            return 'axios-vendor'
                        }
                    }
                }
            }
        },
        minify: 'esbuild',
        esbuild: {
            drop: ['console', 'debugger']
        }
    }
})