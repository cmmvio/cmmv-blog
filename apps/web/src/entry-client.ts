import { createSSRApp } from 'vue'
import { createRouter } from './router'
import { createHead } from '@unhead/vue/client'
import ClientOnly from './components/ClientOnly.vue'
import App from './App.vue';

const head = createHead();
const app = createSSRApp(App)
const router = createRouter()

app.provide('preloaded', (window as any).__CMMV_DATA__ || {})
app.component('ClientOnly', ClientOnly)
app.use(head)
app.use(router)

router.isReady().then(() => {
    app.mount('#app', true)
})