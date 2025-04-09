<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Settings</h1>
            <div class="flex space-x-3">
                <button @click="saveCurrentSection"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Changes
                </button>
            </div>
        </div>

        <!-- Settings Navigation -->
        <div class="bg-neutral-800 rounded-lg p-2 mb-6">
            <div class="flex overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    class="px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors duration-200 mx-1"
                    :class="activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-transparent text-neutral-300 hover:bg-neutral-700'">
                    {{ tab.name }}
                </button>
            </div>
        </div>

        <!-- Settings Sections -->
        <div class="bg-neutral-800 rounded-lg shadow-md">
            <!-- General Settings -->
            <div v-if="activeTab === 'general'" class="p-6 space-y-8">
                <div class="space-y-1 border-b border-neutral-700 pb-4">
                    <h2 class="text-lg font-medium text-white">General Settings</h2>
                    <p class="text-sm text-neutral-400">Configure the basic information about your site</p>
                </div>

                <div class="space-y-6">
                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Site Title</label>
                            <input v-model="settings.title" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="My Awesome Blog" />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Tagline</label>
                            <input v-model="settings.description" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Just another CMMV blog" />
                            <p class="text-xs text-neutral-500">In a few words, explain what this site is about.</p>
                        </div>
                    </div>

                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Admin Email</label>
                            <input v-model="settings.adminEmail" type="email"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="admin@example.com" />
                            <p class="text-xs text-neutral-500">This address is used for admin purposes.</p>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Site Language</label>
                            <select v-model="settings.language"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="en_US">English (United States)</option>
                                <option value="pt_BR">Portuguese (Brazil)</option>
                                <option value="es_ES">Spanish (Spain)</option>
                                <option value="fr_FR">French (France)</option>
                                <option value="de_DE">German (Germany)</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Site URL</label>
                        <input v-model="settings.url" type="text"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="https://example.com" />
                    </div>
                </div>
            </div>

            <!-- Appearance Tab -->
            <div v-if="activeTab === 'appearance'" class="p-6 space-y-8">
                <div class="space-y-1 border-b border-neutral-700 pb-4">
                    <h2 class="text-lg font-medium text-white">Appearance Settings</h2>
                    <p class="text-sm text-neutral-400">Configure how your site looks</p>
                </div>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Site Logo</label>
                        <div class="flex items-center space-x-4">
                            <div
                                class="w-16 h-16 bg-neutral-700 rounded-md flex items-center justify-center border border-neutral-600">
                                <img v-if="settings.logo" :src="settings.logo" alt="Site logo"
                                    class="max-w-full max-h-full p-1" />
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral-500"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="flex space-x-2">
                                <input type="file" ref="logoInput" accept="image/*" class="hidden"
                                    @change="handleLogoUpload" />
                                <button @click="$refs.logoInput.click()"
                                    class="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-md transition-colors">
                                    Select Logo
                                </button>
                                <button v-if="settings.logo" @click="removeLogo"
                                    class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <p class="text-xs text-neutral-500">Recommended size: 140x79px</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Favicon</label>
                        <div class="flex items-center space-x-4">
                            <div
                                class="w-10 h-10 bg-neutral-700 rounded-md flex items-center justify-center border border-neutral-600">
                                <img v-if="settings.favicon" :src="settings.favicon" alt="Favicon"
                                    class="max-w-full max-h-full p-1" />
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-neutral-500"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="flex space-x-2">
                                <input type="file" ref="faviconInput" accept=".ico,.png,image/x-icon,image/png"
                                    class="hidden" @change="handleFaviconUpload" />
                                <button @click="$refs.faviconInput.click()"
                                    class="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-md transition-colors">
                                    Select Favicon
                                </button>
                                <button v-if="settings.favicon" @click="removeFavicon"
                                    class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <p class="text-xs text-neutral-500">Recommended size: 16x16px (PNG, ICO)</p>
                    </div>
                </div>
            </div>

            <!-- Reading Tab -->
            <div v-if="activeTab === 'reading'" class="p-6 space-y-8">
                <div class="space-y-1 border-b border-neutral-700 pb-4">
                    <h2 class="text-lg font-medium text-white">Reading Settings</h2>
                    <p class="text-sm text-neutral-400">Configure how content is displayed</p>
                </div>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Homepage displays</label>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <input id="latest-posts" type="radio" value="latest_posts"
                                    v-model="settings.homepageDisplay"
                                    class="h-4 w-4 mr-2 text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="latest-posts" class="text-sm text-neutral-300">Latest posts</label>
                            </div>
                            <div class="flex items-center">
                                <input id="static-page" type="radio" value="static_page"
                                    v-model="settings.homepageDisplay"
                                    class="h-4 w-4 mr-2 text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="static-page" class="text-sm text-neutral-300">A static page</label>
                            </div>
                        </div>
                    </div>

                    <div v-if="settings.homepageDisplay === 'static_page'" class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Homepage</label>
                            <select v-model="settings.homepage"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="about">About Us</option>
                                <option value="home">Home</option>
                                <option value="welcome">Welcome</option>
                                <option value="landing">Landing Page</option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Posts page</label>
                            <select v-model="settings.postsPage"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="blog">Blog</option>
                                <option value="news">News</option>
                                <option value="articles">Articles</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Posts per page</label>
                            <input v-model="settings.postsperpage" type="number" min="1" max="50"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">RSS feed shows</label>
                            <input v-model="settings.rssFeedItems" type="number" min="1" max="50"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <p class="text-xs text-neutral-500">Number of items to display in RSS feed</p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">For each post in a feed, show</label>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <input id="show-full-text" type="radio" value="full_text" v-model="settings.feedContent"
                                    class="h-4 w-4 mr-2 text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="show-full-text" class="text-sm text-neutral-300">Full text</label>
                            </div>
                            <div class="flex items-center">
                                <input id="show-excerpt" type="radio" value="excerpt" v-model="settings.feedContent"
                                    class="h-4 w-4 mr-2 text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="show-excerpt" class="text-sm text-neutral-300">Excerpt</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Discussion Tab -->
            <div v-if="activeTab === 'discussion'" class="p-6 space-y-8">
                <div class="space-y-1 border-b border-neutral-700 pb-4">
                    <h2 class="text-lg font-medium text-white">Discussion Settings</h2>
                    <p class="text-sm text-neutral-400">Configure how visitors interact with your site</p>
                </div>

                <div class="space-y-6">
                    <div class="space-y-3">
                        <h3 class="text-base font-medium text-neutral-300">Default article settings</h3>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <input id="allow-comments" type="checkbox" v-model="settings.enablecomments"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="allow-comments" class="text-sm text-neutral-300">Allow people to submit
                                    comments on new posts</label>
                            </div>
                            <div class="flex items-center">
                                <input id="comment-approval" type="checkbox" v-model="settings.moderatecomments"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="comment-approval" class="text-sm text-neutral-300">Comment must be manually
                                    approved</label>
                            </div>
                            <div class="flex items-center">
                                <input id="require-name-email" type="checkbox" v-model="settings.requireNameEmail"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="require-name-email" class="text-sm text-neutral-300">Comment author must
                                    fill out name and email</label>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <h3 class="text-base font-medium text-neutral-300">Other comment settings</h3>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <input id="nested-comments" type="checkbox" v-model="settings.nestedComments"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="nested-comments" class="text-sm text-neutral-300">Enable threaded (nested)
                                    comments</label>
                            </div>
                            <div class="flex items-center">
                                <input id="comment-pagination" type="checkbox" v-model="settings.commentPagination"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="comment-pagination" class="text-sm text-neutral-300">Break comments into
                                    pages</label>
                            </div>
                        </div>
                    </div>

                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Comments per page</label>
                            <input v-model="settings.commentsPerPage" type="number" min="1" max="100"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <p class="text-xs text-neutral-500">Only if comment pagination is enabled</p>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Email notifications</label>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <input id="email-me-comments" type="checkbox" v-model="settings.emailOnComment"
                                        class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                    <label for="email-me-comments" class="text-sm text-neutral-300">Email me whenever
                                        anyone posts a comment</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="email-me-moderation" type="checkbox" v-model="settings.emailOnModeration"
                                        class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                    <label for="email-me-moderation" class="text-sm text-neutral-300">Email me whenever
                                        a comment is held for moderation</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Social Tab -->
            <div v-if="activeTab === 'social'" class="p-6 space-y-8">
                <div class="space-y-1 border-b border-neutral-700 pb-4">
                    <h2 class="text-lg font-medium text-white">Social Media Settings</h2>
                    <p class="text-sm text-neutral-400">Configure your social media links</p>
                </div>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Facebook</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://facebook.com/</span>
                            <input v-model="settings.facebook" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Twitter</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://twitter.com/</span>
                            <input v-model="settings.twitter" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Instagram</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://instagram.com/</span>
                            <input v-model="settings.instagram" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">LinkedIn</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://linkedin.com/in/</span>
                            <input v-model="settings.linkedin" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">YouTube</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://youtube.com/c/</span>
                            <input v-model="settings.youtube" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourchannel" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">GitHub</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://github.com/</span>
                            <input v-model="settings.github" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- SEO Tab -->
            <div v-if="activeTab === 'seo'" class="p-6 space-y-8">
                <div class="space-y-1 border-b border-neutral-700 pb-4">
                    <h2 class="text-lg font-medium text-white">SEO Settings</h2>
                    <p class="text-sm text-neutral-400">Configure search engine optimization settings</p>
                </div>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Default Meta Description</label>
                        <textarea v-model="settings.metaDescription" rows="3"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Brief description of your site for search engines"></textarea>
                        <p class="text-xs text-neutral-500">Used when no specific description is provided for a page or
                            post. Aim for 150-160 characters.</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Default Keywords</label>
                        <input v-model="settings.metaKeywords" type="text"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="keyword1, keyword2, keyword3" />
                        <p class="text-xs text-neutral-500">Comma-separated keywords used when no specific keywords are
                            provided.</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Default Featured Image</label>
                        <div class="flex items-center space-x-4">
                            <div
                                class="w-32 h-20 bg-neutral-700 rounded-md flex items-center justify-center border border-neutral-600 overflow-hidden">
                                <img v-if="settings.defaultFeaturedImage" :src="settings.defaultFeaturedImage"
                                    alt="Default featured image" class="object-cover w-full h-full" />
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-neutral-500"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="flex space-x-2">
                                <input type="file" ref="featuredImageInput" accept="image/*" class="hidden"
                                    @change="handleDefaultFeaturedImageUpload" />
                                <button @click="$refs.featuredImageInput.click()"
                                    class="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-md transition-colors">
                                    Select Image
                                </button>
                                <button v-if="settings.defaultFeaturedImage" @click="removeDefaultFeaturedImage"
                                    class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <p class="text-xs text-neutral-500">Used when a post or page doesn't have a featured image.
                            Recommended size: 1200x630px for social sharing.</p>
                    </div>
                </div>
            </div>

            <!-- Advanced Tab -->
            <div v-if="activeTab === 'advanced'" class="p-6 space-y-8">
                <div class="space-y-1 border-b border-neutral-700 pb-4">
                    <h2 class="text-lg font-medium text-white">Advanced Settings</h2>
                    <p class="text-sm text-neutral-400">Configure advanced options for your site</p>
                </div>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Analytics Code</label>
                        <textarea v-model="settings.analyticsCode" rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="<!-- Google Analytics or other tracking code -->"></textarea>
                        <p class="text-xs text-neutral-500">Paste your Google Analytics, Tag Manager or other tracking
                            code.</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Custom CSS</label>
                        <textarea v-model="settings.customCss" rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="/* Add your custom CSS here */"></textarea>
                        <p class="text-xs text-neutral-500">Add custom CSS to your site. This will be included in the
                            header.</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Custom JavaScript</label>
                        <textarea v-model="settings.customJs" rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="/* Add your custom JavaScript here */"></textarea>
                        <p class="text-xs text-neutral-500">Add custom JavaScript to your site. This will be included in
                            the footer.</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Robots.txt Content</label>
                        <textarea v-model="settings.robotsTxt" rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="User-agent: *&#10;Allow: /"></textarea>
                        <p class="text-xs text-neutral-500">Customize your robots.txt file to control search engine
                            indexing.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast notifications -->
    <div v-if="notification.show" class="fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg flex items-center z-50"
        :class="notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
        <span v-if="notification.type === 'success'" class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
            </svg>
        </span>
        <span v-else class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
            </svg>
        </span>
        <span>{{ notification.message }}</span>
        <button @click="notification.show = false" class="ml-4 text-white hover:text-neutral-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminClient } from '@cmmv/blog/admin/client'

const adminClient = useAdminClient()

const tabs = [
    { id: 'general', name: 'General' },
    { id: 'appearance', name: 'Appearance' },
    { id: 'reading', name: 'Reading' },
    { id: 'discussion', name: 'Discussion' },
    { id: 'social', name: 'Social Media' },
    { id: 'seo', name: 'SEO' },
    { id: 'advanced', name: 'Advanced' },
]
const activeTab = ref('general')
const isLoading = ref(true)
const originalSettings = ref([])

const settings = ref({
    // General
    title: '',
    description: '',
    url: '',
    language: 'en',
    timezone: 'UTC',
    adminEmail: '',

    // Appearance
    logo: '',
    favicon: '',
    primaryColor: '#3490dc',
    secondaryColor: '#38c172',
    fontFamily: 'sans-serif',

    // Reading
    homepageDisplay: 'latest_posts',
    homepage: 'home',
    postsPage: 'blog',
    postsperpage: 10,
    rssFeedItems: 10,
    feedContent: 'full_text',

    // Discussion
    enablecomments: true,
    moderatecomments: true,
    requireNameEmail: true,
    nestedComments: true,
    commentPagination: false,
    commentsPerPage: 50,
    emailOnComment: true,
    emailOnModeration: true,

    // Social
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    github: '',

    // SEO
    metaDescription: '',
    metaKeywords: '',
    defaultFeaturedImage: '',

    // Advanced
    analyticsCode: '',
    customCss: '',
    customJs: '',
    robotsTxt: 'User-agent: *\nAllow: /'
})

const tabFieldMap = {
    general: ['title', 'description', 'url', 'language', 'timezone', 'adminEmail'],
    appearance: ['logo', 'favicon', 'primaryColor', 'secondaryColor', 'fontFamily'],
    reading: ['homepageDisplay', 'homepage', 'postsPage', 'postsperpage', 'rssFeedItems', 'feedContent'],
    discussion: ['enablecomments', 'moderatecomments', 'requireNameEmail', 'nestedComments',
        'commentPagination', 'commentsPerPage', 'emailOnComment', 'emailOnModeration'],
    social: ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'github'],
    seo: ['metaDescription', 'metaKeywords', 'defaultFeaturedImage'],
    advanced: ['analyticsCode', 'customCss', 'customJs', 'robotsTxt']
}

const mapApiSettingsToForm = (apiSettings) => {
    originalSettings.value = apiSettings

    apiSettings.forEach(setting => {
        const { key, value, type } = setting

        if (!key.startsWith('blog.')) return

        const fieldName = key.replace('blog.', '')

        if (fieldName in settings.value) {
            let convertedValue = value

            if (type === 'boolean') {
                convertedValue = value === '1' || value === 'true'
            } else if (type === 'number') {
                convertedValue = parseInt(value, 10)
            }

            settings.value[fieldName] = convertedValue
        }
    })
}

const mapFormToApiSettings = () => {
    const apiSettings = [...originalSettings.value]

    const settingsMap = new Map()
    apiSettings.forEach((setting, index) => {
        settingsMap.set(setting.key, { value: setting.value, index })
    })

    for (const field in settings.value) {
        const key = `blog.${field}`
        const value = settings.value[field]

        let type = typeof value
        if (type === 'number') {
            type = 'number'
        } else if (type === 'boolean') {
            type = 'boolean'
        } else {
            type = 'string'
        }

        let apiValue = value
        if (type === 'boolean') {
            apiValue = value ? '1' : '0'
        } else if (value !== null && value !== undefined) {
            apiValue = String(value)
        }

        if (settingsMap.has(key)) {
            const { index } = settingsMap.get(key)
            apiSettings[index].value = apiValue
        }
        else if (value !== null && value !== undefined && value !== '') {
            apiSettings.push({
                group: 'blog',
                key,
                value: apiValue,
                type,
                flags: ['PUBLIC']
            })
        }
    }

    return apiSettings
}

const loadSettings = async () => {
    try {
        isLoading.value = true
        const apiSettings = await adminClient.settings.getRoot()
        mapApiSettingsToForm(apiSettings)
    } catch (error) {
        console.error('Failed to load settings:', error)
    } finally {
        isLoading.value = false
    }
}

const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

const showNotification = (type, message) => {
    notification.value = {
        show: true,
        type,
        message,
        duration: 3000
    }

    setTimeout(() => {
        notification.value.show = false
    }, notification.value.duration)
}

const saveCurrentSection = async () => {
    try {
        const apiSettings = mapFormToApiSettings()
        await adminClient.settings.update(apiSettings)
        showNotification('success', 'Settings saved successfully!')
    } catch (error) {
        console.error('Failed to save settings:', error)
        showNotification('error', 'Failed to save settings: ' + (error.message || 'Unknown error'))
    }
}

const logoInput = ref(null)
const faviconInput = ref(null)
const imageLoading = ref(false)

const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = maxWidth
                canvas.height = maxHeight
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, maxWidth, maxHeight)

                const dataUrl = canvas.toDataURL(file.type)
                resolve(dataUrl)
            }
        }
    })
}

const uploadImage = async (base64Image) => {
    try {
        const response = await adminClient.medias.processImage({
            image: base64Image
        })

        return response.url
    } catch (error) {
        console.error('Failed to upload image:', error)
        showNotification('error', 'Failed to upload image: ' + (error.message || 'Unknown error'))
        return null
    }
}

const handleLogoUpload = async (event) => {
    if (!event.target.files || !event.target.files[0]) return

    try {
        imageLoading.value = true
        const file = event.target.files[0]

        // Resize to 140x79
        const resizedImage = await resizeImage(file, 140, 79)

        // Upload to server
        const imageUrl = await uploadImage(resizedImage)

        if (imageUrl) {
            settings.value.logo = imageUrl
            showNotification('success', 'Logo uploaded successfully!')
        }
    } catch (error) {
        console.error('Error processing logo:', error)
        showNotification('error', 'Failed to process logo: ' + (error.message || 'Unknown error'))
    } finally {
        imageLoading.value = false
        // Clear the input
        event.target.value = ''
    }
}

const handleFaviconUpload = async (event) => {
    if (!event.target.files || !event.target.files[0]) return

    try {
        imageLoading.value = true
        const file = event.target.files[0]

        // Check if it's a valid file type
        if (!file.type.match(/image\/(png|x-icon)/) && !file.name.endsWith('.ico')) {
            showNotification('error', 'Invalid file type. Please select a PNG or ICO file.')
            return
        }

        // Resize to 16x16
        const resizedImage = await resizeImage(file, 16, 16)

        // Upload to server
        const imageUrl = await uploadImage(resizedImage)

        if (imageUrl) {
            settings.value.favicon = imageUrl
            showNotification('success', 'Favicon uploaded successfully!')
        }
    } catch (error) {
        console.error('Error processing favicon:', error)
        showNotification('error', 'Failed to process favicon: ' + (error.message || 'Unknown error'))
    } finally {
        imageLoading.value = false
        // Clear the input
        event.target.value = ''
    }
}

const removeLogo = () => {
    settings.value.logo = ''
    showNotification('success', 'Logo removed')
}

const removeFavicon = () => {
    settings.value.favicon = ''
    showNotification('success', 'Favicon removed')
}

const featuredImageInput = ref(null)

const handleDefaultFeaturedImageUpload = async (event) => {
    if (!event.target.files || !event.target.files[0]) return

    try {
        imageLoading.value = true
        const file = event.target.files[0]

        // We'll maintain aspect ratio but limit width to 1200px for optimal sharing
        const img = new Image()
        img.src = URL.createObjectURL(file)

        await new Promise(resolve => {
            img.onload = resolve
        })

        // Calculate proportional height (maintaining aspect ratio)
        const aspectRatio = img.height / img.width
        const targetWidth = 1200
        const targetHeight = Math.round(targetWidth * aspectRatio)

        // Resize the image
        const resizedImage = await resizeImage(file, targetWidth, targetHeight)

        // Upload to server
        const imageUrl = await uploadImage(resizedImage)

        if (imageUrl) {
            settings.value.defaultFeaturedImage = imageUrl
            showNotification('success', 'Default featured image uploaded successfully!')
        }
    } catch (error) {
        console.error('Error processing default featured image:', error)
        showNotification('error', 'Failed to process image: ' + (error.message || 'Unknown error'))
    } finally {
        imageLoading.value = false
        // Clear the input
        event.target.value = ''
    }
}

const removeDefaultFeaturedImage = () => {
    settings.value.defaultFeaturedImage = ''
    showNotification('success', 'Default featured image removed')
}

onMounted(() => {
    loadSettings()
})
</script>
