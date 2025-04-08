import { useApi } from './api';

export const useAdminClient = () => {
    const api = useApi();

    const getSettings = async () => {
        return await api.getSettings();
    };

    const getRootSettings = async () => {
        return await api.getRootSettings();
    };

    const updateSettings = async (data: any) => {
        return await api.updateSettings(data);
    };

    const saveSetup = async (data: any) => {
        return await api.saveSetup(data);
    };

    //Profile
    const getProfile = async () => {
        return await await api.authRequest('profile', 'GET');
    };

    const updateProfile = async (data: any) => {
        return await api.authRequest('profile', 'PUT', data);
    };

    //Categories
    const getCategories = async (filters: Record<string, string>) => {
        const urlQueries = new URLSearchParams(filters).toString();
        return await api.authRequest(`categories?${urlQueries}`, 'GET');
    };

    const insertCategory = async (data: { name: string }) => {
        return await api.authRequest('categories', 'POST', data);
    };

    const updateCategory = async (id: string, data: { name: string }) => {
        return await api.authRequest(`categories/${id}`, 'PUT', data);
    };

    const deleteCategory = async (id: string) => {
        return await api.authRequest(`categories/${id}`, 'DELETE');
    };

    //Tags
    const getTags = async (filters: Record<string, string>) => {
        const urlQueries = new URLSearchParams(filters).toString();
        return await api.authRequest(`tags?${urlQueries}`, 'GET');
    };

    const insertTag = async (data: { name: string }) => {
        return await api.authRequest('tags', 'POST', data);
    };

    const updateTag = async (id: string, data: { name: string }) => {
        return await api.authRequest(`tags/${id}`, 'PUT', data);
    };

    const deleteTag = async (id: string) => {
        return await api.authRequest(`tags/${id}`, 'DELETE');
    };

    //Session
    const checkSession = async () => {
        return api.checkSession();
    };

    const login = async (data: { username: string; password: string }) => {
        return await api.login(data);
    };

    const logout = async () => {
        return await api.logout();
    };

    //Posts
    const savePost = async (data: any) => {
        return await api.authRequest('blog/posts', 'POST', data);
    };

    const getPosts = async (queries: any) => {
        return await api.authRequest('blog/posts', 'GET', queries);
    };

    const getPost = async (id: string) => {
        return await api.authRequest(`blog/posts/${id}`, 'GET');
    };

    const updatePost = async (id: string, data: any) => {
        return await api.authRequest(`blog/posts/${id}`, 'PUT', data);
    };

    //Pages
    const savePage = async (data: any) => {
        return await api.authRequest('blog/pages', 'POST', data);
    };

    const getPages = async (queries: any) => {
        return await api.authRequest('blog/pages', 'GET', queries);
    };

    const getPage = async (id: string) => {
        return await api.authRequest(`blog/pages/${id}`, 'GET');
    };

    const updatePage = async (id: string, data: any) => {
        return await api.authRequest(`blog/pages/${id}`, 'PUT', data);
    };

    const deletePage = async (id: string) => {
        return await api.authRequest(`blog/pages/${id}`, 'DELETE');
    };

    //Authors
    const getAuthors = async () => {
        return await api.authRequest('authors', 'GET');
    };

    const createAuthor = async (data: any) => {
        return await api.authRequest('authors', 'POST', data);
    };

    const deleteAuthor = async (id: string) => {
        return await api.authRequest(`authors/${id}`, 'DELETE');
    };

    //Medias
    const getMedias = async (queries: any) => {
        const urlQueries = new URLSearchParams(queries).toString();
        return await api.authRequest(`medias?${urlQueries}`, 'GET');
    };

    const processImage = async (data: { image: string, format: string, maxWidth: number, alt: string, caption: string }) => {
        return await api.authRequest('images', 'POST', data);
    };

    //Members
    const createMember = async (data: any) => {
        return await api.authRequest('members', 'POST', data);
    };

    return {
        login,
        logout,
        checkSession,
        getRootSettings,
        updateSettings,
        getProfile,
        updateProfile,
        getCategories,
        getSettings,
        insertCategory,
        updateCategory,
        deleteCategory,
        getTags,
        insertTag,
        updateTag,
        deleteTag,
        saveSetup,
        savePost,
        getPost,
        getPosts,
        updatePost,
        getAuthors,
        createAuthor,
        deleteAuthor,
        createMember,
        savePage,
        getPages,
        getPage,
        updatePage,
        deletePage,
        getMedias,
        processImage
    }
};