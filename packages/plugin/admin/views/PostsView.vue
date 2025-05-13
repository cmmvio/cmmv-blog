<template>
    <div class="space-y-6">
        <!-- Header with actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Posts</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <a href="/post"
                    class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New
                </a>
                <!-- Add search button with dropdown -->
                <div class="relative">
                    <button @click="toggleSearchDropdown" data-search-toggle
                        class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center relative">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                        <!-- Indicator dot for active search -->
                        <span
                            v-if="searchQuery.trim()"
                            class="absolute -top-1 -right-1 h-2.5 w-2.5 bg-blue-500 rounded-full"
                            title="Search filter active">
                        </span>
                    </button>
                    <!-- Search dropdown -->
                    <div v-if="showSearchDropdown" class="absolute right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10">
                        <div class="p-3 relative">
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Search posts..."
                                class="bg-neutral-700 h-9 border border-neutral-600 text-white pl-3 pr-8 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                @keydown.esc="showSearchDropdown = false"
                                ref="searchInput"
                            >
                            <!-- Clear button -->
                            <button
                                v-if="searchQuery.trim()"
                                @click="clearSearch"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                                title="Clear search">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <button @click="refreshData"
                    class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        <!-- Remove the old search box and just keep the status tabs -->
        <!-- Status Tabs -->
        <div class="flex flex-wrap gap-2 mb-4">
            <button
                @click="setStatusFilter('')"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                :class="filters.status === '' ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'"
            >
                All
            </button>
            <button
                @click="setStatusFilter('draft')"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                :class="filters.status === 'draft' ? 'bg-yellow-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'"
            >
                Draft
            </button>
            <button
                @click="setStatusFilter('cron')"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                :class="filters.status === 'cron' ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'"
            >
                Scheduled
            </button>
            <button
                @click="setStatusFilter('published')"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                :class="filters.status === 'published' ? 'bg-green-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'"
            >
                Published
            </button>
        </div>

        <!-- Add this after the filters and before the table/card views -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading posts...</span>
        </div>

        <div v-else-if="posts.length === 0" class="bg-neutral-800 rounded-lg p-6 text-center text-neutral-400">
            No posts found. Try adjusting your filters or search criteria.
        </div>

        <template v-else>

            <!-- Mobile Card View -->
            <div class="block md:hidden space-y-4 mb-6">
                <div v-for="post in paginatedPosts" :key="post.id" class="bg-neutral-800 rounded-lg overflow-hidden">
                    <div class="p-4 border-b border-neutral-700 flex items-center">
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-white truncate">{{ post.title }}</div>
                            <div class="flex items-center space-x-2 mt-1">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                    :class="getStatusClass(post.status)">
                                    {{ post.status === 'cron' ? 'Scheduled' : post.status.charAt(0).toUpperCase() + post.status.slice(1) }}
                                </span>
                                <span class="text-xs text-neutral-400">
                                    <template v-if="post.status === 'cron' && post.scheduledPublishDate">
                                        <span class="ml-2 text-blue-400 font-medium">
                                            <i class="far fa-clock mr-1"></i> Será publicado em: {{ post.scheduledPublishDate }}
                                        </span>
                                    </template>
                                    <template v-else>
                                        {{ formatDate(post.publishedAt || post.createdAt) }}
                                    </template>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div class="flex items-center">
                            <div class="text-neutral-400 text-sm w-24">Author:</div>
                            <div class="text-sm flex items-center text-white">
                                <div v-if="post.authorImage" class="h-5 w-5 rounded-full bg-cover bg-center flex-shrink-0 mr-2 text-white"
                                     :style="{ backgroundImage: `url(${post.authorImage})` }"></div>
                                <div v-else class="h-5 w-5 rounded-full bg-neutral-600 flex-shrink-0 mr-2"></div>
                                {{ post.author }}
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="text-neutral-400 text-sm w-24">Categories:</div>
                            <div class="flex flex-wrap gap-1">
                                <span v-for="category in post.categories" :key="category"
                                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-200">
                                    {{ category?.name }}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="text-neutral-400 text-sm w-24">Tags:</div>
                            <div class="flex flex-wrap gap-1">
                                <span v-for="tag in (post.tags || [])" :key="tag"
                                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-700 text-neutral-300">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center mt-2">
                            <div class="flex items-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span class="text-xs text-neutral-400">{{ formatNumber(post.views || 0) }}</span>
                            </div>
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span class="text-xs text-neutral-400">{{ formatNumber(post.comments || 0) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 bg-neutral-750 border-t border-neutral-700 flex justify-between">
                        <button @click="viewPost(post.id)" class="text-neutral-400 hover:text-white p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                        <button @click="editPost(post.id)" class="text-neutral-400 hover:text-white p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button @click="deletePost(post.id)" class="text-neutral-400 hover:text-red-500 p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden md:block bg-neutral-800 rounded-lg overflow-hidden mb-6">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-neutral-700 text-neutral-300 text-sm">
                            <tr>
                                <th class="p-4 w-16">Image</th>
                                <th class="p-4 min-w-[250px]">Title</th>
                                <th class="p-4 w-44 lg:w-48">Categories</th>
                                <th class="p-4 w-32 hidden lg:table-cell">Stats</th>
                                <th class="p-4 w-28 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-700">
                            <tr v-for="post in paginatedPosts" :key="post.id" class="hover:bg-neutral-750">
                                <td class="p-2">
                                    <div class="h-14 w-24 rounded-md bg-neutral-700 overflow-hidden flex items-center justify-center">
                                        <img v-if="post.featureImage" :src="post.featureImage" alt="Feature image"
                                            class="w-full h-full object-cover">
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-neutral-500" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </td>
                                <td class="p-4">
                                    <div class="flex flex-col">
                                        <div class="text-sm text-white">{{ post.title }}</div>
                                        <div class="flex items-center mt-1 space-x-2">
                                            <div class="flex items-center">
                                                <div v-if="post.authorImage" class="h-5 w-5 rounded-full bg-cover bg-center flex-shrink-0"
                                                     :style="{ backgroundImage: `url(${post.authorImage})` }"></div>
                                                <div v-else class="h-5 w-5 rounded-full bg-neutral-600 flex-shrink-0"></div>
                                                <span class="ml-1.5 text-xs text-neutral-400">{{ post.author }}</span>
                                            </div>
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                                :class="getStatusClass(post.status)">
                                                {{ post.status === 'cron' ? 'Scheduled' : post.status.charAt(0).toUpperCase() + post.status.slice(1) }}
                                            </span>
                                        </div>
                                        <div>
                                            <span class="text-xs text-neutral-400">
                                                <template v-if="post.status === 'cron' && post.autoPublishAt">
                                                    <span class="text-blue-400 font-medium">
                                                        <i class="far fa-clock mr-1"></i> {{ formatDate(post.autoPublishAt) }} {{ formatTime(post.autoPublishAt) }}
                                                    </span>
                                                </template>
                                                <template v-else>
                                                    {{ formatDate(post.publishedAt || post.createdAt) }} {{ formatTime(post.publishedAt || post.createdAt) }}
                                                </template>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4">
                                    <div class="flex flex-wrap gap-1">
                                        <span v-for="category in (post.categories || [])" :key="category"
                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-200">
                                            {{ category?.name }}
                                        </span>
                                    </div>
                                </td>
                                <td class="p-4 hidden lg:table-cell text-xs text-neutral-400">
                                    <div class="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {{ formatNumber(post.views || 0) }}
                                    </div>
                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        {{ formatNumber(post.comments || 0) }}
                                    </div>
                                </td>
                                <td class="p-4 text-right">
                                    <div class="flex items-center justify-end space-x-2">
                                        <button @click="viewPost(post.id)" class="text-neutral-400 hover:text-white p-1 cursor-pointer"
                                            title="View">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button @click="editPost(post.id)" class="text-neutral-400 hover:text-white p-1 cursor-pointer"
                                            title="Edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button @click="deletePost(post.id)" class="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                                            title="Delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <Pagination
                :pagination="pagination"
                itemName="posts"
                @pageChange="handlePageChange"
            />
        </template>
    </div>

    <!-- Add Toast notification component -->
    <ToastNotification
        :show="notification.show"
        :message="notification.message"
        :type="notification.type"
        :duration="notification.duration"
        @close="notification.show = false"
    />
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminClient } from '@cmmv/blog/admin/client'
import Pagination from '../components/Pagination.vue'
import ToastNotification from '../components/ToastNotification.vue'

const router = useRouter()
const route = useRoute()
const adminClient = useAdminClient()
const loading = ref(false)
const posts = ref([])

// Search dropdown functionality
const showSearchDropdown = ref(false)
const searchInput = ref(null)

function toggleSearchDropdown() {
    showSearchDropdown.value = !showSearchDropdown.value

    // Focus the search input when dropdown opens
    if (showSearchDropdown.value) {
        nextTick(() => {
            searchInput.value?.focus()
        })
    }
}

const itemsPerPage = 10
const currentPage = ref(1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)
const totalPosts = ref(0)
const blogUrl = ref('');

// Create a pagination object to match the component's expected format
const pagination = computed(() => ({
    current: currentPage.value,
    lastPage: totalPages.value,
    perPage: itemsPerPage,
    total: totalPosts.value,
    from: posts.length > 0 ? startIndex.value + 1 : 0,
    to: Math.min(endIndex.value, totalPosts.value)
}));

const loadBlogUrl = async () => {
    try {
        const settings = await adminClient.settings.getRoot();
        const urlSetting = settings.find(s => s.key === 'blog.url');

        if (urlSetting)
            blogUrl.value = urlSetting.value.replace(/\/$/, '');
    } catch (err) {
        console.error('Failed to load blog URL:', err);
        blogUrl.value = '';
    }
};

// Add notification system
const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

const showNotification = (type, message) => {
    notification.value = {
        show: true,
        type,
        message,
        duration: 3000
    }

    setTimeout(() => {
        notification.value.show = false
    }, notification.value.duration)
}

// Replace the loadPosts function
async function loadPosts() {
    try {
        loading.value = true

        const params = {
            limit: itemsPerPage,
            offset: (currentPage.value - 1) * itemsPerPage,
            sortBy: 'publishedAt',
            sort: 'desc'
        }

        if (searchQuery.value) {
            params.search = searchQuery.value
            params.searchField = 'title'
        }

        if (filters.value.status) {
            params.status = filters.value.status
        }

        const response = await adminClient.posts.get(params)

        if (response && response.posts) {
            posts.value = response.posts.map(post => {
                const authorData = response.authors?.find(author =>
                    author.user === post.author ||
                    (post.authors && post.authors.includes(author.user))
                );

                return {
                    ...post,
                    author: authorData?.name || 'Unknown',
                    authorImage: authorData?.image || null,
                    categories: Array.isArray(post.categories) ? post.categories : [post.categories],
                    categoryNames: Array.isArray(post.categories)
                        ? response.categories
                            .filter(category => post.categories.includes(category.id))
                            .map(category => category.name)
                        : post.categories?.name ? [post.categories.name] : [],
                    tags: post.tags || []
                }
            });

            totalPosts.value = response.count || posts.value.length;
        } else {
            posts.value = [];
            totalPosts.value = 0;
        }

        loading.value = false
    } catch (error) {
        console.error('Failed to load posts:', error)
        posts.value = [];
        totalPosts.value = 0;
        loading.value = false
        showNotification('error', 'Failed to load posts: ' + error.message)
    }
}

const searchQuery = ref('')
const filters = ref({
    status: '',
    category: ''
})

// Add URL parameter handling for pagination
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    updateUrlParams();
    loadPosts();
}

const updateUrlParams = () => {
    const query = { ...route.query };

    // Update page parameter
    if (currentPage.value === 1) {
        delete query.page;
    } else {
        query.page = currentPage.value.toString();
    }

    // Update search parameter
    if (!searchQuery.value) {
        delete query.search;
    } else {
        query.search = searchQuery.value;
    }

    // Update status parameter
    if (!filters.value.status) {
        delete query.status;
    } else {
        query.status = filters.value.status;
    }

    // Replace URL without navigating
    router.replace({ query });
}

const initializeFromUrl = () => {
    const { query } = route;

    // Set page from URL
    if (query.page) {
        currentPage.value = parseInt(query.page) || 1;
    }

    // Set search query from URL
    if (query.search) {
        searchQuery.value = query.search;
    }

    // Set status filter from URL
    if (query.status) {
        filters.value.status = query.status;
    }
}

// Modify the watcher for searchQuery
watch(searchQuery, (newValue) => {
    // Reset to page 1
    currentPage.value = 1

    // If there's a search term, switch to "All" status to find post in any status
    if (newValue && newValue.trim() !== '') {
        filters.value.status = ''
    }

    updateUrlParams()
    loadPosts()
})

// Remove searchQuery from the combined watcher to avoid double updates
watch([filters], () => {
    loadPosts()
}, { deep: true })

// Add a watcher specifically for status filter changes
watch(() => filters.value.status, (newStatus) => {
    // Reset to page 1
    currentPage.value = 1
    updateUrlParams()
}, { immediate: false })

// Keep the existing watch for currentPage
watch(currentPage, () => {
    updateUrlParams()
    loadPosts()
})

// Add watcher for URL changes
watch(() => route.query, (newQuery, oldQuery) => {
    // Only update if there's an actual change to prevent loops
    if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        initializeFromUrl();
        loadPosts();
    }
}, { deep: true });

const categoryOptions = ref([])

const loadCategories = async () => {
    try {
        const response = await adminClient.categories.get({
            limit: 100,
            sort: 'asc',
            sortBy: 'name'
        })

        if (response && response.data) {
            categoryOptions.value = response.data
        }
    } catch (err) {
        console.error('Failed to load categories:', err)
        showNotification('error', 'Failed to load categories')
    }
}

onMounted(async () => {
    initializeFromUrl()
    loadBlogUrl()
    loadCategories()

    if (!filters.value.status)
        filters.value.status = 'draft'

    loadPosts()

    document.addEventListener('click', (e) => {
        if (showSearchDropdown.value && !e.target.closest('.relative')
            && e.target !== document.querySelector('button[data-search-toggle]')) {
            showSearchDropdown.value = false
        }
    })
})

const paginatedPosts = computed(() => {
    return posts.value
})

const totalPages = computed(() => {
    if (totalPosts.value > 0) {
        return Math.ceil(totalPosts.value / itemsPerPage)
    }
    return Math.max(1, Math.ceil(posts.value.length / itemsPerPage))
})

const selectedPosts = ref([])
const bulkAction = ref('')
const isAllSelected = computed(() =>
    posts.value.length > 0 && selectedPosts.value.length === posts.value.length
)

function toggleSelectAll(e) {
    if (e.target.checked) {
        selectedPosts.value = posts.value.map(post => post.id)
    } else {
        selectedPosts.value = []
    }
}

async function applyBulkAction() {
    if (!bulkAction.value || selectedPosts.value.length === 0) return

    try {
        loading.value = true

        const action = bulkAction.value
        const ids = selectedPosts.value

        await adminClient.bulkUpdatePosts({
            ids,
            action
        })

        selectedPosts.value = []
        bulkAction.value = ''
        await loadPosts()

        loading.value = false
    } catch (error) {
        console.error('Failed to apply bulk action:', error)
        loading.value = false
    }
}

function editPost(id) {
    router.push(`/post/${id}`)
}

function viewPost(id) {
    const post = posts.value.find(p => p.id === id)

    if (post)
        window.open(`${blogUrl.value}/preview/${post.id}`, '_blank')
}

async function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        try {
            loading.value = true
            await adminClient.posts.delete(id)
            await loadPosts()
            showNotification('success', 'Post deleted successfully')
            loading.value = false
        } catch (error) {
            console.error('Failed to delete post:', error)
            loading.value = false
            showNotification('error', 'Failed to delete post: ' + error.message)
        }
    }
}

function formatDate(timestamp) {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTime(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function getStatusClass(status) {
    switch (status) {
        case 'published': return 'bg-green-900 text-green-200'
        case 'draft': return 'bg-yellow-900 text-yellow-200'
        case 'scheduled':
        case 'cron': return 'bg-blue-900 text-blue-200'
        default: return 'bg-neutral-700 text-neutral-200'
    }
}

function formatNumber(num) {
    if (!num && num !== 0) return '0';

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Add a refresh function
function refreshData() {
    loadPosts();
}

function setStatusFilter(status) {
    // Clear search when changing status filter
    if (searchQuery.value.trim() !== '') {
        searchQuery.value = ''
    }

    filters.value.status = status
    // No need to set currentPage, update URL or load posts here
    // The watchers will handle that
}

function clearSearch() {
    searchQuery.value = ''
    updateUrlParams()
    loadPosts()
}
</script>
