//@ts-nocheck
import { ref, inject, App } from "vue";

const PRELOADED_KEY = Symbol('preloaded');
type FetchMap = Record<string, Promise<any>>;
let ssrData: FetchMap = {};

/**
 * @description Use the API to fetch data from the server
 * @returns {Object} The API object
 */
export const useApi = () => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
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
 * @description Inject the SEO metadata into the page
 * @param {string} type - The type of the page
 * @param {any} data - The data of the page
 */
export const injectSEO = async (type: string, data: any = null) => {
    const blogAPI = useBlog();
    const settings = ref<any>(await blogAPI.getAllSettings());
    let keywords = data.keywords || settings.value['blog.keywords'];
    let description = data.description || data.excerpt;
    let metadata = [
        `<meta property="og:locale" content="${settings.value['blog.language']}" />`,
        `<meta property="og:site_name" content="${settings.value['blog.title']}" />`,
    ];

    switch(type){
        case "index":
            metadata.push(
                `<meta property="og:type" content="website" />`,
                `<meta property="og:title" content="${settings.value['blog.title']}" />`,
                `<meta property="og:description" content="${settings.value['blog.metaDescription'] || settings.value['blog.description'] || ""}" />`,
                `<meta property="og:keywords" content="${settings.value['blog.metaKeywords'] || settings.value['blog.keywords'] || ""}" />`,
                `<meta property="og:image" content="${settings.value['blog.defaultFeaturedImage']}" />`,
                `<meta property="og:url" content="${import.meta.env.VITE_WEBSITE_URL}" />`,
                `<meta property="og:image:type" content="image/webp" />`,
                `<meta property="og:image:alt" content="${settings.value['blog.title']}" />`,
                `<meta property="og:image:secure_url" content="${settings.value['blog.defaultFeaturedImage']}" />`,
                `<meta property="og:image:width" content="1440" />`,
                `<meta property="og:image:height" content="1440" />`,
                `<meta property="og:image:type" content="image/webp" />`
            )

            globalThis.__SSR_METADATA__ = {
                title: settings.value['blog.title'] + ' - ' + settings.value['blog.description'],
                description: settings.value['blog.metaDescription'] || settings.value['blog.description'] || "",
                keywords: settings.value['blog.metaKeywords'] || settings.value['blog.keywords'] || "",
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}`,
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "post":
            if(!keywords && data.tags && data.tags.length > 0)
                keywords = data.tags.map((tag: any) => tag.name).join(', ').toLowerCase();

            if(!keywords)
                keywords = settings.value['blog.keywords'];

            if(!description)
                description = data.content.substring(0, 150) + '...';

            if(description.length > 150)
                description = description.substring(0, 150) + '...';

            for(let keyword of keywords.split(', ')){
                metadata.push(
                    `<meta property="article:tag" content="${keyword}" />`
                );
            }

            metadata.push(
                `<meta property="og:type" content="website" />`,
                `<meta property="og:title" content="${data.title}" />`,
                `<meta property="og:description" content="${description || ""}" />`,
                `<meta property="og:keywords" content="${keywords || ""}" />`,
                `<meta property="og:image" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta property="og:url" content="${import.meta.env.VITE_WEBSITE_URL}" />`,
                `<meta property="og:image:type" content="image/webp" />`,
                `<meta property="og:image:alt" content="${settings.value['blog.title']}" />`,
                `<meta property="og:image:secure_url" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta property="og:image:width" content="1200" />`,
                `<meta property="og:image:height" content="675" />`,
                `<meta property="og:image:type" content="image/webp" />`,
                `<meta property="og:updated_time" content="${new Date(data.updatedAt).toISOString()}" />`,
                `<meta property="article:published_time" content="${data.status === 'published' ? new Date(data.publishedAt).toISOString() : new Date(data.createdAt).toISOString()}" />`,
                `<meta property="article:modified_time" content="${new Date(data.updatedAt).toISOString()}" />`,
                `<meta name="twitter:card" content="summary_large_image" />`,
                `<meta name="twitter:title" content="${data.title}" />`,
                `<meta name="twitter:description" content="${description || ""}" />`,
                `<meta name="twitter:image" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta name="twitter:url" content="${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}" />`,
                `<meta name="twitter:label1" content="Written by" />`,
                `<meta name="twitter:data1" content="${data.author.name || settings.value['blog.author']}" />`,
                `<meta name="twitter:label2" content="Published" />`,
                `<meta name="twitter:data2" content="${new Date(data.publishedAt).toISOString()}" />`,
                `<script type="application/ld+json">${JSON.stringify(createLdJSON('post', data, settings))}</script>`,
                `<link rel="alternate" type="application/rss+xml" title="Feed para ${settings.value['blog.title']} &raquo;" href="${import.meta.env.VITE_WEBSITE_URL}/feed" />`,
                `<link rel="alternate" type="application/rss+xml" title="Feed de comentários para ${settings.value['blog.title']} &raquo;" href="${import.meta.env.VITE_WEBSITE_URL}/comments/feed" />`,
                `<link rel="alternate" type="application/rss+xml" title="Feed de comentários para ${settings.value['blog.title']} &raquo; ${data.title} " href="${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}/feed" />`
            );

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
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
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

            metadata.push(
                `<meta property="og:type" content="website" />`,
                `<meta property="og:title" content="${data.title}" />`,
                `<meta property="og:description" content="${description || ""}" />`,
                `<meta property="og:keywords" content="${keywords || ""}" />`,
                `<meta property="og:image" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta property="og:url" content="${import.meta.env.VITE_WEBSITE_URL}" />`,
                `<meta property="og:image:type" content="image/webp" />`,
                `<meta property="og:image:alt" content="${settings.value['blog.title']}" />`,
                `<meta property="og:image:secure_url" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta property="og:image:width" content="1200" />`,
                `<meta property="og:image:height" content="675" />`,
                `<meta property="og:image:type" content="image/webp" />`
            )

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
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
        break;
        case "category":
            globalThis.__SSR_METADATA__ = {
                title: data.category.name + ' - ' + settings.value['blog.description'],
                description: data.category.description || settings.value['blog.description'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/category/${data.category.slug}`,
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "tag":
            break;
        case "author":
            globalThis.__SSR_METADATA__ = {
                title: data.author.name,
                description: data.author.bio || settings.value['blog.description'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/author/${data.author.slug}`,
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "settings":
            break;
    }
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
                        "@id": `${import.meta.env.VITE_WEBSITE_URL}/#person`,
                        "name": data.author.name,
                        "logo": {
                            "@type": "ImageObject",
                            "@id": `${import.meta.env.VITE_WEBSITE_URL}/#logo`,
                            "url": settings.value['blog.image'] || settings.value['blog.defaultFeaturedImage'],
                            "caption": data.author.name,
                            "inLanguage": settings.value['blog.language'],
                            "width": "1440",
                            "height": "1440"
                        },
                        "image": {
                            "@type": "ImageObject",
                            "@id": `${import.meta.env.VITE_WEBSITE_URL}/#logo`,
                            "url": settings.value['blog.logo'],
                            "caption": data.author.name,
                            "inLanguage": settings.value['blog.language'],
                            "width": "1440",
                            "height": "1440"
                        }
                    },
                    {
                        "@type": "WebSite",
                        "@id": `${import.meta.env.VITE_WEBSITE_URL}/#website`,
                        "url": import.meta.env.VITE_WEBSITE_URL,
                        "name": settings.value['blog.title'],
                        "publisher": {
                            "@id": `${import.meta.env.VITE_WEBSITE_URL}/#person`
                        },
                        "inLanguage": settings.value['blog.language']
                    },
                    {
                        "@type": "ImageObject",
                        "@id": data.featureImage || settings.value['blog.image'],
                        "url": data.featureImage || settings.value['blog.image'],
                        "width": "1200",
                        "height": "630",
                        "inLanguage": "pt-BR"
                    },
                    {
                        "@type": "WebPage",
                        "@id": `${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}/#webpage`,
                        "url": `${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}`,
                        "name": data.title,
                        "datePublished": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "dateModified": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "isPartOf": {
                          "@id": `${import.meta.env.VITE_WEBSITE_URL}/#website`
                        },
                        "primaryImageOfPage": {
                          "@id": data.featureImage || settings.value['blog.image']
                        },
                        "inLanguage": settings.value['blog.language']
                    },
                    {
                        "@type": "Person",
                        "@id": `${import.meta.env.VITE_WEBSITE_URL}/author/${data.author.slug}`,
                        "name": data.author.name,
                        "url": `${import.meta.env.VITE_WEBSITE_URL}/author/${data.author.slug}`,
                        "image": {
                          "@type": "ImageObject",
                          "@id": data.author.avatar,
                          "url": data.author.avatar,
                          "caption": data.author.name,
                          "inLanguage": settings.value['blog.language']
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
                            "@id": `${import.meta.env.VITE_WEBSITE_URL}/author/${data.author.slug}`
                        },
                        "publisher": {
                            "@id": `${import.meta.env.VITE_WEBSITE_URL}/#person`
                        },
                        "name": data.title + " -" +settings.value['blog.title'],
                        "@id": `${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}/#richSnippet`,
                        "isPartOf": {
                            "@id": `${import.meta.env.VITE_WEBSITE_URL}/#website`
                        },
                        "image": {
                            "@id": data.featureImage || settings.value['blog.image']
                        },
                        "inLanguage": "pt-BR",
                        "mainEntityOfPage": {
                            "@id": `${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}/#webpage`
                        }
                    }
                ]
            }
            break;
    }
}