import { createSSRApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import { createPiniaInstance } from './store/index.js';
import { useTheme } from './composables/useTheme.js';
import App from './App.vue';
import './style.css';

declare global {
    interface Window {
        __CMMV_DATA__: Record<string, any>;
        __PINIA__: Record<string, any>;
    }
}

async function main() {
    try{
        const head = createHead();
        const app = createSSRApp(App)
        const pinia = createPiniaInstance();
        const preloadedData = window.__CMMV_DATA__ || {};

        app.provide('preloaded', preloadedData)
        app.use(head)
        app.use(pinia);

        if ((window as any).__PINIA__)
            pinia.state.value = (window as any).__PINIA__;

        const { router } = await useTheme();
        app.use(router);
        router.isReady().then(() => app.mount('#app', true))
    }
    catch(error){
        console.error(error);
    }
}

main();
