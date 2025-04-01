import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from './layouts/AdminLayout.vue'
import HomeView from './views/HomeView.vue'
import PostView from './views/PostView.vue'
import PostsView from './views/PostsView.vue'
import SettingsView from './views/SettingsView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'admin',
            component: AdminLayout,
            children: [{
                path: '',
                component: HomeView
            }, {
                path: '/posts',
                component: PostsView
            }, {
                path: '/settings',
                component: SettingsView
            }]
        },
        {
            path: '/post',
            name: 'post',
            component: PostView
        }
    ],
})

export default router
