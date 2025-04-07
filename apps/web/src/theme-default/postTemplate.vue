<template>
    <Navbar />

    <div class="bg-gray-50 z-10 relative">
        <div class="container mx-auto px-4 py-8 z-10">
            <div class="flex">
                <main class="flex-1">
                    <router-view />
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ICategory, ITag, vue3 } from '@cmmv/blog/client';
import Navbar from "./navbar.vue";

const blogAPI = vue3.useBlog();

const searchQuery = ref('')
const categories = ref<ICategory[]>(await blogAPI.getAllCategories())
const tags = ref<ITag[]>(await blogAPI.getAllTags())
const selectedCategory = ref<ICategory | null>(null)
const selectedTag = ref(null)
const filteredPosts = computed(() => {
    return []
})
const totalPages = computed(() => 1)

const handleSearch = () => {
    //console.log(searchQuery.value)
}

const filterByCategory = (category: any) => {
    //console.log(category)
}

const filterByTag = (tag: any) => {
    //console.log(tag)
}

const clearCategory = () => {
    selectedCategory.value = null
}
</script>

