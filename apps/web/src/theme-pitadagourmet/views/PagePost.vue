<template>
    <div class="w-full relative bg-neutral-100">
        <div class="w-full max-w-[1400px] mx-auto px-4">
            <div v-if="!post" class="bg-white rounded-lg p-6">
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-neutral-800 mb-4">Post não encontrado</h1>
                    <p class="text-neutral-600">O post que você está procurando não existe ou está indisponível.</p>
                </div>
            </div>

            <div v-else>
                <!-- Top AdSense Banner -->
                <div v-if="adSettings.enableAds && adSettings.articlePageHeader" class="w-full bg-gray-100 rounded-lg mb-8 overflow-hidden flex justify-center">
                    <div class="ad-container ad-banner-top py-2 px-4" v-if="getAdHtml('header')">
                        <div v-html="getAdHtml('header')"></div>
                    </div>
                    <div class="ad-container ad-banner-top py-2 px-4" v-else>
                        <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            <span>Anúncio</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Layout -->
                <div class="flex flex-col lg:flex-row gap-8">
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

                    <!-- Main Content Area -->
                    <div class="flex-grow">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <!-- Main Post Content (2 columns width) -->
                            <div class="lg:col-span-2 bg-white rounded-lg p-4 relative">
                                <div class="w-full mx-auto overflow-hidden">
                                    <h1 class="post-title text-neutral-900 text-3xl md:text-4xl font-bold break-words mb-4">{{ post.title }}</h1>

                                    <div v-if="post.featureImage" class="post-featured-image relative overflow-hidden rounded-lg max-h-[400px]">
                                        <div class="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                                            <a v-for="category in post.categories" :key="category.id" :href="`/category/${category.slug}`"
                                                class="px-3 py-1 bg-[#4b0d00] text-white text-sm font-medium rounded-full shadow-sm hover:bg-[#064019] transition-all">
                                                {{ category.name }}
                                            </a>
                                        </div>

                                        <img
                                            :src="post.featureImage"
                                            :alt="post.featureImageAlt || post.title"
                                            class="featured-img md:block hidden"
                                            width="890"
                                            height="606"
                                            loading="lazy"
                                            title="Imagem de destaque"
                                            aria-label="Imagem de destaque"
                                        />

                                        <p v-if="post.featureImageCaption" class="image-caption text-neutral-600 text-sm mt-2 text-center">{{
                                            post.featureImageCaption }}</p>
                                    </div>

                                    <!-- After Title Ad -->
                                    <div v-if="adSettings.enableAds && adSettings.articlePageAfterTitle" class="w-full bg-gray-100 rounded-lg my-6 overflow-hidden flex justify-center">
                                        <div class="ad-container ad-after-title py-2 px-4" v-if="getAdHtml('afterTitle')">
                                            <div v-html="getAdHtml('afterTitle')"></div>
                                        </div>
                                        <div class="ad-container ad-after-title py-2 px-4" v-else>
                                            <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                                <span>Anúncio</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Post Header -->
                                    <header class="post-header my-6">
                                        <div class="post-meta flex items-center">
                                            <div class="flex items-center text-neutral-600 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{{ formatDate(post.status === 'published' ? post.publishedAt : post.updatedAt) }}</span>
                                            </div>

                                            <div class="post-status ml-4" v-if="post.status !== 'published'">
                                                <span class="bg-[#ffcc00] text-[#333333] px-2 py-1 rounded-full text-xs font-semibold">{{ post.status?.toUpperCase() }}</span>
                                            </div>
                                        </div>
                                    </header>

                                    <!-- Post Content -->
                                    <div class="post-content text-neutral-800 prose prose-sm sm:prose prose-neutral max-w-none overflow-hidden">
                                        <div v-html="processPostContent(post.content)"></div>
                                    </div>

                                    <!-- Tags & Categories -->
                                    <div class="post-taxonomy mt-2">
                                        <div v-if="post.tags && post.tags.length > 0" class="post-tags">
                                            <div class="tags-list flex flex-wrap gap-2">
                                                <a v-for="tag in post.tags" :key="tag" :href="`/tag/${tag.slug}`"
                                                    class="tag bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1 rounded-full text-sm">
                                                    {{ tag.name }}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Author Box -->
                                    <div v-if="author"
                                        class="mb-10 p-6 bg-neutral-50 rounded-lg border border-neutral-200 mt-8">
                                        <div class="flex items-center mb-4">
                                            <!-- Author Avatar -->
                                            <div
                                                class="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 border-2 border-white shadow">
                                                <img v-if="author.image" :src="author.image" :alt="author.name"
                                                    class="w-full h-full object-cover" width="44" height="44" />
                                                <div v-else
                                                    class="w-full h-full flex items-center justify-center bg-[#4b0d00] text-white font-bold text-lg">
                                                    {{ authorInitials }}
                                                </div>
                                            </div>

                                            <!-- Author Info -->
                                            <div class="flex-1 min-w-0">
                                                <span class="text-md font-semibold text-neutral-800 mb-1 break-words">
                                                    <a :href="`/author/${author.slug}`" class="hover:underline">
                                                        {{ author.name }}
                                                    </a>
                                                </span>
                                                <p v-if="author.location"
                                                    class="text-xs text-neutral-600 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span class="truncate">{{ author.location }}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Author Bio -->
                                        <div v-if="author.bio" class="text-sm leading-relaxed text-neutral-700 mb-4">
                                            {{ author.bio }}
                                        </div>

                                        <!-- Social Links -->
                                        <div class="flex flex-wrap gap-3">
                                            <a v-if="author.website" :href="author.website" target="_blank" rel="noopener noreferrer"
                                                class="inline-flex items-center px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-full text-sm text-neutral-700 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                Website
                                            </a>
                                            <a v-if="author.twitter" :href="`https://twitter.com/${author.twitter}`" target="_blank"
                                                rel="noopener noreferrer"
                                                class="inline-flex items-center px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-full text-sm text-neutral-700 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24"
                                                    fill="currentColor">
                                                    <path
                                                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                </svg>
                                                Twitter
                                            </a>
                                            <a v-if="author.facebook" :href="`https://facebook.com/${author.facebook}`" target="_blank"
                                                rel="noopener noreferrer"
                                                class="inline-flex items-center px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-full text-sm text-neutral-700 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24"
                                                    fill="currentColor">
                                                    <path
                                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                                Facebook
                                            </a>
                                            <a v-if="author.instagram" :href="`https://instagram.com/${author.instagram}`" target="_blank"
                                                rel="noopener noreferrer"
                                                class="inline-flex items-center px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-full text-sm text-neutral-700 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24"
                                                    fill="currentColor">
                                                    <path
                                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                </svg>
                                                Instagram
                                            </a>
                                            <a v-if="author.linkedin" :href="`https://linkedin.com/in/${author.linkedin}`" target="_blank"
                                                rel="noopener noreferrer"
                                                class="inline-flex items-center px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-full text-sm text-neutral-700 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24"
                                                    fill="currentColor">
                                                    <path
                                                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                                LinkedIn
                                            </a>
                                            <a v-if="author.github" :href="`https://github.com/${author.github}`" target="_blank"
                                                rel="noopener noreferrer"
                                                class="inline-flex items-center px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-full text-sm text-neutral-700 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24"
                                                    fill="currentColor">
                                                    <path
                                                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                                </svg>
                                                Github
                                            </a>
                                        </div>
                                    </div>

                                    <!-- Mid-content AdSense Banner -->
                                    <div v-if="adSettings.enableAds && adSettings.articlePageInContent" class="w-full bg-gray-100 rounded-lg my-8 overflow-hidden flex justify-center">
                                        <div class="ad-container ad-banner-mid py-2 px-4" v-if="getAdHtml('inContent')">
                                            <div v-html="getAdHtml('inContent')"></div>
                                        </div>
                                        <div class="ad-container ad-banner-mid py-2 px-4" v-else>
                                            <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                                <span>Anúncio</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Mais Conteúdo Section -->
                                    <div class="mt-10">
                                        <h2 class="text-xl font-bold mb-6 pb-2 text-[#4b0d00] border-b-2 border-[#ffcc00]">
                                            Mais Conteúdo
                                        </h2>

                                        <div ref="relatedPostsObserver" class="min-h-[200px]">
                                            <div v-if="!relatedPostsLoaded" class="flex justify-center items-center py-6">
                                                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4b0d00]"></div>
                                                <span class="ml-3 text-gray-600">Carregando posts relacionados...</span>
                                            </div>

                                            <div v-else-if="relatedPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                <article
                                                    v-for="relatedPost in relatedPosts"
                                                    :key="relatedPost.id"
                                                    class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300"
                                                >
                                                    <a :href="`/post/${relatedPost.slug}`" class="block">
                                                        <div class="h-48 overflow-hidden relative">
                                                            <img
                                                                v-if="relatedPost.featureImage"
                                                                :src="relatedPost.featureImage"
                                                                :alt="relatedPost.title"
                                                                class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                                            />
                                                            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div v-if="relatedPost.categories && relatedPost.categories.length > 0" class="absolute top-2 left-2">
                                                                <span class="bg-[#ffcc00] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                                                    {{ relatedPost.categories[0].name }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <div class="p-4">
                                                        <a :href="`/post/${relatedPost.slug}`" class="block">
                                                            <h3 class="text-lg font-bold text-gray-800 mb-2 hover:text-[#4b0d00] transition-colors line-clamp-2">
                                                                {{ relatedPost.title }}
                                                            </h3>
                                                        </a>
                                                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                                                            {{ relatedPost.excerpt || stripHtml(relatedPost.content).substring(0, 120) + '...' }}
                                                        </p>
                                                        <div class="flex justify-between items-center text-xs text-gray-500">
                                                            <span v-if="getAuthor(relatedPost)">Por {{ getAuthor(relatedPost).name }}</span>
                                                            <span>{{ formatDate(relatedPost.publishedAt || relatedPost.updatedAt) }}</span>
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>

                                            <div v-else class="text-center py-4 text-gray-600">
                                                Nenhum post relacionado encontrado.
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Bottom AdSense Banner -->
                                    <div v-if="adSettings.enableAds && adSettings.articlePageAfterContent" class="w-full bg-gray-100 rounded-lg mt-8 mb-4 overflow-hidden flex justify-center">
                                        <div class="ad-container ad-banner-bottom py-2 px-4" v-if="getAdHtml('belowContent')">
                                            <div v-html="getAdHtml('belowContent')"></div>
                                        </div>
                                        <div class="ad-container ad-banner-bottom py-2 px-4" v-else>
                                            <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                                <span>Anúncio</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Comments Section -->
                                    <div id="comments-container" ref="commentsObserver" class="mt-10 min-h-[100px]">
                                        <div v-if="!commentsLoaded" class="text-center py-4 text-gray-600">
                                            Os comentários serão carregados quando você rolar até aqui.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column (Widgets + Ads) -->
                            <div class="lg:col-span-1">
                                <!-- AdSense Rectangle (Top) -->
                                <div v-if="adSettings.enableAds && adSettings.articlePageSidebarTop" class="bg-gray-100 rounded-lg shadow-md p-2 mb-6 flex justify-center overflow-hidden">
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
                                <div v-if="adSettings.enableAds && adSettings.articlePageSidebarMid" class="bg-gray-100 rounded-lg shadow-md p-2 mb-6 flex justify-center overflow-hidden">
                                    <div class="ad-container ad-sidebar-mid" v-if="getAdHtml('sidebarMid')">
                                        <div v-html="getAdHtml('sidebarMid')"></div>
                                    </div>
                                    <div class="ad-container ad-sidebar-mid" v-else>
                                        <div class="ad-placeholder h-[250px] w-[300px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                            <span>Anúncio</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Share Widget -->
                                <div class="bg-white rounded-lg shadow-md p-5 mb-6">
                                    <h2 class="text-xl font-bold mb-4 pb-2 text-[#4b0d00] border-b-2 border-[#ffcc00]">
                                        Compartilhar
                                    </h2>
                                    <div class="flex flex-wrap gap-2">
                                        <!-- Facebook -->
                                        <a class="bg-blue-600 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                                            rel="nofollow noopener"
                                            :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl)"
                                            onclick="window.open(this.href, 'facebook-share','width=580,height=296');return false;"
                                            title="Compartilhar no Facebook">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path
                                                    d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                                            </svg>
                                        </a>

                                        <!-- Twitter -->
                                        <a class="bg-sky-500 hover:bg-sky-600 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                                            rel="nofollow noopener"
                                            :href="'https://twitter.com/share?text=' + encodeURIComponent(post.title) + '&url=' + encodeURIComponent(pageUrl)"
                                            onclick="window.open(this.href, 'twitter-share', 'width=550,height=235');return false;"
                                            title="Compartilhar no Twitter">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path
                                                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                            </svg>
                                        </a>

                                        <!-- LinkedIn -->
                                        <a class="bg-blue-700 hover:bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                                            rel="nofollow noopener"
                                            :href="'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(pageUrl) + '&title=' + encodeURIComponent(post.title)"
                                            onclick="window.open(this.href, 'linkedin-share', 'width=490,height=530');return false;"
                                            title="Compartilhar no LinkedIn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path
                                                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </a>

                                        <!-- WhatsApp -->
                                        <a class="bg-green-500 hover:bg-green-600 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                                            rel="nofollow noopener"
                                            :href="whatsappShareUrl"
                                            target="_blank"
                                            data-action="share/whatsapp/share"
                                            title="Compartilhar no WhatsApp">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path
                                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </a>

                                        <!-- Copy link button -->
                                        <button @click="copyPageUrl"
                                            class="bg-neutral-200 hover:bg-neutral-300 w-10 h-10 rounded-full flex items-center justify-center text-neutral-600 transition-colors relative"
                                            title="Copiar link">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                            <span v-if="linkCopied"
                                                class="absolute -right-16 whitespace-nowrap bg-green-600 text-white text-xs py-1 px-2 rounded">
                                                Copiado!
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Popular Posts Widget -->
                                <div v-if="popularPosts && popularPosts.length > 0" class="bg-white rounded-lg shadow-md p-5 mb-6">
                                    <h2 class="text-xl font-bold mb-4 pb-2 text-[#4b0d00] border-b-2 border-[#ffcc00]">
                                        Mais Populares
                                    </h2>

                                    <div class="space-y-4">
                                        <div
                                            v-for="popularPost in popularPosts"
                                            :key="popularPost.id"
                                            class="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                                        >
                                            <div class="w-20 h-16 flex-shrink-0 overflow-hidden rounded-md">
                                                <a :href="`/post/${popularPost.slug}`">
                                                    <img
                                                        v-if="popularPost.image || popularPost.featureImage"
                                                        :src="popularPost.image || popularPost.featureImage"
                                                        :alt="popularPost.title"
                                                        class="w-full h-full object-cover"
                                                    />
                                                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="flex-grow">
                                                <a :href="`/post/${popularPost.slug}`" class="block">
                                                    <h4 class="text-sm font-semibold text-gray-800 hover:text-[#4b0d00] transition-colors line-clamp-2">
                                                        {{ popularPost.title }}
                                                    </h4>
                                                </a>
                                                <span class="text-xs text-gray-500 mt-1 block">
                                                    {{ formatDate(popularPost.publishedAt || popularPost.updatedAt) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Categories Widget -->
                                <div v-if="categories && categories.length > 0" class="bg-white rounded-lg shadow-md p-5 mb-6">
                                    <h2 class="text-xl font-bold mb-4 pb-2 text-[#4b0d00] border-b-2 border-[#ffcc00]">
                                        Categorias
                                    </h2>

                                    <ul class="space-y-2">
                                        <li v-for="category in categories" :key="category.id" class="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                            <a
                                                :href="`/category/${category.slug}`"
                                                class="flex justify-between items-center text-gray-700 hover:text-[#4b0d00] transition-colors"
                                            >
                                                {{ category.name }}
                                                <span class="bg-[#4b0d00] text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    {{ category.postCount }}
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <!-- AdSense Rectangle (Bottom) -->
                                <div v-if="adSettings.enableAds && adSettings.articlePageSidebarBottom" class="bg-gray-100 rounded-lg shadow-md p-2 mb-6 flex justify-center">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Taboola JS Code -->
    <div v-if="adSettings.enableAds && adSettings.enableTaboolaAds && adSettings.taboolaJsCode" v-html="adSettings.taboolaJsCode"></div>
</template>

<script setup lang="ts">
//@ts-nocheck
import {
    ref, computed, onServerPrefetch,
    onMounted, watchEffect, watch, onUnmounted
} from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { vue3 } from '@cmmv/blog/client'
import { formatDate, stripHtml } from '../../composables/useUtils'
import CommentSection from '../../components/CommentSection.vue'
import { useSettingsStore } from '../../store/settings';
import { usePostsStore } from '../../store/posts';
import { useCategoriesStore } from '../../store/categories';
import { useMostAccessedPostsStore } from '../../store/mostaccessed';

// Declare adsbygoogle for TypeScript
declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const settingsStore = useSettingsStore();
const postsStore = usePostsStore();
const categoriesStore = useCategoriesStore();
const mostAccessedPostsStore = useMostAccessedPostsStore();
const blogAPI = vue3.useBlog()
const route = useRoute()

const settings = ref<any>(settingsStore.getSettings);
const post = ref<any>(null)
const categories = ref<any[]>(categoriesStore.getCategories || []);
const popularPosts = ref<any[]>(mostAccessedPostsStore.getMostAccessedPosts || []);
const isSSR = import.meta.env.SSR

if(!isSSR)
    post.value = window.__CMMV_DATA__["post"]

// Helper function to handle boolean settings (could be 1, true, etc)
const isTruthy = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        return value === '1' || value.toLowerCase() === 'true';
    }
    return false;
};

// Ad Settings
const adSettings = computed(() => {
    const rawSettings = settings.value || {};

    const result: Record<string, any> = {
        // Convert potential string values to proper booleans
        enableAds: isTruthy(rawSettings['blog.enableAds']),
        showAdsLoggedIn: isTruthy(rawSettings['blog.showAdsLoggedIn']),

        // Ad positions for article page - default to true for most positions
        articlePageHeader: rawSettings['blog.articlePageHeader'] === undefined ? true : isTruthy(rawSettings['blog.articlePageHeader']),
        articlePageSidebarTop: rawSettings['blog.articlePageSidebarTop'] === undefined ? true : isTruthy(rawSettings['blog.articlePageSidebarTop']),
        articlePageSidebarBottom: rawSettings['blog.articlePageSidebarBottom'] === undefined ? true : isTruthy(rawSettings['blog.articlePageSidebarBottom']),
        articlePageAfterTitle: isTruthy(rawSettings['blog.articlePageAfterTitle']),
        articlePageInContent: rawSettings['blog.articlePageInContent'] === undefined ? true : isTruthy(rawSettings['blog.articlePageInContent']),
        articlePageAfterContent: rawSettings['blog.articlePageAfterContent'] === undefined ? true : isTruthy(rawSettings['blog.articlePageAfterContent']),
        articlePageFooter: isTruthy(rawSettings['blog.articlePageFooter']),

        // AdSense settings
        enableAdSense: isTruthy(rawSettings['blog.enableAdSense']),
        adSensePublisherId: rawSettings['blog.adSensePublisherId'] || '',
        adSenseAutoAdsCode: rawSettings['blog.adSenseAutoAdsCode'] || '',
        enableAdSenseAutoAds: isTruthy(rawSettings['blog.enableAdSenseAutoAds']),
        adSenseHeaderBanner: rawSettings['blog.adSenseHeaderBanner'] || '',
        adSenseSidebarTop: rawSettings['blog.adSenseSidebarTop'] || '',
        adSenseSidebarMid: rawSettings['blog.adSenseSidebarMid'] || '',
        adSenseSidebarBottom: rawSettings['blog.adSenseSidebarBottom'] || '',
        adSenseSidebarLeft: rawSettings['blog.adSenseSidebarLeft'] || '',
        adSenseAfterCover: rawSettings['blog.adSenseAfterCover'] || '',
        adSenseAfterTitle: rawSettings['blog.adSenseAfterTitle'] || '',
        adSenseInArticle: rawSettings['blog.adSenseInArticle'] || '',
        adSenseBelowContent: rawSettings['blog.adSenseBelowContent'] || '',

        // Custom Ads
        enableCustomAds: isTruthy(rawSettings['blog.enableCustomAds']),
        customHeaderBanner: rawSettings['blog.customHeaderBanner'] || '',
        customSidebarTop: rawSettings['blog.customSidebarTop'] || '',
        customSidebarBottom: rawSettings['blog.customSidebarBottom'] || '',
        customInArticle: rawSettings['blog.customInArticle'] || '',
        customBelowContent: rawSettings['blog.customBelowContent'] || '',

        // Amazon Affiliate
        enableAmazonAds: isTruthy(rawSettings['blog.enableAmazonAds']),
        amazonAssociateId: rawSettings['blog.amazonAssociateId'] || '',
        amazonSidebarAd: rawSettings['blog.amazonSidebarAd'] || '',
        amazonInContentAd: rawSettings['blog.amazonInContentAd'] || '',
        amazonBelowContentAd: rawSettings['blog.amazonBelowContentAd'] || '',

        // Taboola Ads
        enableTaboolaAds: isTruthy(rawSettings['blog.enableTaboolaAds']),
        taboolaPublisherId: rawSettings['blog.taboolaPublisherId'] || '',
        taboolaBelowArticle: rawSettings['blog.taboolaBelowArticle'] || '',
        taboolaRightRail: rawSettings['blog.taboolaRightRail'] || '',
        taboolaFooter: rawSettings['blog.taboolaFooter'] || '',
        taboolaJsCode: rawSettings['blog.taboolaJsCode'] || '',
    };

    // Log for debugging
    console.log('adSenseSidebarLeft value in PagePost:', rawSettings['blog.adSenseSidebarLeft']);

    return result;
});

// Helper to get appropriate ad HTML based on position
const getAdHtml = (position) => {
    if (!adSettings.value.enableAds) return '';

    // Check if position is enabled
    const positionSetting = `articlePage${position.charAt(0).toUpperCase() + position.slice(1)}`;
    if (positionSetting in adSettings.value && !adSettings.value[positionSetting]) {
        return '';
    }

    if (adSettings.value.enableAdSense) {
        // Map position to the correct AdSense setting key
        let adSenseSetting = '';
        switch (position) {
            case 'header':
                adSenseSetting = 'adSenseHeaderBanner';
                break;
            case 'afterTitle':
                adSenseSetting = 'adSenseAfterTitle';
                break;
            case 'sidebarTop':
                adSenseSetting = 'adSenseSidebarTop';
                break;
            case 'sidebarMid':
                adSenseSetting = 'adSenseSidebarMid';
                break;
            case 'sidebarBottom':
                adSenseSetting = 'adSenseSidebarBottom';
                break;
            case 'sidebarLeft':
                adSenseSetting = 'adSenseSidebarLeft';
                break;
            case 'inContent':
                adSenseSetting = 'adSenseInArticle';
                break;
            case 'belowContent':
                adSenseSetting = 'adSenseBelowContent';
                break;
            default:
                return '';
        }

        if (adSenseSetting in adSettings.value && adSettings.value[adSenseSetting]) {
            return adSettings.value[adSenseSetting];
        }
    }

    if (adSettings.value.enableCustomAds) {
        // Map position to the correct custom ad setting key
        let customSetting = '';
        switch (position) {
            case 'header':
                customSetting = 'customHeaderBanner';
                break;
            case 'sidebarTop':
                customSetting = 'customSidebarTop';
                break;
            case 'sidebarBottom':
                customSetting = 'customSidebarBottom';
                break;
            case 'inContent':
                customSetting = 'customInArticle';
                break;
            case 'belowContent':
                customSetting = 'customBelowContent';
                break;
            default:
                return '';
        }

        if (customSetting in adSettings.value && adSettings.value[customSetting]) {
            return adSettings.value[customSetting];
        }
    }

    if (adSettings.value.enableAmazonAds) {
        switch (position) {
            case 'sidebarTop':
                if (adSettings.value.amazonSidebarAd) return adSettings.value.amazonSidebarAd;
                break;
            case 'inContent':
                if (adSettings.value.amazonInContentAd) return adSettings.value.amazonInContentAd;
                break;
            case 'belowContent':
                if (adSettings.value.amazonBelowContentAd) return adSettings.value.amazonBelowContentAd;
                break;
        }
    }

    if (adSettings.value.enableTaboolaAds) {
        switch (position) {
            case 'belowContent':
                if (adSettings.value.taboolaBelowArticle) return adSettings.value.taboolaBelowArticle;
                break;
            case 'sidebarTop':
                if (adSettings.value.taboolaRightRail) return adSettings.value.taboolaRightRail;
                break;
            case 'footer':
                if (adSettings.value.taboolaFooter) return adSettings.value.taboolaFooter;
                break;
        }
    }

    return '';
};

function processPostContent(content) {
    if (!content) return '';

    // Twitter/X URL patterns
    const twitterUrlPatterns = [
        /https?:\/\/(www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)(\?[^\s]*)?/g,
        /https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)(\?[^\s]*)?/g
    ];

    // Reddit URL patterns
    const redditUrlPatterns = [
        /https?:\/\/(www\.)?reddit\.com\/r\/([a-zA-Z0-9_]+)\/comments\/([a-zA-Z0-9]+)(?:\/[^\/\s]+)?(?:\/([a-zA-Z0-9]+))?/g
    ];

    let processedContent = content;

    // Replace Twitter/X URLs with embed code
    twitterUrlPatterns.forEach(pattern => {
        processedContent = processedContent.replace(pattern, (match, p1, username, tweetId) => {
            // Create Twitter embed HTML
            return `<div class="twitter-embed">
                <blockquote class="twitter-tweet" data-dnt="true" data-theme="light">
                    <a href="${match}"></a>
                </blockquote>
            </div>`;
        });
    });

    // Replace Reddit URLs with embed code
    redditUrlPatterns.forEach(pattern => {
        processedContent = processedContent.replace(pattern, (match, p1, subreddit, postId, commentId) => {
            // Create Reddit embed HTML
            return `<div class="reddit-embed">
                <div class="reddit-card" data-embed-height="500">
                    <a href="${match}"></a>
                </div>
            </div>`;
        });
    });

    // Load Twitter script if content has Twitter embeds
    if (!isSSR && (processedContent.includes('twitter-tweet') || processedContent.includes('twitter-embed'))) {
        setTimeout(() => {
            loadTwitterScript();
        }, 100);
    }

    // Load Reddit script if content has Reddit embeds
    if (!isSSR && processedContent.includes('reddit-embed')) {
        setTimeout(() => {
            loadRedditScript();
        }, 100);
    }

    return processedContent;
}

function loadTwitterScript() {
    if (document.getElementById('twitter-widgets-script')) return;

    const script = document.createElement('script');
    script.id = 'twitter-widgets-script';
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);
}

function loadRedditScript() {
    if (document.getElementById('reddit-widget-script')) return;

    const script = document.createElement('script');
    script.id = 'reddit-widget-script';
    script.src = 'https://embed.reddit.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);
}

const author = computed(() => post.value?.authors?.find((a: any) => a.user === post.value?.author))
const isScrolled = ref(false)
const relatedPosts = ref<any[]>([])
const isDesktop = ref(false)
const linkCopied = ref(false)

const authorInitials = computed(() => {
    return author.value?.name
        ? author.value.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
        : '?'
})

const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const whatsappShareUrl = computed(() => {
    if (!post.value) return '';
    const text = encodeURIComponent(post.value.title + ' ' + pageUrl.value)
    return isDesktop.value
        ? `https://web.whatsapp.com/send?text=${text}`
        : `https://api.whatsapp.com/send?text=${text}`
})

const getAuthor = (post: any) => {
    if (!post.authors || !post.authors.length) return null;
    return post.authors.find((author: any) => author.user === post.author);
};

onServerPrefetch(async () => {
    post.value = route.params.id
            ? await blogAPI.posts.getById(route.params.id as string)
            : await blogAPI.posts.getBySlug(route.params.slug as string);
})

watchEffect(() => {
    if (post.value && post.value.id) {
        const storePosts = postsStore.getPosts || [];

        if (storePosts.length > 0) {
            const filteredPosts = storePosts.filter(p => p.id !== post.value.id);

            if (filteredPosts.length > 0)
                relatedPosts.value = shuffleArray(filteredPosts).slice(0, 3);
        }
    }
})

const pageUrl = computed(() => {
    return `${import.meta.env.VITE_WEBSITE_URL}/post/${post.value?.slug || ''}`
})

const keywords = computed(() => post.value?.keywords ||
    (post.value?.tags?.map((tag: any) => tag.name).join(', ') || ''))

const description = computed(() =>
    stripHtml(post.value?.description || post.value?.excerpt || post.value?.content || '')
        .substring(0, 150) + '...'
)

const metadata = computed(() => keywords.value
    .split(', ')
    .map((k: string) => ({ property: 'article:tag', content: k })))

const headData = computed(() => ({
    title: post.value?.title,
    meta: [
        { name: 'description', content: description.value },
        { name: 'keywords', content: keywords.value },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: post.value?.title },
        { property: 'og:description', content: description.value },
        { property: 'og:image', content: post.value?.featureImage || settings.value?.['blog.image'] },
        { property: 'og:url', content: pageUrl.value },
        { property: 'og:image:type', content: 'image/webp' },
        { property: 'og:image:alt', content: post.value?.title || 'Imagem' },
        { property: 'og:image:secure_url', content: post.value?.featureImage || settings.value?.['blog.image'] },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '675' },
        { property: 'og:image:type', content: 'image/webp' },
        { property: 'og:updated_time', content: post.value?.updatedAt ? new Date(post.value.updatedAt).toISOString() : new Date().toISOString() },
        { property: 'article:published_time', content: post.value?.status === 'published' && post.value?.publishedAt ? new Date(post.value.publishedAt).toISOString() : post.value?.createdAt ? new Date(post.value.createdAt).toISOString() : new Date().toISOString() },
        { property: 'article:modified_time', content: post.value?.updatedAt ? new Date(post.value.updatedAt).toISOString() : new Date().toISOString() },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: post.value?.title },
        { name: 'twitter:description', content: description.value },
        { name: 'twitter:image', content: post.value?.featureImage || settings.value?.['blog.image'] },
        { name: 'twitter:url', content: pageUrl.value },
        ...metadata.value
    ],
    link: [
        { rel: 'canonical', href: pageUrl.value },
        { rel: 'alternate', href: `${settings.value['blog.url']}/feed`, type: 'application/rss+xml', title: settings.value['blog.title'] }
    ],
    script: isSSR ? [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(vue3.createLdJSON('post', post.value, settings.value))
        }

    ] : [
        {
            type: 'text/javascript',
            src: 'https://platform.twitter.com/widgets.js',
            charset: 'UTF-8',
            async: true,
            id: 'twitter-widgets-script'
        },
        {
            type: 'text/javascript',
            src: 'https://embed.reddit.com/widgets.js',
            charset: 'UTF-8',
            async: true,
            id: 'reddit-widget-script'
        }
    ]
}))

useHead(headData)

const copyPageUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(pageUrl.value).then(() => {
            linkCopied.value = true
            setTimeout(() => (linkCopied.value = false), 2000)
        })
    }
}

const handleScroll = () => {
    if (!document.body.contains(relatedPostsObserver.value)) {
        return;
    }
    isScrolled.value = window.scrollY > 300;
};

const commentSystem = computed(() => {
    return settings.value['blog.commentSystem'] || 'none';
});

const loadComments = () => {
    try {
        if (!isMounted.value || isSSR) return;

        const commentsContainer = document.getElementById('comments-container');

        if (!commentsContainer || !document.body.contains(commentsContainer)) {
            console.warn('Comments container not found or not attached to DOM');
            return;
        }

        while (commentsContainer.firstChild) {
            commentsContainer.removeChild(commentsContainer.firstChild);
        }

        if (commentSystem.value === 'disqus') {
            loadDisqusComments();
        } else if (commentSystem.value === 'facebook') {
            loadFacebookComments();
        } else {
            const commentsTitle = document.createElement('h3');
            commentsTitle.className = 'text-xl font-bold mb-4 text-neutral-800';
            commentsTitle.textContent = 'Comentários';
            commentsContainer.appendChild(commentsTitle);

            setTimeout(() => {
                try {
                    if (isMounted.value && document.body.contains(commentsContainer)) {
                        const comments = new CMMVComments({
                            container: '#comments-container',
                            postId: window.location.pathname.split('/').pop(),
                            theme: 'dark'
                        });
                    }
                } catch (error) {
                    console.error('Error initializing comments:', error);
                }
            }, 100);
        }
    } catch (error) {
        console.error('Error in loadComments:', error);
    }
};

const loadFacebookComments = () => {
    try {
        if (isSSR || !isMounted.value) return;

        const commentsContainer = document.getElementById('comments-container');
        if (!commentsContainer || !document.body.contains(commentsContainer)) {
            console.warn('Comments container not found or not attached to DOM');
            return;
        }

        commentsContainer.innerHTML = '';

        const commentsTitle = document.createElement('h3');
        commentsTitle.className = 'text-xl font-bold mb-4 text-neutral-800';
        commentsTitle.textContent = 'Comentários';
        commentsContainer.appendChild(commentsTitle);

        const fbCommentsDiv = document.createElement('div');
        fbCommentsDiv.className = 'fb-comments';
        fbCommentsDiv.setAttribute('data-href', pageUrl.value);
        fbCommentsDiv.setAttribute('data-width', '100%');
        fbCommentsDiv.setAttribute('data-numposts', '5');
        fbCommentsDiv.setAttribute('data-order-by', 'social');
        fbCommentsDiv.setAttribute('data-colorscheme', 'light');
        commentsContainer.appendChild(fbCommentsDiv);

        const facebookAppId = settings.value['blog.facebookAppId'];
        if (!facebookAppId) {
            console.error('Facebook App ID is not set.');
            return;
        }

        if (!window.FB) {
            if (!document.getElementById('facebook-jssdk')) {
                window.fbAsyncInit = function () {
                    FB.init({
                        appId: facebookAppId,
                        xfbml: true,
                        version: 'v16.0',
                    });
                    FB.XFBML.parse();
                };

                const script = document.createElement('script');
                script.id = 'facebook-jssdk';
                script.src = 'https://connect.facebook.net/pt_BR/sdk.js';
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
            }
        } else {
            FB.XFBML.parse();
        }
    } catch (error) {
        console.error('Error in loadFacebookComments:', error);
    }
};

const loadDisqusComments = () => {
    try {
        if (isSSR || !isMounted.value) return;

        const commentsContainer = document.getElementById('comments-container');
        if (!commentsContainer || !document.body.contains(commentsContainer)) {
            console.warn('Comments container not found or not attached to DOM for Disqus');
            return;
        }

        const disqusShortname = settings.value['blog.disqusShortname'];
        if (!disqusShortname) {
            console.error('Disqus shortname is not set');
            if (document.body.contains(commentsContainer)) {
                commentsContainer.innerHTML = '<p class="text-center text-red-500 py-4">O sistema de comentários do Disqus não está configurado corretamente.</p>';
            }
            return;
        }

        const commentsTitle = document.createElement('h3');
        commentsTitle.className = 'text-xl font-bold mb-4 text-neutral-800';
        commentsTitle.textContent = 'Comentários';
        if (!document.body.contains(commentsContainer)) return;
        commentsContainer.appendChild(commentsTitle);

        const disqusThread = document.createElement('div');
        disqusThread.id = 'disqus_thread';
        if (!document.body.contains(commentsContainer)) return;
        commentsContainer.appendChild(disqusThread);

        // Usar setTimeout para garantir que o Disqus seja carregado após o DOM ser atualizado
        setTimeout(() => {
            try {
                if (!isMounted.value || !document.body.contains(disqusThread)) return;

                window.disqus_config = function() {
                    this.page.url = pageUrl.value;
                    this.page.identifier = post.value?.id || post.value?.slug;
                    this.page.title = post.value?.title;
                };

                const script = document.createElement('script');
                script.src = `https://${disqusShortname}.disqus.com/embed.js`;
                script.setAttribute('data-timestamp', +new Date());

                // Verificar se o documento ainda está disponível
                const target = document.head || document.body;
                if (target) {
                    target.appendChild(script);
                }
            } catch (error) {
                console.error('Error loading Disqus:', error);
            }
        }, 100);
    } catch (error) {
        console.error('Error in loadDisqusComments:', error);
    }
};

const relatedPostsObserver = ref<HTMLElement | null>(null)
const commentsObserver = ref<HTMLElement | null>(null)
const relatedPostsLoaded = ref(false)
const commentsLoaded = ref(false)
const relatedPostsObserverInstance = ref<IntersectionObserver | null>(null)
const commentsObserverInstance = ref<IntersectionObserver | null>(null)

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
    isDesktop.value = window.innerWidth > 768;

    window.addEventListener('resize', () => {
        if (isMounted.value)
            isDesktop.value = window.innerWidth > 768;
    });

    window.addEventListener('scroll', handleScroll);
    setupLazyLoading();
    loadAdScripts();
});

onUnmounted(() => {
    isMounted.value = false;

    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', () => {
        isDesktop.value = window.innerWidth > 768;
    });

    if (relatedPostsObserverInstance.value) {
        relatedPostsObserverInstance.value.disconnect();
        relatedPostsObserverInstance.value = null;
    }

    if (commentsObserverInstance.value) {
        commentsObserverInstance.value.disconnect();
        commentsObserverInstance.value = null;
    }
});

const setupLazyLoading = () => {
    if (relatedPostsObserver.value) {
        relatedPostsObserverInstance.value = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !relatedPostsLoaded.value) {
                    if (document.body.contains(relatedPostsObserver.value)) {
                        loadRelatedPosts();
                    }
                }
            },
            {
                rootMargin: '200px',
                threshold: 0.1
            }
        );

        relatedPostsObserverInstance.value.observe(relatedPostsObserver.value);
    }

    if (commentsObserver.value) {
        commentsObserverInstance.value = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !commentsLoaded.value) {
                    if (document.body.contains(commentsObserver.value)) {
                        loadComments();
                        commentsLoaded.value = true;
                    }
                }
            },
            {
                rootMargin: '300px',
                threshold: 0.1
            }
        );

        commentsObserverInstance.value.observe(commentsObserver.value);
    }
};

const loadRelatedPosts = async () => {
    if (!document.body.contains(relatedPostsObserver.value))
        return;

    try {
        if (post.value && post.value.id) {
            const storePosts = postsStore.getPosts || [];

            if (storePosts.length > 0) {
                const filteredPosts = storePosts.filter(p => p.id !== post.value.id);

                if (filteredPosts.length > 0) {
                    if (document.body.contains(relatedPostsObserver.value))
                        relatedPosts.value = shuffleArray(filteredPosts).slice(0, 3);
                }
            }

            if (document.body.contains(relatedPostsObserver.value))
                relatedPostsLoaded.value = true;
        }
    } catch (error) {
        console.error('Error loading related posts:', error);
    }
};

// Load the AdSense script if enabled
const loadAdScripts = () => {
    if (adSettings.value.enableAds) {
        console.log('Loading ad scripts in PagePost. Ad settings:', {
            enableAds: adSettings.value.enableAds,
            enableAdSense: adSettings.value.enableAdSense,
            enableAdSenseAutoAds: adSettings.value.enableAdSenseAutoAds,
            adSenseSidebarLeft: adSettings.value.adSenseSidebarLeft
        });

        // Load AdSense if enabled
        if (adSettings.value.enableAdSense && adSettings.value.enableAdSenseAutoAds && adSettings.value.adSenseAutoAdsCode) {
            const existingScript = document.getElementById('adsense-script');
            if (!existingScript) {
                try {
                    const srcRegex = /src="([^"]+)"/;
                    const match = adSettings.value.adSenseAutoAdsCode.match(srcRegex);

                    if (match && match[1]) {
                        const scriptSrc = match[1];
                        const head = document.head;
                        const script = document.createElement('script');
                        script.id = 'adsense-script';
                        script.async = true;
                        script.src = scriptSrc;
                        script.crossOrigin = "anonymous";
                        head.appendChild(script);
                        console.log('AdSense script added to head:', scriptSrc);
                    } else {
                        console.error('Could not extract AdSense script URL from:', adSettings.value.adSenseAutoAdsCode);
                    }
                } catch (e) {
                    console.error('Error parsing AdSense code:', e);
                }
            }
        }

        // Insert sidebar left ad code directly into DOM
        if (adSettings.value.adSenseSidebarLeft && sidebarLeftAdContainer.value) {
            try {
                // Wait a bit for the DOM to be ready
                setTimeout(() => {
                    // Create a temporary div to parse the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = adSettings.value.adSenseSidebarLeft;

                    // Get the ins element
                    const insElement = tempDiv.querySelector('ins');
                    if (insElement) {
                        sidebarLeftAdContainer.value.appendChild(insElement);
                        console.log('Left sidebar ad inserted into DOM');

                        // Initialize AdSense for this specific ad
                        if (window.adsbygoogle) {
                            try {
                                window.adsbygoogle.push({});
                                console.log('AdSense push called for left sidebar ad');
                            } catch (e) {
                                console.error('Error initializing left sidebar ad:', e);
                            }
                        }
                    } else {
                        console.error('Could not find ins element in adSenseSidebarLeft HTML');
                    }
                }, 500);
            } catch (e) {
                console.error('Error inserting left sidebar ad:', e);
            }
        }

        // Initialize other AdSense ad units
        if (adSettings.value.enableAdSense && window.adsbygoogle) {
            setTimeout(() => {
                try {
                    console.log('Initializing AdSense ads in PagePost. Found adsbygoogle units:', document.querySelectorAll('.adsbygoogle').length);
                    document.querySelectorAll('.adsbygoogle').forEach((ad) => {
                        if (!ad.hasAttribute('data-adsbygoogle-status')) {
                            console.log('Pushing ad unit to AdSense:', ad);
                            (window.adsbygoogle = window.adsbygoogle || []).push({});
                        } else {
                            console.log('Ad unit already initialized:', ad.getAttribute('data-adsbygoogle-status'));
                        }
                    });
                } catch (e) {
                    console.error('AdSense initialization error:', e);
                }
            }, 300);
        }
    }
};

// Elements references
const sidebarLeftAdContainer = ref(null);
</script>

<style scoped>
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
    color: #666;
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

/* Twitter/X embed styles */
.post-content :deep(.twitter-embed) {
    margin: 1.5rem auto;
    max-width: 550px;
    position: relative;
    min-height: 200px;
}

.post-content :deep(.twitter-embed)::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231da1f2'%3E%3Cpath d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.2;
}

.post-content :deep(.twitter-embed iframe) {
    border: none !important;
    margin: 0 auto !important;
}

.featured-img {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    border-radius: 8px;
}

.post-title {
    word-wrap: break-word;
    hyphens: auto;
}

.tags-list {
    overflow-x: auto;
    padding-bottom: 4px;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ad-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    border-radius: 4px;
}

/* Only hide the left sidebar on screens smaller than 1280px */
@media (max-width: 1280px) {
    .ad-sidebar-left {
        display: none;
    }
}
</style>
