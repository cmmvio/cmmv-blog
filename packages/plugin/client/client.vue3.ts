//@ts-nocheck

// Define fallback implementations
let ref = (val) => ({ value: val });
let inject = () => ({});
let App = function() {};

// Try to import Vue
try {
  const Vue = require('vue');
  ref = Vue.ref;
  inject = Vue.inject;
  App = Vue.App;
} catch (e) {
  console.warn('Vue is not installed, @cmmv/blog Vue client will not work properly');
}

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
    const baseUrl = getEnv('VITE_API_URL') || "http://localhost:5001/api";
    const baseUrlFrontend = getEnv('VITE_API_URL_FRONT') || "http://localhost:5001/api";
    const preloaded = inject<Record<string, any>>(PRELOADED_KEY, {});
    const isSSR = typeof window === 'undefined';

    const get = async <T>(path: string, key?: string) => {
        const cacheKey = key || `get:${path}`;
        const data = ref<T | null>(preloaded[cacheKey] ?? null);

        if (isSSR) {
            if (!globalThis.__SSR_DATA__) {
                globalThis.__SSR_DATA__ = {};
            }

            if (!globalThis.__SSR_DATA__[cacheKey]) {
                try {
                    const response = await fetch(`${baseUrl}/${path}`);
                    const result = await response.json();
                    globalThis.__SSR_DATA__[cacheKey] = result?.result || result;
                } catch (error) {
                    console.error(`Error fetching ${path}:`, error);
                    globalThis.__SSR_DATA__[cacheKey] = null;
                }
            }

            data.value = globalThis.__SSR_DATA__[cacheKey];
        }
        else if (data.value === null) {
            try {
                const response = await fetch(`${baseUrlFrontend}/${path}`);
                const result = await response.json();
                data.value = result?.result || result;
            } catch (error) {
                console.error(`Error fetching ${path}:`, error);
            }
        }

        return { data };
    };

    const post = async <T>(path: string, payload: any, key?: string) => {
        try {
            const apiUrl = isSSR ? baseUrl : baseUrlFrontend;
            const response = await fetch(`${apiUrl}/${path}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            return result.result || result;
        } catch (error) {
            console.error(`Error posting to ${path}:`, error);
        }

        return null;
    };

    const put = async <T>(path: string, payload: any, key?: string) => {
        try {
            const apiUrl = isSSR ? baseUrl : baseUrlFrontend;
            const response = await fetch(`${apiUrl}/${path}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            return result.result || result;
        } catch (error) {
            console.error(`Error posting to ${path}:`, error);
        }

        return null;
    }

    const getAuth = async <T>(path: string, key?: string) => {
        const cacheKey = key || `get:${path}`;
        const data = ref<T | null>(preloaded[cacheKey] ?? null);

        try {
            const sessionData = sessionStorage.getItem('member');
            const localData = localStorage.getItem('member');
            const token = sessionData ? JSON.parse(sessionData).token : localData ? JSON.parse(localData).token : null;

            const response = await fetch(`${baseUrlFrontend}/${path}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            data.value = result.result || result;
        } catch (error) {
            console.error(`Error fetching ${path}:`, error);
        }

        return { data };
    }

    const putAuth = async <T>(path: string, payload: any, key?: string) => {
        try {
            const apiUrl = isSSR ? baseUrl : baseUrlFrontend;
            const response = await fetch(`${apiUrl}/${path}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error(`Error posting to ${path}:`, error);
        }

        return null;
    }

    return {
        get,
        post,
        put,
        getAuth,
        putAuth
    };
};

/**
 * @description Use the Blog API to fetch data from the server
 * @returns {Object} The Blog API object
 */
export const useBlog = () => {
    const categoriesData = ref<any[]>([]);
    const tagsData = ref<any[]>([]);
    const settingsData = ref<any[]>([]);
    const api = useApi();

    // Group functions by entity type
    const categories = {
        getAll: async () => {
            const { data } = await api.get<any[]>("blog/categories", "categories");
            categoriesData.value = data.value || [];
            return data.value || [];
        },
        getById: async (id: string, offset: number = 0) => {
            const urlQueries = new URLSearchParams({ limit: "10", offset: offset.toString() }).toString();
            const { data } = await api.get<any[]>(`blog/categories/${id}?${urlQueries}`, "category");
            return data.value || [];
        },
        getBySlug: async (slug: string, offset: number = 0) => {
            const urlQueries = new URLSearchParams({ limit: "10", offset: offset.toString() }).toString();
            const { data } = await api.get<any[]>(`blog/categories/slug/${slug}?${urlQueries}`, "category");
            return data.value || [];
        }
    };

    const tags = {
        getAll: async () => {
            const { data } = await api.get<any[]>("blog/posts/tags", "tags");
            tagsData.value = data.value || [];
            return data.value || [];
        },
        getPostsBySlug: async (tagSlug: string, offset: number = 0) => {
            const urlQueries = new URLSearchParams({ limit: "32", offset: offset.toString() }).toString();
            const { data } = await api.get<any[]>(`blog/posts/tags/${tagSlug}?${urlQueries}`, "post");
            return data.value || [];
        }
    };

    const settings = {
        getAll: async () => {
            const { data } = await api.get<any[]>("settings", "settings");
            settingsData.value = data.value || [];
            return data.value || [];
        }
    };

    const posts = {
        getAll: async (offset: number = 0) => {
            const urlQueries = new URLSearchParams({
                limit: "32",
                status: "published",
                sort: "ASC",
                sortBy: "publishedAt",
                offset: offset.toString()
            }).toString();

            const { data } = await api.get<any[]>(`blog/posts?${urlQueries}`, "posts");
            return data.value || [];
        },
        search: async (query: string) => {
            const urlQueries = new URLSearchParams({
                limit: "10",
                status: "published",
                sort: "ASC",
                sortBy: "publishedAt",
                search: query,
                searchField: "title"
            }).toString();

            const { data } = await api.get<any[]>(`blog/posts?${urlQueries}`, "posts");
            return data.value || [];
        },
        getById: async (id: string) => {
            const { data } = await api.get<any[]>(`blog/posts/${id}`, "post");
            return data.value || [];
        },
        getBySlug: async (slug: string) => {
            const { data } = await api.get<any[]>(`blog/posts/slug/${slug}`, "post");
            return data.value || [];
        },
        getByAuthor: async (author: string) => {
            const urlQueries = new URLSearchParams({
                author: author,
                limit: "5",
                status: "published",
                sort: "DESC",
                sortBy: "publishedAt"
            }).toString();

            const { data } = await api.get<any[]>(`blog/posts?${urlQueries}`, "post");
            return data.value || [];
        }
    };

    const pages = {
        getById: async (id: string) => {
            const { data } = await api.get<any[]>(`blog/pages/${id}`, "page");
            return data.value || [];
        },
        getBySlug: async (slug: string) => {
            const { data } = await api.get<any[]>(`blog/pages/slug/${slug}`, "page");
            return data.value || [];
        }
    };

    const authors = {
        getById: async (id: string) => {
            const { data } = await api.get<any[]>(`authors/${id}`, "author");
            return data.value || [];
        },
        getBySlug: async (slug: string) => {
            const { data } = await api.get<any[]>(`authors/slug/${slug}`, "author");
            return data.value || [];
        }
    };

    const members = {
        create: async (payload: any) => {
            const response = await api.post<any>("blog/members", payload, "create-member");
            return response || null;
        },
        getProfile: async (id: string) => {
            const { data } = await api.getAuth<any>(`blog/members/profile/${id}`, `member-profile-${id}`);
            return data.value || null;
        },
        getMyProfile: async () => {
            const { data } = await api.getAuth<any>("blog/members/me", "current-member");
            return data.value || null;
        },
        updateProfile: async (id: string, payload: any) => {
            const response = await api.putAuth<any>(`blog/members/profile/${id}`, payload, `member-profile-${id}`);
            return response || null;
        },
        login: async (payload: any) => {
            const response = await api.post<any>("blog/members/login", payload, "login-member");
            return response || null;
        }
    };

    const analytics = {
        registerAccess: async (path: string, postId: string) => {
            window.addEventListener('load', () => {
                const url = new URL(window.location.href);
                const data = new URLSearchParams({
                    path: url.pathname,
                    t: Date.now().toString(),
                    r: Math.random().toString()
                });

                navigator.sendBeacon('/api/analytics/access', data);
            });
        },
        registerUnload: async (path: string, postId: string) => {
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
    };

    return {
        categories,
        tags,
        settings,
        posts,
        pages,
        authors,
        members,
        analytics,
        // For backward compatibility
        getAllCategories: categories.getAll,
        getAllTags: tags.getAll,
        getAllSettings: settings.getAll,
        getPosts: posts.getAll,
        getPostById: posts.getById,
        getPostBySlug: posts.getBySlug,
        getPostByAuthor: posts.getByAuthor,
        getPostsByTagSlug: tags.getPostsBySlug,
        getPageById: pages.getById,
        getPageBySlug: pages.getBySlug,
        getCategoryById: categories.getById,
        getCategoryBySlug: categories.getBySlug,
        getAuthorById: authors.getById,
        getAuthorBySlug: authors.getBySlug,
        registerAnalyticsAccess: analytics.registerAccess,
        registerAnalyticsUnload: analytics.registerUnload,
        // Exposed refs
        categoriesData,
        tagsData,
        settingsData
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
