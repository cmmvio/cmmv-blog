//@ts-nocheck
import { ref, inject, App } from "vue";

const PRELOADED_KEY = Symbol('preloaded');
type FetchMap = Record<string, Promise<any>>;
let ssrData: FetchMap = {};

export const useApi = () => {
    const baseUrl = "http://localhost:3000";
    const preloaded = inject<Record<string, any>>(PRELOADED_KEY, {});

    const get = async <T>(path: string, key?: string) => {
        const cacheKey = key || `get:${path}`;
        const data = ref<T | null>(preloaded[cacheKey] ?? null);

        if (import.meta.env.SSR && !preloaded[cacheKey]) {
            if (!globalThis.__SSR_DATA__)
                globalThis.__SSR_DATA__ = {};

            try {
                globalThis.__SSR_DATA__[cacheKey] = await fetch(`${baseUrl}/api/${path}`)
                    .then(res => res.json())
                    .then(data => data.result || data);

                data.value = globalThis.__SSR_DATA__[cacheKey];
            } catch (error) {
                console.error(`Error fetching ${path}:`, error);
            }
        }

        else if (!import.meta.env.SSR && data.value === null) {
            try {
                const response = await fetch(`${baseUrl}/api/${path}`);
                const result = await response.json();
                data.value = result.result || result;
            } catch (error) {
                console.error(`Error fetching ${path}:`, error);
            }
        }

        return { data };
    };

    const post = async <T>(path: string, payload: any, key?: string) => {
        const cacheKey = key || `post:${path}:${JSON.stringify(payload)}`;
        const data = ref<T | null>(preloaded[cacheKey] ?? null);

        try {
            const response = await fetch(`${baseUrl}/api/${path}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            data.value = result.result || result;
        } catch (error) {
            console.error(`Error posting to ${path}:`, error);
        }

        return { data };
    };

    return {
        get,
        post
    };
};

export const useBlog = () => {
    const categories = ref<any[]>([]);
    const api = useApi();

    const getAllCategories = async () => {
        const { data } = await api.get<any[]>("categories", "categories");
        categories.value = data.value || [];
        return data.value || [];
    };

    return {
        getAllCategories,
        categories
    };
};