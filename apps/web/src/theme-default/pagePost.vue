<template>
    <div class="lg:ml-64">
        <div v-if="!post" class="container mx-auto max-w-4xl px-4 py-12">
            <div class="bg-neutral-800 p-6 rounded-lg text-center">
                <h1 class="text-2xl font-bold text-white mb-4">Post not found</h1>
                <p class="text-neutral-400">The post you're looking for doesn't exist or is unavailable.</p>
            </div>
        </div>

        <div v-else class="article-container lg:max-w-4xl md:max-w-3xl">
            <div v-if="post.featureImage" class="post-featured-image relative">
                <div class="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                    <a
                        v-for="category in post.categories"
                        :key="category.id"
                        :href="`/category/${category.slug}`"
                        class="px-3 py-1 bg-blue-600 bg-opacity-85 text-white text-sm font-medium rounded-full shadow-sm hover:bg-opacity-100 transition-all"
                    >
                        {{ category.name }}
                    </a>
                </div>

                <img :src="post.featureImage" :alt="post.featureImageAlt || post.title" class="featured-img" />
                <p v-if="post.featureImageCaption" class="image-caption text-neutral-600 dark:text-neutral-400">{{ post.featureImageCaption }}</p>
            </div>

            <!-- Post Header -->
            <header class="post-header">
                <h1 class="post-title text-neutral-900 dark:text-white">{{ post.title }}</h1>

                <div class="post-meta">
                    <div class="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{{ formatDate(post.status === 'published' ? post.publishedAt : post.updatedAt) }}</span>
                    </div>

                    <div class="post-status" v-if="post.status !== 'published'">
                        <span class="status-badge">{{ post.status.toUpperCase() }}</span>
                    </div>
                </div>
            </header>

            <!-- Post Content -->
            <div class="post-content dark:text-neutral-300" v-html="post.content"></div>

            <!-- Tags & Categories -->
            <div class="post-taxonomy">
                <div v-if="post.tags && post.tags.length > 0" class="post-tags">
                    <div class="tags-list">
                        <a v-for="tag in post.tags" :key="tag" :href="`/tag/${tag.slug}`"
                           class="tag bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                            {{ tag.name }}
                        </a>
                    </div>
                </div>
            </div>

            <!-- Add this right after the post content, replace the existing share box -->
            <div class="py-8 border-t border-neutral-200 dark:border-neutral-800">
                <div class="flex items-center justify-between">
                    <!-- Share text and icons -->
                    <div class="flex items-center gap-2">
                        <span class="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Share:</span>

                        <div class="flex gap-2">
                            <!-- Facebook -->
                            <a
                                class="bg-blue-600 hover:bg-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                                rel="nofollow noopener"
                                :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl)"
                                onclick="window.open(this.href, 'facebook-share','width=580,height=296');return false;"
                                title="Share on Facebook"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                                </svg>
                            </a>

                            <!-- Twitter -->
                            <a
                                class="bg-sky-500 hover:bg-sky-600 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                                rel="nofollow noopener"
                                :href="'https://twitter.com/share?text=' + encodeURIComponent(post.title) + '&url=' + encodeURIComponent(pageUrl)"
                                onclick="window.open(this.href, 'twitter-share', 'width=550,height=235');return false;"
                                title="Share on Twitter"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>

                            <!-- LinkedIn -->
                            <a
                                class="bg-blue-700 hover:bg-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                                rel="nofollow noopener"
                                :href="'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(pageUrl) + '&title=' + encodeURIComponent(post.title)"
                                onclick="window.open(this.href, 'linkedin-share', 'width=490,height=530');return false;"
                                title="Share on LinkedIn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>

                            <!-- WhatsApp -->
                            <a
                                class="bg-green-500 hover:bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                                rel="nofollow noopener"
                                :href="'https://api.whatsapp.com/send?text=' + encodeURIComponent(post.title + ' ' + pageUrl)"
                                data-action="share/whatsapp/share"
                                title="Share on WhatsApp"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <!-- URL copy field -->
                    <div class="relative flex-1 max-w-md ml-4">
                        <div class="flex">
                            <input
                                type="text"
                                :value="pageUrl"
                                readonly
                                class="w-full px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l-md text-sm text-neutral-600 dark:text-neutral-300 focus:outline-none"
                                onclick="this.select()"
                            />
                            <button
                                @click="copyPageUrl"
                                class="bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-500 border border-neutral-300 dark:border-neutral-600 border-l-0 rounded-r-md px-3 text-neutral-600 dark:text-neutral-300 transition-colors"
                                title="Copy to clipboard"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                <span v-if="linkCopied" class="absolute top-full right-0 mt-1 bg-green-600 text-white text-xs py-1 px-2 rounded">
                                    Copied!
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Author Box with Tailwind classes -->
            <div v-if="author" class="mb-10 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div class="flex items-center mb-4">
                    <!-- Author Avatar -->
                    <div class="w-10 h-10 rounded-full overflow-hidden mr-4 flex-shrink-0 border-2 border-white dark:border-neutral-700 shadow">
                        <img v-if="author.image" :src="author.image" :alt="author.name" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-lg">
                            {{ authorInitials }}
                        </div>
                    </div>

                    <!-- Author Info -->
                    <div class="flex-1">
                        <h3 class="text-md font-semibold text-neutral-800 dark:text-white mb-1">
                            <a :href="`/author/${author.slug}`" class="hover:underline">
                                {{ author.name }}
                            </a>
                        </h3>
                        <p v-if="author.location" class="text-xs text-neutral-600 dark:text-neutral-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {{ author.location }}
                        </p>
                    </div>
                </div>

                <!-- Author Bio -->
                <div v-if="author.bio" class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 mb-4">
                    {{ author.bio }}
                </div>

                <!-- Social Links -->
                <div class="flex flex-wrap gap-3">
                    <a v-if="author.website" :href="author.website" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-full text-sm text-neutral-700 dark:text-neutral-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Website
                    </a>
                    <a v-if="author.twitter" :href="`https://twitter.com/${author.twitter}`" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-full text-sm text-neutral-700 dark:text-neutral-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                    </a>
                    <a v-if="author.facebook" :href="`https://facebook.com/${author.facebook}`" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-full text-sm text-neutral-700 dark:text-neutral-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </a>
                    <a v-if="author.instagram" :href="`https://instagram.com/${author.instagram}`" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-full text-sm text-neutral-700 dark:text-neutral-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                        Instagram
                    </a>
                    <a v-if="author.linkedin" :href="`https://linkedin.com/in/${author.linkedin}`" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-full text-sm text-neutral-700 dark:text-neutral-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                    </a>
                    <a v-if="author.github" :href="`https://github.com/${author.github}`" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-full text-sm text-neutral-700 dark:text-neutral-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                        Github
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { vue3 } from '@cmmv/blog/client';

const blogAPI = vue3.useBlog();
const route = useRoute();
const post = ref<any>(null);

const authorInitials = computed(() => {
    if (!author.value.name) return '?';

    return author.value.name
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
});

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
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

const linkCopied = ref(false);

const copyPageUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(pageUrl.value)
            .then(() => {
                linkCopied.value = true;
                setTimeout(() => {
                    linkCopied.value = false;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err);
            });
    }
};

post.value = route.params.id ?
    await blogAPI.getPostById(route.params.id as string) :
    await blogAPI.getPostBySlug(route.params.slug as string);

const author = ref(post.value.authors.find(
    (author: any) => author.user === post.value.author
));

const pageUrl = computed(() => {
    //@ts-ignore
    return `${import.meta.env.VITE_WEBSITE_URL}/post/${post.value.slug}`;
});

await vue3.injectSEO("post", {
    ...post.value,
    author: author.value
});
</script>

<style>
/* Add these CSS variables for dark mode */
/* Apply dark mode to article elements */
.dark .prose {
    color: var(--text-color);
}

.dark .prose h1,
.dark .prose h2,
.dark .prose h3,
.dark .prose h4,
.dark .prose h5,
.dark .prose h6 {
    color: #f3f4f6;
}

.dark .prose p,
.dark .prose ul,
.dark .prose ol {
    color: #d1d5db;
}

.dark .prose a {
    color: #60a5fa;
}

.dark .prose blockquote {
    color: #9ca3af;
    border-left-color: #4b5563;
    background-color: #1f2937;
}

.dark .prose code {
    color: #f3f4f6;
    background-color: #374151;
}

.dark .prose pre {
    background-color: #111827;
    color: #f3f4f6;
}

/* Other existing styles */
.post-content img {
    border-radius: 0.375rem;
    max-width: 100%;
    height: auto;
}

.image-caption {
    text-align: center;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.post-title {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1rem;
}

/* Adjust other styles as needed */
</style>
