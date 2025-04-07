<template>
    <div class="main w-full h-screen z-0 select-none">
        <div class="w-full h-screen z-50" style="backdrop-filter: blur(12px)">
            <div
                class="flex items-center justify-center h-screen w-full md:w-6/12 max-w-lg m-auto p-4 z-50 animate-fade-in"
            >
                <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 relative w-full">
                    <div
                        class="absolute w-full h-full top-0 left-0 right-0 bottom-0 bg-black opacity-60 flex items-center justify-center rounded-lg"
                        style="z-index: 9999"
                        v-if="loading"
                    >
                        <div class="flex flex-col items-center justify-center">
                            <div class="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-zinc-200"></div>
                            <div class="mt-2 text-white text-sm">Loading...</div>
                        </div>
                    </div>

                    <div class="m-auto mb-6">
                        <a href="https://cmmv.io/" target="blank">
                            <img
                                src="https://raw.githubusercontent.com/cmmvio/docs.cmmv.io/main/public/assets/logo_CMMV2_icon.png"
                                width="150"
                                alt="CMMV Logo"
                                class="m-auto"
                            />
                        </a>
                    </div>

                    <form @submit.prevent="handleSubmit" class="w-full">
                        <div class="w-full">
                            <div class="mb-4">
                                <label for="username" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email</label>
                                <input
                                    id="username"
                                    v-model="data.username"
                                    type="text"
                                    placeholder="Enter your email"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                    required
                                />
                                <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
                            </div>

                            <div class="mb-4">
                                <label for="password" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Password</label>
                                <input
                                    id="password"
                                    v-model="data.password"
                                    type="password"
                                    placeholder="Enter your password"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                    required
                                />
                                <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                            </div>

                            <div class="mb-4 text-right">
                                <a
                                    href="/forgot-password"
                                    class="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                    aria-label="Recover your password"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                :disabled="loading"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <div
                        v-if="notification.show"
                        class="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center"
                    >
                        <span class="font-medium">{{ notification.title }}</span>
                        <span class="ml-2">{{ notification.content }}</span>
                        <button
                            @click="notification.show = false"
                            class="ml-4 text-white hover:text-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
body {
    border: 0px;
    margin: 0px;
}

.main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to bottom, #000000, #00172d);
    overflow: hidden;
    position: relative;
}

.main::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 255, 150, 0.4), transparent 70%);
    filter: blur(150px);
    animation: auroraGreen 8s infinite alternate ease-in-out;
    z-index: 0;
}

.main::after {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(128, 0, 255, 0.4), transparent 70%);
    filter: blur(150px);
    animation: auroraPurple 10s infinite alternate-reverse ease-in-out;
    z-index: 0;
}

@keyframes auroraGreen {
    0% {
        transform: translate(-10%, -20%) rotate(0deg);
    }
    50% {
        transform: translate(15%, 25%) rotate(60deg);
    }
    100% {
        transform: translate(-10%, -20%) rotate(120deg);
    }
}

@keyframes auroraPurple {
    0% {
        transform: translate(10%, 20%) rotate(0deg);
    }
    50% {
        transform: translate(-15%, -25%) rotate(-60deg);
    }
    100% {
        transform: translate(10%, 20%) rotate(-120deg);
    }
}

@keyframes float {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animate-fade-in {
    animation: fade-in 0.8s ease-in-out;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminClient } from '@cmmv/blog/admin/client'

const adminClient = useAdminClient()
const router = useRouter()

const loading = ref(false)
const errors = ref({
    username: '',
    password: ''
})

const notification = ref({
    show: false,
    title: '',
    content: '',
    duration: 3000
})

const data = ref({
    username: '',
    password: '',
})

const showNotification = (title, content) => {
    notification.value = {
        show: true,
        title,
        content,
        duration: 3000
    }

    setTimeout(() => {
        notification.value.show = false
    }, notification.value.duration)
}

const validateForm = () => {
    let isValid = true
    errors.value = {}

    if (!data.value.username) {
        errors.value.username = 'Email is required'
        isValid = false
    }

    if (!data.value.password) {
        errors.value.password = 'Password is required'
        isValid = false
    }

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) return

    try {
        loading.value = true
        const result = await adminClient.login(data.value)
        loading.value = false

        if (result.token)
            router.push('/')
    } catch (err) {
        loading.value = false
        showNotification('Error!', 'Unable to login')
    }
}

onMounted(async () => {
    const setupFinish = await adminClient.getSettings();

    if(!setupFinish.setupFinish)
        router.push('/setup')
})
</script>
