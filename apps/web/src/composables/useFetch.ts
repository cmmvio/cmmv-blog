import { ref, inject, App, getCurrentInstance } from 'vue'

type FetchMap = Record<string, Promise<any>>
type FetchedResult = Record<string, any>
const PRELOADED_KEY = Symbol('preloaded')

let ssrData: FetchMap = {}

export async function useFetch<T>(url: string, key: string) {
    const preloaded = inject<Record<string, any>>('preloaded', {})
    const data = ref<T | null>(preloaded[key] ?? null)

    if (import.meta.env.SSR && !preloaded[key]) {
        if (!globalThis.__SSR_DATA__)
            globalThis.__SSR_DATA__ = {}

        globalThis.__SSR_DATA__[key] = await fetch(url).then(res => res.json())
        data.value = globalThis.__SSR_DATA__[key];
    } else if (!import.meta.env.SSR && data.value === null) {
        data[key] = await fetch(url).then(res => res.json());
    }

    return { data }
}

export const useFetchPlugin = {
    install(app: App) {
        app.config.globalProperties.useFetch = useFetch
        app.provide(PRELOADED_KEY, {})

        app.provide('ssr-fetch-collector', {
            collect: () => ssrData,
            clear: () => {
                ssrData = {}
            }
        })
    }
}
