<template>
    <button
        @click="toggle"
        class="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-neutral-800 rounded-md shadow-md focus:outline-none lg:hidden cursor-pointer"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-neutral-700 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>

    <aside
        class="fixed inset-y-0 left-0 w-64 border-r border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-20 transform transition-transform duration-300 ease-in-out"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
        <div class="h-full flex flex-col">
            <div class="p-6 border-b border-neutral-100 dark:border-neutral-800" v-if="settings">
                <a href="/" class="flex flex-col items-center">
                    <img
                        v-if="settings['blog.logo']"
                        :src="settings['blog.logo']"
                        :alt="settings['blog.title']"
                        class="rounded-full w-[140px] h-[79px]"
                        width="140"
                        height="79"
                    />
                    <span v-else class="text-2xl font-bold text-neutral-800 dark:text-white">{{ settings['blog.title'] }}</span>
                    <label class="text-sm text-neutral-400 dark:text-neutral-500">{{ settings['blog.description'] }}</label>
                </a>

                <div class="mt-4 flex items-center justify-center gap-4">
                    <a v-if="settings['blog.facebook']" :href="`https://facebook.com/${settings['blog.facebook']}`" target="_blank" rel="noopener noreferrer" title="Facebook"
                        class="flex items-center justify-center py-2 text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-400 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>

                    <a v-if="settings['blog.twitter']" :href="`https://twitter.com/${settings['blog.twitter']}`" target="_blank" rel="noopener noreferrer" title="Twitter"
                        class="flex items-center justify-center py-2 text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-400 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>

                    <a v-if="settings['blog.instagram']" :href="`https://instagram.com/${settings['blog.instagram']}`" target="_blank" rel="noopener noreferrer" title="Instagram"
                    class="flex items-center justify-center py-2 text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-400 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                    </a>

                    <a v-if="settings['blog.linkedin']" :href="`https://linkedin.com/in/${settings['blog.linkedin']}`" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                        class="flex items-center justify-center py-2 text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-400 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>

                    <a v-if="settings['blog.github']" :href="`https://github.com/${settings['blog.github']}`" target="_blank" rel="noopener noreferrer" title="GitHub"
                        class="flex items-center justify-center py-2 text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-400 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                    </a>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-6">
                <button
                    @click="openSearchModal"
                    class="w-full flex items-center p-3 mb-6 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span class="text-neutral-600 dark:text-neutral-300">Search</span>
                </button>

                <h2 class="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">Categories</h2>
                <ul class="space-y-2">
                    <li v-for="category in categories" :key="category.id">
                        <a
                            :href="`/category/${category.slug}`"
                            class="text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between"
                            aria-label="Category"
                        >
                            {{ category.name }}
                            <span class="text-sm">({{ category.postCount }})</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </aside>

    <!-- Search Modal -->
    <div v-if="searchModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="search-modal" role="dialog" aria-modal="true">
        <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" @click="closeSearchModal" style="backdrop-filter: blur(4px);"></div>

            <!-- Modal panel -->
            <div class="inline-block align-bottom bg-white dark:bg-neutral-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="w-full">
                            <!-- Search header with close button -->
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg leading-6 font-medium text-neutral-900 dark:text-white" id="modal-title">
                                    Search
                                </h3>
                                <button @click="closeSearchModal" class="text-neutral-400 hover:text-neutral-500 focus:outline-none">
                                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Search input -->
                            <div class="mb-4 relative">
                                <div class="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none">
                                    <svg class="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    v-model="searchQuery"
                                    @input="debouncedSearch"
                                    class="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search posts..."
                                    autocomplete="off"
                                    ref="searchInput"
                                />
                            </div>

                            <!-- Search results -->
                            <div class="mt-4 max-h-[70vh] overflow-y-auto">
                                <div v-if="isSearching" class="flex justify-center items-center py-8">
                                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>

                                <div v-else-if="searchResults.length === 0 && searchQuery.length > 1" class="py-8 text-center text-neutral-600 dark:text-neutral-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-neutral-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>No posts found for "{{ searchQuery }}"</p>
                                </div>

                                <!-- Search results with query -->
                                <div v-else-if="searchQuery.length > 1" class="space-y-4">
                                    <p v-if="searchResults.length > 0" class="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                                        Found {{ searchResults.length }} result{{ searchResults.length !== 1 ? 's' : '' }}
                                    </p>
                                    <a
                                        v-for="post in searchResults"
                                        :key="post.id"
                                        :href="`/post/${post.slug}`"
                                        class="block bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div class="flex flex-col sm:flex-row">
                                            <div v-if="post.featureImage" class="w-full sm:w-32 h-40 sm:h-24 flex-shrink-0">
                                                <img :src="post.featureImage" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
                                            </div>
                                            <div class="p-4 flex-grow">
                                                <h4 class="font-bold text-neutral-900 dark:text-white mb-1">{{ post.title }}</h4>
                                                <p v-if="post.excerpt" class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                                    {{ post.excerpt }}
                                                </p>
                                                <div class="mt-2 text-xs text-neutral-500 dark:text-neutral-500 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {{ formatDate(post.publishedAt || post.updatedAt) }}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <!-- Recent Posts Preview (shown when no search query) -->
                                <div v-else class="space-y-4">
                                    <div class="flex items-center justify-between mb-4">
                                        <h3 class="font-medium text-neutral-800 dark:text-white">Recent Posts</h3>
                                        <a href="/" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</a>
                                    </div>

                                    <div v-if="isLoadingRecentPosts" class="flex justify-center items-center py-8">
                                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>

                                    <a
                                        v-else
                                        v-for="post in recentPosts"
                                        :key="post.id"
                                        :href="`/post/${post.slug}`"
                                        class="block bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div class="flex flex-col sm:flex-row">
                                            <div v-if="post.featureImage" class="w-full sm:w-36 h-48 sm:h-28 relative flex-shrink-0">
                                                <img :src="post.featureImage" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
                                                <div v-if="post.categories && post.categories.length > 0"
                                                     class="absolute top-0 left-0 bg-blue-600 text-white text-xs px-2 py-1 m-1 rounded">
                                                    {{ post.categories[0].name }}
                                                </div>
                                            </div>
                                            <div class="p-4 flex-grow">
                                                <h4 class="font-bold text-neutral-900 dark:text-white mb-1">{{ post.title }}</h4>
                                                <p v-if="post.excerpt" class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                                    {{ post.excerpt }}
                                                </p>
                                                <div class="mt-2 flex items-center justify-between">
                                                    <div class="text-xs text-neutral-500 dark:text-neutral-500 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {{ formatDate(post.publishedAt || post.updatedAt) }}
                                                    </div>
                                                    <span class="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-600 dark:text-neutral-300">
                                                        Read more
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { vue3 } from '@cmmv/blog/client';

const blogAPI = vue3.useBlog();
const settings = ref<any>(null);
const categories = ref<any>(null)
const sidebarOpen = ref(false)
const searchModalOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const searchTimeout = ref<any>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const recentPosts = ref<any[]>([])
const isLoadingRecentPosts = ref(false)

const toggle = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const openSearchModal = () => {
    searchModalOpen.value = true
    // Load recent posts when opening the modal
    loadRecentPosts()
    setTimeout(() => {
        searchInput.value?.focus()
    }, 100)
}

const closeSearchModal = () => {
    searchModalOpen.value = false
    searchQuery.value = ''
    searchResults.value = []
}

const loadRecentPosts = async () => {
    if (recentPosts.value.length > 0) return // Don't reload if we already have posts

    isLoadingRecentPosts.value = true
    try {
        const response = await blogAPI.posts.getAll(0)
        if (Array.isArray(response)) {
            recentPosts.value = response.slice(0, 5)
        } else if (response && typeof response === 'object') {
            // Use type assertion to avoid type error
            const typedResponse = response as { posts?: any[] }
            recentPosts.value = typedResponse.posts ? typedResponse.posts.slice(0, 5) : []
        } else {
            recentPosts.value = []
        }
    } catch (error) {
        console.error('Error loading recent posts:', error)
        recentPosts.value = []
    } finally {
        isLoadingRecentPosts.value = false
    }
}

const debouncedSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
    searchTimeout.value = setTimeout(() => {
        performSearch()
    }, 300)
}

const performSearch = async () => {
    if (searchQuery.value.trim().length < 2) {
        searchResults.value = []
        return
    }

    isSearching.value = true
    try {
        const response = await blogAPI.posts.search(searchQuery.value)
        // Handle both response formats
        if (Array.isArray(response)) {
            searchResults.value = response
        } else if (response && typeof response === 'object') {
            // Use type assertion to avoid type error
            const typedResponse = response as { posts?: any[] }
            searchResults.value = Array.isArray(typedResponse.posts) ? typedResponse.posts : []
        } else {
            searchResults.value = []
        }
    } catch (error) {
        console.error('Search error:', error)
        searchResults.value = []
    } finally {
        isSearching.value = false
    }
}

// Handle keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
    // Open search on Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openSearchModal()
    }

    // Close on Escape
    if (e.key === 'Escape' && searchModalOpen.value) {
        closeSearchModal()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
})

// Format date helper function
const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date)
}

// Fetch initial data
blogAPI.categories.getAll().then((res) => {
    categories.value = res
})

blogAPI.settings.getAll().then((res) => {
    settings.value = res
})
</script>

<style scoped>
/* Add these styles for the line clamp */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
