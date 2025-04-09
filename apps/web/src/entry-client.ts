import { createSSRApp } from 'vue'
import { createRouter } from './router'
import App from './App.vue';

const app = createSSRApp(App)
const router = createRouter()

app.provide('preloaded', (window as any).__CMMV_DATA__ || {})
app.use(router)

router.isReady().then(() => {
    app.mount('#app')
})