<template>
    <div class="bg-neutral-50 dark:bg-neutral-900 z-10 relative">
        <div class="mx-auto z-10">
            <div class="flex">
                <main class="flex-1">
                    <div class="lg:ml-64 lg:max-w-4xl md:max-w-3xl px-4 sm:px-6 mx-auto bg-white dark:bg-neutral-900 rounded-lg pl-[40px] pr-[40px]">
                        <div v-if="!category" class="container mx-auto max-w-4xl px-4 py-12">
                            <div class="bg-neutral-800 p-6 rounded-lg text-center">
                                <h1 class="text-2xl font-bold text-white mb-4">Category not found</h1>
                                <p class="text-neutral-400">The category you're looking for doesn't exist or is unavailable.</p>
                            </div>
                        </div>

                        <div v-else class="max-w-4xl mx-auto px-4 py-8 pt-4">
                            <header class="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-4 pr-4 pt-4">
                                <h1 class="text-3xl font-bold text-neutral-900 dark:text-white mb-3">{{ category.name }}</h1>
                                <p v-if="category.description" class="text-neutral-600 dark:text-neutral-300 mb-4">{{ category.description }}</p>
                                <div class="text-sm text-neutral-500 dark:text-neutral-400">{{ category.postCount }} posts in this category</div>
                            </header>

                            <!-- Initial loading state -->
                            <div v-if="loading && posts.length === 0" class="flex justify-center items-center py-20">
                                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>

                            <!-- Posts List -->
                            <div v-else-if="posts.length > 0" class="space-y-10">
                                <article v-for="post in posts" :key="post.id" class="border-b border-neutral-200 dark:border-neutral-800 pb-8 last:border-0">
                                    <!-- Feature Image -->
                                    <a :href="`/post/${post.slug}`" class="block mb-4" aria-label="Read more about this post">
                                        <div v-if="post.featureImage" class="relative aspect-video overflow-hidden rounded-lg">
                                            <img :src="post.featureImage" :alt="post.featureImageAlt || post.title" class="w-full h-full object-cover" />
                                        </div>
                                    </a>

                                    <!-- Post Title -->
                                    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                                        <a :href="`/post/${post.slug}`" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Read more about this post">
                                            {{ post.title }}
                                        </a>
                                    </h2>

                                    <!-- Post Meta -->
                                    <div class="flex items-center mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{{ formatDate(post.publishedAt || post.updatedAt) }}</span>
                                        </div>
                                    </div>

                                    <!-- Post Excerpt -->
                                    <div v-if="post.excerpt" class="text-neutral-700 dark:text-neutral-300 mb-4">
                                        {{ post.excerpt }}
                                    </div>
                                    <div v-else-if="post.content" class="text-neutral-700 dark:text-neutral-300 mb-4">
                                        {{ stripHtml(post.content).substring(0, 200) }}{{ stripHtml(post.content).length > 200 ? '...' : '' }}
                                    </div>

                                    <!-- Tags -->
                                    <div v-if="post.tags && post.tags.length > 0" class="mb-4 flex flex-wrap gap-2">
                                        <a v-for="tag in post.tags" :key="tag" :href="`/tag/${tag.slug}`"
                                           class="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm px-3 py-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
                                            {{ tag.name }}
                                        </a>
                                    </div>

                                    <!-- Read More Button -->
                                    <div class="mt-4">
                                        <a :href="`/post/${post.slug}`"
                                           class="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                            Read more
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                            </svg>
                                        </a>
                                    </div>
                                </article>
                            </div>

                            <!-- No posts state -->
                            <div v-else-if="!loading && posts.length === 0" class="text-center py-16">
                                <h2 class="text-2xl font-bold mb-2 dark:text-white">No posts found in this category</h2>
                                <p class="text-gray-600 dark:text-gray-400">Check back later for new content!</p>
                            </div>

                            <!-- Loading more indicator -->
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
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue'
import { vue3 } from '@cmmv/blog/client';

import {
    formatDate, stripHtml
} from '../composables/useUtils';

const blogAPI = vue3.useBlog();
const route = useRoute();

const isSSR = import.meta.env.SSR
const posts = ref<any[]>([]);
const category = ref<any>(null);
const pagination = ref<any>(null);
const loading = ref(true);
const loadingMore = ref(false);
const hasMorePosts = ref(true);
const currentPage = ref(0);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);

const loadCategoryData = async () => {
    try {
        loading.value = true;

        const data = ref<any>(route.params.id ?
            await blogAPI.categories.getById(route.params.id as string) :
            await blogAPI.categories.getBySlug(route.params.slug as string));

        category.value = data.value.category;
        posts.value = data.value.posts?.data || [];
        pagination.value = data.value.posts?.pagination;

        hasMorePosts.value = posts.value.length < (data.value.posts?.count || 0);
    } catch (err) {
        console.error('Failed to load category data:', err);
    } finally {
        loading.value = false;
    }
};

const loadMorePosts = async () => {
    if (loadingMore.value || !hasMorePosts.value) return;

    try {
        loadingMore.value = true;
        currentPage.value++;

        const response = route.params.id ?
            await blogAPI.categories.getById(route.params.id as string, posts.value.length) :
            await blogAPI.categories.getBySlug(route.params.slug as string, posts.value.length);

        if (response && response.posts && response.posts.data && response.posts.data.length > 0) {
            console.log(response.posts.data);
            posts.value = [...posts.value, ...response.posts.data];
            hasMorePosts.value = posts.value.length < (response.posts.count || 0);
        } else {
            hasMorePosts.value = false;
        }
    } catch (err) {
        console.error('Failed to load more posts:', err);
    } finally {
        loadingMore.value = false;
    }
};

const setupIntersectionObserver = () => {
    observer.value = new IntersectionObserver(
        (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMorePosts.value && !loadingMore.value) {
                loadMorePosts();
            }
        },
        { threshold: 0.1 }
    );

    if (observerTarget.value) {
        observer.value.observe(observerTarget.value);
    }
};

onMounted(async () => {
    await loadCategoryData();
    setupIntersectionObserver();
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
});
</script>
