import { useApi } from './api';

export const useAdminClient = () => {
    const api = useApi();

    const getSettings = async () => {
        return await api.getSettings();
    };

    const saveSetup = async (data: any) => {
        return await api.saveSetup(data);
    };

    const getProfile = async () => {
        return await await api.authRequest('profile', 'GET');
    };

    const updateProfile = async (data: any) => {
        return await api.authRequest('profile', 'PUT', data);
    };

    const getCategories = async (filters: Record<string, string>) => {
        const urlQueries = new URLSearchParams(filters).toString();
        const response = await api.authRequest(`categories?${urlQueries}`, 'GET');
        return response;
    };

    const insertCategory = async (data: { name: string }) => {
        const response = await api.authRequest('categories', 'POST', data);
        return response;
    };

    const updateCategory = async (id: string, data: { name: string }) => {
        const response = await api.authRequest(`categories/${id}`, 'PUT', data);
        return response;
    };

    const deleteCategory = async (id: string) => {
        const response = await api.authRequest(`categories/${id}`, 'DELETE');
        return response;
    };

    const getTags = async () => {
        const response = await api.authRequest('tags', 'GET');
        return response;
    };

    const insertTag = async (data: { name: string }) => {
        const response = await api.authRequest('tags', 'POST', data);
        return response;
    };

    const updateTag = async (id: string, data: { name: string }) => {
        const response = await api.authRequest(`tags/${id}`, 'PUT', data);
        return response;
    };

    const deleteTag = async (id: string) => {
        const response = await api.authRequest(`tags/${id}`, 'DELETE');
        return response;
    };

    const checkSession = async () => {
        return api.checkSession();
    };

    const login = async (data: { username: string; password: string }) => {
        return await api.login(data);
    };

    return {
        login,
        checkSession,
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
        saveSetup
    }
};