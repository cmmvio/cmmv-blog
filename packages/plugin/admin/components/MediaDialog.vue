<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
        <div class="bg-neutral-800 rounded-lg w-full max-w-5xl mx-auto h-[80vh] flex flex-col">
            <div class="p-4 border-b border-neutral-700 flex justify-between items-center">
                <h3 class="text-lg font-medium text-white">Media Library</h3>
                <div class="flex items-center gap-2">
                    <button
                        @click="toggleView"
                        class="text-neutral-300 hover:text-white px-3 py-1.5 rounded focus:outline-none"
                        :class="{'bg-blue-600': viewMode === 'grid', 'bg-neutral-700': viewMode === 'list'}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button @click="$emit('update:modelValue', false)" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="flex flex-1 overflow-hidden">
                <!-- Left: Upload and Filters -->
                <div class="w-64 bg-neutral-850 p-4 border-r border-neutral-700 flex flex-col">
                    <div class="mb-4">
                        <label for="media-upload" class="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded cursor-pointer transition-colors">
                            Upload New Media
                        </label>
                        <input
                            type="file"
                            id="media-upload"
                            @change="handleFileUpload"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            class="hidden"
                        />
                    </div>

                    <div class="mb-4">
                        <h4 class="text-sm font-medium text-neutral-300 mb-2">Filter</h4>
                        <div class="space-y-2">
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Search</label>
                                <input
                                    v-model="filters.search"
                                    type="text"
                                    placeholder="Search media..."
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Search by</label>
                                <select
                                    v-model="filters.searchField"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="alt">Alt Text</option>
                                    <option value="caption">Caption</option>
                                    <option value="format">Format</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Type</label>
                                <select
                                    v-model="filters.type"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">All Media</option>
                                    <option value="image">Images</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Sort by</label>
                                <select
                                    v-model="filters.sortBy"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="createdAt">Date</option>
                                    <option value="format">Format</option>
                                    <option value="size">Size</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Order</label>
                                <select
                                    v-model="filters.sortOrder"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="desc">Newest first</option>
                                    <option value="asc">Oldest first</option>
                                </select>
                            </div>
                            <button
                                @click="refreshData"
                                class="w-full mt-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right: Media Content -->
                <div class="flex-1 flex flex-col overflow-hidden">
                    <!-- Loading state -->
                    <div v-if="loading" class="flex-1 flex justify-center items-center">
                        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        <span class="ml-3 text-neutral-400">Loading media...</span>
                    </div>

                    <!-- Error state -->
                    <div v-else-if="error" class="flex-1 p-8 flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-neutral-300 mb-2">Failed to load media</p>
                        <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
                        <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                            Try Again
                        </button>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="medias.length === 0" class="flex-1 p-8 flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                        </svg>
                        <p class="text-neutral-300 mb-2">No media found</p>
                        <p class="text-neutral-400 text-sm mb-4">Upload your first media item</p>
                        <label for="media-upload-empty" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer">
                            Upload Media
                        </label>
                        <input
                            type="file"
                            id="media-upload-empty"
                            @change="handleFileUpload"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            class="hidden"
                        />
                    </div>

                    <!-- Media Grid View -->
                    <div v-else-if="viewMode === 'grid'" class="flex-1 p-4 overflow-y-auto">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div
                                v-for="media in medias"
                                :key="media.id"
                                @click="selectMedia(media)"
                                class="group bg-neutral-750 rounded-lg overflow-hidden hover:bg-neutral-700 transition-colors cursor-pointer relative"
                                :class="{'ring-2 ring-blue-500': selectedMedia && selectedMedia.id === media.id}"
                            >
                                <div class="aspect-square overflow-hidden bg-neutral-700 flex items-center justify-center">
                                    <img
                                        :src="media.url"
                                        :alt="media.alt || ''"
                                        class="object-cover w-full h-full"
                                    />
                                </div>
                                <div class="p-2 text-sm">
                                    <p class="text-white truncate">{{ getFileName(media.url) }}</p>
                                    <p class="text-neutral-400 text-xs">{{ formatDate(media.createdAt) }} · {{ formatFileSize(media.size) }}</p>
                                </div>
                                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <button
                                        @click.stop="selectMedia(media)"
                                        class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Media List View -->
                    <div v-else class="flex-1 overflow-y-auto">
                        <table class="min-w-full divide-y divide-neutral-700">
                            <thead class="bg-neutral-750">
                                <tr>
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
                                <tr
                                    v-for="media in medias"
                                    :key="media.id"
                                    @click="selectMedia(media)"
                                    class="hover:bg-neutral-750 cursor-pointer transition-colors"
                                    :class="{'bg-blue-900/20': selectedMedia && selectedMedia.id === media.id}"
                                >
                                    <td class="px-4 py-2">
                                        <div class="h-12 w-12 overflow-hidden rounded bg-neutral-700 flex items-center justify-center">
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
                                        <button
                                            @click.stop="selectMedia(media)"
                                            class="text-blue-500 hover:text-blue-400 transition-colors"
                                        >
                                            Select
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="p-4 border-t border-neutral-700 flex items-center justify-between">
                        <div class="text-sm text-neutral-400">
                            Showing <span class="font-medium text-white">{{ pagination.from }}</span> to
                            <span class="font-medium text-white">{{ pagination.to }}</span> of
                            <span class="font-medium text-white">{{ pagination.total }}</span> items
                        </div>
                        <div class="flex items-center space-x-2">
                            <button
                                @click="prevPage"
                                :disabled="pagination.current === 1"
                                :class="{'opacity-50 cursor-not-allowed': pagination.current === 1}"
                                class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                            >
                                Previous
                            </button>
                            <div class="flex items-center">
                                <div v-for="page in paginationPages" :key="page"
                                    @click="goToPage(page)"
                                    class="w-8 h-8 flex items-center justify-center rounded text-sm cursor-pointer transition-colors"
                                    :class="page === pagination.current ? 'bg-blue-600 text-white' : 'text-white hover:bg-neutral-700'"
                                >
                                    {{ page }}
                                </div>
                            </div>
                            <button
                                @click="nextPage"
                                :disabled="pagination.current === pagination.lastPage"
                                :class="{'opacity-50 cursor-not-allowed': pagination.current === pagination.lastPage}"
                                class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Media Details Panel (when an image is selected) -->
                <div v-if="selectedMedia" class="w-80 bg-neutral-850 p-4 border-l border-neutral-700 flex flex-col">
                    <h4 class="text-white font-medium mb-4">Media Details</h4>

                    <div class="mb-4">
                        <div class="aspect-video overflow-hidden bg-neutral-700 rounded-lg mb-4">
                            <img :src="selectedMedia.url" :alt="selectedMedia.alt || ''" class="object-contain w-full h-full" />
                        </div>

                        <div class="text-sm text-neutral-400 flex justify-between mb-2">
                            <span>{{ formatDate(selectedMedia.createdAt) }}</span>
                            <span>{{ formatFileSize(selectedMedia.size) }}</span>
                        </div>

                        <div class="text-sm text-neutral-400 mb-2">
                            <span>{{ selectedMedia.width }} × {{ selectedMedia.height }}</span>
                        </div>
                    </div>

                    <div class="space-y-4 mb-8">
                        <div>
                            <label class="block text-sm font-medium text-neutral-300 mb-1">Alt Text</label>
                            <input
                                v-model="selectedMedia.alt"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Image description for accessibility"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-300 mb-1">Caption</label>
                            <textarea
                                v-model="selectedMedia.caption"
                                rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                placeholder="Image caption (optional)"
                            ></textarea>
                        </div>

                        <button
                            @click="updateMediaDetails"
                            class="w-full px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded"
                        >
                            Update Details
                        </button>
                    </div>

                    <div class="mt-auto">
                        <button
                            @click="confirmSelection"
                            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                            Select This Media
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast notifications -->
    <div v-if="notification.show"
        class="fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg flex items-center z-[200]"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useAdminClient } from '@cmmv/blog/admin/client';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'all' // 'all', 'image', etc.
    }
});

const emit = defineEmits(['update:modelValue', 'select']);

const adminClient = useAdminClient();

// State variables
const medias = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedMedia = ref(null);
const viewMode = ref('grid'); // 'grid' or 'list'
const uploadProgress = ref(0);
const isUploading = ref(false);

// Pagination state
const pagination = ref({
    current: 1,
    lastPage: 1,
    perPage: 12,
    total: 0,
    from: 1,
    to: 12
});

// Filter state
const filters = ref({
    search: '',
    searchField: 'alt',
    type: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1
});

// Notification state
const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
});

// Computed properties
const paginationPages = computed(() => {
    const totalPages = pagination.value.lastPage;

    if (totalPages <= 5)
        return Array.from({ length: totalPages }, (_, i) => i + 1);

    const current = pagination.value.current;
    const pages = [1];

    if (current > 2) pages.push('...');
    if (current > 1 && current < totalPages) pages.push(current);
    if (current < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
});

// Methods
const loadMedias = async () => {
    try {
        loading.value = true;
        error.value = null;

        const apiFilters = {
            limit: pagination.value.perPage,
            offset: (filters.value.page - 1) * pagination.value.perPage,
            sortBy: filters.value.sortBy,
            sort: filters.value.sortOrder,
        };

        if (filters.value.search) {
            apiFilters.search = filters.value.search;
            apiFilters.searchField = filters.value.searchField;
        }

        if (filters.value.type) {
            apiFilters.type = filters.value.type;
        }

        const response = await adminClient.medias.get(apiFilters);

        if (response && response.data) {
            medias.value = response.data || [];

            const paginationData = response.pagination || {};
            const totalCount = response.count || 0;
            const currentOffset = paginationData.offset || 0;
            const currentLimit = paginationData.limit || 12;

            const currentPage = Math.floor(currentOffset / currentLimit) + 1;
            const lastPage = Math.ceil(totalCount / currentLimit);

            pagination.value = {
                current: currentPage,
                lastPage: lastPage,
                perPage: currentLimit,
                total: totalCount,
                from: currentOffset + 1,
                to: Math.min(currentOffset + currentLimit, totalCount)
            };
        } else {
            medias.value = [];
            pagination.value = {
                current: 1,
                lastPage: 1,
                perPage: 12,
                total: 0,
                from: 0,
                to: 0
            };
        }

        loading.value = false;
    } catch (err) {
        console.error('Failed to load medias:', err);
        loading.value = false;
        error.value = err.message || 'Failed to load medias';
        showNotification('error', 'Failed to load medias');
    }
};

const refreshData = () => {
    loadMedias();
};

const goToPage = (page) => {
    if (page === '...') return;
    filters.value.page = page;
};

const prevPage = () => {
    if (pagination.value.current > 1) {
        filters.value.page = pagination.value.current - 1;
    }
};

const nextPage = () => {
    if (pagination.value.current < pagination.value.lastPage) {
        filters.value.page = pagination.value.current + 1;
    }
};

const toggleSort = (column) => {
    if (filters.value.sortBy === column) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        filters.value.sortBy = column;
        filters.value.sortOrder = 'asc';
    }
};

const toggleView = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
};

const selectMedia = (media) => {
    selectedMedia.value = { ...media };
};

const updateMediaDetails = async () => {
    if (!selectedMedia.value) return;

    try {
        await adminClient.medias.update(selectedMedia.value.id, {
            alt: selectedMedia.value.alt,
            caption: selectedMedia.value.caption
        });

        const index = medias.value.findIndex(m => m.id === selectedMedia.value.id);

        if (index !== -1)
            medias.value[index] = { ...medias.value[index], ...selectedMedia.value };

        showNotification('success', 'Media details updated');
    } catch (err) {
        console.error('Failed to update media details:', err);
        showNotification('error', 'Failed to update media details');
    }
};

const confirmSelection = () => {
    if (selectedMedia.value) {
        emit('select', selectedMedia.value);
        emit('update:modelValue', false);
    }
};

const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result.toString());
        };
        reader.onerror = error => reject(error);
    });
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar tipo de arquivo para determinar o formato
    const format = file.type.split('/')[1]?.toUpperCase() || 'JPEG';

    try {
        isUploading.value = true;
        uploadProgress.value = 0;

        showNotification('success', 'Preparing image...');

        // Converter arquivo para base64 com cabeçalho
        const base64Image = await convertFileToBase64(file);

        // Configurações para processamento
        const imageData = {
            image: base64Image,
            format: format,
            maxWidth: 1920, // Tamanho máximo padrão, pode ser ajustado conforme necessário
            alt: '',       // Inicialmente vazio, será preenchido após o upload
            caption: ''    // Inicialmente vazio, será preenchido após o upload
        };

        // Usar processImage ao invés de upload
        const response = await adminClient.medias.processImage(imageData);

        isUploading.value = false;

        if (response && response.id) {
            showNotification('success', 'Media processed successfully');

            // Garantir que a lista seja atualizada após o upload
            await loadMedias();

            // Selecionar a nova mídia imediatamente após carregar a lista
            const newMedia = medias.value.find(m => m.id === response.id);
            if (newMedia) {
                selectMedia(newMedia);
            } else {
                // Se não encontrou logo após carregar, tente novamente em um intervalo curto
                setTimeout(async () => {
                    await loadMedias();
                    const delayedMedia = medias.value.find(m => m.id === response.id);
                    if (delayedMedia) {
                        selectMedia(delayedMedia);
                    }
                }, 300);
            }
        }
    } catch (err) {
        isUploading.value = false;
        console.error('Failed to process image:', err);
        showNotification('error', err.message || 'Failed to process image');
    }

    // Limpar o input do arquivo
    event.target.value = '';
};

const showNotification = (type, message, duration = 3000) => {
    notification.value = {
        show: true,
        type,
        message,
        duration
    };

    setTimeout(() => {
        notification.value.show = false;
    }, duration);
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const getFileName = (url) => {
    if (!url) return '';
    return url.substring(url.lastIndexOf('/') + 1);
};

watch(filters, () => {
    loadMedias();
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        if (props.type !== 'all')
            filters.value.type = props.type;

        loadMedias();
    } else {
        selectedMedia.value = null;
    }
});

onMounted(() => {
    if (props.modelValue)
        loadMedias();
});
</script>
