import {
    createMemoryHistory, createWebHistory,
    createRouter as _createRouter
} from 'vue-router';

import DefaultTemplate from './theme-default/defaultTemplate.vue';
import PostTemplate from './theme-default/postTemplate.vue';
import Home from './theme-default/pageHome.vue';
import PreviewPage from './theme-default/previewPage.vue';


export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes: [
            {
                path: '/',
                component: DefaultTemplate,
                children: [{
                    path: '',
                    component: Home
                }],
            },
            {
                path: '/preview/:id',
                component: PostTemplate,
                children: [{
                    path: '',
                    component: PreviewPage
                }]
            }
        ]
    });
}