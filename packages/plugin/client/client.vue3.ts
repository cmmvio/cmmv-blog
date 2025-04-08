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
                globalThis.__SSR_DATA__[cacheKey] = await fetch(`${baseUrl}/${path}`)
                    .then(res => res.json())
                    .then(data => data.result || data);

                data.value = globalThis.__SSR_DATA__[cacheKey];
            } catch (error) {
                console.error(`Error fetching ${path}:`, error);
            }
        }

        else if (!import.meta.env.SSR && data.value === null) {
            try {
                const response = await fetch(`${baseUrl}/${path}`);
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
    const tags = ref<any[]>([]);
    const settings = ref<any[]>([]);
    const api = useApi();

    const getAllCategories = async () => {
        const { data } = await api.get<any[]>("blog/categories", "categories");
        categories.value = data.value || [];
        return data.value || [];
    };

    const getAllTags = async () => {
        const { data } = await api.get<any[]>("blog/posts/tags", "tags");
        tags.value = data.value || [];
        return data.value || [];
    };

    const getAllSettings = async () => {
        const { data } = await api.get<any[]>("api/settings", "settings");
        settings.value = data.value || [];
        return data.value || [];
    };

    const getPostById = async (id: string) => {
        const { data } = await api.get<any[]>(`blog/posts/${id}`, "post");
        return data.value || [];
    };

    const getPostBySlug = async (slug: string) => {
        const { data } = await api.get<any[]>(`blog/posts/slug/${slug}`, "post");
        return data.value || [];
    };

    const getPageById = async (id: string) => {
        const { data } = await api.get<any[]>(`blog/pages/${id}`, "page");
        return data.value || [];
    };

    const getPageBySlug = async (slug: string) => {
        const { data } = await api.get<any[]>(`blog/pages/slug/${slug}`, "page");
        return data.value || [];
    };

    const getCategoryById = async (id: string) => {
        const { data } = await api.get<any[]>(`blog/categories/${id}`, "category");
        return data.value || [];
    };

    const getCategoryBySlug = async (slug: string) => {
        const { data } = await api.get<any[]>(`blog/categories/slug/${slug}`, "category");
        return data.value || [];
    };

    const getAuthorById = async (id: string) => {
        const { data } = await api.get<any[]>(`authors/${id}`, "author");
        return data.value || [];
    };

    const getAuthorBySlug = async (slug: string) => {
        const { data } = await api.get<any[]>(`authors/slug/${slug}`, "author");
        return data.value || [];
    };

    return {
        getAllCategories,
        getAllTags,
        getAllSettings,
        getPostById,
        getPostBySlug,
        getPageById,
        getPageBySlug,
        getCategoryById,
        getCategoryBySlug,
        getAuthorById,
        getAuthorBySlug,
        categories,
        tags,
        settings
    };
};

export const injectSEO = async (type: string, data: any = null) => {
    const blogAPI = useBlog();
    const settings = ref<any>(await blogAPI.getAllSettings());
    let keywords = data.keywords || settings.value['blog.keywords'];
    let description = data.description || data.excerpt;
    let metadata = [];

    switch(type){
        case "index":
            globalThis.__SSR_METADATA__ = {
                title: settings.value['blog.title'] + ' - ' + settings.value['blog.description'],
                description: settings.value['blog.description'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}`,
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJS'] || "",
                customCSS: settings.value['blog.customCSS'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "post":
            metadata.push(
                `<meta property="article:published_time" content="${data.status === 'published' ? new Date(data.publishedAt).toISOString() : new Date(data.createdAt).toISOString()}" />`,
                `<meta property="article:modified_time" content="${new Date(data.updatedAt).toISOString()}" />`
            );

            if(!keywords && data.tags && data.tags.length > 0)
                keywords = data.tags.map((tag: any) => tag.name).join(', ').toLowerCase();

            if(!keywords)
                keywords = settings.value['blog.keywords'];

            if(!description)
                description = data.content.substring(0, 150) + '...';

            if(description.length > 150)
                description = description.substring(0, 150) + '...';

            globalThis.__SSR_METADATA__ = {
                title: data.title + ' - ' + settings.value['blog.title'],
                description,
                keywords,
                image: data.featureImage || settings.value['blog.image'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}`,
                author: data.author.name || settings.value['blog.author'],
                date: data.status === 'published' ?
                    new Date(data.publishedAt).toISOString() :
                    new Date(data.updatedAt).toISOString(),
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJS'] || "",
                customCSS: settings.value['blog.customCSS'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "page":
            if(!keywords)
                keywords = settings.value['blog.keywords'];

            if(!description)
                description = data.content.substring(0, 150) + '...';

            if(description.length > 150)
                description = description.substring(0, 150) + '...';

            globalThis.__SSR_METADATA__ = {
                title: data.title + ' - ' + settings.value['blog.title'],
                description,
                keywords,
                image: data.featureImage || settings.value['blog.image'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/page/${data.slug}`,
                author: data.author.name || settings.value['blog.author'],
                date: data.status === 'published' ?
                    new Date(data.publishedAt).toISOString() :
                    new Date(data.updatedAt).toISOString(),
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJS'] || "",
                customCSS: settings.value['blog.customCSS'] || "",
                metadata: metadata.join('\n\t\t')
            }
        break;
        case "category":
            globalThis.__SSR_METADATA__ = {
                title: data.category.name + ' - ' + settings.value['blog.description'],
                description: data.category.description || settings.value['blog.description'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/category/${data.category.slug}`,
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJS'] || "",
                customCSS: settings.value['blog.customCSS'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "tag":
            break;
        case "author":
            break;
        case "settings":
            break;
    }
};