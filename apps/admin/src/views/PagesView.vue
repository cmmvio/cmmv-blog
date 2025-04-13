<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Pages</h1>
            <div class="flex space-x-3">
                <a href="/page"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New
                </a>
            </div>
        </div>

        <div class="bg-neutral-800 rounded-lg p-4 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="relative flex-1 flex items-center">
                    <div class="flex items-center mr-4">
                        <label for="filter-status" class="mr-2 text-sm text-neutral-400">Status:</label>
                        <select id="filter-status" v-model="filters.status"
                            class="bg-neutral-700 h-10 border border-neutral-600 text-white rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="">All</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>

                    <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search pages..."
                            class="bg-neutral-700 h-10 border border-neutral-600 text-white pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                    </div>
                </div>
            </div>
        </div>

        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading pages...</span>
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
                                    {{ post.status.charAt(0).toUpperCase() + post.status.slice(1) }}
                                </span>
                                <span class="text-xs text-neutral-400">{{ formatDate(post.publishedAt || post.createdAt)
                                    }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div class="flex items-center">
                            <div class="text-neutral-400 text-sm w-24">Author:</div>
                            <div class="text-sm flex items-center">
                                <div v-if="post.authorImage" class="h-5 w-5 rounded-full bg-cover bg-center flex-shrink-0 mr-2"
                                     :style="{ backgroundImage: `url(${post.authorImage})` }"></div>
                                <div v-else class="h-5 w-5 rounded-full bg-neutral-600 flex-shrink-0 mr-2"></div>
                                {{ post.author }}
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
                                                {{ post.status.charAt(0).toUpperCase() + post.status.slice(1) }}
                                            </span>
                                        </div>
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
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div class="text-sm text-neutral-400">
                    Showing <span class="font-medium text-white">{{ posts.length > 0 ? startIndex + 1 : 0 }}</span> to
                    <span class="font-medium text-white">{{ Math.min(endIndex, totalPosts) }}</span> of
                    <span class="font-medium text-white">{{ totalPosts }}</span> posts
                </div>
                <div class="flex items-center space-x-2">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                        class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200">
                        Previous
                    </button>
                    <div class="flex items-center">
                        <div v-for="page in displayedPages" :key="page" @click="goToPage(page)"
                            class="w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer transition-colors duration-200"
                            :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-white hover:bg-neutral-700'">
                            {{ page }}
                        </div>
                    </div>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                        class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200">
                        Next
                    </button>
                </div>
            </div>
        </template>
    </div>

    <!-- Toast notification component -->
    <div v-if="notification.show"
        class="fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg flex items-center z-50"
        :class="notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
        <span v-if="notification.type === 'success'" class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
        </span>
        <span v-else class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
        </span>
        <span>{{ notification.message }}</span>
        <button @click="notification.show = false" class="ml-4 text-white hover:text-neutral-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminClient } from '@cmmv/blog/admin/client'

const router = useRouter()
const adminClient = useAdminClient()
const loading = ref(false)
const posts = ref([])

const itemsPerPage = 10
const currentPage = ref(1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)
const totalPosts = ref(0)
const blogUrl = ref('');

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

async function loadPages() {
    try {
        loading.value = true

        const params = {
            limit: itemsPerPage,
            offset: (currentPage.value - 1) * itemsPerPage,
            sortBy: 'updatedAt',
            sort: 'desc'
        }

        if (searchQuery.value) {
            params.search = searchQuery.value
            params.searchField = 'title'
        }

        if (filters.value.status) {
            params.status = filters.value.status
        }

        if (filters.value.category) {
            params.category = filters.value.category
        }

        const response = await adminClient.pages.get(params)

        if (response && response.posts) {
            posts.value = response.posts.map(post => {
                const authorData = response.authors?.find(author =>
                    author.user === post.author ||
                    (post.authors && post.authors.includes(author.user))
                );

                return {
                    ...post,
                    author: authorData?.name || 'Unknown',
                    authorImage: authorData?.image || null
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
        showNotification('error', 'Failed to load pages: ' + error.message)
    }
}

const searchQuery = ref('')
const filters = ref({
    status: '',
    category: ''
})

watch([searchQuery, filters], () => {
    currentPage.value = 1
    loadPages()
}, { deep: true })

watch(currentPage, () => {
    loadPages()
})

onMounted(() => {
    loadBlogUrl();
    loadPages()
})

const paginatedPosts = computed(() => {
    return posts.value
})

const totalPages = computed(() => {
    if (totalPosts.value > 0)
        return Math.ceil(totalPosts.value / itemsPerPage)

    return Math.max(1, Math.ceil(posts.value.length / itemsPerPage))
})

function prevPage() {
    if (currentPage.value > 1)
        currentPage.value--
}

function nextPage() {
    if (currentPage.value < totalPages.value)
        currentPage.value++
}

function goToPage(page) {
    currentPage.value = page
}

const selectedPosts = ref([])
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

function editPost(id) {
    router.push(`/page/${id}`)
}

function viewPost(id) {
    const post = posts.value.find(p => p.id === id)

    if (post)
        window.open(`${blogUrl.value}/preview-page/${post.id}`, '_blank')
}

async function deletePost(id) {
    if (confirm('Are you sure you want to delete this page?')) {
        try {
            loading.value = true
            await adminClient.pages.delete(id)
            await loadPages()
            showNotification('success', 'Page deleted successfully')
            loading.value = false
        } catch (error) {
            console.error('Failed to delete page:', error)
            loading.value = false
            showNotification('error', 'Failed to delete page: ' + error.message)
        }
    }
}

function formatDate(timestamp) {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getStatusClass(status) {
    switch (status) {
        case 'published': return 'bg-green-900 text-green-200'
        case 'draft': return 'bg-yellow-900 text-yellow-200'
        case 'scheduled': return 'bg-blue-900 text-blue-200'
        default: return 'bg-neutral-700 text-neutral-200'
    }
}

const displayedPages = computed(() => {
    if (totalPages.value <= 5) return Array.from({ length: totalPages.value }, (_, i) => i + 1);

    let pages = [];
    pages.push(1);

    if (currentPage.value <= 3)
        pages.push(2, 3, 4);
    else if (currentPage.value >= totalPages.value - 2)
        pages.push(totalPages.value - 3, totalPages.value - 2, totalPages.value - 1);
    else
        pages.push(currentPage.value - 1, currentPage.value, currentPage.value + 1);

    if (totalPages.value > 1)
        pages.push(totalPages.value);

    return [...new Set(pages)].sort((a, b) => a - b);
});

function refreshData() {
    loadPages()
}
</script>
