<template>
    <div class="main w-full h-screen z-0 select-none">
        <div class="w-full h-screen z-50" style="backdrop-filter: blur(12px)">
            <div
                class="flex items-center justify-center h-screen w-full md:w-8/12 max-w-2xl m-auto p-4 z-50 animate-fade-in"
            >
                <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-0 relative w-full overflow-hidden">
                    <div
                        class="absolute w-full h-full top-0 left-0 right-0 bottom-0 bg-black opacity-60 flex items-center justify-center rounded-lg"
                        style="z-index: 9999"
                        v-if="loading"
                    >
                        <div class="flex flex-col items-center justify-center">
                            <div class="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-zinc-200"></div>
                            <div class="mt-2 text-white text-sm">Setting up your blog...</div>
                        </div>
                    </div>

                    <!-- Compact Header with Steps -->
                    <div class="bg-neutral-900 px-4 py-3 flex items-center justify-between border-b border-neutral-700">
                        <!-- Logo and title -->
                        <div class="flex items-center">
                            <img
                                src="https://raw.githubusercontent.com/cmmvio/docs.cmmv.io/main/public/assets/logo_CMMV2_icon.png"
                                width="32"
                                alt="CMMV Logo"
                                class="mr-3"
                            />
                            <div>
                                <h1 class="text-lg font-bold text-white">Blog Setup</h1>
                                <p class="text-xs text-gray-400">Configure your CMMV blog</p>
                            </div>
                        </div>

                        <!-- Steps indicator -->
                        <div class="flex items-center space-x-1">
                            <!-- Step 1 -->
                            <div class="flex flex-col items-center">
                                <div
                                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-md z-10"
                                    :class="{
                                        'bg-blue-600 text-white': currentStep >= 0,
                                        'bg-neutral-700 text-neutral-400': currentStep < 0
                                    }"
                                >
                                    <svg v-if="currentStep > 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                    <span v-else>1</span>
                                </div>
                                <span class="text-[10px] text-neutral-400 mt-1">Admin</span>
                            </div>

                            <!-- Connecting line 1-2 -->
                            <div class="w-8 h-0.5 mt-[-12px]" :class="{'bg-blue-600': currentStep > 0, 'bg-neutral-700': currentStep <= 0}"></div>

                            <!-- Step 2 -->
                            <div class="flex flex-col items-center">
                                <div
                                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-md z-10"
                                    :class="{
                                        'bg-blue-600 text-white': currentStep >= 1,
                                        'bg-neutral-700 text-neutral-400': currentStep < 1
                                    }"
                                >
                                    <svg v-if="currentStep > 1" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                    <span v-else>2</span>
                                </div>
                                <span class="text-[10px] text-neutral-400 mt-1">Blog</span>
                            </div>

                            <!-- Connecting line 2-3 -->
                            <div class="w-8 h-0.5 mt-[-12px]" :class="{'bg-blue-600': currentStep > 1, 'bg-neutral-700': currentStep <= 1}"></div>

                            <!-- Step 3 -->
                            <div class="flex flex-col items-center">
                                <div
                                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-md z-10"
                                    :class="{
                                        'bg-blue-600 text-white': currentStep >= 2,
                                        'bg-neutral-700 text-neutral-400': currentStep < 2
                                    }"
                                >
                                    <span>3</span>
                                </div>
                                <span class="text-[10px] text-neutral-400 mt-1">Settings</span>
                            </div>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="p-6">
                        <!-- Admin Account -->
                        <div v-if="currentStep === 0" class="w-full">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Admin Account</h2>
                            <div class="mb-4">
                                <label for="admin-email" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email</label>
                                <input
                                    id="admin-email"
                                    v-model="setupData.adminEmail"
                                    type="email"
                                    placeholder="Enter admin email"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                    required
                                />
                                <p v-if="errors.adminEmail" class="mt-1 text-sm text-red-600">{{ errors.adminEmail }}</p>
                            </div>

                            <div class="mb-4">
                                <label for="admin-password" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Password</label>
                                <input
                                    id="admin-password"
                                    v-model="setupData.adminPassword"
                                    type="password"
                                    placeholder="Create a strong password"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                    required
                                />
                                <p v-if="errors.adminPassword" class="mt-1 text-sm text-red-600">{{ errors.adminPassword }}</p>
                            </div>

                            <div class="mb-4">
                                <label for="admin-password-confirm" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Confirm Password</label>
                                <input
                                    id="admin-password-confirm"
                                    v-model="setupData.adminPasswordConfirm"
                                    type="password"
                                    placeholder="Confirm your password"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                    required
                                />
                                <p v-if="errors.adminPasswordConfirm" class="mt-1 text-sm text-red-600">{{ errors.adminPasswordConfirm }}</p>
                            </div>
                        </div>

                        <!-- Blog Information -->
                        <div v-if="currentStep === 1" class="w-full">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Blog Information</h2>
                            <div class="mb-4">
                                <label for="blog-title" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Blog Title</label>
                                <input
                                    id="blog-title"
                                    v-model="setupData.blogTitle"
                                    type="text"
                                    placeholder="My Awesome Blog"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                    required
                                />
                                <p v-if="errors.blogTitle" class="mt-1 text-sm text-red-600">{{ errors.blogTitle }}</p>
                            </div>

                            <div class="mb-4">
                                <label for="blog-description" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Description</label>
                                <textarea
                                    id="blog-description"
                                    v-model="setupData.blogDescription"
                                    placeholder="A short description of your blog"
                                    :disabled="loading"
                                    rows="3"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                ></textarea>
                                <p v-if="errors.blogDescription" class="mt-1 text-sm text-red-600">{{ errors.blogDescription }}</p>
                            </div>

                            <div class="mb-4">
                                <label for="blog-url" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Blog URL</label>
                                <input
                                    id="blog-url"
                                    v-model="setupData.blogUrl"
                                    type="url"
                                    placeholder="https://myblog.com"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                    required
                                />
                                <p v-if="errors.blogUrl" class="mt-1 text-sm text-red-600">{{ errors.blogUrl }}</p>
                            </div>
                        </div>

                        <!-- Advanced Settings -->
                        <div v-if="currentStep === 2" class="w-full">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Advanced Settings</h2>

                            <div class="mb-4">
                                <label for="posts-per-page" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Posts Per Page</label>
                                <input
                                    id="posts-per-page"
                                    v-model="setupData.postsPerPage"
                                    type="number"
                                    min="1"
                                    max="50"
                                    placeholder="10"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white select-text"
                                />
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Comment Settings</label>
                                <div class="flex items-center mb-2">
                                    <input
                                        id="enable-comments"
                                        v-model="setupData.enableComments"
                                        type="checkbox"
                                        :disabled="loading"
                                        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label for="enable-comments" class="ml-2 block text-gray-700 dark:text-gray-300 text-sm">
                                        Enable comments
                                    </label>
                                </div>
                                <div class="flex items-center" v-if="setupData.enableComments">
                                    <input
                                        id="moderate-comments"
                                        v-model="setupData.moderateComments"
                                        type="checkbox"
                                        :disabled="loading"
                                        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label for="moderate-comments" class="ml-2 block text-gray-700 dark:text-gray-300 text-sm">
                                        Moderate comments before publishing
                                    </label>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Language & Timezone</label>
                                <select
                                    v-model="setupData.language"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white mb-2"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="pt">Portuguese</option>
                                </select>

                                <select
                                    v-model="setupData.timezone"
                                    :disabled="loading"
                                    class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                                    <option value="America/Chicago">Central Time (US & Canada)</option>
                                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Europe/Paris">Paris</option>
                                    <option value="Asia/Tokyo">Tokyo</option>
                                </select>
                            </div>
                        </div>

                        <!-- Navigation buttons -->
                        <div class="flex justify-between mt-10 pt-4 border-t border-gray-200 dark:border-neutral-700">
                            <button
                                v-if="currentStep > 0"
                                @click="currentStep--"
                                type="button"
                                class="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-gray-800 dark:text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                :disabled="loading"
                            >
                                Back
                            </button>
                            <div v-else></div>

                            <button
                                v-if="currentStep < steps.length - 1"
                                @click="nextStep"
                                type="button"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                :disabled="loading"
                            >
                                Next
                            </button>
                            <button
                                v-else
                                @click="finishSetup"
                                type="button"
                                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                :disabled="loading"
                            >
                                Complete Setup
                            </button>
                        </div>
                    </div>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminClient } from '@cmmv/blog/admin/client'

const adminClient = useAdminClient()
const router = useRouter()

const steps = [
    { id: 'admin', name: 'Admin' },
    { id: 'blog', name: 'Blog Info' },
    { id: 'settings', name: 'Settings' }
]

const currentStep = ref(0)
const loading = ref(false)
const errors = ref({})

const setupData = ref({
    // Admin account
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: '',

    // Blog info
    blogTitle: '',
    blogDescription: '',
    blogUrl: '',

    // Advanced settings
    postsPerPage: 10,
    enableComments: true,
    moderateComments: true,
    language: 'en',
    timezone: 'UTC'
})

const notification = ref({
    show: false,
    title: '',
    content: '',
    duration: 3000
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

const validateCurrentStep = () => {
    errors.value = {}
    let isValid = true

    if (currentStep.value === 0) {
        // Validate admin account
        if (!setupData.value.adminEmail) {
            errors.value.adminEmail = 'Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setupData.value.adminEmail)) {
            errors.value.adminEmail = 'Please enter a valid email address'
            isValid = false
        }

        if (!setupData.value.adminPassword) {
            errors.value.adminPassword = 'Password is required'
            isValid = false
        } else if (setupData.value.adminPassword.length < 8) {
            errors.value.adminPassword = 'Password must be at least 8 characters'
            isValid = false
        }

        if (setupData.value.adminPassword !== setupData.value.adminPasswordConfirm) {
            errors.value.adminPasswordConfirm = 'Passwords do not match'
            isValid = false
        }
    } else if (currentStep.value === 1) {
        // Validate blog info
        if (!setupData.value.blogTitle) {
            errors.value.blogTitle = 'Blog title is required'
            isValid = false
        }

        if (!setupData.value.blogUrl) {
            errors.value.blogUrl = 'Blog URL is required'
            isValid = false
        } else {
            try {
                new URL(setupData.value.blogUrl)
            } catch (e) {
                errors.value.blogUrl = 'Please enter a valid URL'
                isValid = false
            }
        }
    }

    return isValid
}

const nextStep = () => {
    if (validateCurrentStep()) {
        currentStep.value++
    }
}

const finishSetup = async () => {
    if (!validateCurrentStep()) return

    try {
        loading.value = true

        // Prepare the setup data
        const setupConfig = {
            admin: {
                email: setupData.value.adminEmail,
                password: setupData.value.adminPassword
            },
            blog: {
                title: setupData.value.blogTitle,
                description: setupData.value.blogDescription,
                url: setupData.value.blogUrl
            },
            settings: {
                postsPerPage: parseInt(setupData.value.postsPerPage),
                enableComments: setupData.value.enableComments,
                moderateComments: setupData.value.moderateComments,
                language: setupData.value.language,
                timezone: setupData.value.timezone
            },
            setupFinish: true
        }

        // Send setup data to API
        await adminClient.saveSetup(setupConfig)

        // Login with the new admin account
        await adminClient.login({
            username: setupData.value.adminEmail,
            password: setupData.value.adminPassword
        })

        // Redirect to dashboard
        router.push('/')
    } catch (err) {
        loading.value = false
        showNotification('Error!', 'Failed to complete setup: ' + (err.message || 'Unknown error'))
    }
}
</script>
