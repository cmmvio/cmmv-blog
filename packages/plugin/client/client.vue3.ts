//@ts-nocheck
import { ref, inject, App } from "vue";

const PRELOADED_KEY = Symbol('preloaded');
type FetchMap = Record<string, Promise<any>>;
let ssrData: FetchMap = {};

/**
 * @description Get the environment variable
 * @param {string} key - The key of the environment variable
 * @returns {string | undefined} The environment variable
 */
export const getEnv = (key: string): string | undefined => {
    if (typeof import.meta !== 'undefined' && import.meta.env)
      return import.meta.env[key]

    if (typeof process !== 'undefined' && process.env)
      return process.env[key]

    return undefined
}

/**
 * @description Use the API to fetch data from the server
 * @returns {Object} The API object
 */
export const useApi = () => {
    const baseUrl = getEnv('VITE_API_URL') || "http://localhost:3000";
    const preloaded = inject<Record<string, any>>(PRELOADED_KEY, {});

    const get = async <T>(path: string, key?: string) => {
        const cacheKey = key || `get:${path}`;
        const data = ref<T | null>(preloaded[cacheKey] ?? null);

        if (getEnv('SSR') && !preloaded[cacheKey]) {
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

        else if (!getEnv('SSR') && data.value === null) {
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

/**
 * @description Use the Blog API to fetch data from the server
 * @returns {Object} The Blog API object
 */
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
        const { data } = await api.get<any[]>("settings", "settings");
        settings.value = data.value || [];
        return data.value || [];
    };

    const getPosts = async (offset: number = 0) => {
        const urlQueries = new URLSearchParams({
            limit: "10",
            status: "published",
            sort: "ASC",
            sortBy: "publishedAt",
            offset: offset.toString()
        }).toString();

        const { data } = await api.get<any[]>(`blog/posts?${urlQueries}`, "posts");
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

    const getPostByAuthor = async (author: string) => {
        const urlQueries = new URLSearchParams({
            author: author,
            limit: "5",
            status: "published",
            sort: "DESC",
            sortBy: "publishedAt"
        }).toString();

        const { data } = await api.get<any[]>(`blog/posts?${urlQueries}`, "post");
        return data.value || [];
    };

    const getPostsByTagSlug = async (tagSlug: string) => {
        const { data } = await api.get<any[]>(`/blog/posts/tags/${tagSlug}`, "post");
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

    const registerAnalyticsAccess = async (path: string, postId: string) => {
        window.addEventListener('load', () => {
            const url = new URL(window.location.href);
            const data = new URLSearchParams({
                path: url.pathname,
                t: Date.now().toString(),
                r: Math.random().toString()
            });

            navigator.sendBeacon('/api/analytics/access', data);
        });
    }

    const registerAnalyticsUnload = async (path: string, postId: string) => {
        window.addEventListener('beforeunload', () => {
            const url = new URL(window.location.href);
            const data = new URLSearchParams({
                path: url.pathname,
                t: Date.now().toString(),
                r: Math.random().toString()
            });

            navigator.sendBeacon('/api/analytics/unload', data);
        });
    }

    return {
        getAllCategories,
        getAllTags,
        getAllSettings,
        getPosts,
        getPostById,
        getPostBySlug,
        getPostByAuthor,
        getPostsByTagSlug,
        getPageById,
        getPageBySlug,
        getCategoryById,
        getCategoryBySlug,
        getAuthorById,
        getAuthorBySlug,
        registerAnalyticsAccess,
        categories,
        tags,
        settings
    };
};

/**
 * @description Create the LD+JSON for the page
 * @param {string} type - The type of the page
 * @param {any} data - The data of the page
 * @param {any} settings - The settings of the blog
 * @returns {string} The LD+JSON
 */
export const createLdJSON = (type: string, data: any, settings: any) => {
    switch(type){
        case "post":
            let authorLinks = [];

            if(data.author.facebook)
                authorLinks.push(`https://www.facebook.com/${data.author.facebook}`);

            if(data.author.twitter)
                authorLinks.push(`https://twitter.com/${data.author.twitter}`);

            if(data.author.linkedin)
                authorLinks.push(`https://www.linkedin.com/in/${data.author.linkedin}`);

            if(data.author.instagram)
                authorLinks.push(`https://www.instagram.com/${data.author.instagram}`);

            if(data.author.youtube)
                authorLinks.push(`https://www.youtube.com/${data.author.youtube}`);

            if(data.author.github)
                authorLinks.push(`https://github.com/${data.author.github}`);

            if(data.author.website)
                authorLinks.push(data.author.website);

            return {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": [
                            "Person",
                            "Organization"
                        ],
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/#person`,
                        "name": data.author.name,
                        "logo": {
                            "@type": "ImageObject",
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#logo`,
                            "url": settings['blog.image'] || settings['blog.defaultFeaturedImage'],
                            "caption": data.author.name,
                            "inLanguage": settings['blog.language'],
                            "width": "1440",
                            "height": "1440"
                        },
                        "image": {
                            "@type": "ImageObject",
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#logo`,
                            "url": settings['blog.logo'],
                            "caption": data.author.name,
                            "inLanguage": settings['blog.language'],
                            "width": "1440",
                            "height": "1440"
                        }
                    },
                    {
                        "@type": "WebSite",
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/#website`,
                        "url": getEnv('VITE_WEBSITE_URL'),
                        "name": settings['blog.title'],
                        "publisher": {
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#person`
                        },
                        "inLanguage": settings['blog.language']
                    },
                    {
                        "@type": "ImageObject",
                        "@id": data.featureImage || settings['blog.image'],
                        "url": data.featureImage || settings['blog.image'],
                        "width": "1200",
                        "height": "630",
                        "inLanguage": "pt-BR"
                    },
                    {
                        "@type": "WebPage",
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/post/${data.slug}/#webpage`,
                        "url": `${getEnv('VITE_WEBSITE_URL')}/post/${data.slug}`,
                        "name": data.title,
                        "datePublished": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "dateModified": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "isPartOf": {
                          "@id": `${getEnv('VITE_WEBSITE_URL')}/#website`
                        },
                        "primaryImageOfPage": {
                          "@id": data.featureImage || settings['blog.image']
                        },
                        "inLanguage": settings['blog.language']
                    },
                    {
                        "@type": "Person",
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/author/${data.author.slug}`,
                        "name": data.author.name,
                        "url": `${getEnv('VITE_WEBSITE_URL')}/author/${data.author.slug}`,
                        "image": {
                          "@type": "ImageObject",
                          "@id": data.author.avatar,
                          "url": data.author.avatar,
                          "caption": data.author.name,
                          "inLanguage": settings['blog.language']
                        },
                        "sameAs": authorLinks
                      },
                    {
                        "@type": "BlogPosting",
                        "headline": data.title,
                        "keywords": data.tags.map((tag: any) => tag.name).join(', ').toLowerCase(),
                        "description": data.excerpt,
                        "datePublished": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "dateModified": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "author": {
                            "@type": "Person",
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/author/${data.author.slug}`
                        },
                        "publisher": {
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#person`
                        },
                        "name": data.title + " -" +settings['blog.title'],
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/post/${data.slug}/#richSnippet`,
                        "isPartOf": {
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#website`
                        },
                        "image": {
                            "@id": data.featureImage || settings['blog.image']
                        },
                        "inLanguage": "pt-BR",
                        "mainEntityOfPage": {
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/post/${data.slug}/#webpage`
                        }
                    }
                ]
            }
            break;
    }
}