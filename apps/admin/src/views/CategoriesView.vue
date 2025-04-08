<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Categories</h1>
            <div class="flex space-x-3 mt-2 sm:mt-0">
                <button @click="refreshData" class="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <button @click="openAddDialog" class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Category
                </button>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-neutral-800 rounded-lg p-4 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="relative flex-1 flex items-center">
                    <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            v-model="filters.search"
                            type="text"
                            placeholder="Search categories..."
                            class="bg-neutral-700 h-10 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-0"
                        >
                    </div>
                    <select
                        v-model="filters.searchField"
                        class="bg-neutral-700 w-56 h-10 border border-neutral-800 text-white px-3 py-2 rounded-r-md focus:outline-none focus:ring-0 border-l-0"
                    >
                        <option value="name">Name</option>
                        <option value="slug">Slug</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading categories...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load categories</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="categories.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            <p class="text-neutral-300 mb-2">No categories found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by creating your first category</p>
            <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Add Category
            </button>
        </div>

        <!-- Categories table -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                ID
                            </th>
                            <th
                                @click="toggleSort('name')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Name
                                <span v-if="filters.sortBy === 'name'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th
                                @click="toggleSort('slug')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Slug
                                <span v-if="filters.sortBy === 'slug'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Posts
                            </th>
                            <th
                                @click="toggleSort('active')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Status
                                <span v-if="filters.sortBy === 'active'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="category in categories" :key="category.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="category.id">
                                {{ category.id.substring(0, 6) }}...
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {{ category.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                <a :href="`${blogUrl}/category/${category.slug}`" target="_blank" class="text-blue-400 hover:text-blue-300 hover:underline">
                                    {{ category.slug }}
                                </a>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ category.postCount || 0 }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                    class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="category.active ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'"
                                >
                                    {{ category.active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="openEditDialog(category)"
                                        title="Edit"
                                        class="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="confirmDelete(category)"
                                        title="Delete"
                                        class="text-neutral-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        <div class="flex items-center justify-between">
            <div class="text-sm text-neutral-400">
                Showing <span class="font-medium text-white">{{ pagination.from }}</span> to
                <span class="font-medium text-white">{{ pagination.to }}</span> of
                <span class="font-medium text-white">{{ pagination.total }}</span> categories
            </div>
            <div class="flex items-center space-x-2">
                <button
                    @click="prevPage"
                    :disabled="pagination.current === 1"
                    :class="{'opacity-50 cursor-not-allowed': pagination.current === 1}"
                    class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
                >
                    Previous
                </button>
                <div class="flex items-center">
                    <div v-for="page in paginationPages" :key="page"
                        @click="goToPage(page)"
                        class="w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer transition-colors duration-200"
                        :class="page === pagination.current ? 'bg-blue-600 text-white' : 'text-white hover:bg-neutral-700'"
                    >
                        {{ page }}
                    </div>
                </div>
                <button
                    @click="nextPage"
                    :disabled="pagination.current === pagination.lastPage"
                    :class="{'opacity-50 cursor-not-allowed': pagination.current === pagination.lastPage}"
                    class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
                >
                    Next
                </button>
            </div>
        </div>

        <!-- Add/Edit Category Dialog -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Edit Category' : 'Add Category' }}</h3>
                    <button @click="closeDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <form @submit.prevent="saveCategory">
                        <div class="mb-4">
                            <label for="categoryName" class="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                            <input
                                id="categoryName"
                                v-model="categoryForm.name"
                                @input="updateSlugAndLabel"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Category name"
                                required
                            />
                            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="categorySlug" class="block text-sm font-medium text-neutral-300 mb-1">Slug</label>
                            <input
                                id="categorySlug"
                                v-model="categoryForm.slug"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="category-slug"
                                required
                            />
                            <p class="mt-1 text-sm text-neutral-500">URL: /category/<span class="text-blue-400">{{ categoryForm.slug || 'your-slug' }}</span></p>
                            <p v-if="formErrors.slug" class="mt-1 text-sm text-red-500">{{ formErrors.slug }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="parentCategory" class="block text-sm font-medium text-neutral-300 mb-1">Parent Category (optional)</label>
                            <select
                                id="parentCategory"
                                v-model="categoryForm.parentCategory"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">None</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="navigationLabel" class="block text-sm font-medium text-neutral-300 mb-1">Navigation Label (optional)</label>
                            <input
                                id="navigationLabel"
                                v-model="categoryForm.navigationLabel"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Custom navigation label"
                            />
                        </div>

                        <div class="mb-4 flex items-center">
                            <input
                                id="categoryActive"
                                v-model="categoryForm.active"
                                type="checkbox"
                                class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                            />
                            <label for="categoryActive" class="ml-2 block text-sm text-neutral-300">
                                Active
                            </label>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                @click="closeDialog"
                                class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                :disabled="formLoading"
                            >
                                <span v-if="formLoading" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                                <span v-else>
                                    {{ isEditing ? 'Update' : 'Create' }}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Confirm Deletion</h3>
                </div>
                <div class="p-6">
                    <p class="text-neutral-300 mb-4">
                        Are you sure you want to delete the category <span class="font-medium text-white">{{ categoryToDelete?.name }}</span>?
                    </p>
                    <p class="text-sm text-neutral-400 mb-6">
                        This action cannot be undone. All posts associated with this category may be affected.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button
                            @click="closeDeleteDialog"
                            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="deleteCategory"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            :disabled="deleteLoading"
                        >
                            <span v-if="deleteLoading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </span>
                            <span v-else>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast notifications -->
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAdminClient } from '@cmmv/blog/admin/client'

const adminClient = useAdminClient()

// State
const categories = ref([])
const loading = ref(true)
const error = ref(null)

// Category form
const showDialog = ref(false)
const isEditing = ref(false)
const categoryForm = ref({
    name: '',
    slug: '',
    parentCategory: '',
    navigationLabel: '',
    active: true
})
const categoryToEdit = ref(null)
const formErrors = ref({})
const formLoading = ref(false)

// Delete confirmation
const showDeleteDialog = ref(false)
const categoryToDelete = ref(null)
const deleteLoading = ref(false)

// Notification
const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

// Pagination
const pagination = ref({
    current: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 1,
    to: 10
})

// Filtering & Sorting
const filters = ref({
    search: '',
    searchField: 'name',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1
})

// First, add the blogUrl ref after other state declarations
const blogUrl = ref('');

// Add the loadBlogUrl function
const loadBlogUrl = async () => {
    try {
        const settings = await adminClient.getRootSettings();
        const urlSetting = settings.find(s => s.key === 'blog.url');
        if (urlSetting) {
            blogUrl.value = urlSetting.value.replace(/\/$/, ''); // Remove trailing slash if present
        }
    } catch (err) {
        console.error('Failed to load blog URL:', err);
        blogUrl.value = '';
    }
};

// Computed
const paginationPages = computed(() => {
    const totalPages = pagination.value.lastPage
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always include first page, last page, current page, and one page before/after current
    const current = pagination.value.current
    const pages = [1]

    if (current > 2) pages.push('...')

    if (current > 1 && current < totalPages) pages.push(current)

    if (current < totalPages - 1) pages.push('...')

    if (totalPages > 1) pages.push(totalPages)

    return pages
})

// Load categories
const loadCategories = async () => {
    try {
        loading.value = true
        error.value = null

        // Create filter object from current filters using the correct interface
        const apiFilters = {
            limit: pagination.value.perPage,
            offset: (filters.value.page - 1) * pagination.value.perPage,
            sortBy: filters.value.sortBy,
            sort: filters.value.sortOrder,
        }

        if (filters.value.search) {
            apiFilters.search = filters.value.search
            apiFilters.searchField = filters.value.searchField
        }

        const response = await adminClient.getCategories(apiFilters)

        if (response && response.data) {
            categories.value = response.data || []

            const paginationData = response.pagination || {}
            const totalCount = response.count || 0
            const currentOffset = paginationData.offset || 0
            const currentLimit = paginationData.limit || 10

            // Calculate current page from offset and limit
            const currentPage = Math.floor(currentOffset / currentLimit) + 1
            const lastPage = Math.ceil(totalCount / currentLimit)

            pagination.value = {
                current: currentPage,
                lastPage: lastPage,
                perPage: currentLimit,
                total: totalCount,
                from: currentOffset + 1,
                to: Math.min(currentOffset + currentLimit, totalCount)
            }
        } else {
            categories.value = []
            // Reset pagination if data format is unexpected
            pagination.value = {
                current: 1,
                lastPage: 1,
                perPage: 10,
                total: 0,
                from: 0,
                to: 0
            }
        }

        loading.value = false
    } catch (err) {
        console.error('Failed to load categories:', err)
        loading.value = false
        error.value = err.message || 'Failed to load categories'
        showNotification('error', 'Failed to load categories')
    }
}

// Refresh data
const refreshData = () => {
    loadCategories()
}

// Pagination methods
const goToPage = (page) => {
    if (page === '...') return
    filters.value.page = page
}

const prevPage = () => {
    if (pagination.value.current > 1) {
        filters.value.page = pagination.value.current - 1
    }
}

const nextPage = () => {
    if (pagination.value.current < pagination.value.lastPage) {
        filters.value.page = pagination.value.current + 1
    }
}

// Watch for filter changes
watch(filters, () => {
    loadCategories()
}, { deep: true })

// Dialog methods
const openAddDialog = () => {
    isEditing.value = false
    categoryForm.value = { name: '', slug: '', parentCategory: '', navigationLabel: '', active: true }
    formErrors.value = {}
    showDialog.value = true
}

const openEditDialog = (category) => {
    isEditing.value = true
    categoryToEdit.value = category
    categoryForm.value = {
        name: category.name,
        slug: category.slug,
        parentCategory: category.parentCategory || '',
        navigationLabel: category.navigationLabel || '',
        active: category.active !== undefined ? category.active : true
    }
    formErrors.value = {}
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    categoryForm.value = { name: '', slug: '', parentCategory: '', navigationLabel: '', active: true }
    formErrors.value = {}
    categoryToEdit.value = null
}

// Save category
const saveCategory = async () => {
    try {
        formLoading.value = true
        formErrors.value = {}

        // Validate
        if (!categoryForm.value.name.trim()) {
            formErrors.value.name = 'Category name is required'
            formLoading.value = false
            return
        }

        if (!categoryForm.value.slug.trim()) {
            formErrors.value.slug = 'Category slug is required'
            formLoading.value = false
            return
        }

        const categoryData = {
            name: categoryForm.value.name.trim(),
            slug: categoryForm.value.slug.trim(),
            active: categoryForm.value.active,
            parentCategory: categoryForm.value.parentCategory || null,
            navigationLabel: categoryForm.value.navigationLabel.trim() || null
        }

        if (isEditing.value) {
            // Update existing category
            await adminClient.updateCategory(categoryToEdit.value.id, categoryData)
            showNotification('success', 'Category updated successfully')
        } else {
            // Create new category
            await adminClient.insertCategory(categoryData)
            showNotification('success', 'Category created successfully')
        }

        formLoading.value = false
        closeDialog()
        refreshData()
    } catch (err) {
        formLoading.value = false
        console.error('Failed to save category:', err)

        if (err.response?.data?.errors) {
            formErrors.value = err.response.data.errors
        } else {
            showNotification('error', err.message || 'Failed to save category')
        }
    }
}

// Delete methods
const confirmDelete = (category) => {
    categoryToDelete.value = category
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    categoryToDelete.value = null
}

const deleteCategory = async () => {
    if (!categoryToDelete.value) return

    try {
        deleteLoading.value = true
        await adminClient.deleteCategory(categoryToDelete.value.id)
        deleteLoading.value = false
        closeDeleteDialog()
        showNotification('success', 'Category deleted successfully')
        refreshData()
    } catch (err) {
        deleteLoading.value = false
        console.error('Failed to delete category:', err)
        showNotification('error', err.message || 'Failed to delete category')
    }
}

// Notification
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

// Format date
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    try {
        const date = new Date(timestamp)
        // Check if date is valid
        if (isNaN(date.getTime())) return 'N/A'
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch (err) {
        console.error('Date formatting error:', err, timestamp)
        return 'N/A'
    }
}

// Add a toggle sort method
const toggleSort = (column) => {
    if (filters.value.sortBy === column) {
        // Toggle sort order if clicking the same column
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
        // Set new sort column with default asc order
        filters.value.sortBy = column
        filters.value.sortOrder = 'asc'
    }
}

// Initial load
onMounted(() => {
    loadCategories()
    loadBlogUrl()
})

// Update the updateSlugAndLabel method to always generate a new slug when name changes
const updateSlugAndLabel = () => {
    // Always update slug when name changes
    categoryForm.value.slug = generateSlug(categoryForm.value.name)

    // Only update navigation label if empty
    if (!categoryForm.value.navigationLabel) {
        categoryForm.value.navigationLabel = categoryForm.value.name
    }
}

// Add this helper function to generate slugs
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/&/g, '-and-')      // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}
</script>
