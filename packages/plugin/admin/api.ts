import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export function useApi() {
    const router = useRouter()
    const user = ref<any>(null)
    const token = ref<string | null>(localStorage.getItem('token') || null)
    const refreshToken = ref<string | null>(localStorage.getItem('refreshToken') || null)
    const isAuthenticated = computed(() => !!token.value)

    const getHeaders = (headers?: object) => {
        return {
            Authorization: `Bearer ${token.value}`,
            ...headers,
        }
    }

    const authRequest = async (path: string, method: string, payload?: any, headers?: object) => {
        try {
            if (token.value && token.value !== 'null') {
                if (!headers) headers = {}

                const response = await fetch(
                    `api/${path}`,
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

                const data: any =
                    contentType === 'application/json' || contentType === 'text/json'
                        ? await response.json()
                        : await response.text()

                if (response.status === 401 || response.status === 403) await refreshAuth()

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
        const response = await fetch(`api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })

        const data: any = await response.json()

        if (response.ok && data.result.token) {
            localStorage.setItem('token', data.result.token)
            localStorage.setItem('refreshToken', data.result.refreshToken)
            token.value = data.result.token
            refreshToken.value = data.result.refreshToken
            return data.result
        } else {
            throw new Error(data.result.message || 'Login failed')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        token.value = null
        refreshToken.value = null
        user.value = null
        router.push('/login')
    }

    const checkSession = async () => {
        //const result = await authRequest('auth/check', 'GET')

        //if (result && (result.status === 401 || result.status === 403)) refreshAuth()
    }

    const refreshAuth = async () => {
        const result = await authRequest('auth/refresh', 'POST', null, {
            'refresh-token': refreshToken.value,
        })

        if (result?.status === 200) {
            localStorage.setItem('token', result.token)
            token.value = result.token
        } else {
            router.push('/login')
        }
    }

    const methods = {}

    return {
        user,
        token,
        isAuthenticated,
        getHeaders,
        authRequest,
        checkSession,
        login,
        logout,
        ...methods,
    }
}
