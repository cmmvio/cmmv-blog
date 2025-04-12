/**
 * Member authentication composable
 */
import { ref, computed, watchEffect } from 'vue';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export default function useMemberAuth() {
    // Reactive state
    const currentMember = ref<any>(null);
    const isLoggedIn = ref(false);
    const authToken = ref<string | null>(null);

    // Initialize auth state
    const checkAuthStatus = () => {
        // Skip on server-side rendering
        if (!isBrowser) return false;

        // Check sessionStorage first
        const sessionData = sessionStorage.getItem('member');
        if (sessionData) {
            try {
                const parsed = JSON.parse(sessionData);
                if (parsed.token && parsed.member) {
                    currentMember.value = parsed.member;
                    isLoggedIn.value = true;
                    authToken.value = parsed.token;
                    return true;
                }
            } catch (e) {
                console.error('Error parsing session data:', e);
            }
        }

        // Then check localStorage
        const localData = localStorage.getItem('member');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                if (parsed.token && parsed.member) {
                    currentMember.value = parsed.member;
                    isLoggedIn.value = true;
                    authToken.value = parsed.token;
                    return true;
                }
            } catch (e) {
                console.error('Error parsing local data:', e);
            }
        }

        // Reset if no auth data found
        currentMember.value = null;
        isLoggedIn.value = false;
        authToken.value = null;
        return false;
    };

    // Initialize auth state on composable creation
    checkAuthStatus();

    // Save member authentication data
    const login = (token: string, member: any, rememberMe = false) => {
        if (!isBrowser) return;

        const data = JSON.stringify({ token, member });

        if (rememberMe) {
            localStorage.setItem('member', data);
        } else {
            sessionStorage.setItem('member', data);
        }

        // Update reactive state
        currentMember.value = member;
        isLoggedIn.value = true;
        authToken.value = token;
    };

    // Update member data in storage
    const updateProfile = (updatedMember: any) => {
        if (!isLoggedIn.value || !isBrowser) return false;

        // Check where the data is stored
        const sessionData = sessionStorage.getItem('member');
        if (sessionData) {
            try {
                const parsed = JSON.parse(sessionData);
                parsed.member = { ...parsed.member, ...updatedMember };
                sessionStorage.setItem('member', JSON.stringify(parsed));

                // Update reactive state
                currentMember.value = { ...currentMember.value, ...updatedMember };
                return true;
            } catch (e) {
                console.error('Error updating session data:', e);
            }
        }

        const localData = localStorage.getItem('member');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                parsed.member = { ...parsed.member, ...updatedMember };
                localStorage.setItem('member', JSON.stringify(parsed));

                // Update reactive state
                currentMember.value = { ...currentMember.value, ...updatedMember };
                return true;
            } catch (e) {
                console.error('Error updating local data:', e);
            }
        }

        return false;
    };

    // Logout - clear member data
    const logout = () => {
        if (!isBrowser) return;

        localStorage.removeItem('member');
        sessionStorage.removeItem('member');

        // Reset reactive state
        currentMember.value = null;
        isLoggedIn.value = false;
        authToken.value = null;
    };

    // Check if token is expired
    const isTokenExpired = (token: string) => {
        if (!token) return true;

        try {
            // Get the payload part of the JWT
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));

            // Check if token has an expiration
            if (!decoded.exp) return false;

            // Compare expiration time with current time
            const now = Math.floor(Date.now() / 1000);
            return decoded.exp < now;
        } catch (e) {
            console.error('Error checking token expiration:', e);
            return true;
        }
    };

    // Check if the current auth token is valid
    const hasValidTokenValue = computed(() => {
        return authToken.value && !isTokenExpired(authToken.value);
    });

    // For backward compatibility with existing code
    // These methods can still be used in components that haven't been updated yet
    const backwardCompatible = {
        isAuthenticated: () => isLoggedIn.value,
        getAuthMember: () => currentMember.value ? { ...currentMember.value, token: authToken.value } : null,
        saveAuthData: login,
        updateMemberData: updateProfile,
        getAuthToken: () => authToken.value,
        isTokenExpired
    };

    return {
        // Reactive state
        currentMember,
        isLoggedIn,
        authToken,
        hasValidToken: hasValidTokenValue,

        // Methods
        login,
        logout,
        updateProfile,
        checkAuthStatus,

        // Include backward compatibility methods except those returned directly
        ...backwardCompatible
    };
}

// Export individual functions for backward compatibility
export const isAuthenticated = () => {
    if (!isBrowser) return false;

    const sessionData = sessionStorage.getItem('member');
    if (sessionData) {
        try {
            const parsed = JSON.parse(sessionData);
            if (parsed.token && parsed.member) {
                return true;
            }
        } catch (e) {
            console.error('Error parsing session data:', e);
        }
    }

    const localData = localStorage.getItem('member');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            if (parsed.token && parsed.member) {
                return true;
            }
        } catch (e) {
            console.error('Error parsing local data:', e);
        }
    }

    return false;
};

export const getAuthMember = () => {
    if (!isBrowser) return null;

    const sessionData = sessionStorage.getItem('member');
    if (sessionData) {
        try {
            const parsed = JSON.parse(sessionData);
            if (parsed.token && parsed.member) {
                return {
                    ...parsed.member,
                    token: parsed.token,
                    storage: 'session'
                };
            }
        } catch (e) {
            console.error('Error parsing session data:', e);
        }
    }

    const localData = localStorage.getItem('member');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            if (parsed.token && parsed.member) {
                return {
                    ...parsed.member,
                    token: parsed.token,
                    storage: 'local'
                };
            }
        } catch (e) {
            console.error('Error parsing local data:', e);
        }
    }

    return null;
};

export const saveAuthData = (token: string, member: any, rememberMe = false) => {
    if (!isBrowser) return;

    const data = JSON.stringify({ token, member });
    if (rememberMe) {
        localStorage.setItem('member', data);
    } else {
        sessionStorage.setItem('member', data);
    }
};

export const updateMemberData = (updatedMember: any) => {
    if (!isBrowser) return false;

    const sessionData = sessionStorage.getItem('member');
    if (sessionData) {
        try {
            const parsed = JSON.parse(sessionData);
            parsed.member = { ...parsed.member, ...updatedMember };
            sessionStorage.setItem('member', JSON.stringify(parsed));
            return true;
        } catch (e) {
            console.error('Error updating session data:', e);
        }
    }

    const localData = localStorage.getItem('member');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            parsed.member = { ...parsed.member, ...updatedMember };
            localStorage.setItem('member', JSON.stringify(parsed));
            return true;
        } catch (e) {
            console.error('Error updating local data:', e);
        }
    }

    return false;
};

export const logout = () => {
    if (!isBrowser) return;

    localStorage.removeItem('member');
    sessionStorage.removeItem('member');
};

export const getAuthToken = () => {
    if (!isBrowser) return null;

    const member = getAuthMember();
    return member ? member.token : null;
};

export const isTokenExpired = (token: string) => {
    if (!token) return true;

    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        if (!decoded.exp) return false;
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;
    } catch (e) {
        console.error('Error checking token expiration:', e);
        return true;
    }
};

export const hasValidToken = () => {
    if (!isBrowser) return false;

    const token = getAuthToken();
    return token && !isTokenExpired(token);
};
