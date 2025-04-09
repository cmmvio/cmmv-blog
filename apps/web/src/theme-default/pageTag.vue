<template>
    <Navbar />

    <div class="bg-neutral-50 dark:bg-neutral-900 z-10 relative">
        <div class="container mx-auto z-10">
            <div class="flex">
                <main class="flex-1">
                    <div class="lg:ml-64 bg-white dark:bg-neutral-900 rounded-lg">
                        <div v-if="!posts" class="container mx-auto max-w-4xl px-4 py-12">
                            <div class="bg-neutral-800 p-6 rounded-lg text-center">
                                <h1 class="text-2xl font-bold text-white mb-4">Tag not found</h1>
                                <p class="text-neutral-400">The tag you're looking for doesn't exist or is unavailable.</p>
                            </div>
                        </div>

                        <div v-else class="max-w-4xl mx-auto px-4 py-8 pt-4">
                            <header class="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-4 px-4 pt-4">
                                <h1 class="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Tag: {{ data.tag.name }}</h1>
                                <p v-if="data.tag.description" class="text-neutral-600 dark:text-neutral-300 mb-4">{{ data.tag.description }}</p>
                                <div class="text-sm text-neutral-500 dark:text-neutral-400">{{ data.tag.postCount }} posts in this tag</div>
                            </header>

                            <!-- Posts List -->
                            <div class="space-y-10">
                                <article v-for="post in posts" :key="post.id" class="border-b border-neutral-200 dark:border-neutral-800 pb-8 last:border-0">
                                    <!-- Feature Image -->
                                    <a :href="`/post/${post.slug}`" class="block mb-4">
                                        <div v-if="post.featureImage" class="relative aspect-video overflow-hidden rounded-lg">
                                            <img :src="post.featureImage" :alt="post.featureImageAlt || post.title" class="w-full h-full object-cover" />
                                        </div>
                                    </a>

                                    <!-- Post Title -->
                                    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                                        <a :href="`/post/${post.slug}`" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { vue3 } from '@cmmv/blog/client';
import Navbar from "./navbar.vue";

const blogAPI = vue3.useBlog();
const route = useRoute();
const data = ref<any>(await blogAPI.getPostsByTagSlug(route.params.slug as string));
const posts = ref<any[]>(data.value.posts || []);

// Format date
const formatDate = (timestamp: string) => {
    if (!timestamp) return 'Unknown date';

    try {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        return 'Invalid date';
    }
};

const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
};

//await vue3.injectSEO("category", data.value);
</script>