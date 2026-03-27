import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 路由懒加载 - 性能优化：按需加载页面组件
const HomePage = () =>
    import ('@/views/HomePage.vue')
const BlogList = () =>
    import ('@/views/BlogList.vue')
const BlogDetail = () =>
    import ('@/views/BlogDetail.vue')
const LoginPage = () =>
    import ('@/views/LoginPage.vue')
const AdminPage = () =>
    import ('@/views/AdminPage.vue')
const AboutPage = () =>
    import ('@/views/AboutPage.vue')

const routes = [{
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: { title: '首页' }
    },
    {
        path: '/blog',
        name: 'BlogList',
        component: BlogList,
        meta: { title: '博客列表' }
    },
    {
        path: '/blog/:id',
        name: 'BlogDetail',
        component: BlogDetail,
        meta: { title: '博客详情' }
    },
    {
        path: '/about',
        name: 'About',
        component: AboutPage,
        meta: { title: '关于我' }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { title: '管理员登录', guest: true }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminPage,
        meta: { title: '管理后台', requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0, behavior: 'smooth' }
    }
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
    // 更新页面标题
    const title = to.meta.title
    if (title) {
        document.title = `${title} | zhou的个人博客`
    }

    const authStore = useAuthStore()

    // 需要登录的页面
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
    }

    // 已登录时访问登录页，重定向到管理后台
    if (to.meta.guest && authStore.isAuthenticated) {
        next({ name: 'Admin' })
        return
    }

    next()
})

export default router