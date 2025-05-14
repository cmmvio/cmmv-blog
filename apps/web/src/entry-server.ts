import { createSSRApp } from 'vue';
//@ts-ignore
import { loadEnv } from 'vite';
import { createHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer';
import { createPiniaInstance } from "./store/index.js";
import { useTheme } from './composables/useTheme.js';
import { useSettingsStore } from './store/settings.js';
import { useCategoriesStore } from "./store/categories.js";
import { usePostsStore } from './store/posts.js';
import { useMostAccessedPostsStore } from './store/mostaccessed.js';

import App from './App.vue';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'VITE');

let settingsData: any;
let categoriesData: any;
let postsData: any;
let mostAccessedPostsData: any;

export async function setup(){
    const urlQueries = new URLSearchParams({
        limit: "32",
        status: "published",
        sort: "ASC",
        sortBy: "publishedAt",
        offset: "0"
    }).toString();

    const settings = await fetch(`${env.VITE_API_URL}/settings`);
    const categories = await fetch(`${env.VITE_API_URL}/blog/categories`);
    const posts = await fetch(`${env.VITE_API_URL}/blog/posts?${urlQueries}`);
    const mostAccessedPosts = await fetch(`${env.VITE_API_URL}/blog/posts/most-accessed`);

    if (!settings.ok)
        throw new Error('Failed to fetch settings');

    if (!categories.ok)
        throw new Error('Failed to fetch categories');

    settingsData = await settings.json();
    categoriesData = await categories.json();
    postsData = await posts.json();
    mostAccessedPostsData = await mostAccessedPosts.json();
}

export async function render(url: string) {
    try {
        if(!settingsData || !categoriesData)
            await setup();

        globalThis.__SSR_DATA__ = {};
        globalThis.__SSR_METADATA__ = {};

        const app = createSSRApp(App);
        const head = createHead();
        const pinia = createPiniaInstance();

        app.use(pinia);
        app.use(head);

        const settingsStore = useSettingsStore();
        const categoriesStore = useCategoriesStore();
        const postsStore = usePostsStore();
        const mostAccessedPostsStore = useMostAccessedPostsStore();

        settingsStore.setSettings(settingsData);
        categoriesStore.setCategories(categoriesData);
        postsStore.setPosts(postsData.result.posts);
        mostAccessedPostsStore.setMostAccessedPosts(mostAccessedPostsData);

        const { router } = await useTheme();
        router.push(url);
        await router.isReady();

        const route = router.currentRoute.value
        const match = matchLegacyRedirect(route);

        if (match)
            return { redirect: match }

        app.use(router);
        await renderToString(app);

        const prefetchPromises = Object.values(globalThis.__SSR_DATA__ || {});
        await Promise.all(prefetchPromises);

        const resolvedData = await resolveSSRData(globalThis.__SSR_DATA__);
        const appFinal = createSSRApp(App);
        const headFinal = createHead();

        appFinal.use(router);
        appFinal.use(headFinal);
        appFinal.use(pinia);
        appFinal.provide('preloaded', resolvedData);

        const html = await renderToString(appFinal);

        return {
            html,
            head: headFinal,
            preloadedData: resolvedData,
            metadata: globalThis.__SSR_METADATA__,
            piniaState: pinia.state.value,
            settings: settingsData,
            categories: categoriesData,
            posts: postsData.result,
            mostAccessedPosts: mostAccessedPostsData
        }
    } catch (e: any) {
        console.error('Render error:', e);
    }
}

function matchLegacyRedirect(route: any): string | null {
    const slug = route.params.slug;

    const legacyPaths = [
        /^\/\d{4}\/\d{2}\/\d{2}\/(.+?)\/?$/,
        /^\/\d{4}\/\d{2}\/(.+?)\/?$/,
        /^\/arquivos\/(\d+)$/,
        /^\/\?p=(\d+)$/
    ];

    for (const pattern of legacyPaths) {
        const match = route.fullPath.match(pattern);

        if (match)
            return `/post/${match[1]}`;
    }

    return null;
}

async function resolveSSRData(obj: Record<string, Promise<any>>) {
    if (!obj || Object.keys(obj).length === 0) return {};

    const keys = Object.keys(obj)

    const resolvedEntries = await Promise.all(
        keys.map(async (key) => {
            try {
                const value = obj[key];
                const resolvedValue = value instanceof Promise ? await value : value;
                return [key, resolvedValue];
            } catch (error) {
                return [key, null];
            }
        })
    )

    return Object.fromEntries(resolvedEntries)
}

setInterval(setup, 1000 * 60 * 10);
