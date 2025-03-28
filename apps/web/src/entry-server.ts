import { createSSRApp } from 'vue';
import App from './App.vue';
import { createRouter } from './routes';
import { renderToString } from 'vue/server-renderer';

export async function render(url: string) {
    const app = createSSRApp(App);
    const router = createRouter();

    router.push(url);
    await router.isReady();

    const matchedRoute = router.currentRoute.value;
    const data = matchedRoute.meta?.loadData ? await matchedRoute.meta.loadData() : {};

    app.provide('preloaded', data);
    app.use(router);

    const html = await renderToString(app);
    return { html, data };
}
