import {
    createMemoryHistory, createWebHistory,
    createRouter as _createRouter
} from 'vue-router';

import TemplateDefault from './theme-default/templateDefault.vue';

import PageHome from './theme-default/pageHome.vue';
import PagePost from './theme-default/pagePost.vue';
import PageCategory from './theme-default/pageCategory.vue';
import PagePage from './theme-default/pagePage.vue';
import PageAuthor from './theme-default/pageAuthor.vue';
import PageTag from './theme-default/pageTag.vue';
import PageLogin from './theme-default/memberLogin.vue';
import PageRegister from './theme-default/memberRegister.vue';
import PageProfile from './theme-default/memberProfile.vue';

export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes: [
            {
                path: '/',
                component: TemplateDefault,
                children: [
                    { path: '', component: PageHome },
                    { path: '/category/:slug', component: PageCategory },
                    { path: '/preview/:id', component: PagePost },
                    { path: '/preview-page/:id', component: PagePage },
                    { path: '/post/:slug', component: PagePost },
                    { path: '/tag/:slug', component: PageTag },
                    { path: '/author/:slug', component: PageAuthor },
                    { path: '/member/profile', component: PageProfile }
                ]
            },
            {
                path: '/member/login',
                component: PageLogin
            },
            {
                path: '/member/register',
                component: PageRegister
            }
        ]
    });
}