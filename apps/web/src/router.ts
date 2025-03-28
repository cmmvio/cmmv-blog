import {
    createMemoryHistory, createWebHistory,
    createRouter as _createRouter
} from 'vue-router';

import DefaultTemplate from './theme-default/defaultTemplate.vue';
import Home from './theme-default/pageHome.vue';

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
            /*{
                path: '/posts',
                component: Posts,
                meta: {
                    loadData: async () => {
                        const res = await fetch('http://localhost:4000/api/posts');
                        return { posts: await res.json() };
                    }
                }
            }*/
        ]
    });
}