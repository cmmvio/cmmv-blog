import {
    createMemoryHistory, createWebHistory,
    createRouter as _createRouter
} from 'vue-router';

import TemplateDefault from './theme-default/templateDefault.vue';
import TemplatePost from './theme-default/templatePost.vue';

import PageHome from './theme-default/pageHome.vue';
import PagePost from './theme-default/pagePost.vue';
import PageCategory from './theme-default/pageCategory.vue';
import PagePage from './theme-default/pagePage.vue';
export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes: [
            {
                path: '/',
                component: TemplateDefault,
                children: [{
                    path: '',
                    component: PageHome
                }],
            },
            {
                path: '/preview/:id',
                component: TemplatePost,
                children: [{
                    path: '',
                    component: PagePost
                }]
            },
            {
                path: '/preview-page/:id',
                component: TemplatePost,
                children: [{
                    path: '',
                    component: PagePage
                }]
            },
            {
                path: '/post/:slug',
                component: TemplatePost,
                children: [{
                    path: '',
                    component: PagePost
                }]
            },
            {
                path: '/category/:slug',
                component: PageCategory
            }
        ]
    });
}