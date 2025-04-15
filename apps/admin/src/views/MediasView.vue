<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Medias</h1>
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
                    Upload Media
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
                            placeholder="Search medias..."
                            class="bg-neutral-700 h-10 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-0"
                        >
                    </div>
                    <select
                        v-model="filters.searchField"
                        class="bg-neutral-700 w-56 h-10 border border-neutral-800 text-white px-3 py-2 rounded-r-md focus:outline-none focus:ring-0 border-l-0"
                    >
                        <option value="alt">Alt Text</option>
                        <option value="caption">Caption</option>
                        <option value="format">Format</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading medias...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load medias</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="medias.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            <p class="text-neutral-300 mb-2">No medias found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by uploading your first media</p>
            <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Upload Media
            </button>
        </div>

        <!-- Media table -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                ID
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                Preview
                            </th>
                            <th
                                @click="toggleSort('format')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Format
                                <span v-if="filters.sortBy === 'format'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Dimensions
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Size
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Created
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="media in medias" :key="media.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="media.id">
                                {{ media.id.substring(0, 6) }}...
                            </td>
                            <td class="px-6 py-4">
                                <div class="h-14 w-24 overflow-hidden rounded bg-neutral-700 flex items-center justify-center">
                                    <img :src="media.url" :alt="media.alt || ''" class="object-cover w-full h-full" />
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white uppercase">
                                {{ media.format }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ media.width }} × {{ media.height }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ formatFileSize(media.size) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ formatDate(media.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="openEditDialog(media)"
                                        title="Edit media"
                                        class="text-neutral-400 hover:text-yellow-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="openInNewTab(media)"
                                        title="Open in new tab"
                                        class="text-neutral-400 hover:text-blue-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="copyUrl(media)"
                                        title="Copy URL"
                                        class="text-neutral-400 hover:text-green-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    </button>
                                    <button @click="confirmDelete(media)" class="text-neutral-400 hover:text-red-500 p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
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
        <div class="flex items-center justify-between">
            <div class="text-sm text-neutral-400">
                Showing <span class="font-medium text-white">{{ pagination.from }}</span> to
                <span class="font-medium text-white">{{ pagination.to }}</span> of
                <span class="font-medium text-white">{{ pagination.total }}</span> medias
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

        <!-- Adicionar o diálogo de confirmação para deletar mídia -->
        <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Confirm Deletion</h3>
                </div>
                <div class="p-6">
                    <p class="text-neutral-300 mb-4">
                        Are you sure you want to delete this media? This action cannot be undone.
                    </p>
                    <div class="flex justify-end space-x-3">
                        <button @click="showDeleteDialog = false"
                            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                            Cancel
                        </button>
                        <button @click="deleteMedia"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Media Library Dialog -->
        <MediaDialog
            v-model="showMediaDialog"
            :type="mediaDialogType"
            @select="handleMediaSelected"
        />

        <!-- Adicionar diálogo de edição de mídia -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Edit Media Details</h3>
                </div>
                <div class="p-6">
                    <div v-if="mediaToEdit" class="space-y-4">
                        <div class="mb-4">
                            <div class="aspect-video overflow-hidden bg-neutral-700 rounded-lg mb-4">
                                <img :src="mediaToEdit.url" :alt="mediaToEdit.alt || ''" class="object-contain w-full h-full" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-300 mb-1">Alt Text</label>
                            <input
                                v-model="mediaForm.alt"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Image description for accessibility"
                            />
                            <p v-if="formErrors.alt" class="mt-1 text-sm text-red-500">{{ formErrors.alt }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-300 mb-1">Caption</label>
                            <textarea
                                v-model="mediaForm.caption"
                                rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                placeholder="Image caption (optional)"
                            ></textarea>
                            <p v-if="formErrors.caption" class="mt-1 text-sm text-red-500">{{ formErrors.caption }}</p>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 mt-6">
                        <button @click="showDialog = false"
                            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                            Cancel
                        </button>
                        <button @click="saveMedia"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAdminClient } from '@cmmv/blog/admin/client'
import MediaDialog from '../components/MediaDialog.vue'

const adminClient = useAdminClient()

const medias = ref([])
const loading = ref(true)
const error = ref(null)

const showDialog = ref(false)
const isEditing = ref(false)
const mediaForm = ref({
    alt: '',
    caption: '',
    active: true
})
const mediaToEdit = ref(null)
const formErrors = ref({})

const showDeleteDialog = ref(false)
const mediaToDelete = ref(null)

const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

const pagination = ref({
    current: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 1,
    to: 10
})

const filters = ref({
    search: '',
    searchField: 'alt',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1
})

const showMediaDialog = ref(false)
const mediaDialogType = ref('all')

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

const paginationPages = computed(() => {
    const totalPages = pagination.value.lastPage

    if (totalPages <= 5)
        return Array.from({ length: totalPages }, (_, i) => i + 1)

    const current = pagination.value.current
    const pages = [1]

    if (current > 2) pages.push('...')

    if (current > 1 && current < totalPages) pages.push(current)

    if (current < totalPages - 1) pages.push('...')

    if (totalPages > 1) pages.push(totalPages)

    return pages
})

const loadMedias = async () => {
    try {
        loading.value = true
        error.value = null

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

        const response = await adminClient.medias.get(apiFilters)

        if (response && response.data) {
            medias.value = response.data || []

            const paginationData = response.pagination || {}
            const totalCount = response.count || 0
            const currentOffset = paginationData.offset || 0
            const currentLimit = paginationData.limit || 10

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
            medias.value = []

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
        console.error('Failed to load medias:', err)
        loading.value = false
        error.value = err.message || 'Failed to load medias'
        showNotification('error', 'Failed to load medias')
    }
}

const refreshData = () => {
    loadMedias()
}

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

const openAddDialog = () => {
    mediaDialogType.value = 'all'
    showMediaDialog.value = true
}

const openEditDialog = (media) => {
    isEditing.value = true
    mediaToEdit.value = media
    mediaForm.value = {
        alt: media.alt || '',
        caption: media.caption || '',
        active: true
    }
    formErrors.value = {}
    showDialog.value = true
}

const confirmDelete = (media) => {
    mediaToDelete.value = media
    showDeleteDialog.value = true
}

const toggleSort = (column) => {
    if (filters.value.sortBy === column) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
        filters.value.sortBy = column
        filters.value.sortOrder = 'asc'
    }
}

const showNotification = (type, message, duration = 3000) => {
    notification.value = {
        show: true,
        type,
        message,
        duration
    }

    setTimeout(() => {
        notification.value.show = false
    }, duration)
}

const getMediaUrl = (media) => {
    return media.url;
}

const openInNewTab = (media) => {
    const url = getMediaUrl(media);
    window.open(url, '_blank');
}

const copyUrl = (media) => {
    const url = getMediaUrl(media);
    navigator.clipboard.writeText(url)
        .then(() => {
            showNotification('success', 'URL copied to clipboard');
        })
        .catch(() => {
            showNotification('error', 'Failed to copy URL');
        });
}

const deleteMedia = async () => {
    if (!mediaToDelete.value) return;

    try {
        // Mostrar estado de carregamento se necessário
        showDeleteDialog.value = false;

        // Chamar a API para excluir a mídia
        await adminClient.medias.delete(mediaToDelete.value.id);

        // Mostrar notificação de sucesso
        showNotification('success', 'Media deleted successfully');

        // Atualizar a lista de mídias
        refreshData();
    } catch (err) {
        console.error('Failed to delete media:', err);
        showNotification('error', err.message || 'Failed to delete media');
    } finally {
        mediaToDelete.value = null;
    }
};

const handleMediaSelected = (media) => {
    refreshData();
    showNotification('success', 'Media added successfully');
}

const saveMedia = async () => {
    if (!mediaToEdit.value) return;

    try {
        // Validar
        const errors = {};
        if (!mediaForm.value.alt.trim()) {
            errors.alt = 'Alt text is required';
        }

        if (Object.keys(errors).length > 0) {
            formErrors.value = errors;
            return;
        }

        // Limpar erros
        formErrors.value = {};

        // Chamar a API para atualizar a mídia
        await adminClient.medias.update(mediaToEdit.value.id, {
            alt: mediaForm.value.alt.trim(),
            caption: mediaForm.value.caption.trim()
        });

        // Atualizar mídia na lista
        const index = medias.value.findIndex(m => m.id === mediaToEdit.value.id);
        if (index !== -1) {
            medias.value[index] = {
                ...medias.value[index],
                alt: mediaForm.value.alt.trim(),
                caption: mediaForm.value.caption.trim()
            };
        }

        // Mostrar notificação de sucesso
        showNotification('success', 'Media updated successfully');

        // Fechar diálogo
        showDialog.value = false;
    } catch (err) {
        console.error('Failed to update media:', err);
        showNotification('error', err.message || 'Failed to update media');
    }
};

watch(filters, () => {
    loadMedias()
}, { deep: true })

onMounted(() => {
    loadMedias()
})
</script>
