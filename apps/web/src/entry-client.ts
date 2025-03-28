import { createApp } from 'vue';
import App from './App.vue';
import { createRouter } from './routes';

const app = createApp(App);
const router = createRouter();

app.provide('preloaded', (window as any).__PRELOADED__ || {});
app.use(router);
app.mount('#app');
