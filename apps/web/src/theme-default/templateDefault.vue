<template>
    <Navbar />

    <div class="min-h-screen bg-gray-50 flex">
        <!-- Main Content -->
        <main class="flex-1 p-6 lg:p-8 relative z-10">
            <div class="max-w-7xl mx-auto pt-10 lg:pt-0">
                <!-- Active Filters -->
                <div v-if="selectedCategory || selectedTag || searchQuery" class="mb-6">
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <template v-if="selectedCategory">
                            <span>Category:</span>
                            <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center">
                                {{ selectedCategory.name }}
                                <button @click="clearCategory" class="ml-2 hover:text-blue-800">×</button>
                            </span>
                        </template>
                        <template v-if="searchQuery">
                            <span>Search:</span>
                            <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center">
                                {{ searchQuery }}
                                <button @click="searchQuery = ''; handleSearch()" class="ml-2 hover:text-blue-800">×</button>
                            </span>
                        </template>
                    </div>
                </div>

                <!-- Content -->
                <router-view />
            </div>
        </main>

        <!-- Search Modal -->
        <div
            v-if="searchModalOpen"
            class="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
        >
            <!-- Overlay -->
            <div
                class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                @click="searchModalOpen = false"
            ></div>

            <!-- Modal -->
            <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <div class="p-4 border-b border-gray-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search posts..."
                        class="w-full px-2 py-2 focus:outline-none text-lg"
                        @keyup.enter="handleSearch(); searchModalOpen = false"
                        ref="searchInput"
                    >
                    <button
                        @click="searchModalOpen = false"
                        class="ml-2 p-1 hover:bg-gray-100 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    <p class="text-gray-500 text-sm">Press Enter to search</p>
                </div>
            </div>
        </div>

        <!-- Add an overlay when sidebar is open on mobile -->
        <div
            v-if="sidebarOpen"
            class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            @click="sidebarOpen = false"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ICategory, ITag, vue3 } from '@cmmv/blog/client';
import Navbar from './navbar.vue';

const blogAPI = vue3.useBlog();

// State
const searchQuery = ref('')
const categories = ref<ICategory[]>(await blogAPI.getAllCategories())
const tags = ref<ITag[]>(await blogAPI.getAllTags())
const selectedCategory = ref<ICategory | null>(null)
const selectedTag = ref(null)
const sidebarOpen = ref(false)
const searchModalOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

// When search modal opens, focus the input
watch(searchModalOpen, (newVal) => {
    if (newVal) {
        nextTick(() => {
            if (searchInput.value) {
                searchInput.value.focus()
            }
        })
    }
})

// Computed
const filteredPosts = computed(() => {
    return []
})

const totalPages = computed(() => 1)

// Methods
const handleSearch = () => {
    console.log('Searching for:', searchQuery.value)
    // Add your search logic here
}

const filterByCategory = (category: any) => {
    selectedCategory.value = category
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
        sidebarOpen.value = false
    }
}

const filterByTag = (tag: any) => {
    selectedTag.value = tag
}

const clearCategory = () => {
    selectedCategory.value = null
}
</script>

<style>
/* Prevent body scrolling when modal is open */
body.modal-open {
    overflow: hidden;
}

/* Add any additional styling here */
</style>

