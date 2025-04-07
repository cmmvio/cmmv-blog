<template>
    <!-- Sidebar Toggle Button (Hamburger) -->
    <button
        @click="toggleSidebar"
        class="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md focus:outline-none lg:hidden cursor-pointer"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>

    <!-- Sidebar -->
    <aside
        class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-20 transform transition-transform duration-300 ease-in-out"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
        <div class="h-full flex flex-col">
            <!-- Logo -->
            <div class="p-6 border-b border-gray-100">
                <router-link to="/" class="flex items-center">
                    <span class="text-2xl font-bold text-gray-800">Blog CMMV</span>
                </router-link>
            </div>

            <!-- Sidebar Content -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Search Button -->
                <button
                    @click="sidebarOpen = true"
                    class="w-full flex items-center p-3 mb-6 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span class="text-gray-600">Search</span>
                </button>

                <!-- Categories -->
                <h2 class="text-lg font-semibold mb-4">Categories</h2>
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
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ICategory, vue3 } from '@cmmv/blog/client';

const blogAPI = vue3.useBlog();
const sidebarOpen = ref(false)
const categories = ref<ICategory[]>(await blogAPI.getAllCategories())
const selectedCategory = ref<ICategory | null>(null)

const toggleSidebar = () => {
    console.log('toggleSidebar', sidebarOpen.value)
    sidebarOpen.value = !sidebarOpen.value
}

const filterByCategory = (category: any) => {
    selectedCategory.value = category
}
</script>