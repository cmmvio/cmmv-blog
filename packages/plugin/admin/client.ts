import { useApi } from './api';

export const useAdminClient = () => {
    const api = useApi();

    const settings = {
        get: () => api.getSettings(),
        getRoot: () => api.getRootSettings(),
        update: (data: any) => api.updateSettings(data),
        saveSetup: (data: any) => api.saveSetup(data),
    };

    const profile = {
        get: () => api.authRequest('profile', 'GET'),
        update: (data: any) => api.authRequest('profile', 'PUT', data),
    };

    const categories = {
        get: (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`categories?${query}`, 'GET');
        },
        insert: (data: { name: string }) => api.authRequest('categories', 'POST', data),
        update: (id: string, data: { name: string }) => api.authRequest(`categories/${id}`, 'PUT', data),
        delete: (id: string) => api.authRequest(`categories/${id}`, 'DELETE'),
    };

    const tags = {
        get: (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`tags?${query}`, 'GET');
        },
        insert: (data: { name: string }) => api.authRequest('tags', 'POST', data),
        update: (id: string, data: { name: string }) => api.authRequest(`tags/${id}`, 'PUT', data),
        delete: (id: string) => api.authRequest(`tags/${id}`, 'DELETE'),
    };

    const session = {
        check: () => api.checkSession(),
        login: (data: { username: string; password: string }) => api.login(data),
        logout: () => api.logout(),
    };

    const posts = {
        get: (filters: Record<string, any>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`blog/posts/admin?${query}&t=${new Date().getTime()}`, 'GET');
        },
        getById: (id: string) => api.authRequest(`blog/posts/${id}?t=${new Date().getTime()}`, 'GET'),
        save: (data: any) => api.authRequest('blog/posts', 'POST', data),
        update: (id: string, data: any) => api.authRequest(`blog/posts/${id}`, 'PUT', data),
        delete: (id: string) => api.authRequest(`blog/posts/${id}`, 'DELETE'),
    };

    const pages = {
        get: (filters: Record<string, any>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`blog/pages?${query}&t=${new Date().getTime()}`, 'GET');
        },
        getById: (id: string) => api.authRequest(`blog/pages/${id}`, 'GET'),
        save: (data: any) => api.authRequest('blog/pages', 'POST', data),
        update: (id: string, data: any) => api.authRequest(`blog/pages/${id}`, 'PUT', data),
        delete: (id: string) => api.authRequest(`blog/pages/${id}`, 'DELETE'),
    };

    const authors = {
        get: (filters: Record<string, any>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`authors?${query}`, 'GET');
        },
        create: (data: any) => api.authRequest('authors', 'POST', data),
        update: (id: string, data: any) => api.authRequest(`authors/${id}`, 'PUT', data),
        delete: (id: string) => api.authRequest(`authors/${id}`, 'DELETE'),
    };

    const medias = {
        get: (queries: Record<string, any>) => {
            const query = new URLSearchParams(queries).toString();
            return api.authRequest(`medias?${query}`, 'GET');
        },
        processImage: (data: {
            image: string;
            format: string;
            maxWidth: number;
            alt: string;
            caption: string;
        }) => api.authRequest('images', 'POST', data),
        update: (id: string, data: {
            alt: string;
            caption: string;
        }) => api.authRequest(`medias/${id}`, 'PUT', data),
        delete: (id: string) => api.authRequest(`medias/${id}`, 'DELETE'),
    };

    const members = {
        create: (data: any) => api.authRequest('members', 'POST', data),
        getProfile: (id: string) => api.authRequest(`blog/members/profile/${id}`, 'GET'),
        getMyProfile: () => api.authRequest('blog/members/me', 'GET'),
        updateProfile: (id: string, data: any) => api.authRequest(`blog/members/profile/${id}`, 'PUT', data),
        get: (filters: Record<string, any>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`member?${query}`, 'GET');
        },
        getById: (id: string) => api.authRequest(`member/${id}`, 'GET'),
        update: (id: string, data: any) => api.authRequest(`member/${id}`, 'PUT', data),
        insert: (data: any) => api.authRequest('member', 'POST', data),
        delete: (id: string) => api.authRequest(`member/${id}`, 'DELETE'),
    };

    const analytics = {
        getSummary: () => api.authRequest('analytics/summary', 'GET').then((res: any) => res.data),
        getPostsMostAccessed: () => api.authRequest('analytics/posts-most-accessed', 'GET'),
        getDashboard: () => api.authRequest('analytics/dashboard', 'GET'),
    };

    const comments = {
        get: (filters: Record<string, any>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`comments?${query}`, 'GET');
        },
        getWithDetails: (filters: Record<string, any>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`comments-with-details?${query}`, 'GET');
        },
        getPending: () => api.authRequest('comments/pending', 'GET'),
        getById: (id: string) => api.authRequest(`comments/${id}`, 'GET'),
        save: (data: any) => api.authRequest('comments', 'POST', data),
        update: (id: string, data: any) => api.authRequest(`comments/${id}`, 'PUT', data),
        delete: (id: string) => api.authRequest(`comments/${id}`, 'DELETE'),
    };

    const imports = {
        wordpress: (data: any) => api.authRequest('imports/wordpress', 'POST', data),
        ghost: (data: any) => api.authRequest('imports/blogger', 'POST', data),
        progress: () => api.authRequest('imports/progress', 'GET'),
        progressById: (id: string) => api.authRequest(`imports/progress/${id}`, 'GET'),
        reprocessImages: () => api.authRequest('reprocess-images', 'POST'),
        getReprocessProgress: () => api.authRequest('reprocess-images-progress', 'GET'),
        cleanupOrphanedMedia: (forceCleanup: boolean = false) => api.authRequest('cleanup-orphaned-media', 'POST', { forceCleanup }),
        cleanupDuplicatedImages: () => api.authRequest('cleanup-duplicated-images', 'POST'),
        getCleanupProgress: () => api.authRequest('cleanup-orphaned-media-progress', 'GET'),
        initCleanupProgress: () => api.authRequest('init-cleanup-progress', 'POST'),
    };

    return {
        settings,
        profile,
        categories,
        tags,
        session,
        posts,
        pages,
        authors,
        medias,
        members,
        analytics,
        comments,
        imports,
    };
};
