import { createSSRApp } from 'vue' // use SSR-aware
import App from './App.vue'
import { createRouter } from './routes'

const app = createSSRApp(App)
const router = createRouter()

app.provide('preloaded', (window as any).__PRELOADED__ || {})
app.use(router)

router.isReady().then(() => {
  app.mount('#app', true)
})
