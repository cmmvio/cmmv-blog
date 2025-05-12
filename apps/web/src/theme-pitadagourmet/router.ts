import {
    createMemoryHistory, createWebHistory,
    createRouter as _createRouter
} from 'vue-router';

import TemplateDefault from './templates/TemplateDefault.vue';

import PageHome from './views/PageHome.vue';
import PagePost from './views/PagePost.vue';
import PageCategory from './views/PageCategory.vue';
import PageTag from './views/PageTag.vue';
import PagePage from './views/PagePage.vue';
import PageAuthor from './views/PageAuthor.vue';
import PageTermsOfService from './views/TermsOfService.vue';
import PageTermsOfPrivacy from './views/TermsOfPrivacy.vue';

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
                    { path: '/terms-of-service', component: PageTermsOfService },
                    { path: '/terms-of-privacy', component: PageTermsOfPrivacy }
                ]
            }
        ]
    });
}