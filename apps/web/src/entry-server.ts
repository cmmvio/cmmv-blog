import { createSSRApp } from 'vue';
import App from './App.vue';
import { createRouter } from './routes';
import { renderToString } from 'vue/server-renderer';

export async function render(url: string) {
    const app = createSSRApp(App)
    const router = createRouter()

    router.push(url)
    await router.isReady()

    globalThis.__SSR_DATA__ = {}

    app.use(router)

    await renderToString(app)
    const resolvedData = await resolveSSRData(globalThis.__SSR_DATA__)
    app.provide('preloaded', resolvedData)

    const html = await renderToString(app)
    return { html, data: resolvedData }
}

async function resolveSSRData(obj: Record<string, Promise<any>>) {
    const keys = Object.keys(obj)
    const resolvedEntries = await Promise.all(
        keys.map(async (key) => [key, await obj[key]])
    )

    return Object.fromEntries(resolvedEntries)
}