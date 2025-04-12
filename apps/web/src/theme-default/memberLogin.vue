<template>
    <div>
        <div class="container mx-auto max-w-xl px-4 py-10">
            <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                    <h1 class="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">Member Login</h1>

                    <div v-if="errorMessage" class="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
                        {{ errorMessage }}
                    </div>

                    <form @submit.prevent="handleLogin">
                        <div class="mb-4">
                            <label for="email" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                v-model="loginForm.email"
                                required
                                class="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div class="mb-6">
                            <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                v-model="loginForm.password"
                                required
                                class="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    v-model="loginForm.rememberMe"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
                                />
                                <label for="remember-me" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                                    Remember me
                                </label>
                            </div>

                            <a href="#" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            :disabled="isLoggingIn"
                        >
                            <span v-if="isLoggingIn">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                            <span v-else>Sign in</span>
                        </button>

                        <div class="mt-6 text-center">
                            <span class="text-sm text-neutral-600 dark:text-neutral-400">Don't have an account?</span>
                            <a href="/member/register" class="ml-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">Register</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { vue3 } from '@cmmv/blog/client'
import { useRouter } from 'vue-router'
import { saveAuthData, isAuthenticated } from '../composables/useMemberAuth'

const router = useRouter()
const blogAPI = vue3.useBlog()

const loginForm = ref({
    email: '',
    password: '',
    rememberMe: false
})

const isLoggingIn = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    errorMessage.value = ''
    isLoggingIn.value = true

    try {
        const loginData = {
            email: loginForm.value.email,
            password: loginForm.value.password
        }

        const response = await blogAPI.members.login(loginData)

        if (response && response.token) {
            saveAuthData(response.token, response.member)

            // Check if there's a redirect parameter and use it for navigation
            const redirect = new URLSearchParams(window.location.search).get('redirect') || '/member/profile'
            window.location.href = redirect
            // router.push(redirect)
        } else {
            errorMessage.value = 'Invalid login credentials'
        }
    } catch (error: any) {
        console.error('Login error:', error)
        errorMessage.value = error.message || 'Failed to login. Please try again.'
    } finally {
        isLoggingIn.value = false
    }
}

// Check if user is already logged in
onMounted(() => {
    if (isAuthenticated()) {
        // User is already logged in, redirect to profile or redirect URL
        const redirect = new URLSearchParams(window.location.search).get('redirect') || '/member/profile'
        window.location.href = redirect
        // router.push(redirect)
    }
})
</script>
