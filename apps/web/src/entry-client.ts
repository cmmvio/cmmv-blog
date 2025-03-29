import { createSSRApp } from 'vue'

export async function createClientEntry(router: any, App: any) {
    const app = createSSRApp(App)

    app.provide('preloaded', (window as any).__CMMV_DATA__ || {})
    app.use(router)

    router.isReady().then(() => {
        app.mount('#app', true)
    })

    return app;
}


