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
                                    <span class="text-sm text-gray-400">({{ category.count }})</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- Tags Cloud -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-lg font-semibold mb-4">Tags</h2>
                        <div class="flex flex-wrap gap-2">
                            <a
                                v-for="tag in tags"
                                :key="tag.id"
                                href="#"
                                @click.prevent="filterByTag(tag)"
                                class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                                :class="{'bg-blue-100 text-blue-600': selectedTag?.id === tag.id}"
                            >
                                {{ tag.name }}
                            </a>
                        </div>
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
                            <template v-if="selectedTag">
                                <span>Tag:</span>
                                <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center">
                                    {{ selectedTag.name }}
                                    <button @click="clearTag" class="ml-2 hover:text-blue-800">×</button>
                                </span>
                            </template>
                            <template v-if="searchQuery">
                                <span>Busca:</span>
                                <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center">
                                    "{{ searchQuery }}"
                                    <button @click="clearSearch" class="ml-2 hover:text-blue-800">×</button>
                                </span>
                            </template>
                        </div>
                    </div>

                    <!-- Posts Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <article v-for="post in filteredPosts" :key="post.id" class="bg-white rounded-lg shadow overflow-hidden">
                            <img :src="post.image" :alt="post.title" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <div class="flex items-center gap-2 mb-3">
                                    <span
                                        v-for="tag in post.tags"
                                        :key="tag.id"
                                        class="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                    >
                                        {{ tag.name }}
                                    </span>
                                </div>
                                <h2 class="text-xl font-semibold mb-2">
                                    <router-link :to="`/post/${post.slug}`" class="text-gray-800 hover:text-blue-600">
                                        {{ post.title }}
                                    </router-link>
                                </h2>
                                <p class="text-gray-600 mb-4 line-clamp-3">{{ post.excerpt }}</p>
                                <div class="flex items-center justify-between text-sm text-gray-500">
                                    <span>{{ formatDate(post.publishedAt) }}</span>
                                    <router-link :to="`/post/${post.slug}`" class="text-blue-600 hover:text-blue-800">
                                        Ler mais →
                                    </router-link>
                                </div>
                            </div>
                        </article>
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
                        <div class="flex items-center gap-2">
                            <button
                                @click="prevPage"
                                :disabled="currentPage === 1"
                                class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                ← Anterior
                            </button>
                            <span class="px-4 py-2 text-sm text-gray-600">
                                Página {{ currentPage }} de {{ totalPages }}
                            </span>
                            <button
                                @click="nextPage"
                                :disabled="currentPage === totalPages"
                                class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Próxima →
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>

    <!-- Router View for Post Details -->
    <router-view />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Estado
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedTag = ref(null)
const currentPage = ref(1)
const postsPerPage = 10

// Mock data (substituir por dados reais da API)
const categories = ref([
    { id: 1, name: 'Tecnologia', count: 12 },
    { id: 2, name: 'Desenvolvimento', count: 8 },
    { id: 3, name: 'Design', count: 5 },
    { id: 4, name: 'Negócios', count: 3 },
])

const tags = ref([
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'Vue.js' },
    { id: 3, name: 'TypeScript' },
    { id: 4, name: 'Node.js' },
    { id: 5, name: 'API' },
])

const posts = ref([
    {
        id: 1,
        title: 'Introdução ao Vue 3',
        slug: 'introducao-vue-3',
        excerpt: 'Aprenda os conceitos básicos do Vue 3 e como começar seu primeiro projeto...',
        content: '',
        image: 'https://picsum.photos/600/400',
        publishedAt: '2023-12-01',
        category: { id: 1, name: 'Tecnologia' },
        tags: [{ id: 2, name: 'Vue.js' }, { id: 1, name: 'JavaScript' }]
    },
    // Adicionar mais posts aqui
])

// Computed Properties
const filteredPosts = computed(() => {
    let filtered = posts.value

    // Filtrar por categoria
    if (selectedCategory.value) {
        filtered = filtered.filter(post => post.category.id === selectedCategory.value.id)
    }

    // Filtrar por tag
    if (selectedTag.value) {
        filtered = filtered.filter(post =>
            post.tags.some(tag => tag.id === selectedTag.value.id)
        )
    }

    // Filtrar por busca
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query)
        )
    }

    // Paginação
    const start = (currentPage.value - 1) * postsPerPage
    const end = start + postsPerPage
    return filtered.slice(start, end)
})

const totalPages = computed(() =>
    Math.ceil(posts.value.length / postsPerPage)
)

// Métodos
const handleSearch = () => {
    currentPage.value = 1
}

const filterByCategory = (category) => {
    selectedCategory.value = category
    selectedTag.value = null
    currentPage.value = 1
}

const filterByTag = (tag) => {
    selectedTag.value = tag
    selectedCategory.value = null
    currentPage.value = 1
}

const clearCategory = () => {
    selectedCategory.value = null
}

const clearTag = () => {
    selectedTag.value = null
}

const clearSearch = () => {
    searchQuery.value = ''
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

