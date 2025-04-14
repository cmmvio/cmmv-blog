import { createSSRApp } from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer';
import ClientOnly from './components/ClientOnly.vue'

export async function render(url: string) {
    try {
        globalThis.__SSR_DATA__ = {}
        globalThis.__SSR_METADATA__ = {}

        const app = createSSRApp(App)
        const head = createHead()
        const router = createRouter()

        router.push(url)
        await router.isReady()

        const route = router.currentRoute.value

        const match = matchLegacyRedirect(route)

        if (match)
            return { redirect: match }

        app.component('ClientOnly', ClientOnly)
        app.use(router)
        app.use(head)

        await new Promise(resolve => setTimeout(resolve, 100))
        const resolvedData = await resolveSSRData(globalThis.__SSR_DATA__)
        app.provide('preloaded', resolvedData)

        const html = await renderToString(app)

        return {
            html,
            head,
            preloadedData: resolvedData,
            metadata: globalThis.__SSR_METADATA__
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
                // Handle both Promise and non-Promise values
                return [key, value instanceof Promise ? await value : value];
            } catch (error) {
                console.error(`Error resolving SSR data for key ${key}:`, error);
                return [key, null];
            }
        })
    )

    return Object.fromEntries(resolvedEntries)
}
