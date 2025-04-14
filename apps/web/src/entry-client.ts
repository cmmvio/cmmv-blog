import { createSSRApp } from 'vue'
import { createRouter } from './router'
import { createHead } from '@unhead/vue/client'
import ClientOnly from './components/ClientOnly.vue'
import App from './App.vue';

declare global {
    interface Window {
        __CMMV_DATA__: Record<string, any>;
    }
}

const head = createHead();
const app = createSSRApp(App)
const router = createRouter()

const preloadedData = window.__CMMV_DATA__ || {};

app.provide('preloaded', preloadedData)
app.component('ClientOnly', ClientOnly)
app.use(head)
app.use(router)

router.isReady().then(() => {
    app.mount('#app', true)
})
