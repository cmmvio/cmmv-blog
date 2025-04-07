<template>
    <div class="min-h-screen bg-neutral-900 flex">
        <!-- Sidebar -->
        <aside
            class="fixed h-full z-30 transition-all duration-300 ease-in-out bg-neutral-900 border-r border-neutral-800 shadow-md"
            :class="{ 'w-20': isCollapsed, 'w-50': !isCollapsed, '-translate-x-full md:translate-x-0': isMobileMenuHidden }">
            <div class="flex items-center justify-between h-16 px-4 border-b border-neutral-800">
                <div class="flex items-center">
                    <img src="/favicon-32x32.png" alt="Blog Logo" class="h-8 transition-all duration-300"
                        :class="{ 'scale-90': isCollapsed }" />
                </div>
                <button class="text-neutral-400 hover:text-white focus:outline-none transition-transform duration-300"
                    @click="toggleSidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7" v-if="!isCollapsed" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 5l7 7-7 7M5 5l7 7-7 7" v-else />
                    </svg>
                </button>
            </div>

            <div class="h-[calc(100%-144px)] py-4 overflow-y-auto">
                <nav class="space-y-1 px-2">
                    <router-link to="/dashboard"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Dashboard' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Dashboard</span>
                    </router-link>

                    <div class="pt-4 pb-1" v-if="!isCollapsed">
                        <p class="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Content</p>
                    </div>

                    <router-link to="/posts"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Posts' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Posts</span>
                    </router-link>

                    <router-link to="/pages"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Pages' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Pages</span>
                    </router-link>

                    <router-link to="/comments"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Comments' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Comments</span>
                    </router-link>

                    <router-link to="/media"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Media' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Media</span>
                    </router-link>

                    <div class="pt-4 pb-1" v-if="!isCollapsed">
                        <p class="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Taxonomy</p>
                    </div>

                    <router-link to="/categories"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Categories' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Categories</span>
                    </router-link>

                    <router-link to="/tags"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Tags' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Tags</span>
                    </router-link>

                    <div class="pt-4 pb-1" v-if="!isCollapsed">
                        <p class="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Users</p>
                    </div>

                    <router-link to="/authors"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Authors' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Authors</span>
                    </router-link>

                    <router-link to="/members"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Members' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Members</span>
                    </router-link>

                    <div class="pt-4 pb-1" v-if="!isCollapsed">
                        <p class="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Advanced</p>
                    </div>

                    <router-link to="/themes"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Themes' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Themes</span>
                    </router-link>

                    <router-link to="/plugins"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Plugins' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Plugins</span>
                    </router-link>

                    <router-link to="/settings"
                        class="flex items-center px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md group transition-all duration-200"
                        :class="{ 'justify-center': isCollapsed }" :title="isCollapsed ? 'Settings' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span class="ml-3 transition-opacity duration-200"
                            :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">Settings</span>
                    </router-link>
                </nav>
            </div>

            <div class="absolute bottom-0 left-0 right-0 border-t border-neutral-800 p-4 bg-neutral-800 transition-all duration-300">
                <div class="flex items-center" :class="{ 'justify-center': isCollapsed }">
                    <div v-if="user" class="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden bg-blue-600 text-white">
                        <img
                            v-if="userAvatar"
                            :src="userAvatar"
                            :alt="userDisplayName"
                            class="h-full w-full object-cover"
                        />
                        <span v-else class="text-sm font-medium">{{ userInitials }}</span>
                    </div>
                    <div v-else class="h-8 w-8 rounded-full bg-neutral-600"></div>

                    <div class="ml-3 transition-opacity duration-200"
                        :class="isCollapsed ? 'opacity-0 absolute' : 'opacity-100'">
                        <p class="text-sm font-medium text-neutral-200">{{ userDisplayName }}</p>
                        <p class="text-xs text-neutral-400"><router-link to="/profile">View Profile</router-link></p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col transition-all duration-300 overflow-hidden"
            :class="{ 'md:ml-20': isCollapsed, 'md:ml-50': !isCollapsed }">
            <div class="lg:hidden absolute top-4 left-4 z-50">
                <button @click="toggleMobileMenu"
                    class="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <main class="flex-1 bg-neutral-900 p-4 overflow-y-auto">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminClient } from '@cmmv/blog/admin/client'

const api = useAdminClient()
api.checkSession();

const route = useRoute()
const isCollapsed = ref(false)
const isMobileMenuHidden = ref(true)
const currentYear = ref(new Date().getFullYear())
const user = ref(null)

const currentPageTitle = computed(() => {
    const routePath = route.path.split('/').pop()
    if (!routePath) return 'Dashboard'
    return routePath.charAt(0).toUpperCase() + routePath.slice(1)
})

const userDisplayName = computed(() => {
    if (!user.value) return 'Loading...'

    if (user.value.profile && user.value.profile.name)
        return user.value.profile.name

    const email = user.value.email || ''
    return email.length > 10 ? `${email.substring(0, 10)}...` : email
})

const userInitials = computed(() => {
    if (!user.value) return '?'

    if (user.value.profile && user.value.profile.name)
        return user.value.profile.name.substring(0, 1).toUpperCase()

    return user.value.email ? user.value.email.substring(0, 1).toUpperCase() : '?'
})

const userAvatar = computed(() => {
    if (user.value && user.value.profile && user.value.profile.image)
        return user.value.profile.image

    return null
})

const refreshUserProfile = async () => {
    try {
        user.value = await api.getProfile()
        console.log('User profile refreshed:', user.value)
    } catch (error) {
        console.error('Failed to refresh user profile:', error)
    }
}

function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem('sidebarCollapsed', isCollapsed.value)
}

function toggleMobileMenu() {
    isMobileMenuHidden.value = !isMobileMenuHidden.value
}

onMounted(async () => {
    const savedPreference = localStorage.getItem('sidebarCollapsed')

    if (savedPreference !== null)
        isCollapsed.value = savedPreference === 'true'

    try {
        user.value = await api.getProfile()
        console.log('User profile loaded:', user.value)

        watch(() => route.path, (newPath, oldPath) => {
            if (oldPath.includes('/profile'))
                refreshUserProfile()
        })
    } catch (error) {
        console.error('Failed to load user profile:', error)
    }
})
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #262626;
}

::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #525252;
}

::-webkit-scrollbar-corner {
  background: #262626;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #404040 #262626;
}
</style>
