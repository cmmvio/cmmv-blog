//@ts-ignore
import { useApi } from '@cmmv/blog/admin/api';

export const useFeedClient = () => {
    const api = useApi();

    const channels = {
        get: (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`feed/channels?${query}`, "GET");
        },
        insert: (data: any) => api.authRequest("feed/channels", "POST", data),
        update: (id: string, data: any) => api.authRequest(`feed/channels/${id}`, "PUT", data),
        delete: (id: string) => api.authRequest(`feed/channels/${id}`, "DELETE"),
        processFeeds: () => api.authRequest("feed/channels/processFeeds", "GET"),
        processFeed: (channelId: string) => api.authRequest(`feed/channels/processFeed/${channelId}`, "GET")
    };

    const raw = {
        get: (filter: any, headers: any = {}) => {
            const query = new URLSearchParams(filter).toString();
            return api.authRequest(`feed/raw/getRaws?${query}`, "GET", {}, headers);
        },
        getById: (id: string) => api.authRequest(`feed/raw/get/${id}`, "GET"),
        getAIRaw: (id: string, data: any = {}) => api.authRequest(`feed/raw/getAIRaw/${id}`, "POST", data),
        startAIJob: (id: string, data: any = {}) => api.authRequest(`feed/raw/startAIJob/${id}`, "POST", data),
        getAIJobStatus: (jobId: string) => api.authRequest(`feed/raw/getAIJobStatus/${jobId}`, "GET"),
        updateRaw: (id: string, data: any) => api.authRequest(`feed/raw/updateRaw/${id}`, "PUT", data),
        reprocessRaw: (id: string) => api.authRequest(`feed/raw/reprocess/${id}`, "POST"),
        rejectRaw: (id: string) => api.authRequest(`feed/raw/rejectRaw/${id}`, "PUT"),
        createRaw: (data: any) => api.authRequest(`feed/raw`, "POST", data),
        cleanAllRaws: () => api.authRequest(`feed/raw/cleanAllRaws`, "GET"),
        cleanChannelRaws: (channelId: string) => api.authRequest(`feed/raw/cleanChannelRaws/${channelId}`, "GET"),
        classifyRawsWithAI: () => api.authRequest(`feed/raw/classifyRawsWithAI`, "POST"),
        deleteRaw: (id: string) => api.authRequest(`feed/raw/${id}`, "DELETE")
    };

    const parser = {
        get: (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`feed/parser?${query}`, "GET");
        },
        insert: (data: any) => api.authRequest("feed/parser", "POST", data),
        update: (id: string, data: any) => api.authRequest(`feed/parser/${id}`, "PUT", data),
        delete: (id: string) => api.authRequest(`feed/parser/${id}`, "DELETE"),
        parseURL: (url: string) => api.authRequest(`feed/parser/parseURL?url=${encodeURIComponent(url)}`, "GET"),
        parseContent: (parserId: string, url: string) => {
            const encodedUrl = encodeURIComponent(url);
            return api.authRequest(`feed/parser/parseContent/${parserId}?url=${encodedUrl}`, "GET");
        },
        parseContentAll: (url: string) => {
            const encodedUrl = encodeURIComponent(url);
            return api.authRequest(`feed/parser/parseContentAll?url=${encodedUrl}`, "GET");
        },
        createRaw: (data: any) => api.authRequest("feed/parser/createRaw", "POST", data)
    };

    return {
        channels,
        raw,
        parser
    };
};
