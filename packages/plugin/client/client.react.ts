//@ts-nocheck

/**
 * Check if React is installed
 */
let React;
let useState;
let useCallback;
let useEffect;

try {
    React = require('react');
    useState = React.useState;
    useCallback = React.useCallback;
    useEffect = React.useEffect;
} catch (e) {
    console.warn('React is not installed, @cmmv/blog React client will not work properly');

}

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
    const baseUrl = getEnv('VITE_API_URL') || "http://localhost:5000";
    const baseUrlFrontend = getEnv('VITE_API_URL_FRONT') || "http://localhost:5000";
    const isSSR = typeof window === 'undefined';

    const get = useCallback(async <T>(path: string, key?: string) => {
        const cacheKey = key || `get:${path}`;
        const [data, setData] = useState<T | null>(null);

        useEffect(() => {
            if (data === null) {
                if (!isSSR) {
                    (async () => {
                        try {
                            const response = await fetch(`${baseUrlFrontend}/${path}`);
                            const result = await response.json();
                            setData(result?.result || result);
                        } catch (error) {
                            console.error(`Error fetching ${path}:`, error);
                        }
                    })();
                }
            }
        }, [path]);

        return { data, isLoading: data === null };
    }, [baseUrl, baseUrlFrontend, isSSR]);

    const post = useCallback(async <T>(path: string, payload: any, key?: string) => {
        const [data, setData] = useState<T | null>(null);
        const [isLoading, setIsLoading] = useState<boolean>(false);

        const executePost = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${baseUrl}/api/${path}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                setData(result.result || result);
            } catch (error) {
                console.error(`Error posting to ${path}:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        return { data, isLoading, executePost };
    }, [baseUrl]);

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
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [tagsData, setTagsData] = useState<any[]>([]);
    const [settingsData, setSettingsData] = useState<any[]>([]);
    const api = useApi();
    const baseUrl = getEnv('VITE_API_URL') || "http://localhost:5000";

    // Group functions by entity type
    const categories = {
        getAll: useCallback(async () => {
            const { data, isLoading } = await api.get<any[]>("blog/categories", "categories");
            if (data) {
                setCategoriesData(data);
            }
            return { data, isLoading };
        }, [api]),

        getById: useCallback(async (id: string) => {
            const { data, isLoading } = await api.get<any[]>(`blog/categories/${id}`, "category");
            return { data, isLoading };
        }, [api]),

        getBySlug: useCallback(async (slug: string) => {
            const { data, isLoading } = await api.get<any[]>(`blog/categories/slug/${slug}`, "category");
            return { data, isLoading };
        }, [api])
    };

    const tags = {
        getAll: useCallback(async () => {
            const { data, isLoading } = await api.get<any[]>("blog/posts/tags", "tags");
            if (data) {
                setTagsData(data);
            }
            return { data, isLoading };
        }, [api]),

        getPostsBySlug: useCallback(async (tagSlug: string) => {
            const { data, isLoading } = await api.get<any[]>(`/blog/posts/tags/${tagSlug}`, "post");
            return { data, isLoading };
        }, [api])
    };

    const settings = {
        getAll: useCallback(async () => {
            const { data, isLoading } = await api.get<any[]>("settings", "settings");
            if (data) {
                setSettingsData(data);
            }
            return { data, isLoading };
        }, [api])
    };

    const posts = {
        getAll: useCallback(async (offset: number = 0) => {
            const urlQueries = new URLSearchParams({
                limit: "10",
                status: "published",
                sort: "ASC",
                sortBy: "publishedAt",
                offset: offset.toString()
            }).toString();

            const { data, isLoading } = await api.get<any[]>(`blog/posts?${urlQueries}`, "posts");
            return { data, isLoading };
        }, [api]),

        search: useCallback(async (query: string) => {
            const urlQueries = new URLSearchParams({
                limit: "10",
                status: "published",
                sort: "ASC",
                sortBy: "publishedAt",
                search: query,
                searchField: "title"
            }).toString();

            const { data, isLoading } = await api.get<any[]>(`blog/posts?${urlQueries}`, "posts");
            return { data, isLoading };
        }, [api]),

        getById: useCallback(async (id: string) => {
            const { data, isLoading } = await api.get<any[]>(`blog/posts/${id}`, "post");
            return { data, isLoading };
        }, [api]),

        getBySlug: useCallback(async (slug: string) => {
            const { data, isLoading } = await api.get<any[]>(`blog/posts/slug/${slug}`, "post");
            return { data, isLoading };
        }, [api]),

        getByAuthor: useCallback(async (author: string) => {
            const urlQueries = new URLSearchParams({
                author: author,
                limit: "5",
                status: "published",
                sort: "DESC",
                sortBy: "publishedAt"
            }).toString();

            const { data, isLoading } = await api.get<any[]>(`blog/posts?${urlQueries}`, "post");
            return { data, isLoading };
        }, [api])
    };

    const pages = {
        getById: useCallback(async (id: string) => {
            const { data, isLoading } = await api.get<any[]>(`blog/pages/${id}`, "page");
            return { data, isLoading };
        }, [api]),

        getBySlug: useCallback(async (slug: string) => {
            const { data, isLoading } = await api.get<any[]>(`blog/pages/slug/${slug}`, "page");
            return { data, isLoading };
        }, [api])
    };

    const authors = {
        getById: useCallback(async (id: string) => {
            const { data, isLoading } = await api.get<any[]>(`authors/${id}`, "author");
            return { data, isLoading };
        }, [api]),

        getBySlug: useCallback(async (slug: string) => {
            const { data, isLoading } = await api.get<any[]>(`authors/slug/${slug}`, "author");
            return { data, isLoading };
        }, [api])
    };

    const members = {
        create: useCallback(async (payload: any) => {
            const { data, isLoading, executePost } = await api.post<any>("members", payload, "create-member");
            executePost();
            return { data, isLoading };
        }, [api]),

        getProfile: useCallback(async (id: string) => {
            const { data, isLoading } = await api.get<any>(`blog/members/profile/${id}`, `member-profile-${id}`);
            return { data, isLoading };
        }, [api]),

        getMyProfile: useCallback(async () => {
            const { data, isLoading } = await api.get<any>("blog/members/me", "current-member");
            return { data, isLoading };
        }, [api]),

        updateProfile: useCallback(async (id: string, payload: any) => {
            const [data, setData] = useState<any>(null);
            const [isLoading, setIsLoading] = useState<boolean>(false);

            const executeUpdate = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${baseUrl}/blog/members/profile/${id}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();
                    setData(result.result || result);
                } catch (error) {
                    console.error(`Error updating profile:`, error);
                } finally {
                    setIsLoading(false);
                }
            };

            return { data, isLoading, executeUpdate };
        }, [baseUrl])
    };

    const analytics = {
        registerAccess: useCallback((path: string, postId: string) => {
            useEffect(() => {
                const handleLoad = () => {
                    const url = new URL(window.location.href);
                    const data = new URLSearchParams({
                        path: url.pathname,
                        t: Date.now().toString(),
                        r: Math.random().toString()
                    });

                    navigator.sendBeacon('/api/analytics/access', data);
                };

                window.addEventListener('load', handleLoad);
                return () => window.removeEventListener('load', handleLoad);
            }, []);
        }, []),

        registerUnload: useCallback((path: string, postId: string) => {
            useEffect(() => {
                const handleUnload = () => {
                    const url = new URL(window.location.href);
                    const data = new URLSearchParams({
                        path: url.pathname,
                        t: Date.now().toString(),
                        r: Math.random().toString()
                    });

                    navigator.sendBeacon('/api/analytics/unload', data);
                };

                window.addEventListener('beforeunload', handleUnload);
                return () => window.removeEventListener('beforeunload', handleUnload);
            }, []);
        }, [])
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
        // Exposed states
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
    switch (type) {
        case "post":
            let authorLinks = [];

            if (data.author.facebook)
                authorLinks.push(`https://www.facebook.com/${data.author.facebook}`);

            if (data.author.twitter)
                authorLinks.push(`https://twitter.com/${data.author.twitter}`);

            if (data.author.linkedin)
                authorLinks.push(`https://www.linkedin.com/in/${data.author.linkedin}`);

            if (data.author.instagram)
                authorLinks.push(`https://www.instagram.com/${data.author.instagram}`);

            if (data.author.youtube)
                authorLinks.push(`https://www.youtube.com/${data.author.youtube}`);

            if (data.author.github)
                authorLinks.push(`https://github.com/${data.author.github}`);

            if (data.author.website)
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
                        "name": data.title + " -" + settings['blog.title'],
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
