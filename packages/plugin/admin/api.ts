import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const getEnv = (key: string): string | undefined => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env)// @ts-ignore
        return import.meta.env[key]

    if (typeof process !== 'undefined' && process.env)
        return process.env[key]

    return undefined
}

const ssrLocalStorage: any =
    typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
          };

export function useApi() {
    const router = useRouter()
    const user = ref<any>(null)
    const token = ref<string | null>(ssrLocalStorage.getItem('token') || null)
    const refreshToken = ref<string | null>(ssrLocalStorage.getItem('refreshToken') || null)
    const isAuthenticated = computed(() => !!token.value)
    const currentWhitelabelId = ref<string | null>(ssrLocalStorage.getItem('currentWhitelabelId') || null)
    const isWhitelabelMode = computed(() => !!currentWhitelabelId.value)

    const getApiPath = (path: string) => {
        if (currentWhitelabelId.value)
            return `/${currentWhitelabelId.value}/${path}`;

        return `/api/${path}`;
    }

    const getHeaders = (headers?: object) => {
        const result = {
            Authorization: `Bearer ${token.value}`,
            ...headers,
        };

        if (currentWhitelabelId.value)
            result['x-whitelabel-id'] = currentWhitelabelId.value;

        return result;
    }

    const authRootRequest = async (path: string, method: string, payload?: any, headers?: object) => {
        return await authRequest(path, method, payload, headers, true);
    }

    const authRequest = async (
        path: string, method: string,
        payload?: any, headers?: object,
        isRoot?: boolean
    ) => {
        try {
            if (token.value && token.value !== 'null') {
                if (!headers) headers = {}

                let apiPath = isRoot ? `/api/${path}` : getApiPath(path);
                apiPath += (apiPath.includes("?")) ? `&t=${new Date().getTime()}` : `?t=${new Date().getTime()}`

                const response = await fetch(
                    apiPath,
                    method == 'GET'
                        ? {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token.value}`,
                                ...headers,
                            },
                        }
                        : {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token.value}`,
                                ...headers,
                            },
                            body: payload ? JSON.stringify(payload) : undefined,
                        },
                )

                const contentType = response.headers.get('content-type')?.split(';')[0]

                if (response.status !== 200)
                    return null;

                const data: any =
                    contentType === 'application/json' || contentType === 'text/json'
                        ? await response.json()
                        : await response.text()

                if (data.result) {
                    return {
                        status: response.status,
                        ...data.result,
                    }
                } else {
                    return data
                }
            } else {
                router.push('/login')
            }
        } catch (error) {
            return { status: 500, message: error }
        }
    }

    const login = async (credentials: { username: string; password: string; token?: string }) => {
        const response = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })

        const data: any = await response.json()

        if (response.ok && data.result.token) {
            ssrLocalStorage.setItem('token', data.result.token)
            ssrLocalStorage.setItem('refreshToken', data.result.refreshToken)
            token.value = data.result.token
            refreshToken.value = data.result.refreshToken
            return data.result
        } else {
            throw new Error(data.result.message || 'Login failed')
        }
    }

    const getSettings = async (root: boolean = false) => {
        const apiPath = getApiPath(`settings?t=${new Date().getTime()}`);

        const response = await fetch(root ? `/api/settings` : apiPath, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data: any = await response.json();
        return data ? data : null;
    }

    const setSettings = async (key: string, value: any, root: boolean = true) => {
        const response = await authRequest(`settings/set`, 'PUT', { key, value }, {}, root);
        return response.data ? response.data : null;
    }

    const setSettingsWhitelabel = async (key: string, value: any) => {
        const response = await authRequest(`settings/set`, 'PUT', { key, value }, {}, false);
        return response.data ? response.data : null;
    }

    const getRootSettings = async (root: boolean = false) => {
        const response = await authRequest(`settings-root`, 'GET', {}, {}, root);
        return response.data ? response.data : null;
    }

    const updateSettings = async (data: any) => {
        const response = await authRequest(`settings`, 'PUT', data);
        return response.data ? response.data : null;
    }

    const saveSetup = async (data: any) => {
        const apiPath = getApiPath('setup');

        const response = await fetch(apiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const responseData: any = await response.json();
        return responseData.result ? responseData.result : null;
    }

    const logout = () => {
        ssrLocalStorage.removeItem('token')
        ssrLocalStorage.removeItem('refreshToken')
        token.value = null
        refreshToken.value = null
        user.value = null
        router.push('/login')
    }

    const checkSession = async () => {
        const result = await authRequest('auth/check', 'GET')
        console.log(result)

        if (!result)
            refreshAuth()
    }

    const refreshAuth = async () => {
        const result = await authRequest('auth/refresh', 'POST', null, {
            'refresh-token': refreshToken.value,
        })

        if (result?.status === 200) {
            ssrLocalStorage.setItem('token', result.token)
            token.value = result.token
        } else {
            ssrLocalStorage.removeItem('token')
            ssrLocalStorage.removeItem('refreshToken')
            token.value = null
            refreshToken.value = null
            user.value = null
            router.push('/login')
        }
    }

    const setWhitelabel = (whitelabelId: string | null) => {
        if (whitelabelId) {
            currentWhitelabelId.value = whitelabelId;
            ssrLocalStorage.setItem('currentWhitelabelId', whitelabelId);
            console.log(`Switched to whitelabel: ${whitelabelId}`);
        } else {
            currentWhitelabelId.value = null;
            ssrLocalStorage.removeItem('currentWhitelabelId');
            console.log('Switched to root mode');
        }
    }

    const getWhitelabel = async () => {
        return ssrLocalStorage.getItem('currentWhitelabelId') || null;
    }

    const methods = {}

    return {
        user,
        token,
        isAuthenticated,
        isWhitelabelMode,
        currentWhitelabelId,
        getHeaders,
        authRequest,
        authRootRequest,
        checkSession,
        getSettings,
        getRootSettings,
        setSettings,
        setSettingsWhitelabel,
        updateSettings,
        login,
        logout,
        saveSetup,
        setWhitelabel,
        getWhitelabel,
        ...methods,
    }
}
