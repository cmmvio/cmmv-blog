<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Themes</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button @click="refreshData" class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
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
                        <div class="p-3 space-y-2">
                            <div class="relative">
                                <input
                                    v-model="searchQuery"
                                    type="text"
                                    placeholder="Search themes..."
                                    class="bg-neutral-700 h-9 border border-neutral-600 text-white pl-3 pr-8 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    @keydown.esc="showSearchDropdown = false"
                                    ref="searchInput"
                                >
                                <!-- Clear button -->
                                <button
                                    v-if="searchQuery.trim()"
                                    @click="clearSearch"
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                                    title="Clear search">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="toggleView" class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg v-if="viewMode === 'grid'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading themes...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load themes</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredThemes.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <p class="text-neutral-300 mb-2">No themes found</p>
            <p v-if="searchQuery" class="text-neutral-400 text-sm mb-4">
                No themes match your search "{{ searchQuery }}"
            </p>
            <p v-else class="text-neutral-400 text-sm mb-4">
                No themes have been installed yet
            </p>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="bg-neutral-800 rounded-lg p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <div
                    v-for="theme in filteredThemes"
                    :key="theme.id"
                    class="bg-neutral-750 rounded-lg p-5 border border-neutral-700 hover:border-neutral-500 cursor-pointer transition-colors relative"
                    @click="selectTheme(theme)"
                >
                    <div class="absolute top-0 right-0 p-4 flex items-center space-x-2">
                        <span v-if="theme.active" class="bg-green-900/60 text-green-200 px-3 py-1 text-xs rounded-full">
                            Active
                        </span>
                        <button
                            v-else
                            @click.stop="activateTheme(theme)"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-xs font-medium rounded-full flex items-center"
                            :disabled="activatingTheme === theme.name"
                        >
                            <svg v-if="activatingTheme === theme.name" class="animate-spin h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ activatingTheme === theme.name ? 'Activating...' : 'Activate' }}
                        </button>
                    </div>

                    <div v-if="theme.previewImage || theme.preview" class="h-56 w-full overflow-hidden bg-neutral-800 rounded-md mb-4">
                        <img :src="theme.previewImage || theme.preview" :alt="theme.name" class="object-cover w-full h-full" />
                    </div>
                    <div v-else class="h-32 w-full bg-neutral-800 rounded-md mb-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        <span v-if="theme.version" class="bg-purple-900/30 text-purple-300 px-2 py-0.5 text-xs rounded-full">
                            v{{ theme.version }}
                        </span>
                    </div>

                    <p class="text-neutral-400 text-sm mb-3 line-clamp-2">{{ theme.description || 'No description available' }}</p>

                    <div class="text-xs text-neutral-500">
                        <span v-if="theme.author">By {{ theme.author }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- List View -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                Preview
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Version
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Author
                            </th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="theme in filteredThemes" :key="theme.id"
                            class="hover:bg-neutral-750 cursor-pointer"
                            @click="selectTheme(theme)">
                            <td class="px-6 py-4">
                                <div class="h-14 w-24 overflow-hidden rounded bg-neutral-700 flex items-center justify-center">
                                    <img v-if="theme.previewImage || theme.preview" :src="theme.previewImage || theme.preview" :alt="theme.name" class="object-cover w-full h-full" />
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                    </svg>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                <div class="font-medium">{{ theme.name }}</div>
                                <div v-if="theme.description" class="text-xs text-neutral-400 mt-1 max-w-md truncate">
                                    {{ theme.description }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ theme.version || 'Unknown' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ theme.author || 'Unknown' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <span
                                    v-if="theme.active"
                                    class="bg-green-900/60 text-green-200 px-2 py-1 text-xs rounded-full"
                                >
                                    Active
                                </span>
                                <span
                                    v-else
                                    class="bg-neutral-700 text-neutral-400 px-2 py-1 text-xs rounded-full"
                                >
                                    Inactive
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Theme Detail View -->
        <div v-if="showThemeDetail" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">Theme Details</h3>
                    <button @click="closeThemeDetail" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div v-if="selectedTheme" class="p-6">
                    <div class="mb-6">
                        <div v-if="selectedTheme.previewImage || selectedTheme.preview" class="aspect-video overflow-hidden bg-neutral-700 rounded-lg mb-4">
                            <img :src="selectedTheme.previewImage || selectedTheme.preview" :alt="selectedTheme.name" class="object-contain w-full h-full" />
                        </div>
                        <div v-else class="aspect-video bg-neutral-700 rounded-lg mb-4 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                        </div>

                        <div class="flex items-center justify-between">
                            <h2 class="text-2xl font-bold text-white">{{ selectedTheme.name }}</h2>
                            <span
                                v-if="selectedTheme.active"
                                class="bg-green-900/60 text-green-200 px-3 py-1 text-xs rounded-full"
                            >
                                Active
                            </span>
                            <span
                                v-else
                                class="bg-neutral-700 text-neutral-400 px-3 py-1 text-xs rounded-full"
                            >
                                Inactive
                            </span>
                        </div>

                        <div v-if="selectedTheme.version" class="mt-2">
                            <span class="bg-purple-900/30 text-purple-300 px-2 py-0.5 text-xs rounded-full">
                                v{{ selectedTheme.version }}
                            </span>
                        </div>

                        <p class="mt-4 text-neutral-300">{{ selectedTheme.description || 'No description available' }}</p>
                    </div>


                    <div class="flex justify-between space-x-3 mt-6">
                        <button
                            v-if="!selectedTheme.active"
                            @click="activateTheme(selectedTheme)"
                            class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors flex items-center"
                            :disabled="activatingTheme === selectedTheme.name"
                        >
                            <svg v-if="activatingTheme === selectedTheme.name" class="animate-spin h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ activatingTheme === selectedTheme.name ? 'Activating...' : 'Activate Theme' }}
                        </button>
                        <button
                            type="button"
                            @click="closeThemeDetail"
                            class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors ml-auto"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast notifications -->
        <ToastNotification
            :show="notification.show"
            :message="notification.message"
            :type="notification.type"
            :duration="notification.duration"
            @close="notification.show = false"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAdminClient } from '@cmmv/blog/admin/client'
import ToastNotification from '../components/ToastNotification.vue'

const adminClient = useAdminClient()

const themes = ref([])
const loading = ref(true)
const error = ref(null)
const viewMode = ref('grid') // 'grid' or 'list'
const searchQuery = ref('')
const selectedTheme = ref(null)
const showThemeDetail = ref(false)
const activatingTheme = ref(null)
const showSearchDropdown = ref(false)
const searchInput = ref(null)

const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

const filteredThemes = computed(() => {
    if (!searchQuery.value) return themes.value

    const query = searchQuery.value.toLowerCase()
    return themes.value.filter(theme =>
        theme.name?.toLowerCase().includes(query) ||
        theme.description?.toLowerCase().includes(query) ||
        theme.author?.toLowerCase().includes(query)
    )
})

const loadThemes = async () => {
    try {
        loading.value = true
        error.value = null

        const response = await adminClient.themes.get()

        if (response && response.data) {
            themes.value = response.data
        } else {
            themes.value = []
        }

        loading.value = false
    } catch (err) {
        console.error('Failed to load themes:', err)
        loading.value = false
        error.value = err.message || 'Failed to load themes'
        showNotification('error', 'Failed to load themes')
    }
}

const activateTheme = async (theme) => {
    if (theme.active || activatingTheme.value === theme.name) return

    try {
        activatingTheme.value = theme.namespace

        await adminClient.themes.setActive(theme.namespace)

        themes.value = themes.value.map(t => ({
            ...t,
            active: t.namespace === theme.namespace
        }))

        if (selectedTheme.value && selectedTheme.value.namespace === theme.namespace)
            selectedTheme.value = { ...selectedTheme.value, active: true }

        showNotification('success', `Theme "${theme.name}" has been activated successfully`)
    } catch (err) {
        showNotification('error', err.message || `Failed to activate theme "${theme.name}"`)
    } finally {
        activatingTheme.value = null
    }
}

const refreshData = () => {
    loadThemes()
}

const toggleView = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const selectTheme = (theme) => {
    selectedTheme.value = theme
    showThemeDetail.value = true
}

const closeThemeDetail = () => {
    showThemeDetail.value = false
    selectedTheme.value = null
}

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

const toggleSearchDropdown = () => {
    showSearchDropdown.value = !showSearchDropdown.value

    // Focus the search input when dropdown opens
    if (showSearchDropdown.value) {
        nextTick(() => {
            searchInput.value?.focus()
        })
    }
}

const clearSearch = () => {
    searchQuery.value = ''
    showSearchDropdown.value = false
}

onMounted(() => {
    loadThemes()

    // Close search dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (showSearchDropdown.value &&
            !e.target.closest('[data-search-toggle]') &&
            !e.target.closest('.absolute')) {
            showSearchDropdown.value = false
        }
    })
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

