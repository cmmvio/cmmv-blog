import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from './layouts/AdminLayout.vue'
import SetupView from './views/SetupView.vue'
import HomeView from './views/HomeView.vue'
import PostView from './views/PostView.vue'
import PostsView from './views/PostsView.vue'
import SettingsView from './views/SettingsView.vue'
import CategoriesView from './views/CategoriesView.vue'
import LoginView from './views/LoginView.vue'
import TagsView from './views/TagsView.vue'
import ProfileView from './views/ProfileView.vue'
import AuthorsView from './views/AuthorsView.vue'

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
            }, {
                path: '/categories',
                component: CategoriesView
            }, {
                path: '/tags',
                component: TagsView
            }, {
                path: '/profile',
                component: ProfileView
            }, {
                path: '/authors',
                component: AuthorsView
            }],
        },
        {
            path: '/setup',
            name: 'setup',
            component: SetupView
        },
        {
            path: '/post',
            name: 'post',
            component: PostView
        }, {
            path: '/post/:id',
            name: 'post',
            component: PostView
        }, {
            path: '/login',
            name: 'login',
            component: LoginView
        }
    ],
})

export default router
