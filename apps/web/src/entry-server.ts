import { createSSRApp } from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer';
import ClientOnly from './components/ClientOnly.vue'

export async function render(url: string) {
    try {
        const app = createSSRApp(App)
        const head = createHead()
        const router = createRouter()

        router.push(url)
        await router.isReady()

        globalThis.__SSR_DATA__ = {}
        globalThis.__SSR_METADATA__ = {}

        app.component('ClientOnly', ClientOnly)
        app.use(router)
        app.use(head)

        const resolvedData = await resolveSSRData(globalThis.__SSR_DATA__)
        app.provide('preloaded', resolvedData)

        const html = await renderToString(app)

        return {
            html, head,
            data: resolvedData,
            metadata: globalThis.__SSR_METADATA__
        }
    } catch (e: any) {
        console.error('Render error:', e);

        return {
            html: e.message
        }
    }
}

async function resolveSSRData(obj: Record<string, Promise<any>>) {
    const keys = Object.keys(obj)

    const resolvedEntries = await Promise.all(
        keys.map(async (key) => [key, await obj[key]])
    )

    return Object.fromEntries(resolvedEntries)
}
