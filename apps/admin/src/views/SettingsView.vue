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
                            <input v-model="settings.general.siteTitle" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="My Awesome Blog" />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Tagline</label>
                            <input v-model="settings.general.tagline" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Just another CMMV blog" />
                            <p class="text-xs text-neutral-500">In a few words, explain what this site is about.</p>
                        </div>
                    </div>

                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Admin Email</label>
                            <input v-model="settings.general.adminEmail" type="email"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="admin@example.com" />
                            <p class="text-xs text-neutral-500">This address is used for admin purposes.</p>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Site Language</label>
                            <select v-model="settings.general.language"
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
                        <input v-model="settings.general.siteUrl" type="text"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="https://example.com" />
                    </div>

                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Default Category</label>
                            <select v-model="settings.general.defaultCategory"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="uncategorized">Uncategorized</option>
                                <option value="news">News</option>
                                <option value="technology">Technology</option>
                                <option value="design">Design</option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Default Post Format</label>
                            <select v-model="settings.general.defaultPostFormat"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="standard">Standard</option>
                                <option value="aside">Aside</option>
                                <option value="gallery">Gallery</option>
                                <option value="link">Link</option>
                                <option value="quote">Quote</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
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
                                <img v-if="settings.appearance.logo" :src="settings.appearance.logo" alt="Site logo"
                                    class="max-w-full max-h-full p-1" />
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral-500"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="flex space-x-2">
                                <button
                                    class="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-md transition-colors">
                                    Select Logo
                                </button>
                                <button v-if="settings.appearance.logo"
                                    class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <p class="text-xs text-neutral-500">Recommended size: 300x100px</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Favicon</label>
                        <div class="flex items-center space-x-4">
                            <div
                                class="w-10 h-10 bg-neutral-700 rounded-md flex items-center justify-center border border-neutral-600">
                                <img v-if="settings.appearance.favicon" :src="settings.appearance.favicon" alt="Favicon"
                                    class="max-w-full max-h-full p-1" />
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-neutral-500"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="flex space-x-2">
                                <button
                                    class="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-md transition-colors">
                                    Select Favicon
                                </button>
                                <button v-if="settings.appearance.favicon"
                                    class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <p class="text-xs text-neutral-500">Recommended size: 32x32px (PNG, ICO)</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Primary Color</label>
                        <div class="flex items-center space-x-3">
                            <input v-model="settings.appearance.primaryColor" type="color"
                                class="w-10 h-10 p-0 border-0 rounded bg-transparent cursor-pointer" />
                            <input v-model="settings.appearance.primaryColor" type="text"
                                class="w-32 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="#3490dc" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Secondary Color</label>
                        <div class="flex items-center space-x-3">
                            <input v-model="settings.appearance.secondaryColor" type="color"
                                class="w-10 h-10 p-0 border-0 rounded bg-transparent cursor-pointer" />
                            <input v-model="settings.appearance.secondaryColor" type="text"
                                class="w-32 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="#38c172" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Font Family</label>
                        <select v-model="settings.appearance.fontFamily"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="sans-serif">Sans-serif (system default)</option>
                            <option value="serif">Serif (system default)</option>
                            <option value="monospace">Monospace (system default)</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Lato">Lato</option>
                            <option value="Poppins">Poppins</option>
                        </select>
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
                                    v-model="settings.reading.homepageDisplay"
                                    class="h-4 w-4 mr-2 text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="latest-posts" class="text-sm text-neutral-300">Latest posts</label>
                            </div>
                            <div class="flex items-center">
                                <input id="static-page" type="radio" value="static_page"
                                    v-model="settings.reading.homepageDisplay"
                                    class="h-4 w-4 mr-2 text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="static-page" class="text-sm text-neutral-300">A static page</label>
                            </div>
                        </div>
                    </div>

                    <div v-if="settings.reading.homepageDisplay === 'static_page'" class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Homepage</label>
                            <select v-model="settings.reading.homepage"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="about">About Us</option>
                                <option value="home">Home</option>
                                <option value="welcome">Welcome</option>
                                <option value="landing">Landing Page</option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Posts page</label>
                            <select v-model="settings.reading.postsPage"
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
                            <input v-model="settings.reading.postsPerPage" type="number" min="1" max="50"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">RSS feed shows</label>
                            <input v-model="settings.reading.rssFeedItems" type="number" min="1" max="50"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <p class="text-xs text-neutral-500">Number of items to display in RSS feed</p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">For each post in a feed, show</label>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <input id="show-full-text" type="radio" value="full_text"
                                    v-model="settings.reading.feedContent"
                                    class="h-4 w-4 mr-2 text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="show-full-text" class="text-sm text-neutral-300">Full text</label>
                            </div>
                            <div class="flex items-center">
                                <input id="show-excerpt" type="radio" value="excerpt"
                                    v-model="settings.reading.feedContent"
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
                                <input id="allow-comments" type="checkbox" v-model="settings.discussion.allowComments"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="allow-comments" class="text-sm text-neutral-300">Allow people to submit
                                    comments on new posts</label>
                            </div>
                            <div class="flex items-center">
                                <input id="comment-approval" type="checkbox"
                                    v-model="settings.discussion.commentApproval"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="comment-approval" class="text-sm text-neutral-300">Comment must be manually
                                    approved</label>
                            </div>
                            <div class="flex items-center">
                                <input id="require-name-email" type="checkbox"
                                    v-model="settings.discussion.requireNameEmail"
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
                                <input id="nested-comments" type="checkbox" v-model="settings.discussion.nestedComments"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="nested-comments" class="text-sm text-neutral-300">Enable threaded (nested)
                                    comments</label>
                            </div>
                            <div class="flex items-center">
                                <input id="comment-pagination" type="checkbox"
                                    v-model="settings.discussion.commentPagination"
                                    class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                <label for="comment-pagination" class="text-sm text-neutral-300">Break comments into
                                    pages</label>
                            </div>
                        </div>
                    </div>

                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Comments per page</label>
                            <input v-model="settings.discussion.commentsPerPage" type="number" min="1" max="100"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <p class="text-xs text-neutral-500">Only if comment pagination is enabled</p>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-neutral-300">Email notifications</label>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <input id="email-me-comments" type="checkbox"
                                        v-model="settings.discussion.emailOnComment"
                                        class="h-4 w-4 mr-2 rounded text-blue-600 bg-neutral-700 border-neutral-600 focus:ring-blue-500" />
                                    <label for="email-me-comments" class="text-sm text-neutral-300">Email me whenever
                                        anyone posts a comment</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="email-me-moderation" type="checkbox"
                                        v-model="settings.discussion.emailOnModeration"
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
                            <input v-model="settings.social.facebook" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Twitter</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://twitter.com/</span>
                            <input v-model="settings.social.twitter" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Instagram</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://instagram.com/</span>
                            <input v-model="settings.social.instagram" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">LinkedIn</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://linkedin.com/in/</span>
                            <input v-model="settings.social.linkedin" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">YouTube</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://youtube.com/c/</span>
                            <input v-model="settings.social.youtube" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourchannel" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">GitHub</label>
                        <div class="flex items-center">
                            <span
                                class="bg-neutral-700 rounded-l-md border border-neutral-600 px-3 py-2 text-neutral-400">https://github.com/</span>
                            <input v-model="settings.social.github" type="text"
                                class="flex-1 rounded-none rounded-r-md bg-neutral-700 border border-l-0 border-neutral-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="yourusername" />
                        </div>
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
                        <textarea v-model="settings.advanced.analyticsCode" rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="<!-- Google Analytics or other tracking code -->"></textarea>
                        <p class="text-xs text-neutral-500">Paste your Google Analytics, Tag Manager or other tracking
                            code.</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Custom CSS</label>
                        <textarea v-model="settings.advanced.customCss" rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="/* Add your custom CSS here */"></textarea>
                        <p class="text-xs text-neutral-500">Add custom CSS to your site. This will be included in the
                            header.</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Custom JavaScript</label>
                        <textarea v-model="settings.advanced.customJs" rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="/* Add your custom JavaScript here */"></textarea>
                        <p class="text-xs text-neutral-500">Add custom JavaScript to your site. This will be included in
                            the footer.</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-neutral-300">Robots.txt Content</label>
                        <textarea v-model="settings.advanced.robotsTxt" rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="User-agent: *&#10;Allow: /"></textarea>
                        <p class="text-xs text-neutral-500">Customize your robots.txt file to control search engine
                            indexing.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminClient } from '@cmmv/blog/admin/client'

const adminClient = useAdminClient()

adminClient.getSettings().then((settings) => {
    console.log(settings)
})

// Tabs
const tabs = [
    { id: 'general', name: 'General' },
    { id: 'appearance', name: 'Appearance' },
    { id: 'reading', name: 'Reading' },
    { id: 'discussion', name: 'Discussion' },
    { id: 'social', name: 'Social Media' },
    { id: 'advanced', name: 'Advanced' },
]
const activeTab = ref('general')

// Settings data structure with default values
const settings = ref({
    general: {
        siteTitle: 'CMMV Blog',
        tagline: 'Just another awesome blog',
        adminEmail: 'admin@example.com',
        language: 'en_US',
        siteUrl: 'https://example.com',
        defaultCategory: 'uncategorized',
        defaultPostFormat: 'standard'
    },
    appearance: {
        logo: '',
        favicon: '',
        primaryColor: '#3490dc',
        secondaryColor: '#38c172',
        fontFamily: 'sans-serif'
    },
    reading: {
        homepageDisplay: 'latest_posts',
        homepage: 'home',
        postsPage: 'blog',
        postsPerPage: 10,
        rssFeedItems: 10,
        feedContent: 'full_text'
    },
    discussion: {
        allowComments: true,
        commentApproval: true,
        requireNameEmail: true,
        nestedComments: true,
        commentPagination: false,
        commentsPerPage: 50,
        emailOnComment: true,
        emailOnModeration: true
    },
    social: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        github: ''
    },
    advanced: {
        analyticsCode: '',
        customCss: '',
        customJs: '',
        robotsTxt: 'User-agent: *\nAllow: /'
    }
})

// Function to save the current section
function saveCurrentSection() {
    const sectionToSave = activeTab.value

    console.log(`Saving ${sectionToSave} settings:`, settings.value[sectionToSave])

    // Display a success toast or notification
    alert(`Settings saved successfully!`)
}
</script>