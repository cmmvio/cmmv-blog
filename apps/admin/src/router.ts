import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from './layouts/AdminLayout.vue'
import SetupView from './views/SetupView.vue'
import HomeView from './views/HomeView.vue'
import PostView from './views/PostView.vue'
import PostsView from './views/PostsView.vue'
import PagesView from './views/PagesView.vue'
import PageView from './views/PageView.vue'
import SettingsView from './views/SettingsView.vue'
import CategoriesView from './views/CategoriesView.vue'
import LoginView from './views/LoginView.vue'
import TagsView from './views/TagsView.vue'
import ProfileView from './views/ProfileView.vue'
import AuthorsView from './views/AuthorsView.vue'
import MediasView from './views/MediasView.vue'
import MembersView from './views/MembersView.vue'
import CommentsView from './views/CommentsView.vue'
import ImportsView from './views/ImportsView.vue'

const router = createRouter({
    //@ts-ignore
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
                path: '/pages',
                component: PagesView
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
            }, {
                path: '/medias',
                component: MediasView
            }, {
                path: '/members',
                component: MembersView
            }, {
                path: '/comments',
                component: CommentsView
            }, {
                path: '/imports',
                component: ImportsView
            }],
        },
        {
            path: '/setup',
            name: 'setup',
            component: SetupView
        },
        {
            path: '/post/:id',
            name: 'editPost',
            component: PostView
        },
        {
            path: '/post',
            name: 'newPost',
            component: PostView,
        },
        {
            path: '/page/:id',
            name: 'editPage',
            component: PageView
        },
        {
            path: '/page',
            name: 'newPage',
            component: PageView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        }
    ],
})

export default router
