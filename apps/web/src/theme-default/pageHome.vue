<template>
    <div class="bg-neutral-50 dark:bg-neutral-900 z-10 relative">
        <div class="mx-auto z-10 px-4">
            <div class="flex">
                <main class="flex-1">
                    <div class="lg:ml-64 bg-white dark:bg-neutral-900 rounded-lg">
                        <div class="mx-auto px-4 py-8">
                            <div v-if="loading" class="flex justify-center items-center py-20">
                                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>

                            <div v-else-if="posts && posts.length === 0" class="text-center py-16">
                                <h2 class="text-2xl font-bold mb-2 dark:text-white">No posts found</h2>
                                <p class="text-gray-600 dark:text-gray-400">Check back later for new content!</p>
                            </div>

                            <div v-else>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                    <div v-for="post in posts" :key="post.id" class="flex flex-col bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                                        <a :href="`/post/${post.slug}`" class="block">
                                            <div class="relative h-40 overflow-hidden">
                                                <img
                                                    v-if="post.featureImage"
                                                    :src="post.featureImage"
                                                    :alt="post.title"
                                                    class="w-full h-full object-cover transition-transform hover:scale-105"
                                                />
                                                <div v-else class="w-full h-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>

                                                <div class="absolute top-2 left-2 flex gap-2 flex-wrap">
                                                    <a
                                                        v-for="category in post.categories"
                                                        :key="category.id"
                                                        :href="`/category/${category.slug}`"
                                                        class="px-3 py-1 bg-blue-600 bg-opacity-85 text-white text-xs font-medium rounded-full shadow-sm hover:bg-opacity-100 transition-all"
                                                    >
                                                        {{ category.name }}
                                                    </a>
                                                </div>
                                            </div>
                                        </a>

                                        <div class="p-4 flex-grow flex flex-col">
                                            <a :href="`/post/${post.slug}`" class="block mb-2">
                                                <h2 class="text-xl font-bold line-clamp-2 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                                                    {{ post.title }}
                                                </h2>
                                            </a>

                                            <p class="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm mb-4">
                                                {{ post.excerpt || stripHtml(post.content).substring(0, 150) + '...' }}
                                            </p>

                                            <div class="mt-auto flex justify-between items-center">
                                                <div class="flex items-center">
                                                    <div v-if="getAuthor(post)" class="text-sm text-gray-600 dark:text-gray-400">
                                                        <a :href="`/author/${getAuthor(post).slug}`" class="hover:text-blue-600 dark:hover:text-blue-400">
                                                            {{ getAuthor(post).name }}
                                                        </a>
                                                    </div>
                                                </div>

                                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                                    {{ formatDate(post.publishedAt) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="pagination && pagination.total > pagination.limit" class="mt-10 flex justify-center">
                                    <div class="flex space-x-1">
                                        <button
                                            @click="changePage(currentPage - 1)"
                                            :disabled="currentPage === 1"
                                            :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                                            class="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600"
                                        >
                                            Previous
                                        </button>

                                        <button
                                            @click="changePage(currentPage + 1)"
                                            :disabled="currentPage === Math.ceil(pagination.total / pagination.limit)"
                                            :class="{'opacity-50 cursor-not-allowed': currentPage === Math.ceil(pagination.total / pagination.limit)}"
                                            class="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { vue3 } from '@cmmv/blog/client';

import {
    formatDate, stripHtml
} from '../composables/useUtils';

const blogAPI = vue3.useBlog();

const posts = ref<any[]>([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const pagination = ref({
    total: 0,
    limit: 9,
    offset: 0
});

loading.value = true;
error.value = null;

const response: any = await blogAPI.getPosts((currentPage.value - 1) * pagination.value.limit);
posts.value = response.posts;
loading.value = false;

if(response){
    pagination.value = {
        total: response.meta?.pagination?.total || 0,
        limit: response.meta?.pagination?.limit || 9,
        offset: response.meta?.pagination?.offset || 0
    };
}

const changePage = (page: number) => {
    if (page < 1 || page > Math.ceil(pagination.value.total / pagination.value.limit))
        return;

    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const getAuthor = (post: any) => {
    if (!post.authors || !post.authors.length) return null;
    return post.authors.find((author: any) => author.id === post.author);
};
</script>