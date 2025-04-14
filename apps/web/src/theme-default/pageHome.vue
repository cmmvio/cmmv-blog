<template>
    <div class="bg-neutral-50 dark:bg-neutral-900 z-10 relative">
        <div class="mx-auto z-10 px-4">
            <div class="flex">
                <main class="flex-1">
                    <div class="lg:ml-64 bg-white dark:bg-neutral-900 rounded-lg max-w-[1200px] m-auto overflow-hidden justify-center">
                        <div class="mx-auto px-4 py-8">
                            <div v-if="loading && posts.length === 0" class="flex justify-center items-center py-20">
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

                                <!-- Loading indicator for infinite scroll -->
                                <div v-if="loadingMore" class="mt-8 flex justify-center items-center py-6">
                                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>

                                <!-- No more posts indicator -->
                                <div v-if="!hasMorePosts && posts.length > 0 && !loadingMore" class="mt-8 text-center py-4 text-gray-500 dark:text-gray-400">

                                </div>

                                <!-- Intersection observer target -->
                                <div ref="observerTarget" class="h-4 w-full"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { vue3 } from '@cmmv/blog/client';

import {
    formatDate, stripHtml
} from '../composables/useUtils';

const blogAPI = vue3.useBlog();

const posts = ref<any[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(0);
const hasMorePosts = ref(true);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);

const pagination = ref({
    total: 0,
    limit: 32,
    offset: 0
});

const loadPosts = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response: any = await blogAPI.posts.getAll(currentPage.value * pagination.value.limit);

        if (response) {
            posts.value = response.posts;

            pagination.value = {
                total: response.meta?.pagination?.total || 0,
                limit: response.meta?.pagination?.limit || 32,
                offset: response.meta?.pagination?.offset || 0
            };

            hasMorePosts.value = posts.value.length < response.count;
        }
    } catch (err: any) {
        console.error('Failed to load posts:', err);
        error.value = err;
    } finally {
        loading.value = false;
    }
};

const loadMorePosts = async () => {
    if (loadingMore.value || !hasMorePosts.value) return;

    try {
        loadingMore.value = true;
        currentPage.value++;

        const response: any = await blogAPI.posts.getAll(posts.value.length);

        if (response && response.posts && response.posts.length > 0) {
            posts.value = [...posts.value, ...response.posts];

            pagination.value = {
                total: response.meta?.pagination?.total || 0,
                limit: response.meta?.pagination?.limit || 9,
                offset: response.meta?.pagination?.offset || 0
            };

            hasMorePosts.value = posts.value.length < response.count;
        } else {
            hasMorePosts.value = false;
        }
    } catch (err: any) {
        console.error('Failed to load more posts:', err);
    } finally {
        loadingMore.value = false;
    }
};

const setupIntersectionObserver = () => {
    observer.value = new IntersectionObserver(
        (entries) => {
            const [entry] = entries;

            if (entry.isIntersecting && hasMorePosts.value && !loadingMore.value)
                loadMorePosts();
        },
        { threshold: 0.1 }
    );

    if (observerTarget.value) {
        observer.value.observe(observerTarget.value);
    }
};

onMounted(async () => {
    await loadPosts();
    setupIntersectionObserver();
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
});

const getAuthor = (post: any) => {
    if (!post.authors || !post.authors.length) return null;
    return post.authors.find((author: any) => author.id === post.author);
};
</script>
