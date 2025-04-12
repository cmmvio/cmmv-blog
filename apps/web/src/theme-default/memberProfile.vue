<template>
    <div class="lg:ml-64">
        <div class="container mx-auto max-w-4xl px-4 py-10">
            <div v-if="!isAuthenticated" class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-neutral-500 dark:text-neutral-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-2">Authentication Required</h2>
                <p class="text-neutral-600 dark:text-neutral-400 mb-6">You need to be logged in to view this page.</p>
                <div class="flex justify-center space-x-4">
                    <a href="/member/login" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                        Login
                    </a>
                    <a href="/member/register" class="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md transition-colors">
                        Register
                    </a>
                </div>
            </div>

            <div v-else-if="isLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span class="ml-3 text-neutral-600 dark:text-neutral-400">Loading profile...</span>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Profile Sidebar -->
                <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden p-6">
                    <div class="flex flex-col items-center text-center">
                        <div class="h-24 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-2xl font-bold text-neutral-700 dark:text-neutral-300 mb-4">
                            {{ memberInitials }}
                        </div>
                        <h1 class="text-xl font-bold text-neutral-900 dark:text-white mb-1">{{ memberProfile.name }}</h1>
                        <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{{ memberProfile.email }}</p>

                        <div class="w-full border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-2">
                            <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-1 flex justify-between">
                                <span>Member since:</span>
                                <span class="text-neutral-900 dark:text-white">{{ formatDate(memberProfile.createdAt) }}</span>
                            </p>
                            <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-1 flex justify-between">
                                <span>Email notifications:</span>
                                <span :class="memberProfile.emailDisabled ? 'text-red-500' : 'text-green-500'">
                                    {{ memberProfile.emailDisabled ? 'Disabled' : 'Enabled' }}
                                </span>
                            </p>
                        </div>

                        <button @click="logout" class="mt-6 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm">
                            Sign Out
                        </button>
                    </div>
                </div>

                <!-- Profile Content -->
                <div class="md:col-span-2">
                    <!-- Profile Edit Form -->
                    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden p-6 mb-6">
                        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                            Edit Profile
                        </h2>

                        <div v-if="updateMessage" class="mb-4 p-3 rounded-md" :class="updateSuccess ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'">
                            {{ updateMessage }}
                        </div>

                        <form @submit.prevent="updateProfile">
                            <div class="mb-4">
                                <label for="profileName" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="profileName"
                                    v-model="profileForm.name"
                                    class="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your name"
                                />
                            </div>

                            <div class="mb-4">
                                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    :value="memberProfile.email"
                                    class="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-500 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="your@email.com"
                                />
                                <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    Email address cannot be changed
                                </p>
                            </div>

                            <div class="mb-6">
                                <label for="profileNote" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Bio / Note
                                </label>
                                <textarea
                                    id="profileNote"
                                    v-model="profileForm.note"
                                    rows="3"
                                    class="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="A little about yourself..."
                                ></textarea>
                            </div>

                            <div class="mb-6">
                                <div class="flex items-center">
                                    <input
                                        id="emailDisabled"
                                        type="checkbox"
                                        v-model="profileForm.emailDisabled"
                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
                                    />
                                    <label for="emailDisabled" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                                        Disable email notifications
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                :disabled="isUpdating"
                            >
                                <span v-if="isUpdating">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                                <span v-else>Save Changes</span>
                            </button>
                        </form>
                    </div>

                    <!-- Password Change Form -->
                    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden p-6">
                        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                            Change Password
                        </h2>

                        <div v-if="passwordMessage" class="mb-4 p-3 rounded-md" :class="passwordSuccess ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'">
                            {{ passwordMessage }}
                        </div>

                        <form @submit.prevent="changePassword">
                            <div class="mb-4">
                                <label for="currentPassword" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    v-model="passwordForm.currentPassword"
                                    required
                                    class="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div class="mb-4">
                                <label for="newPassword" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    v-model="passwordForm.newPassword"
                                    required
                                    class="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div class="mb-6">
                                <label for="confirmPassword" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    v-model="passwordForm.confirmPassword"
                                    required
                                    class="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                                :disabled="isChangingPassword"
                            >
                                <span v-if="isChangingPassword">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                                <span v-else>Change Password</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { vue3 } from '@cmmv/blog/client'
import { useRouter } from 'vue-router'
import useMemberAuth from '../composables/useMemberAuth'

const router = useRouter()
const blogAPI = vue3.useBlog()

// Use the auth composable
const auth = useMemberAuth()
const isAuthenticated = computed(() => auth.isLoggedIn.value)
const memberProfile = ref<any>({})
const isLoading = ref(true)
const isUpdating = ref(false)
const isChangingPassword = ref(false)
const updateMessage = ref('')
const updateSuccess = ref(false)
const passwordMessage = ref('')
const passwordSuccess = ref(false)

// Form data
const profileForm = ref({
    name: '',
    note: '',
    emailDisabled: false
})

const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// Computed properties
const memberInitials = computed(() => {
    if (!memberProfile.value?.name) return '';
    return memberProfile.value.name
        .split(' ')
        .map((part: string) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
})

// Methods
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date)
}

const loadProfile = async () => {
    isLoading.value = true

    try {
        if (!auth.isLoggedIn.value) {
            isLoading.value = false
            return
        }

        const authData = auth.getAuthMember()
        if (!authData) {
            isLoading.value = false
            return
        }

        // Load profile data
        const profile = await blogAPI.members.getMyProfile()

        if (profile) {
            memberProfile.value = profile

            // Initialize form with current data
            profileForm.value = {
                name: profile.name || '',
                note: profile.note || '',
                emailDisabled: profile.emailDisabled || false
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error)
    } finally {
        isLoading.value = false
    }
}

const updateProfile = async () => {
    updateMessage.value = ''
    isUpdating.value = true

    try {
        if (!isAuthenticated.value) {
            router.push('/member/login')
            return
        }

        const response = await blogAPI.members.updateProfile(memberProfile.value.id, profileForm.value)

        if (response) {
            memberProfile.value = {
                ...memberProfile.value,
                ...profileForm.value
            }

            // Update the stored member data using the helper function
            auth.updateMemberData(profileForm.value)

            updateSuccess.value = true
            updateMessage.value = 'Profile updated successfully'
        } else {
            updateSuccess.value = false
            updateMessage.value = 'Failed to update profile'
        }
    } catch (error: any) {
        console.error('Update error:', error)
        updateSuccess.value = false
        updateMessage.value = error.message || 'Failed to update profile'
    } finally {
        isUpdating.value = false
    }
}

const changePassword = async () => {
    passwordMessage.value = ''
    isChangingPassword.value = true

    try {
        // Validate passwords match
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
            passwordSuccess.value = false
            passwordMessage.value = 'New passwords do not match'
            isChangingPassword.value = false
            return
        }

        // Validate password length
        if (passwordForm.value.newPassword.length < 8) {
            passwordSuccess.value = false
            passwordMessage.value = 'Password must be at least 8 characters long'
            isChangingPassword.value = false
            return
        }

        if (!isAuthenticated.value) {
            router.push('/member/login')
            return
        }

        const authData = auth.getAuthMember()
        if (!authData) {
            router.push('/member/login')
            return
        }

        // Implement password change - this is a placeholder as the exact API endpoint depends on your implementation
        // You might need to adjust this based on your actual API
        const response = await fetch('/api/members/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData.token}`
            },
            body: JSON.stringify({
                currentPassword: passwordForm.value.currentPassword,
                newPassword: passwordForm.value.newPassword
            })
        })

        if (response.ok) {
            passwordSuccess.value = true
            passwordMessage.value = 'Password changed successfully'

            // Reset form
            passwordForm.value = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        } else {
            const data = await response.json()
            passwordSuccess.value = false
            passwordMessage.value = data.message || 'Failed to change password'
        }
    } catch (error: any) {
        console.error('Password change error:', error)
        passwordSuccess.value = false
        passwordMessage.value = error.message || 'Failed to change password'
    } finally {
        isChangingPassword.value = false
    }
}

const logout = () => {
    // Use the logout helper function
    auth.logout()

    // Clear local state
    memberProfile.value = {}

    // Redirect to home
    router.push('/')
}

// Load profile on mount
onMounted(() => {
    loadProfile()
})
</script>
