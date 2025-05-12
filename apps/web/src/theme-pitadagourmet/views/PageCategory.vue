<template>
    <div class="w-full relative bg-neutral-100">
        <div class="lg:max-w-[1400px] mx-auto px-4">
            <div v-if="!category" class="bg-white rounded-lg p-6">
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-neutral-800 mb-4">Categoria não encontrada</h1>
                    <p class="text-neutral-600">A categoria que você está procurando não existe ou está indisponível.</p>
                </div>
            </div>

            <div v-else class="flex flex-col xl:flex-row gap-8">
                <!-- Left AdSense Sidebar -->
                <aside class="xl:w-[160px] shrink-0 hidden xl:block" v-if="adSettings.enableAds">
                    <div class="sticky top-24">
                        <div class="ad-container ad-sidebar-left mb-6" v-if="adSettings.adSenseSidebarLeft">
                            <div ref="sidebarLeftAdContainer"></div>
                        </div>
                        <div class="ad-container ad-sidebar-left mb-6" v-else>
                            <div class="ad-placeholder h-[600px] w-[160px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                <span>Anúncio</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main Content -->
                <div class="bg-white rounded-lg p-6 article-container overflow-hidden flex-grow">
                    <header class="border-b border-neutral-200 pb-4 mb-6 pr-4 pt-4">
                        <h1 class="text-3xl font-bold text-neutral-900 mb-3">{{ category.name }}</h1>
                        <p v-if="category.description" class="text-neutral-600 mb-4">{{ category.description }}</p>
                        <div class="text-sm text-neutral-500">{{ category.postCount }} posts nesta categoria</div>
                    </header>

                    <!-- Top AdSense Banner -->
                    <div v-if="adSettings.enableAds" class="w-full bg-gray-100 rounded-lg mb-8 overflow-hidden flex justify-center">
                        <div class="ad-container ad-banner-top py-2 px-4" v-if="getAdHtml('header')">
                            <div v-html="getAdHtml('header')"></div>
                        </div>
                        <div class="ad-container ad-banner-top py-2 px-4" v-else>
                            <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                <span>Anúncio</span>
                            </div>
                        </div>
                    </div>

                    <!-- Initial loading state -->
                    <div v-if="loading && posts.length === 0" class="flex justify-center items-center py-20">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4b0d00]"></div>
                    </div>

                    <!-- Posts List -->
                    <div v-else-if="posts.length > 0" class="space-y-10 post-content prose prose-sm sm:prose prose-neutral max-w-none">
                        <article v-for="(post, index) in posts" :key="post.id" class="border-b border-neutral-200 pb-8 last:border-0">
                            <!-- Feature Image -->
                            <a :href="`/post/${post.slug}`" class="block mb-4" aria-label="Ler mais sobre este post">
                                <div v-if="post.featureImage" class="relative aspect-video overflow-hidden rounded-lg">
                                    <img :src="post.featureImage" :alt="post.featureImageAlt || post.title" class="w-full h-full object-cover" />
                                </div>
                            </a>

                            <!-- Post Title -->
                            <h2 class="text-2xl font-bold text-neutral-900 mb-3">
                                <a :href="`/post/${post.slug}`" class="hover:text-[#4b0d00] transition-colors" aria-label="Ler mais sobre este post">
                                    {{ post.title }}
                                </a>
                            </h2>

                            <!-- Post Meta -->
                            <div class="flex items-center mb-4 text-sm text-neutral-600">
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{{ formatDate(post.publishedAt || post.updatedAt) }}</span>
                                </div>
                            </div>

                            <!-- Post Excerpt -->
                            <div v-if="post.excerpt" class="text-neutral-700 mb-4">
                                {{ post.excerpt }}
                            </div>
                            <div v-else-if="post.content" class="text-neutral-700 mb-4">
                                {{ stripHtml(post.content).substring(0, 200) }}{{ stripHtml(post.content).length > 200 ? '...' : '' }}
                            </div>

                            <!-- Tags -->
                            <div v-if="post.tags && post.tags.length > 0" class="mb-4 flex flex-wrap gap-2">
                                <a v-for="tag in post.tags" :key="tag" :href="`/tag/${tag.slug}`"
                                class="bg-neutral-100 text-neutral-700 text-sm px-3 py-1 rounded-full hover:bg-neutral-200 transition-colors">
                                    {{ tag.name }}
                                </a>
                            </div>

                            <!-- Read More Button -->
                            <div class="mt-4">
                                <a :href="`/post/${post.slug}`"
                                class="inline-flex items-center text-[#4b0d00] font-medium hover:text-[#064019] transition-colors">
                                    Ler mais
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                            </div>

                            <!-- Mid-content AdSense Banner (after every 3 posts) -->
                            <div v-if="adSettings.enableAds && adSettings.categoryPageInContent && (index + 1) % 3 === 0 && index < posts.length - 1" class="w-full bg-gray-100 rounded-lg my-8 overflow-hidden flex justify-center">
                                <div class="ad-container ad-banner-mid py-2 px-4" v-if="getAdHtml('inContent')">
                                    <div v-html="getAdHtml('inContent')"></div>
                                </div>
                                <div class="ad-container ad-banner-mid py-2 px-4" v-else>
                                    <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                        <span>Anúncio</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    <!-- No posts state -->
                    <div v-else-if="!loading && posts.length === 0" class="text-center py-16">
                        <h2 class="text-2xl font-bold mb-2 text-neutral-800">Nenhum post encontrado nesta categoria</h2>
                        <p class="text-neutral-600">Volte mais tarde para novos conteúdos!</p>
                    </div>

                    <!-- Bottom AdSense Banner -->
                    <div v-if="adSettings.enableAds && adSettings.categoryPageAfterContent" class="w-full bg-gray-100 rounded-lg my-8 overflow-hidden flex justify-center">
                        <div class="ad-container ad-banner-bottom py-2 px-4" v-if="getAdHtml('belowContent')">
                            <div v-html="getAdHtml('belowContent')"></div>
                        </div>
                        <div class="ad-container ad-banner-bottom py-2 px-4" v-else>
                            <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                <span>Anúncio</span>
                            </div>
                        </div>
                    </div>

                    <!-- Loading more indicator -->
                    <div v-if="loadingMore" class="mt-8 flex justify-center items-center py-6">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4b0d00]"></div>
                    </div>

                    <!-- No more posts indicator -->
                    <div v-if="!hasMorePosts && posts.length > 0 && !loadingMore" class="mt-8 text-center py-4 text-neutral-500">

                    </div>

                    <!-- Intersection observer target -->
                    <div ref="observerTarget" class="h-4 w-full"></div>
                </div>

                <!-- Right Sidebar with AdSense spaces -->
                <aside class="lg:w-80 shrink-0">
                    <div class="sticky top-24 space-y-6">
                        <!-- AdSense Rectangle (Top) -->
                        <div v-if="adSettings.enableAds && adSettings.categoryPageSidebarTop" class="bg-gray-100 rounded-lg shadow-md p-2 mb-6 flex justify-center">
                            <div class="ad-container ad-sidebar-top" v-if="getAdHtml('sidebarTop')">
                                <div v-html="getAdHtml('sidebarTop')"></div>
                            </div>
                            <div class="ad-container ad-sidebar-top" v-else>
                                <div class="ad-placeholder h-[250px] w-[300px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                    <span>Anúncio</span>
                                </div>
                            </div>
                        </div>

                        <!-- AdSense Rectangle (Middle) -->
                        <div v-if="adSettings.enableAds && adSettings.categoryPageSidebarMid" class="bg-gray-100 rounded-lg shadow-md p-2 mb-6 flex justify-center">
                            <div class="ad-container ad-sidebar-mid" v-if="getAdHtml('sidebarMid')">
                                <div v-html="getAdHtml('sidebarMid')"></div>
                            </div>
                            <div class="ad-container ad-sidebar-mid" v-else>
                                <div class="ad-placeholder h-[250px] w-[300px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                    <span>Anúncio</span>
                                </div>
                            </div>
                        </div>

                        <!-- AdSense Rectangle (Bottom) -->
                        <div v-if="adSettings.enableAds && adSettings.categoryPageSidebarBottom" class="bg-gray-100 rounded-lg shadow-md p-2 mb-6 flex justify-center">
                            <div class="ad-container ad-sidebar-bottom" v-if="getAdHtml('sidebarBottom')">
                                <div v-html="getAdHtml('sidebarBottom')"></div>
                            </div>
                            <div class="ad-container ad-sidebar-bottom" v-else>
                                <div class="ad-placeholder h-[250px] w-[300px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                    <span>Anúncio</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>

    <!-- Taboola JS Code -->
    <div v-if="adSettings.enableAds && adSettings.enableTaboolaAds && adSettings.taboolaJsCode" v-html="adSettings.taboolaJsCode"></div>
</template>

<script setup lang="ts">
//@ts-nocheck
import { ref, computed, onMounted, onUnmounted, onServerPrefetch  } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue'
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings';

import {
    formatDate, stripHtml
} from '../../composables/useUtils';
import { useAds } from '../../composables/useAds';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const settingsStore = useSettingsStore();
const blogAPI = vue3.useBlog();
const route = useRoute();

const isSSR = import.meta.env.SSR
const posts = ref<any[]>([]);
const settings = ref<any>(settingsStore.getSettings);
const category = ref<any>(null);
const pagination = ref<any>(null);
const loading = ref(true);
const loadingMore = ref(false);
const hasMorePosts = ref(true);
const currentPage = ref(0);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const sidebarLeftAdContainer = ref<HTMLElement | null>(null);

const adPluginSettings = computed(() => {
    return settings.value || {};
});

const { adSettings, getAdHtml, loadAdScripts, loadSidebarLeftAd } = useAds(adPluginSettings.value, 'category');

loading.value = true;

const data = ref<any>(route.params.id ?
    await blogAPI.categories.getById(route.params.id as string) :
    await blogAPI.categories.getBySlug(route.params.slug as string));

category.value = data.value.category;
posts.value = data.value.posts?.data || [];
pagination.value = data.value.posts?.pagination;
hasMorePosts.value = posts.value.length < (data.value.posts?.count || 0);

const pageUrl = computed(() => {
    // Use the URL from settings instead of the environment variable
    const baseUrl = settings.value['blog.url'] || '';
    return `${baseUrl}/category/${category.value?.slug || ''}`;
})

const headData = ref({
    title: category.value.name + ' - ' + settings.value['blog.title'],
    meta: [
        { name: 'description', content: category.value.description },
        { name: 'keywords', content: settings.value['blog.keywords'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: category.value.name + ' - ' + settings.value['blog.title'] },
        { property: 'og:description', content: category.value.description },
        { property: 'og:image', content: settings.value['blog.logo'] },
        { property: 'og:url', content: pageUrl.value }
    ],
    link: [
        { rel: 'canonical', href: pageUrl.value },
        { rel: 'alternate', href: `${settings.value['blog.url']}/feed`, type: 'application/rss+xml', title: settings.value['blog.title'] }
    ]
})

useHead(headData);

const loadMorePosts = async () => {
    if (loadingMore.value || !hasMorePosts.value) return;

    try {
        loadingMore.value = true;
        currentPage.value++;

        const response = route.params.id ?
            await blogAPI.categories.getById(route.params.id as string, posts.value.length) :
            await blogAPI.categories.getBySlug(route.params.slug as string, posts.value.length);

        if (response && response.posts && response.posts.data && response.posts.data.length > 0) {
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
    loading.value = false;
    setupIntersectionObserver();

    // Load ad scripts and sidebar left ad
    loadAdScripts();
    loadSidebarLeftAd(sidebarLeftAdContainer.value);
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
});
</script>

<style scoped>
.article-container {
    max-width: 48rem;
    margin: 0 auto;
}

.post-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(iframe) {
    max-width: 100%;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(table) {
    max-width: 100%;
    overflow-x: auto;
    display: block;
    border-collapse: collapse;
    margin: 1rem 0;
}

.post-content :deep(table td),
.post-content :deep(table th) {
    border: 1px solid #e5e5e5;
    padding: 0.5rem;
}

.post-content :deep(pre) {
    max-width: 100%;
    overflow-x: auto;
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(code) {
    white-space: pre-wrap;
    word-break: break-word;
    background-color: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
}

.post-content :deep(blockquote) {
    border-left: 4px solid #4b0d00;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #4b0d00;
}

.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.post-content :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
}

.post-content :deep(ul),
.post-content :deep(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
}

.post-content :deep(li) {
    margin-bottom: 0.5rem;
}

.post-content :deep(a) {
    color: #4b0d00;
    text-decoration: underline;
}

.post-content :deep(a:hover) {
    color: #064019;
}

.ad-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    border-radius: 4px;
}

@media (max-width: 1536px) {
    .ad-sidebar-left {
        display: none;
    }
}
</style>
