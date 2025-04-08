<template>
    <Navbar />

    <div class="lg:ml-64">
        <div v-if="!author" class="container mx-auto max-w-4xl px-4 py-12">
            <div class="bg-neutral-800 p-6 rounded-lg text-center">
                <h1 class="text-2xl font-bold text-white mb-4">Author not found</h1>
                <p class="text-neutral-400">The author you're looking for doesn't exist or is unavailable.</p>
            </div>
        </div>

        <div v-else>
            <!-- Cover Image in Facebook style -->
            <div class="w-full bg-neutral-100 dark:bg-neutral-800 relative">
                <div v-if="author.coverImage" class="h-72 md:h-96 overflow-hidden">
                    <img :src="author.coverImage" alt="" class="w-full h-full object-cover">
                </div>
                <div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div class="container mx-auto max-w-4xl px-4">
                <div class="relative bg-white dark:bg-neutral-900 rounded-lg -mt-20 border border-neutral-100 dark:border-neutral-800 mb-8">
                    <div class="p-6 pt-20 md:p-8 md:pt-20 md:pb-6 items-center justify-center">
                        <div class="absolute left-1/2 -translate-x-1/2 -top-16 flex items-center justify-center">
                            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-700 shadow-lg bg-white dark:bg-neutral-700">
                                <img v-if="author.image" :src="author.image" :alt="author.name" class="w-full h-full object-cover" />
                                <div v-else class="w-full h-full flex items-center justify-center bg-blue-600 text-white text-3xl font-bold">
                                    {{ authorInitials }}
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row md:items-end justify-center items-center">
                            <div>
                                <h1 class="text-3xl font-bold text-neutral-900 dark:text-white mb-1">{{ author.name }}</h1>
                                <div v-if="author.location" class="text-neutral-600 dark:text-neutral-400 flex items-center mb-2 justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {{ author.location }}
                                </div>
                            </div>
                        </div>

                        <div v-if="author.bio" class="p-4">
                            <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">{{ author.bio }}</p>
                        </div>
                    </div>

                    <!-- Complete social row at bottom of profile card -->
                    <div class="px-8 py-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        <a v-if="author.facebook" :href="`https://facebook.com/${author.facebook}`" target="_blank" rel="noopener noreferrer"
                           class="flex items-center justify-center py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a v-if="author.twitter" :href="`https://twitter.com/${author.twitter}`" target="_blank" rel="noopener noreferrer"
                           class="flex items-center justify-center py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>

                        <a v-if="author.instagram" :href="`https://instagram.com/${author.instagram}`" target="_blank" rel="noopener noreferrer"
                           class="flex items-center justify-center py-2 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-md transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                            </svg>
                        </a>
                        <a v-if="author.linkedin" :href="`https://linkedin.com/in/${author.linkedin}`" target="_blank" rel="noopener noreferrer"
                           class="flex items-center justify-center py-2 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a v-if="author.github" :href="`https://github.com/${author.github}`" target="_blank" rel="noopener noreferrer"
                           class="flex items-center justify-center py-2 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-md transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>
                        <a v-if="author.website" :href="author.website" target="_blank" rel="noopener noreferrer"
                           class="flex items-center justify-center py-2 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-md transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Posts in Facebook-like cards -->
                <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    Posts
                </h2>

                <div class="space-y-6 mb-10">
                    <!-- Fix the v-if condition based on authorPosts structure -->
                    <template v-if="authorPosts && (authorPosts.length > 0 || (authorPosts.posts && authorPosts.posts.length > 0))">
                        <!-- Loop through the correct posts array structure -->
                        <div v-for="post in (authorPosts.posts || authorPosts)" :key="post.id"
                             class="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800 transition-shadow">
                            <!-- Post header - Facebook style -->
                            <div class="flex items-center p-4 border-b border-neutral-100 dark:border-neutral-700">
                                <div class="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 mr-3">
                                    <img v-if="author.image" :src="author.image" :alt="author.name" class="w-full h-full object-cover" />
                                    <div v-else class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">
                                        {{ authorInitials }}
                                    </div>
                                </div>
                                <div>
                                    <p class="font-medium text-neutral-900 dark:text-white">{{ author.name }}</p>
                                    <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ formatDate(post.publishedAt || post.createdAt) }}</p>
                                </div>
                            </div>

                            <!-- Featured image -->
                            <div v-if="post.featureImage" class="border-b border-neutral-100 dark:border-neutral-700">
                                <a :href="`/post/${post.slug}`">
                                    <img :src="post.featureImage" :alt="post.title" class="w-full h-64 object-cover hover:opacity-95 transition-opacity">
                                </a>
                            </div>

                            <!-- Post content -->
                            <div class="p-4">
                                <h3 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                                    <a :href="`/post/${post.slug}`" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {{ post.title }}
                                    </a>
                                </h3>

                                <p v-if="post.excerpt" class="text-neutral-700 dark:text-neutral-300 mb-4">
                                    {{ post.excerpt }}
                                </p>
                                <p v-else-if="post.content" class="text-neutral-700 dark:text-neutral-300 mb-4">
                                    {{ stripHtml(post.content).substring(0, 150) }}{{ stripHtml(post.content).length > 150 ? '...' : '' }}
                                </p>
                            </div>

                            <!-- Post footer with action buttons - Facebook style -->
                            <div class="flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                                <div class="flex items-center space-x-1">
                                    <a :href="`/post/${post.slug}#comments`" class="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        Comments
                                    </a>
                                </div>

                                <a :href="`/post/${post.slug}`" class="px-3 py-1.5 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors flex items-center">
                                    Read more
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </template>

                    <!-- No posts message -->
                    <div v-else class="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-neutral-600 dark:text-neutral-400">No posts available from this author yet.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { vue3 } from '@cmmv/blog/client';
import Navbar from "./navbar.vue";

const blogAPI = vue3.useBlog();
const route = useRoute();
const author = ref<any>(null);
const authorPosts = ref<any>(null);
const isDarkMode = ref(false);

// Check for dark mode preference on mount
onMounted(() => {
    // Check localStorage first
    const darkModeStored = localStorage.getItem('darkMode');

    // Set dark mode based on storage or system preference
    if (darkModeStored === 'enabled') {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
    } else if (darkModeStored === 'disabled') {
        isDarkMode.value = false;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
    }
});

author.value = route.params.id
    ? await blogAPI.getAuthorById(route.params.id as string)
    : await blogAPI.getAuthorBySlug(route.params.slug as string);

if (author.value) {
    const postsResponse = await blogAPI.getPostByAuthor(author.value.user);
    if (postsResponse) {
        authorPosts.value = postsResponse;
    }
}

const authorInitials = computed(() => {
    if (!author.value?.name) return '?';

    return author.value.name
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
});

function formatDate(timestamp: string) {
    if (!timestamp) return 'Unknown date';

    try {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

function stripHtml(html: string) {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
}

await vue3.injectSEO("author", { author: author.value });
</script>
