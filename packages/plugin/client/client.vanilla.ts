//@ts-nocheck

/**
 * @description Get the environment variable
 * @param {string} key - The key of the environment variable
 * @returns {string | undefined} The environment variable
 */
export const getEnv = (key) => {
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }
    return undefined;
};

/**
 * @description API client for making HTTP requests
 */
export class ApiClient {
    constructor() {
        this.baseUrl = getEnv('VITE_API_URL') || 'http://localhost:5000';
        this.baseUrlFrontend = getEnv('VITE_API_URL_FRONT') || 'http://localhost:5000';
        this.isSSR = typeof window === 'undefined';
    }

    /**
     * Make a GET request
     * @param {string} path - The path to request
     * @param {string} key - Optional cache key
     * @returns {Promise<any>} - The response data
     */
    async get(path, key) {
        try {
            const response = await fetch(`${this.baseUrlFrontend}/${path}`);
            const data = await response.json();
            return data?.result || data;
        } catch (error) {
            console.error(`Error fetching ${path}:`, error);
            return null;
        }
    }

    /**
     * Make a POST request
     * @param {string} path - The path to request
     * @param {any} payload - The data to send
     * @param {string} key - Optional cache key
     * @returns {Promise<any>} - The response data
     */
    async post(path, payload, key) {
        try {
            const response = await fetch(`${this.baseUrl}/api/${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return data?.result || data;
        } catch (error) {
            console.error(`Error posting to ${path}:`, error);
            return null;
        }
    }

    /**
     * Make a PUT request
     * @param {string} path - The path to request
     * @param {any} payload - The data to send
     * @param {string} key - Optional cache key
     * @returns {Promise<any>} - The response data
     */
    async put(path, payload, key) {
        try {
            const response = await fetch(`${this.baseUrl}/api/${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return data?.result || data;
        } catch (error) {
            console.error(`Error updating ${path}:`, error);
            return null;
        }
    }
}

/**
 * @description Blog client for interacting with the blog API
 */
export class BlogClient {
    constructor() {
        this.api = new ApiClient();
        this.categoriesData = [];
        this.tagsData = [];
        this.settingsData = [];
    }

    // Categories
    async getAllCategories() {
        const data = await this.api.get('blog/categories');
        if (data) {
            this.categoriesData = data;
        }
        return data;
    }

    async getCategoryById(id) {
        return await this.api.get(`blog/categories/${id}`);
    }

    async getCategoryBySlug(slug) {
        return await this.api.get(`blog/categories/slug/${slug}`);
    }

    // Tags
    async getAllTags() {
        const data = await this.api.get('blog/posts/tags');
        if (data) {
            this.tagsData = data;
        }
        return data;
    }

    async getPostsByTagSlug(tagSlug) {
        return await this.api.get(`/blog/posts/tags/${tagSlug}`);
    }

    // Settings
    async getAllSettings() {
        const data = await this.api.get('settings');
        if (data) {
            this.settingsData = data;
        }
        return data;
    }

    // Posts
    async getPosts(offset = 0) {
        const urlQueries = new URLSearchParams({
            limit: '10',
            status: 'published',
            sort: 'ASC',
            sortBy: 'publishedAt',
            offset: offset.toString()
        }).toString();

        return await this.api.get(`blog/posts?${urlQueries}`);
    }

    async searchPosts(query) {
        const urlQueries = new URLSearchParams({
            limit: '10',
            status: 'published',
            sort: 'ASC',
            sortBy: 'publishedAt',
            search: query,
            searchField: 'title'
        }).toString();

        return await this.api.get(`blog/posts?${urlQueries}`);
    }

    async getPostById(id) {
        return await this.api.get(`blog/posts/${id}`);
    }

    async getPostBySlug(slug) {
        return await this.api.get(`blog/posts/slug/${slug}`);
    }

    async getPostByAuthor(author) {
        const urlQueries = new URLSearchParams({
            author: author,
            limit: '5',
            status: 'published',
            sort: 'DESC',
            sortBy: 'publishedAt'
        }).toString();

        return await this.api.get(`blog/posts?${urlQueries}`);
    }

    // Pages
    async getPageById(id) {
        return await this.api.get(`blog/pages/${id}`);
    }

    async getPageBySlug(slug) {
        return await this.api.get(`blog/pages/slug/${slug}`);
    }

    // Authors
    async getAuthorById(id) {
        return await this.api.get(`authors/${id}`);
    }

    async getAuthorBySlug(slug) {
        return await this.api.get(`authors/slug/${slug}`);
    }

    // Members
    async createMember(payload) {
        return await this.api.post('members', payload);
    }

    async getMemberProfile(id) {
        return await this.api.get(`blog/members/profile/${id}`);
    }

    async getMyProfile() {
        return await this.api.get('blog/members/me');
    }

    async updateMemberProfile(id, payload) {
        return await this.api.put(`blog/members/profile/${id}`, payload);
    }

    // Analytics
    registerAnalyticsAccess(path) {
        if (typeof window !== 'undefined') {
            window.addEventListener('load', () => {
                const url = new URL(window.location.href);
                const data = new URLSearchParams({
                    path: path || url.pathname,
                    t: Date.now().toString(),
                    r: Math.random().toString()
                });

                navigator.sendBeacon('/api/analytics/access', data);
            });
        }
    }

    registerAnalyticsUnload(path) {
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                const url = new URL(window.location.href);
                const data = new URLSearchParams({
                    path: path || url.pathname,
                    t: Date.now().toString(),
                    r: Math.random().toString()
                });

                navigator.sendBeacon('/api/analytics/unload', data);
            });
        }
    }
}

/**
 * Creates a new blog client instance
 * @returns {BlogClient} A new BlogClient instance
 */
export const createBlogClient = () => {
    return new BlogClient();
};

/**
 * @description Create the LD+JSON for the page
 * @param {string} type - The type of the page
 * @param {any} data - The data of the page
 * @param {any} settings - The settings of the blog
 * @returns {Object} The LD+JSON object
 */
export const createLdJSON = (type, data, settings) => {
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
                        "keywords": data.tags.map(tag => tag.name).join(', ').toLowerCase(),
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
};
