import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import LoginView from './views/LoginView.vue';

import { mergePluginRoutes } from './composables/useRouter'

const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: LoginView
    }
]

import { blogAdminRoutes } from '@cmmv/blog/admin/router'

const mergedRoutes = mergePluginRoutes(
    adminRoutes,
    blogAdminRoutes
);

const router = createRouter({
    // @ts-ignore
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: mergedRoutes,
})

export default router
