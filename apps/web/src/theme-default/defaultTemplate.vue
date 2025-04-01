<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header/Navbar -->
        <nav class="bg-white shadow-sm">
            <div class="container mx-auto px-4 py-3">
                <div class="flex justify-between items-center">
                    <router-link to="/" class="text-2xl font-bold text-gray-800">
                        Blog CMMV
                    </router-link>

                    <!-- Search Bar -->
                    <div class="flex-1 max-w-xl mx-8">
                        <div class="relative">
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Buscar posts..."
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                @input="handleSearch"
                            >
                            <span class="absolute right-3 top-2.5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8">
            <div class="flex gap-8">
                <!-- Sidebar -->
                <aside class="w-64 flex-shrink-0">
                    <!-- Categories -->
                    <div class="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 class="text-lg font-semibold mb-4">Categorias</h2>
                        <ul class="space-y-2">
                            <li v-for="category in categories" :key="category.id">
                                <a
                                    href="#"
                                    @click.prevent="filterByCategory(category)"
                                    class="text-gray-600 hover:text-blue-600 flex items-center justify-between"
                                    :class="{'text-blue-600 font-medium': selectedCategory?.id === category.id}"
                                >
                                    {{ category.name }}
                                    <span class="text-sm text-gray-400">({{ category.totalPosts }})</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>

                <!-- Main Content Area -->
                <main class="flex-1">
                    <div v-if="selectedCategory || selectedTag || searchQuery" class="mb-6">
                        <div class="flex items-center gap-2 text-sm text-gray-500">
                            <template v-if="selectedCategory">
                                <span>Categoria:</span>
                                <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center">
                                    {{ selectedCategory.name }}
                                    <button @click="clearCategory" class="ml-2 hover:text-blue-800">×</button>
                                </span>
                            </template>
                        </div>
                    </div>

                    <!-- Posts Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <router-view />
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ICategory, vue3 } from '@cmmv/blog/client';
const blogAPI = vue3.useBlog();

const searchQuery = ref('')
const categories = ref<ICategory[]>(await blogAPI.getAllCategories())
const tags = ref([])
const selectedCategory = ref<ICategory | null>(null)
const selectedTag = ref(null)
const filteredPosts = computed(() => {
    return []
})
const totalPages = computed(() => 1)

const handleSearch = () => {
    console.log(searchQuery.value)
}

const filterByCategory = (category: any) => {
    console.log(category)
}

const filterByTag = (tag: any) => {
    console.log(tag)
}

const clearCategory = () => {
    selectedCategory.value = null
}
</script>

