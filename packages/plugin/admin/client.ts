import { useApi } from './api';

export const useAdminClient = () => {
    const api = useApi();

    const getSettings = async () => {
        const response = await api.authRequest('settings', 'GET');
        return response.data;
    };

    return {
        getSettings
    }
};