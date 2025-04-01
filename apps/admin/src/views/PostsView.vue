<template>
    <div class="space-y-6">
        <!-- Header with actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Posts</h1>
            <div class="flex space-x-3">
                <a href="/post"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New
                </a>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-neutral-800 rounded-lg p-4 mb-6">
            <div class="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div class="flex items-center">
                        <label for="filter-status" class="mr-2 text-sm text-neutral-400">Status:</label>
                        <select id="filter-status" v-model="filters.status"
                            class="bg-neutral-700 border border-neutral-600 text-white rounded-md px-3 py-1.5 text-sm">
                            <option value="">All</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <label for="filter-category" class="mr-2 text-sm text-neutral-400">Category:</label>
                        <select id="filter-category" v-model="filters.category"
                            class="bg-neutral-700 border border-neutral-600 text-white rounded-md px-3 py-1.5 text-sm">
                            <option value="">All</option>
                            <option value="technology">Technology</option>
                            <option value="design">Design</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                </div>
                <div class="w-full lg:w-64">
                    <div class="relative">
                        <input type="text" v-model="searchQuery" placeholder="Search posts..."
                            class="w-full bg-neutral-700 border border-neutral-600 text-white rounded-md pl-10 pr-4 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bulk Actions -->
        <div class="flex items-center mb-4 gap-2">
            <select v-model="bulkAction"
                class="bg-neutral-700 border border-neutral-600 text-white rounded-md px-3 py-1.5 text-sm">
                <option value="">Bulk Actions</option>
                <option value="publish">Publish</option>
                <option value="draft">Move to Draft</option>
                <option value="trash">Move to Trash</option>
            </select>
            <button @click="applyBulkAction"
                class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
                :disabled="!selectedPosts.length || !bulkAction">
                Apply
            </button>
            <span v-if="selectedPosts.length" class="text-sm text-neutral-400 ml-2">
                {{ selectedPosts.length }} selected
            </span>
        </div>

        <!-- Mobile Card View (visible on small screens) -->
        <div class="block md:hidden space-y-4 mb-6">
            <div v-for="post in paginatedPosts" :key="post.id" class="bg-neutral-800 rounded-lg overflow-hidden">
                <div class="p-4 border-b border-neutral-700 flex items-center">
                    <input type="checkbox" class="rounded bg-neutral-600 border-neutral-500 text-blue-600 mr-3"
                        :value="post.id" v-model="selectedPosts">
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
                        <div class="text-sm">{{ post.author }}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="text-neutral-400 text-sm w-24">Categories:</div>
                        <div class="flex flex-wrap gap-1">
                            <span v-for="category in post.categories" :key="category"
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-200">
                                {{ category }}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="text-neutral-400 text-sm w-24">Tags:</div>
                        <div class="flex flex-wrap gap-1">
                            <span v-for="tag in post.tags" :key="tag"
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-700 text-neutral-300">
                                {{ tag }}
                            </span>
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

        <!-- Desktop Table View (hidden on small screens) -->
        <div class="hidden md:block bg-neutral-800 rounded-lg overflow-hidden mb-6">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-neutral-700 text-neutral-300 text-sm">
                        <tr>
                            <th class="p-4 w-10">
                                <input type="checkbox" class="rounded bg-neutral-600 border-neutral-500 text-blue-600"
                                    @change="toggleSelectAll" :checked="isAllSelected">
                            </th>
                            <th class="p-4 min-w-[250px]">Title</th>
                            <th class="p-4 w-44 lg:w-48">Categories</th>
                            <th class="p-4 hidden xl:table-cell w-44">Tags</th>
                            <th class="p-4 w-32">Date</th>
                            <th class="p-4 w-28 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-700">
                        <tr v-for="post in paginatedPosts" :key="post.id" class="hover:bg-neutral-750">
                            <td class="p-4">
                                <input type="checkbox" class="rounded bg-neutral-600 border-neutral-500 text-blue-600"
                                    :value="post.id" v-model="selectedPosts">
                            </td>
                            <td class="p-4">
                                <div class="flex flex-col">
                                    <div class="text-sm text-white">{{ post.title }}</div>
                                    <div class="flex items-center mt-1 space-x-2">
                                        <div class="flex items-center">
                                            <div class="h-5 w-5 rounded-full bg-neutral-600 flex-shrink-0"></div>
                                            <span class="ml-1.5 text-xs text-neutral-400">{{ post.author }}</span>
                                        </div>
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                            :class="getStatusClass(post.status)">
                                            {{ post.status.charAt(0).toUpperCase() + post.status.slice(1) }}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="category in post.categories" :key="category"
                                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-200">
                                        {{ category }}
                                    </span>
                                </div>
                            </td>
                            <td class="p-4 hidden xl:table-cell">
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="tag in post.tags" :key="tag"
                                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-700 text-neutral-300">
                                        {{ tag }}
                                    </span>
                                </div>
                            </td>
                            <td class="p-4 text-sm text-neutral-500">
                                <div>{{ formatDate(post.publishedAt || post.createdAt) }}</div>
                                <div class="text-xs text-neutral-400">{{ formatTime(post.publishedAt || post.createdAt)
                                    }}</div>
                            </td>
                            <td class="p-4 text-right">
                                <div class="flex items-center justify-end space-x-2">
                                    <button @click="viewPost(post.id)" class="text-neutral-400 hover:text-white p-1"
                                        title="View">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <button @click="editPost(post.id)" class="text-neutral-400 hover:text-white p-1"
                                        title="Edit">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button @click="deletePost(post.id)" class="text-neutral-400 hover:text-red-500 p-1"
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
                        <tr v-if="paginatedPosts.length === 0">
                            <td colspan="7" class="p-6 text-center text-neutral-400">
                                No posts found. Try adjusting your filters or search criteria.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div class="text-sm text-neutral-400">
                Showing <span class="font-medium text-white">{{ startIndex + 1 }}</span> to
                <span class="font-medium text-white">{{ Math.min(endIndex, filteredPosts.length) }}</span> of
                <span class="font-medium text-white">{{ filteredPosts.length }}</span> posts
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
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock data
const posts = ref([
    {
        id: 1,
        title: "Getting Started with Vue 3 Composition API",
        slug: "getting-started-with-vue-3-composition-api",
        author: "Jane Smith",
        authorId: "user1",
        excerpt: "Learn how to use Vue 3's Composition API to create more maintainable components",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Technology", "Development"],
        tags: ["Vue", "JavaScript", "Frontend"],
        status: "published",
        publishedAt: new Date("2023-04-15").getTime(),
        createdAt: new Date("2023-04-10").getTime(),
        featureImage: "https://placehold.co/600x400/2563eb/FFFFFF?text=Vue+3"
    },
    {
        id: 2,
        title: "Building Responsive Layouts with Tailwind CSS",
        slug: "building-responsive-layouts-with-tailwind-css",
        author: "John Doe",
        authorId: "user2",
        excerpt: "Learn how to create beautiful responsive layouts using Tailwind CSS",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Design", "CSS"],
        tags: ["Tailwind", "CSS", "Responsive"],
        status: "published",
        publishedAt: new Date("2023-04-12").getTime(),
        createdAt: new Date("2023-04-08").getTime(),
        featureImage: "https://placehold.co/600x400/6366f1/FFFFFF?text=Tailwind"
    },
    {
        id: 3,
        title: "Introduction to State Management with Pinia",
        slug: "introduction-to-state-management-with-pinia",
        author: "Jane Smith",
        authorId: "user1",
        excerpt: "Discover how Pinia makes state management in Vue applications easier",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Technology", "Development"],
        tags: ["Vue", "Pinia", "State Management"],
        status: "draft",
        publishedAt: null,
        createdAt: new Date("2023-04-05").getTime(),
        featureImage: "https://placehold.co/600x400/16a34a/FFFFFF?text=Pinia"
    },
    {
        id: 4,
        title: "10 Tips for Better TypeScript Code",
        slug: "10-tips-for-better-typescript-code",
        author: "Maria Garcia",
        authorId: "user3",
        excerpt: "Improve your TypeScript skills with these practical tips",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Technology", "Development"],
        tags: ["TypeScript", "JavaScript", "Tips"],
        status: "published",
        publishedAt: new Date("2023-04-02").getTime(),
        createdAt: new Date("2023-03-30").getTime(),
        featureImage: "https://placehold.co/600x400/ca8a04/FFFFFF?text=TypeScript"
    },
    {
        id: 5,
        title: "Creating Custom Vue Directives",
        slug: "creating-custom-vue-directives",
        author: "Alex Johnson",
        authorId: "user4",
        excerpt: "Learn how to extend Vue with your own custom directives",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Technology", "Development"],
        tags: ["Vue", "JavaScript", "Directives"],
        status: "scheduled",
        publishedAt: new Date("2023-05-20").getTime(),
        createdAt: new Date("2023-04-01").getTime(),
        featureImage: "https://placehold.co/600x400/7c3aed/FFFFFF?text=Vue+Directives"
    },
    {
        id: 6,
        title: "Optimizing Bundle Size in Modern Web Applications",
        slug: "optimizing-bundle-size-in-modern-web-applications",
        author: "Chris Wilson",
        authorId: "user5",
        excerpt: "Techniques to reduce bundle size and improve application performance",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Technology", "Performance"],
        tags: ["Webpack", "Performance", "Optimization"],
        status: "published",
        publishedAt: new Date("2023-03-28").getTime(),
        createdAt: new Date("2023-03-25").getTime(),
        featureImage: "https://placehold.co/600x400/be185d/FFFFFF?text=Optimization"
    },
    {
        id: 7,
        title: "Introduction to Web Animation with GSAP",
        slug: "introduction-to-web-animation-with-gsap",
        author: "John Doe",
        authorId: "user2",
        excerpt: "Get started with GreenSock Animation Platform for smooth web animations",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Design", "Animation"],
        tags: ["GSAP", "Animation", "JavaScript"],
        status: "draft",
        publishedAt: null,
        createdAt: new Date("2023-03-22").getTime(),
        featureImage: "https://placehold.co/600x400/0e7490/FFFFFF?text=GSAP"
    },
    {
        id: 8,
        title: "Building a RESTful API with Node.js and Express",
        slug: "building-a-restful-api-with-nodejs-and-express",
        author: "Maria Garcia",
        authorId: "user3",
        excerpt: "Step-by-step guide to creating a robust RESTful API",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Technology", "Backend"],
        tags: ["Node.js", "Express", "API"],
        status: "published",
        publishedAt: new Date("2023-03-18").getTime(),
        createdAt: new Date("2023-03-15").getTime(),
        featureImage: "https://placehold.co/600x400/1e293b/FFFFFF?text=Node.js"
    },
    {
        id: 9,
        title: "Understanding CSS Grid Layout",
        slug: "understanding-css-grid-layout",
        author: "Jane Smith",
        authorId: "user1",
        excerpt: "Master CSS Grid to create complex layouts with ease",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Design", "CSS"],
        tags: ["CSS", "Grid", "Layout"],
        status: "published",
        publishedAt: new Date("2023-03-12").getTime(),
        createdAt: new Date("2023-03-10").getTime(),
        featureImage: "https://placehold.co/600x400/0369a1/FFFFFF?text=CSS+Grid"
    },
    {
        id: 10,
        title: "Introduction to TensorFlow.js",
        slug: "introduction-to-tensorflowjs",
        author: "Alex Johnson",
        authorId: "user4",
        excerpt: "Learn how to integrate machine learning into your web applications",
        content: "<p>Lorem ipsum dolor sit amet...</p>",
        categories: ["Technology", "AI"],
        tags: ["TensorFlow", "ML", "JavaScript"],
        status: "draft",
        publishedAt: null,
        createdAt: new Date("2023-03-05").getTime(),
        featureImage: "https://placehold.co/600x400/9f1239/FFFFFF?text=TensorFlow.js"
    }
])

// Pagination
const itemsPerPage = 5
const currentPage = ref(1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)
const paginatedPosts = computed(() =>
    filteredPosts.value.slice(startIndex.value, endIndex.value)
)
const totalPages = computed(() =>
    Math.ceil(filteredPosts.value.length / itemsPerPage)
)

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

function goToPage(page) {
    currentPage.value = page
}

// Filtering and searching
const searchQuery = ref('')
const filters = ref({
    status: '',
    category: ''
})

const filteredPosts = computed(() => {
    return posts.value.filter(post => {
        // Filter by status
        if (filters.value.status && post.status !== filters.value.status) {
            return false
        }

        // Filter by category
        if (filters.value.category && !post.categories.some(cat =>
            cat.toLowerCase() === filters.value.category.toLowerCase()
        )) {
            return false
        }

        // Search query
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            const inTitle = post.title.toLowerCase().includes(query)
            const inExcerpt = post.excerpt.toLowerCase().includes(query)
            const inCategories = post.categories.some(cat => cat.toLowerCase().includes(query))
            const inTags = post.tags.some(tag => tag.toLowerCase().includes(query))

            return inTitle || inExcerpt || inCategories || inTags
        }

        return true
    })
})

// Watch for filter changes to reset pagination
watch([searchQuery, filters], () => {
    currentPage.value = 1
})

// Bulk actions
const selectedPosts = ref([])
const bulkAction = ref('')
const isAllSelected = computed(() =>
    filteredPosts.value.length > 0 && selectedPosts.value.length === filteredPosts.value.length
)

function toggleSelectAll(e) {
    if (e.target.checked) {
        selectedPosts.value = filteredPosts.value.map(post => post.id)
    } else {
        selectedPosts.value = []
    }
}

function applyBulkAction() {
    if (!bulkAction.value || selectedPosts.value.length === 0) return

    // Get all selected posts
    const selected = posts.value.filter(post => selectedPosts.value.includes(post.id))

    // Apply the selected action
    switch (bulkAction.value) {
        case 'publish':
            selected.forEach(post => {
                post.status = 'published'
                post.publishedAt = Date.now()
            })
            break
        case 'draft':
            selected.forEach(post => {
                post.status = 'draft'
                post.publishedAt = null
            })
            break
        case 'trash':
            // In a real application, you would either mark as deleted or remove
            posts.value = posts.value.filter(post => !selectedPosts.value.includes(post.id))
            break
    }

    // Reset selection and action
    selectedPosts.value = []
    bulkAction.value = ''
}

// Item actions
function editPost(id) {
    // Navigate to edit page
    router.push(`/post/${id}`)
}

function viewPost(id) {
    // Open post in new tab (in a real app, this would go to the public URL)
    const post = posts.value.find(p => p.id === id)
    if (post) {
        window.open(`/blog/${post.slug}`, '_blank')
    }
}

function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts.value = posts.value.filter(post => post.id !== id)
    }
}

// Utility functions
function formatDate(timestamp) {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTime(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function getStatusClass(status) {
    switch (status) {
        case 'published': return 'bg-green-900 text-green-200'
        case 'draft': return 'bg-yellow-900 text-yellow-200'
        case 'scheduled': return 'bg-blue-900 text-blue-200'
        default: return 'bg-neutral-700 text-neutral-200'
    }
}

// Update to show limited page numbers for better mobile experience
const displayedPages = computed(() => {
    if (totalPages.value <= 5) return Array.from({ length: totalPages.value }, (_, i) => i + 1);

    let pages = [];
    // Always include first page
    pages.push(1);

    // Add middle pages
    if (currentPage.value <= 3) {
        pages.push(2, 3, 4);
    } else if (currentPage.value >= totalPages.value - 2) {
        pages.push(totalPages.value - 3, totalPages.value - 2, totalPages.value - 1);
    } else {
        pages.push(currentPage.value - 1, currentPage.value, currentPage.value + 1);
    }

    // Always include last page
    if (totalPages.value > 1) {
        pages.push(totalPages.value);
    }

    // Remove duplicates and sort
    return [...new Set(pages)].sort((a, b) => a - b);
});
</script>
