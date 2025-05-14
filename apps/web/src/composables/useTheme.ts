import { useSettingsStore } from "../store/settings.js";

export async function useTheme() {
    const isSSR = import.meta.env.SSR;
    const settingsStore = useSettingsStore();
    const routerModules = import.meta.glob('../theme-*/router.ts');

    if(isSSR){
        let theme = settingsStore.getSetting('blog.theme', import.meta.env.VITE_DEFAULT_THEME);
        const importFn = routerModules[`../theme-${theme}/router.ts`];
        //@ts-ignore
        const { createRouter } = await importFn();
        const router = createRouter();
        return { theme, router }
    }
    else{
        const pinia = (window as any).__PINIA__;
        let theme = pinia.settings.data["blog.theme"] || import.meta.env.VITE_DEFAULT_THEME;
        const importFn = routerModules[`../theme-${theme}/router.ts`] || routerModules[`../theme-default/router.ts`];
        //@ts-ignore
        const { createRouter } = await importFn();
        const router = createRouter();
        return { theme, router }
    }
}
