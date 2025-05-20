<template>
    <div class="flex h-screen bg-neutral-900 text-white overflow-hidden">

        <!-- Main Editor Area -->
        <div class="flex-1 flex flex-col h-screen overflow-hidden" :class="{ 'mr-80': sidebarOpen }">
            <!-- Top Toolbar -->
            <div class="bg-neutral-900 border-b border-neutral-900 p-2 flex justify-between items-center">
                <div class="flex items-center space-x-4">
                    <a href="/posts" class="text-neutral-400 hover:text-white">
                        <i class="fas fa-arrow-left h-6 w-6"></i>
                    </a>
                    <div class="flex items-center">
                        <div class="relative">
                            <div class="h-3 w-3 rounded-full bg-yellow-500 absolute -top-1 -right-1"
                                v-if="postStatus === 'draft'"></div>
                            <div class="h-3 w-3 rounded-full bg-green-500 absolute -top-1 -right-1"
                                v-else-if="postStatus === 'published'"></div>
                            <span class="text-sm font-medium">{{ postStatusText }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-3">
                    <button v-if="postStatus !== 'published'" @click="saveDraft"
                        class="px-3 py-1.5 rounded-md text-sm font-medium border border-neutral-600 hover:border-neutral-500 transition-colors cursor-pointer">
                        {{ postStatus === 'cron' ? 'Save' : 'Save Draft' }}
                    </button>
                    <button
                        @click="showAIGenerateDialog = true"
                        class="px-3 py-1.5 rounded-md text-sm font-medium border border-neutral-600 hover:border-neutral-500 transition-colors cursor-pointer flex items-center"
                        title="Generate content from URL using AI">
                        <i class="fas fa-robot mr-1.5"></i>
                        AI Generate
                    </button>
                    <button
                        v-if="post.id"
                        @click="viewPost(post.id)"
                        class="px-3 py-1.5 rounded-md text-sm font-medium border border-neutral-600 hover:border-neutral-500 transition-colors cursor-pointer">
                        Preview
                    </button>
                    <button
                        class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center"
                        :class="isFeatureImageUnprocessed() && postStatus !== 'published' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'"
                        @click="confirmPublish">
                        <template v-if="isFeatureImageUnprocessed() && postStatus !== 'published'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Publicar
                        </template>
                        <template v-else>
                            {{ postStatus === 'published' ? 'Update' : 'Publish' }}
                        </template>
                    </button>
                    <button @click="toggleSidebar" class="ml-2 text-neutral-400 hover:text-white p-1 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="bg-white border-b border-neutral-200 py-1 px-3 flex flex-wrap items-center justify-center space-x-0.5 sticky top-0 z-10 shadow-sm">
                <div class="flex items-center mr-1.5 border-r border-neutral-200 pr-1.5">
                    <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                        :class="{ 'bg-neutral-100': editor.isActive('heading', { level: 1 }) }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Heading 1">
                        <span class="font-bold text-neutral-600 text-sm">H1</span>
                    </button>
                    <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                        :class="{ 'bg-neutral-100': editor.isActive('heading', { level: 2 }) }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Heading 2">
                        <span class="font-bold text-neutral-600 text-sm">H2</span>
                    </button>
                    <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                        :class="{ 'bg-neutral-100': editor.isActive('heading', { level: 3 }) }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Heading 3">
                        <span class="font-bold text-neutral-600 text-sm">H3</span>
                    </button>
                </div>

                <div class="flex items-center mr-1.5 border-r border-neutral-200 pr-1.5">
                    <button @click="editor.chain().focus().toggleBold().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('bold') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Bold">
                        <i class="fas fa-bold text-neutral-600"></i>
                    </button>
                    <button @click="editor.chain().focus().toggleItalic().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('italic') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Italic">
                        <i class="fas fa-italic text-neutral-600"></i>
                    </button>
                    <button @click="setLink"
                        :class="{ 'bg-neutral-100': editor.isActive('link') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Link">
                        <i class="fas fa-link h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                </div>

                <div class="flex items-center mr-1.5 border-r border-neutral-200 pr-1.5">
                    <button @click="editor.chain().focus().toggleBulletList().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('bulletList') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Bullet List">
                        <i class="fas fa-list-ul h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="editor.chain().focus().toggleOrderedList().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('orderedList') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Numbered List">
                        <i class="fas fa-list-ol h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                </div>

                <div class="flex items-center mr-1.5 border-r border-neutral-200 pr-1.5">
                    <button @click="editor.chain().focus().toggleCodeBlock().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('codeBlock') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Code Block">
                        <i class="fas fa-terminal h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="insertHtmlCode"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="HTML Code">
                        <i class="fas fa-tags h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                </div>

                <!-- Adicionando botões de alinhamento de texto -->
                <div class="flex items-center mr-1.5 border-r border-neutral-200 pr-1.5">
                    <button @click="editor.chain().focus().setTextAlign('left').run()"
                        :class="{ 'bg-neutral-100': editor.isActive({ textAlign: 'left' }) }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Align Left">
                        <i class="fas fa-align-left h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="editor.chain().focus().setTextAlign('center').run()"
                        :class="{ 'bg-neutral-100': editor.isActive({ textAlign: 'center' }) }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Align Center">
                        <i class="fas fa-align-center h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="editor.chain().focus().setTextAlign('right').run()"
                        :class="{ 'bg-neutral-100': editor.isActive({ textAlign: 'right' }) }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Align Right">
                        <i class="fas fa-align-right h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="editor.chain().focus().setTextAlign('justify').run()"
                        :class="{ 'bg-neutral-100': editor.isActive({ textAlign: 'justify' }) }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Justify">
                        <i class="fas fa-align-justify h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                </div>

                <div class="flex items-center">
                    <button @click="insertYouTubeVideo"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="YouTube Video">
                        <i class="fab fa-youtube h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="insertImage"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Image">
                        <i class="fas fa-image h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="insertAudio"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Audio">
                        <i class="fas fa-headphones h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="insertTable"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Table">
                        <i class="fas fa-table h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="insertTweet"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Twitter/X Tweet">
                        <i class="fab fa-twitter h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                    <button @click="insertReddit"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Reddit Post">
                        <i class="fab fa-reddit h-3.5 w-3.5 text-neutral-600"></i>
                    </button>
                </div>
            </div>

            <!-- Editor Area -->
            <div class="flex overflow-y-auto px-6 py-8 justify-center bg-neutral-200">
                <div class="w-full max-w-3xl mb-20">
                    <!-- Paper-like editor container -->
                    <div class="bg-white text-neutral-900 rounded-lg shadow-xs overflow-hidden pb-40 mb-10">
                        <!-- Title input - now part of the paper -->
                        <div class="px-8 pt-4 pb-4">
                            <textarea
                                v-model="post.title"
                                placeholder="Post title"
                                @input="autoResizeTitle"
                                ref="titleTextarea"
                                rows="1"
                                class="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-neutral-400 resize-none overflow-hidden min-h-[32px]"
                            ></textarea>
                        </div>

                        <!-- Divider -->
                        <div class="border-b border-neutral-200"></div>

                        <!-- Editor content -->
                        <div class="px-8 py-6">
                            <editor-content :editor="editor" class="prose prose-neutral max-w-none" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Floating menu will be injected by TipTap -->
        </div>

        <!-- Settings Sidebar -->
        <div class="fixed right-0 top-0 bottom-0 w-80 bg-neutral-900 border-l border-neutral-700 overflow-y-auto transition-transform duration-300"
            :class="{ 'translate-x-0': sidebarOpen, 'translate-x-full': !sidebarOpen }">
            <div class="p-4 border-b border-neutral-700 flex justify-between items-center">
                <h2 class="text-lg font-medium">Post settings</h2>
                <button @click="toggleSidebar" class="text-neutral-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Accordion Sidebar -->
            <div class="divide-y divide-neutral-700">
                <!-- Basic Info Accordion -->
                <div class="border-b border-neutral-700">
                    <button @click="expandedSections.basic = !expandedSections.basic"
                        class="flex items-center justify-between w-full p-4 text-left text-neutral-200 font-medium">
                        <span>Basic Info</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200"
                            :class="expandedSections.basic ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-show="expandedSections.basic" class="p-4 pt-0 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">URL Slug</label>
                            <input v-model="post.slug" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <p class="mt-1 text-xs text-neutral-500">{{ websiteUrl }}/post/{{ post.slug || 'post-slug'
                                }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Excerpt</label>
                            <textarea v-model="post.excerpt" rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Brief description of your post"></textarea>
                            <p class="mt-1 text-xs text-neutral-500">Max 140 characters</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Authors</label>
                            <div v-if="loadingAuthors" class="text-sm text-neutral-400">Loading authors...</div>
                            <div v-else class="space-y-3">
                                <div>
                                    <label class="text-xs text-neutral-400 mb-1 block">Main Author</label>
                                    <select v-model="post.author" class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option v-for="author in authors" :key="author.user" :value="author.user">
                                            {{ author.name }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-neutral-400 mb-1 mt-4">Push Notification</label>
                                    <div>
                                        <input id="pushNotification" type="checkbox" :value="post.pushNotification"
                                            v-model="post.pushNotification"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700" />
                                        <label for="pushNotification" class="ml-2 text-sm text-neutral-300">
                                            Send push notification
                                        </label>
                                    </div>

                                    <div class="mt-4">
                                        <label class="block text-sm font-medium text-neutral-400 mb-1">Publishing</label>
                                        <div class="space-y-2">
                                            <div class="flex items-center">
                                                <label class="inline-flex items-center">
                                                    <input type="radio" v-model="post.status" value="draft"
                                                        class="rounded-full bg-neutral-700 border-neutral-600 text-blue-600" />
                                                    <span class="ml-2 text-sm">Draft</span>
                                                </label>
                                            </div>
                                            <div class="flex items-center">
                                                <label class="inline-flex items-center">
                                                    <input type="radio" v-model="post.status" value="published"
                                                        class="rounded-full bg-neutral-700 border-neutral-600 text-blue-600" />
                                                    <span class="ml-2 text-sm">Published</span>
                                                </label>
                                            </div>
                                            <div class="flex items-center">
                                                <label class="inline-flex items-center">
                                                    <input type="radio" v-model="post.status" value="cron"
                                                        class="rounded-full bg-neutral-700 border-neutral-600 text-blue-600" />
                                                    <span class="ml-2 text-sm">Scheduled</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="post.status === 'cron'">
                                        <label class="block text-sm font-medium text-neutral-400 mb-1">Schedule for</label>
                                        <input v-model="scheduleDate" type="datetime-local"
                                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        
                                        <!-- Time adjustment buttons grid -->
                                        <div class="grid grid-cols-4 gap-1 mt-2">
                                            <button
                                                @click="subtractOneHourFromSchedule"
                                                class="px-2 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center bg-red-600 hover:bg-red-700 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                                                </svg>
                                                1h
                                            </button>
                                            <button
                                                @click="subtractThirtyMinutesFromSchedule"
                                                class="px-2 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                                                </svg>
                                                30m
                                            </button>
                                            <button
                                                @click="addThirtyMinutesToSchedule"
                                                class="px-2 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                                30m
                                            </button>
                                            <button
                                                @click="addOneHourToSchedule"
                                                class="px-2 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                                1h
                                            </button>
                                        </div>
                                        <div class="mt-3">
                                            <div v-if="!hasDraftPosts" class="text-xs text-center text-yellow-500 mb-2">
                                                Todos os rascunhos foram agendados!
                                            </div>
                                            <button 
                                                v-if="hasDraftPosts"
                                                @click="handleNextScheduledPost"
                                                :disabled="handleNextScheduledPostLoading"
                                                class="w-full px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center"
                                                :class="handleNextScheduledPostLoading ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'">
                                                <svg v-if="handleNextScheduledPostLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {{ handleNextScheduledPostLoading ? 'Processing...' : 'Save and Next Draft' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tags & Categories Accordion -->
                <div class="border-b border-neutral-700">
                    <button @click="expandedSections.tags = !expandedSections.tags"
                        class="flex items-center justify-between w-full p-4 text-left text-neutral-200 font-medium">
                        <span>Tags & Categories</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200"
                            :class="expandedSections.tags ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-show="expandedSections.tags" class="p-4 pt-0 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Categories</label>
                            <div v-if="loadingCategories" class="text-sm text-neutral-400">Loading categories...</div>
                            <div v-else>
                                <input
                                    v-model="categoryFilter"
                                    type="text"
                                    placeholder="Filter categories..."
                                    class="w-full px-3 py-2 mb-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                />
                                <div class="space-y-2 max-h-48 overflow-y-auto p-2 bg-neutral-700 border border-neutral-600 rounded-md">
                                    <div v-for="category in filteredCategories" :key="category.id" class="flex items-center">
                                        <input :id="'category-' + category.id" type="checkbox" :value="category.id"
                                            v-model="post.categories"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700" />
                                        <label :for="'category-' + category.id" class="ml-2 text-sm text-neutral-300">
                                            {{ category.name }}
                                        </label>
                                    </div>
                                    <div v-if="filteredCategories.length === 0" class="text-sm text-neutral-400 p-1">
                                        No categories found
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Tags</label>
                            <div
                                class="flex flex-wrap items-center gap-2 p-2 bg-neutral-700 border border-neutral-600 rounded-md">
                                <div v-for="(tag, index) in post.tags" :key="index"
                                    class="flex items-center bg-blue-500/20 text-blue-400 px-2 py-1 text-sm rounded-md">
                                    {{ tag }}
                                    <button @click="removeTag(index)" class="ml-1.5 text-blue-400 hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <input v-model="newTag" @keydown.enter.prevent="addTag" @change="handleTagSelect"
                                    type="text" list="available-tags" placeholder="Add tag..."
                                    class="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm" />
                                <datalist id="available-tags" v-if="availableTags.length > 0">
                                    <option v-for="tag in availableTags" :key="tag.id" :value="tag.name"></option>
                                </datalist>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Featured Image Accordion -->
                <div class="border-b border-neutral-700">
                    <button @click="expandedSections.image = !expandedSections.image"
                        class="flex items-center justify-between w-full p-4 text-left text-neutral-200 font-medium">
                        <span>Featured Image</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200"
                            :class="expandedSections.image ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-show="expandedSections.image" class="p-4 pt-0 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-2">Feature Image</label>
                            <div class="border-2 border-dashed border-neutral-600 rounded-lg p-4 text-center hover:border-neutral-500 transition-colors cursor-pointer"
                                @click="openMediaSelector">
                                <div v-if="post.featureImage" class="relative">
                                    <img :src="post.featureImage" alt="Feature image"
                                        class="rounded-md w-full h-auto" />
                                    <button @click.stop="post.featureImage = null"
                                        class="absolute top-2 right-2 bg-neutral-800/80 rounded-full p-1 hover:bg-neutral-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div v-else class="py-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-neutral-500"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p class="mt-2 text-sm text-neutral-500">Click to upload feature image</p>
                                    <p class="mt-1 text-xs text-neutral-400">16:9 ratio recommended</p>
                                </div>
                            </div>
                        </div>

                        <div v-if="post.featureImage">
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Alt Text</label>
                            <input v-model="post.featureImageAlt" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Describe your image for accessibility" />

                            <!-- Adicionar alerta para imagem não processada -->
                            <div v-if="isFeatureImageUnprocessed()" class="mt-2 bg-yellow-900/40 border border-yellow-700 rounded-md p-3">
                                <div class="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p class="text-xs text-yellow-400 font-medium">Imagem temporária detectada</p>
                                        <p class="text-xs text-yellow-500 mt-1">Esta imagem pode não ficar disponível permanentemente.</p>
                                        <button @click="processFeatureImage"
                                            class="mt-2 w-full px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors flex items-center justify-center"
                                            :disabled="imageProcessingLoading">
                                            <span v-if="imageProcessingLoading" class="flex items-center">
                                                <svg class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processando...
                                            </span>
                                            <span v-else>Processar Imagem</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="post.featureImage">
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Caption</label>
                            <input v-model="post.featureImageCaption" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Image caption (optional)" />
                        </div>
                    </div>
                </div>

                <!-- SEO Accordion -->
                <div class="border-b border-neutral-700">
                    <button @click="expandedSections.seo = !expandedSections.seo"
                        class="flex items-center justify-between w-full p-4 text-left text-neutral-200 font-medium">
                        <span>SEO</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200"
                            :class="expandedSections.seo ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-show="expandedSections.seo" class="p-4 pt-0 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Meta Title</label>
                            <input v-model="post.metaTitle" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="SEO title (defaults to post title)" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Meta Description</label>
                            <textarea v-model="post.metaDescription" rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="SEO description (defaults to excerpt)"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Social Accordion -->
                <div class="border-b border-neutral-700">
                    <button @click="expandedSections.social = !expandedSections.social"
                        class="flex items-center justify-between w-full p-4 text-left text-neutral-200 font-medium">
                        <span>Social</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200"
                            :class="expandedSections.social ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-show="expandedSections.social" class="p-4 pt-0 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Facebook Title</label>
                            <input v-model="postMeta.ogTitle" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Facebook Description</label>
                            <textarea v-model="postMeta.ogDescription" rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Facebook Image</label>
                            <input v-model="postMeta.ogImage" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>

                        <hr class="border-neutral-700" />

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Twitter Title</label>
                            <input v-model="postMeta.twitterTitle" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Twitter Description</label>
                            <textarea v-model="postMeta.twitterDescription" rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Twitter Image</label>
                            <input v-model="postMeta.twitterImage" type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                <!-- Advanced Accordion -->
                <div class="border-b border-neutral-700">
                    <button @click="expandedSections.advanced = !expandedSections.advanced"
                        class="flex items-center justify-between w-full p-4 text-left text-neutral-200 font-medium">
                        <span>Advanced</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200"
                            :class="expandedSections.advanced ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-show="expandedSections.advanced" class="p-4 pt-0 space-y-4">

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Code Injection -
                                Header</label>
                            <textarea v-model="post.codeInjectionHead" rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                                placeholder=""></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Code Injection -
                                Footer</label>
                            <textarea v-model="post.codeInjectionBody" rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                                placeholder=""></textarea>
                        </div>

                        <div class="flex justify-between items-center">
                            <label class="text-xs text-neutral-400 mb-1 block">Co-Authors</label>
                            <span class="text-xs text-neutral-500">(includes main author)</span>
                        </div>
                        <div class="p-2 bg-neutral-700 border border-neutral-600 rounded-md min-h-[100px]">
                            <div class="flex flex-wrap gap-2 mb-2">
                                <div v-for="userId in postAuthorIds" :key="userId" class="flex items-center bg-neutral-600 rounded-md px-2 py-1">
                                    <span class="text-sm text-neutral-300">{{ getAuthorName(userId) }}</span>
                                    <button
                                        v-if="userId !== post.author"
                                        @click="removeCoAuthor(userId)"
                                        class="ml-2 text-neutral-400 hover:text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="flex items-center">
                                <select v-model="selectedCoAuthor" class="w-full bg-neutral-700 border-none outline-none text-sm text-neutral-300">
                                    <option value="">Add co-author...</option>
                                    <option
                                        v-for="author in availableCoAuthors"
                                        :key="author.user"
                                        :value="author.user"
                                    >
                                        {{ author.name }}
                                    </option>
                                </select>
                                <button
                                    v-if="selectedCoAuthor"
                                    @click="addCoAuthor"
                                    class="ml-2 p-1 bg-blue-600 hover:bg-blue-700 rounded-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>

        <!-- Blocks Sidebar (only this one) -->
        <div class="fixed z-30 left-0 bottom-0 top-13 w-60 bg-neutral-800 border-r border-neutral-700 overflow-y-auto flex flex-col transition-transform duration-300"
            :class="{ 'translate-x-0': blocksOpen, '-translate-x-full': !blocksOpen }">
            <div class="p-4 border-b border-neutral-700 flex justify-between items-center">
                <h3 class="font-medium">Blocks</h3>
                <button @click="toggleBlocks" class="text-neutral-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-2 flex-1 overflow-y-auto">
                <div class="space-y-2">
                    <div class="text-xs font-semibold text-neutral-400 px-2 py-1">Basic</div>
                    <div @click="insertParagraph"
                        class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-paragraph h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Paragraph</span>
                    </div>
                    <div @click="insertHeading"
                        class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-heading h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Heading</span>
                    </div>
                    <div @click="insertList" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-list h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>List</span>
                    </div>

                    <div class="text-xs font-semibold text-neutral-400 px-2 py-1 mt-4">Media</div>
                    <div @click="insertImage" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-image h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Image</span>
                    </div>
                    <div @click="insertVideo" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-video h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Video</span>
                    </div>
                    <div @click="insertAudio" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-file-audio h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Audio</span>
                    </div>
                    <div @click="insertTweet" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fab fa-twitter h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Tweet</span>
                    </div>
                    <div @click="insertReddit" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fab fa-reddit h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Reddit Post</span>
                    </div>

                    <div class="text-xs font-semibold text-neutral-400 px-2 py-1 mt-4">Layout</div>
                    <div @click="insertColumns"
                        class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-columns h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Columns</span>
                    </div>
                    <div @click="insertQuote" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-quote-right h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Quote</span>
                    </div>
                    <div @click="insertDivider"
                        class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fas fa-minus h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>Divider</span>
                    </div>
                    <div @click="insertYouTubeVideo" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <i class="fab fa-youtube h-5 w-5 text-neutral-400 mr-3"></i>
                        <span>YouTube Video</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add this template at the bottom, outside the main div -->
    <template v-if="editor">
        <floating-menu :editor="editor" :tippyOptions="{ duration: 100, placement: 'top' }">
            <div class="bg-neutral-800 shadow-lg rounded-lg overflow-hidden">
                <div class="flex items-center p-0.5">
                    <button @click="editor.chain().focus().toggleBold().run()"
                        :class="{ 'bg-neutral-700': editor.isActive('bold') }"
                        class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded font-bold">
                        B
                    </button>
                    <button @click="editor.chain().focus().toggleItalic().run()"
                        :class="{ 'bg-neutral-700': editor.isActive('italic') }"
                        class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded italic">
                        I
                    </button>
                    <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                        :class="{ 'bg-neutral-700': editor.isActive('heading', { level: 1 }) }"
                        class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                        H1
                    </button>
                    <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                        :class="{ 'bg-neutral-700': editor.isActive('heading', { level: 2 }) }"
                        class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                        H2
                    </button>
                    <button @click="setLink" class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                        <i class="fas fa-link h-4 w-4"></i>
                    </button>
                    <button @click="editor.chain().focus().toggleCode().run()"
                        :class="{ 'bg-neutral-700': editor.isActive('code') }"
                        class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                        <i class="fas fa-code h-4 w-4"></i>
                    </button>
                    <button @click="editor.chain().focus().toggleBulletList().run()"
                        :class="{ 'bg-neutral-700': editor.isActive('bulletList') }"
                        class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                        <i class="fas fa-list-ul h-4 w-4"></i>
                    </button>
                </div>
            </div>
        </floating-menu>

        <!-- Add this right after your existing floating menu template -->
        <bubble-menu :editor="editor" :tippyOptions="{ duration: 100 }"
            class="bg-neutral-800 shadow-lg rounded-lg overflow-hidden">
            <div class="flex items-center p-0.5">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'bg-neutral-700': editor.isActive('bold') }"
                    class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded font-bold">
                    B
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-neutral-700': editor.isActive('italic') }"
                    class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded italic">
                    I
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    :class="{ 'bg-neutral-700': editor.isActive('heading', { level: 1 }) }"
                    class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    H1
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'bg-neutral-700': editor.isActive('heading', { level: 2 }) }"
                    class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    H2
                </button>
                <button @click="setLink" class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <i class="fas fa-link h-4 w-4"></i>
                </button>
                <!-- Add YouTube video button -->
                <button @click="insertYouTubeVideo" class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <i class="fab fa-youtube h-4 w-4"></i>
                </button>
                <!-- Adicionar botões de alinhamento -->
                <div class="border-l border-neutral-600 mx-1 h-6"></div>
                <button @click="editor.chain().focus().setTextAlign('left').run()"
                    :class="{ 'bg-neutral-700': editor.isActive({ textAlign: 'left' }) }"
                    class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <i class="fas fa-align-left h-4 w-4"></i>
                </button>
                <button @click="editor.chain().focus().setTextAlign('center').run()"
                    :class="{ 'bg-neutral-700': editor.isActive({ textAlign: 'center' }) }"
                    class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <i class="fas fa-align-center h-4 w-4"></i>
                </button>
                <button @click="editor.chain().focus().setTextAlign('right').run()"
                    :class="{ 'bg-neutral-700': editor.isActive({ textAlign: 'right' }) }"
                    class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <i class="fas fa-align-right h-4 w-4"></i>
                </button>
                <button @click="editor.chain().focus().setTextAlign('justify').run()"
                    :class="{ 'bg-neutral-700': editor.isActive({ textAlign: 'justify' }) }"
                    class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <i class="fas fa-align-justify h-4 w-4"></i>
                </button>
                <button @click="insertTweet" class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <i class="fab fa-twitter h-4 w-4"></i>
                </button>
                <button @click="insertReddit" class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <i class="fab fa-reddit h-4 w-4"></i>
                </button>
            </div>
        </bubble-menu>

        <!-- Empty Line Block Selector Menu -->
        <div v-if="showBlockMenu" ref="blockMenuContainer"
            class="absolute bg-neutral-800 shadow-lg rounded-lg overflow-hidden z-50"
            :style="{ top: blockMenuPos.top + 'px', left: blockMenuPos.left + 'px' }">
            <div class="p-2">
                <input ref="blockMenuInput" v-model="blockMenuSearch" type="text" placeholder="Search for a block..."
                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white text-sm"
                    @keydown.esc="hideBlockMenu" />
            </div>
            <div class="max-h-60 overflow-y-auto p-1">
                <button v-for="block in filteredBlocks" :key="block.name" @click="insertBlock(block.type)"
                    class="flex items-center w-full text-left p-2 hover:bg-neutral-700 rounded text-sm transition-colors">
                    <span class="mr-2 w-5 h-5 flex items-center justify-center text-neutral-400">
                        <component :is="block.icon" />
                    </span>
                    <span>{{ block.name }}</span>
                </button>
            </div>
        </div>
    </template>

    <!-- Publish Confirmation Dialog -->
    <div v-if="showPublishDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        style="backdrop-filter: blur(4px);">
        <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div class="p-6 border-b border-neutral-700">
                <h3 class="text-lg font-medium text-white">Confirm Publication</h3>
            </div>
            <div class="p-6">
                <p class="text-neutral-300 mb-4">
                    Are you sure you want to publish this post? It will be publicly visible on your blog.
                </p>
                <p class="text-sm text-neutral-400 mb-6">
                    You can always set it back to draft later.
                </p>

                <div class="flex justify-end space-x-3">
                    <button @click="showPublishDialog = false"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                        Cancel
                    </button>
                    <button @click="publishPost"
                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                        :disabled="publishLoading">
                        <span v-if="publishLoading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Publishing...
                        </span>
                        <span v-else>Publish Now</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast notifications -->
    <ToastNotification
        :show="notification.show"
        :message="notification.message"
        :type="notification.type"
        :duration="notification.duration"
        @close="notification.show = false"
    />

    <!-- Add file input for feature image -->
    <input
        type="file"
        ref="featureImageInput"
        @change="handleFeatureImageSelect"
        accept="image/*"
        class="hidden"
    />

    <!-- Add feature image crop modal -->
    <div v-if="featureCropModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        style="backdrop-filter: blur(4px);">
        <div class="bg-neutral-800 rounded-lg max-w-2xl w-full p-6">
            <h3 class="text-lg font-medium text-white mb-4">Crop Feature Image</h3>

            <div class="relative mb-4">
                <div class="w-full aspect-video relative overflow-hidden rounded-lg border-2 border-neutral-600">
                    <!-- Canvas for crop preview -->
                    <canvas
                        ref="featureCropCanvas"
                        class="absolute inset-0 w-full h-full"
                        @mousedown="startFeatureDrag"
                        @mousemove="onFeatureDrag"
                        @mouseup="stopFeatureDrag"
                        @mouseleave="stopFeatureDrag"
                        @wheel="handleFeatureWheel"
                        @touchstart="startFeatureDrag"
                        @touchmove="onFeatureDrag"
                        @touchend="stopFeatureDrag"
                    ></canvas>
                </div>

                <!-- Zoom controls -->
                <div class="flex items-center justify-center mt-4">
                    <button
                        @click="adjustFeatureZoom(-0.1)"
                        class="p-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-l-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div class="px-4 py-2 bg-neutral-700 text-white text-sm font-medium">
                        Zoom: {{ Math.round(featureZoomLevel * 100) }}%
                    </div>
                    <button
                        @click="adjustFeatureZoom(0.1)"
                        class="p-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-r-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Action buttons -->
            <div class="flex justify-end space-x-2">
                <button
                    @click="featureCropModalOpen = false"
                    class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md"
                >
                    Cancel
                </button>
                <button
                    @click="cropFeatureImage"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                    Apply
                </button>
            </div>
        </div>
    </div>

    <div v-if="fullPageLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" style="backdrop-filter: blur(4px);">
        <div class="bg-neutral-800 rounded-lg p-8 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-lg text-white">{{ loadingMessage }}</p>
        </div>
    </div>

    <MediaDialog
        v-model="showMediaDialog"
        :type="mediaDialogType"
        @select="handleMediaSelected"
    />

    <div v-if="showImageProcessingDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        style="backdrop-filter: blur(4px);">
        <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div class="p-6 border-b border-neutral-700">
                <h3 class="text-lg font-medium text-white">Imagem não processada</h3>
            </div>
            <div class="p-6">
                <p class="text-neutral-300 mb-4">
                    A imagem principal do post contém um link temporário ou não processado.
                    É recomendado processar a imagem antes de publicar o post.
                </p>
                <p class="text-sm text-neutral-400 mb-6">
                    Processar a imagem irá garantir que ela fique disponível permanentemente.
                </p>

                <div class="flex justify-end space-x-3">
                    <button @click="showImageProcessingDialog = false"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                        Cancelar
                    </button>
                    <button @click="processFeatureImage"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        :disabled="imageProcessingLoading">
                        <span v-if="imageProcessingLoading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Processando...
                        </span>
                        <span v-else>Processar Imagem</span>
                    </button>
                    <button @click="proceedWithPublish"
                        class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors">
                        Publicar Mesmo Assim
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Add AI Content Generation Dialog -->
    <div v-if="showAIGenerateDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        style="backdrop-filter: blur(4px);">
        <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div class="p-6 border-b border-neutral-700">
                <h3 class="text-lg font-medium text-white">AI Content Generation</h3>
            </div>
            <div class="p-6">
                <div v-if="!aiGenerateJobId">
                    <p class="text-neutral-300 mb-4">
                        Enter a URL to generate blog content using AI. The content will be processed and used to fill the editor.
                    </p>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-neutral-400 mb-1">URL</label>
                        <input
                            v-model="aiGenerateUrl"
                            type="url"
                            placeholder="https://example.com/article"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div v-else class="mb-4">
                    <div class="flex items-center justify-center flex-col">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p class="text-neutral-300 mb-2 text-center">Generating content...</p>
                        <p class="text-sm text-neutral-400 text-center">
                            This may take 30-60 seconds to complete. The system is reading the URL, extracting relevant content, and creating a high-quality blog post.
                        </p>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        @click="cancelGeneration"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        v-if="!aiGenerateJobId"
                        @click="generateFromUrl"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        :disabled="aiGenerateLoading"
                    >
                        <span v-if="aiGenerateLoading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Starting...
                        </span>
                        <span v-else>Generate Content</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchEffect, nextTick, watch } from 'vue'
import { useUtils } from "../../../../apps/admin/src/composables/useUtils";
import { useRouter, useRoute } from 'vue-router'
import { Editor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import ImageResize from 'tiptap-extension-resize-image';
import TextAlign from '@tiptap/extension-text-align'
import { default as TiptapImage } from '@tiptap/extension-image'
import { Extension } from '@tiptap/core'
import { Node } from '@tiptap/core'
import { useAdminClient } from '@cmmv/blog/admin/client'
import MediaDialog from '../components/MediaDialog.vue'
import ToastNotification from '../components/ToastNotification.vue'

// Extensão para permitir qualquer atributo HTML
const AllowAllAttributes = Extension.create({
  name: 'allowAllAttributes',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          '*': {
            parseHTML: (element) => {
              return Object.fromEntries(
                Array.from(element.attributes)
                  .filter(attr => !['class', 'style'].includes(attr.name))
                  .map(attr => [attr.name, attr.value])
              )
            },
            renderHTML: attributes => {
              return Object.fromEntries(
                Object.entries(attributes).filter(([key]) => key !== '*')
              )
            }
          }
        }
      }
    ]
  }
})

// Node para permitir iframes
const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  selectable: true,
  parseHTML() {
    return [{
      tag: 'div.iframe-wrapper',
      getAttrs: node => {
        const iframe = node.querySelector ? node.querySelector('iframe') : null;
        return iframe ? {
          src: iframe.getAttribute('src'),
          width: iframe.getAttribute('width'),
          height: iframe.getAttribute('height'),
          frameborder: iframe.getAttribute('frameborder'),
          allowfullscreen: iframe.hasAttribute('allowfullscreen'),
          allow: iframe.getAttribute('allow'),
          class: iframe.getAttribute('class'),
          style: iframe.getAttribute('style'),
          title: iframe.getAttribute('title')
        } : null;
      }
    }, {
      tag: 'iframe'
    }];
  },
  renderHTML({ HTMLAttributes }) {
    const attrs = {...HTMLAttributes};

    // Clean up attributes to prevent rendering issues
    delete attrs.class;
    delete attrs.style;

    // Set default attributes for YouTube embeds
    if (attrs.src && (attrs.src.includes('youtube.com') || attrs.src.includes('youtu.be'))) {
      if (!attrs.height || attrs.height < 477) {
        attrs.height = '477px';
      }
    }

    return [
      'div',
      { class: 'iframe-wrapper' },
      ['div', { class: 'iframe-actions' }, ['button', { class: 'iframe-delete-button', title: 'Delete Embed' }, '×']],
      ['iframe', attrs]
    ];
  },
  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: true,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '100%',
      },
      class: {
        default: null,
      },
      allow: {
        default: null,
      },
      style: {
        default: null,
      },
      title: {
        default: null,
      }
    }
  },
})

// Add Tweet Node after Iframe
const Tweet = Node.create({
  name: 'tweet',
  group: 'block',
  atom: true,
  selectable: true, // Make sure it's selectable

  addAttributes() {
    return {
      url: {
        default: ''
      },
      tweetId: {
        default: ''
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-tweet]',
        getAttrs: (node) => {
          // If node is a string, it's a selector match
          if (typeof node === 'string') {
            const div = document.createElement('div');
            div.innerHTML = node;
            const tweetDiv = div.querySelector('div[data-tweet]');
            return { tweetId: tweetDiv?.getAttribute('data-tweet') || '' };
          }

          // Otherwise it's a DOM node
          const element = node;
          return {
            tweetId: element.getAttribute('data-tweet') || ''
          };
        }
      },
      {
        tag: 'div.tweet-embed',
        getAttrs: (node) => {
          // If node is a string, it's a selector match
          if (typeof node === 'string') {
            const div = document.createElement('div');
            div.innerHTML = node;
            const tweetDiv = div.querySelector('div.tweet-embed');
            return { tweetId: tweetDiv?.getAttribute('data-tweet') || '' };
          }

          // Otherwise it's a DOM node
          const element = node;
          return {
            tweetId: element.getAttribute('data-tweet') || ''
          };
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const tweet = HTMLAttributes.tweetId

    if (!tweet) {
      return ['div', { class: 'tweet-invalid' }, 'Invalid Tweet URL']
    }

    return ['div', {
      class: 'tweet-embed',
      'data-tweet': tweet
    },
      ['div', { class: 'tweet-embed-container' },
        ['div', { class: 'tweet-embed-actions' },
          ['button', {
            class: 'tweet-delete-button',
            title: 'Delete Tweet'
          }, '×']
        ],
        ['iframe', {
          src: `https://platform.twitter.com/embed/Tweet.html?id=${tweet}`,
          frameborder: '0',
          scrolling: 'no',
          allowtransparency: 'true',
          allowfullscreen: 'true'
        }]
      ]
    ]
  }
})

// Add Reddit Node after Tweet
const Reddit = Node.create({
  name: 'reddit',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      url: {
        default: ''
      },
      postId: {
        default: ''
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-reddit]',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            const div = document.createElement('div');
            div.innerHTML = node;
            const redditDiv = div.querySelector('div[data-reddit]');
            return { postId: redditDiv?.getAttribute('data-reddit') || '' };
          }

          const element = node;
          return {
            postId: element.getAttribute('data-reddit') || ''
          };
        }
      },
      {
        tag: 'div.reddit-embed',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            const div = document.createElement('div');
            div.innerHTML = node;
            const redditDiv = div.querySelector('div.reddit-embed');
            return { postId: redditDiv?.getAttribute('data-reddit') || '' };
          }

          const element = node;
          return {
            postId: element.getAttribute('data-reddit') || ''
          };
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const postId = HTMLAttributes.postId;
    const postUrl = HTMLAttributes.url;

    if (!postId || !postUrl) {
      return ['div', { class: 'reddit-invalid' }, 'Invalid Reddit URL']
    }

    return ['div', {
      class: 'reddit-embed',
      'data-reddit': postId
    },
      ['div', { class: 'reddit-embed-container' },
        ['div', { class: 'reddit-embed-actions' },
          ['button', {
            class: 'reddit-delete-button',
            title: 'Delete Reddit Post'
          }, '×']
        ],
        ['iframe', {
          src: `https://www.redditmedia.com/r/${postId}?ref_source=embed&ref=share&embed=true`,
          frameborder: '0',
          scrolling: 'no',
          allowtransparency: 'true',
          allowfullscreen: 'true',
          sandbox: 'allow-scripts allow-same-origin allow-popups'
        }]
      ]
    ]
  }
})

// Add Audio Node after Reddit
const Audio = Node.create({
  name: 'audio',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-audio-src]',
        getAttrs: node => ({ src: node.getAttribute('data-audio-src') }),
      },
      {
        tag: 'audio',
        getAttrs: node => ({ src: node.getAttribute('src') }),
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    if (!HTMLAttributes.src) {
      return ['div', { class: 'audio-invalid' }, 'Invalid Audio Source'];
    }

    return [
      'div',
      { class: 'audio-embed', 'data-audio-src': HTMLAttributes.src },
      ['div', { class: 'audio-embed-actions' },
        ['button', { class: 'audio-delete-button', title: 'Delete Audio' }, '×']
      ],
      ['audio', { controls: true, src: HTMLAttributes.src, style: 'width: 100%; margin-top: 5px;' }, 'Your browser does not support the audio element.']
    ];
  },
});

const adminClient = useAdminClient()
const router = useRouter()
const route = useRoute()
const { slugify } = useUtils();

const sidebarOpen = ref(JSON.parse(localStorage.getItem('postEditor_sidebarOpen') || 'true'))
const blocksOpen = ref(JSON.parse(localStorage.getItem('postEditor_blocksOpen') || 'false'))
const activeTab = ref('basic')
const newTag = ref('')
const scheduleDate = ref('')
const websiteUrl = ref('https://yourblog.com')
const slugManuallyEdited = ref(false)

const settings = ref({})
const categories = ref([])
const allTags = ref([])
const loadingCategories = ref(false)
const loadingTags = ref(false)
const blogUrl = ref('');

const loadBlogUrl = async () => {
    try {
        const settings = await adminClient.settings.getRoot();
        const urlSetting = settings.find(s => s.key === 'blog.url');

        if (urlSetting)
            blogUrl.value = urlSetting.value.replace(/\/$/, '');
    } catch (err) {
        console.error('Failed to load blog URL:', err);
        blogUrl.value = '';
    }
};

async function loadCategories() {
    try {
        loadingCategories.value = true
        const response = await adminClient.categories.get({
            limit: 100,
            sort: 'asc',
            sortBy: 'name'
        })
        categories.value = response.data || []
        loadingCategories.value = false
    } catch (error) {
        console.error('Failed to load categories:', error)
        loadingCategories.value = false
    }
}

async function loadTags() {
    try {
        loadingTags.value = true
        const response = await adminClient.tags.get({
            limit: 100,
            sort: 'asc',
            sortBy: 'name'
        })
        allTags.value = response.data || []
        loadingTags.value = false
    } catch (error) {
        console.error('Failed to load tags:', error)
        loadingTags.value = false
    }
}

const expandedSections = ref({
    basic: JSON.parse(localStorage.getItem('postEditor_expandedBasic') || 'true'),
    tags: JSON.parse(localStorage.getItem('postEditor_expandedTags') || 'false'),
    image: JSON.parse(localStorage.getItem('postEditor_expandedImage') || 'false'),
    seo: JSON.parse(localStorage.getItem('postEditor_expandedSeo') || 'false'),
    social: JSON.parse(localStorage.getItem('postEditor_expandedSocial') || 'false'),
    advanced: JSON.parse(localStorage.getItem('postEditor_expandedAdvanced') || 'false')
})

const tabs = [
    { id: 'basic', name: 'Basic' },
    { id: 'tags', name: 'Tags' },
    { id: 'image', name: 'Image' },
    { id: 'seo', name: 'SEO' },
    { id: 'social', name: 'Social' },
    { id: 'advanced', name: 'Advanced' }
]

const post = ref({
    author: 'current-user-id',
    authors: ['current-user-id'],
    title: '',
    excerpt: '',
    content: '',
    lexicalContent: '',
    mobileDocument: '',
    categories: [],
    slug: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    publishedAt: null,
    autoPublishAt: null,
    image: '',
    featured: false,
    featureImage: '',
    featureImageAlt: '',
    featureImageCaption: '',
    tags: [],
    type: 'post',
    status: 'draft',
    visibility: 'public',
    codeInjectionHead: '',
    codeInjectionBody: '',
    canonicalUrl: '',
    pushNotification: false
})

const postMeta = ref({
    post: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    metaTitle: '',
    metaDescription: ''
})

const showBlockMenu = ref(false)
const blockMenuPos = ref({ top: 0, left: 0 })
const blockMenuSearch = ref('')
const blockMenuContainer = ref(null)
const blockMenuInput = ref(null)

const blocks = [
    { name: 'Paragraph', type: 'paragraph', icon: 'ParagraphIcon' },
    { name: 'Heading 1', type: 'heading1', icon: 'Heading1Icon' },
    { name: 'Heading 2', type: 'heading2', icon: 'Heading2Icon' },
    { name: 'Bullet List', type: 'bulletList', icon: 'BulletListIcon' },
    { name: 'Numbered List', type: 'orderedList', icon: 'NumberedListIcon' },
    { name: 'Image', type: 'image', icon: 'ImageIcon' },
    { name: 'Quote', type: 'blockquote', icon: 'QuoteIcon' },
    { name: 'Code Block', type: 'codeBlock', icon: 'CodeIcon' },
    { name: 'Horizontal Rule', type: 'horizontalRule', icon: 'HorizontalRuleIcon' },
]

const filteredBlocks = computed(() => {
    if (!blockMenuSearch.value) return blocks

    return blocks.filter(block =>
        block.name.toLowerCase().includes(blockMenuSearch.value.toLowerCase())
    )
})

const editor = new Editor({
    extensions: [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            },
        }),
        Placeholder.configure({
            placeholder: 'Click to write or press + for commands...',
        }),
        Link.configure({
            openOnClick: false,
        }),
        ImageResize,
        // Customize TiptapImage to add loading="lazy" by default
        TiptapImage.extend({
            addAttributes() {
                return {
                    ...this.parent?.(),
                    loading: {
                        default: 'lazy',
                        renderHTML: attributes => {
                            return {
                                loading: attributes.loading,
                            }
                        },
                    }
                }
            }
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right', 'justify'],
            defaultAlignment: 'left',
        }),
        Youtube.configure({
            controls: true,
            nocookie: true,
            width: 640,
            height: 477,
        }),
        AllowAllAttributes,
        Iframe,
        Tweet,
        Reddit, // Add Reddit extension
        Audio, // Add Audio extension
    ],
    content: '',
    onUpdate: ({ editor }) => {
        post.value.content = editor.getHTML()
    },
    onSelectionUpdate: ({ editor }) => {
        const { selection } = editor.state
        const { empty, $cursor } = selection

        if (empty && $cursor) {
            const node = $cursor.node()
            if (node.type.name === 'paragraph' && node.content.size === 0) {
                showAddButtonAtCursor($cursor)
            } else {
                hideAddButton()
            }
        } else {
            hideAddButton()
        }
    }
})

function showAddButtonAtCursor($cursor) {
    const coords = editor.view.coordsAtPos($cursor.pos)

    addButtonPos.value = {
        top: coords.top,
        left: coords.left - 30
    }

    showAddButton.value = true
}

function hideAddButton() {
    showAddButton.value = false
}

function insertBlock(type) {
    editor.commands.deleteRange({
        from: editor.state.selection.from - 1,
        to: editor.state.selection.from,
    })

    switch (type) {
        case 'paragraph':
            editor.chain().focus().setParagraph().run()
            break
        case 'heading1':
            editor.chain().focus().setHeading({ level: 1 }).run()
            break
        case 'heading2':
            editor.chain().focus().setHeading({ level: 2 }).run()
            break
        case 'bulletList':
            editor.chain().focus().toggleBulletList().run()
            break
        case 'orderedList':
            editor.chain().focus().toggleOrderedList().run()
            break
        case 'image':
            const url = prompt('Enter image URL')
            if (url) {
                editor.chain().focus().setImage({ src: url }).run()
            }
            break
        case 'blockquote':
            editor.chain().focus().toggleBlockquote().run()
            break
        case 'codeBlock':
            editor.chain().focus().toggleCodeBlock().run()
            break
        case 'horizontalRule':
            editor.chain().focus().setHorizontalRule().run()
            break
    }

    hideBlockMenu()
}

function insertParagraph() {
    editor.chain().focus().setParagraph().run()
}

function insertHeading() {
    editor.chain().focus().setHeading({ level: 2 }).run()
}

function insertList() {
    editor.chain().focus().toggleBulletList().run()
}

function insertImage() {
    mediaDialogType.value = 'all';

    mediaSelectCallback.value = (media) => {
        editor.chain().focus().setImage({
            src: media.url,
            alt: media.alt || '',
            title: media.caption || '',
            loading: 'lazy' // Add lazy loading attribute
        }).run();
    };

    showMediaDialog.value = true;
}

function insertColumns() {
    editor.chain().focus().insertContent(`
        <div class="columns-container">
            <div class="column">Column 1 content...</div>
            <div class="column">Column 2 content...</div>
        </div>
    `).run()
}

function insertQuote() {
    editor.chain().focus().toggleBlockquote().run()
}

function insertDivider() {
    editor.chain().focus().setHorizontalRule().run()
}

const titleTextarea = ref(null)
const LOCAL_STORAGE_SCHEDULE_KEY = 'postEditor_lastScheduleDate';
const LOCAL_STORAGE_NEXT_SCHEDULE_KEY = 'postEditor_nextScheduleDate'; // Nova chave para a próxima data

function autoResizeTitle() {
    const textarea = titleTextarea.value
    if (!textarea) return

    textarea.style.height = 'auto'

    textarea.style.height = textarea.scrollHeight + 'px'
}

onMounted(async () => {
    const postId = route.params.id

    if (postId) {
        const loaded = loadPost(postId)

        if (!loaded) {
            showNotification('error', 'Could not find the requested post')
            return
        }
    } else {
        // Se é um novo post, tentar carregar a última data de agendamento salva
        loadSavedScheduleDate();
    }

    // Verificar se há posts em draft disponíveis
    checkDraftPostsAvailability();

    settings.value = await adminClient.settings.get()

    loadCategories()
    loadTags()
    loadBlogUrl();
    document.addEventListener('click', handleGlobalClick)
    document.addEventListener('click', handleImageClick)

    nextTick(() => {
        autoResizeTitle()
    })
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleGlobalClick)
    document.removeEventListener('click', handleImageClick)
})

function handleGlobalClick(event) {
    if (showBlockMenu.value &&
        !event.target.closest('.blocks-sidebar') &&
        !event.target.closest('#add-button')) {
        showBlockMenu.value = false
    }
}

function setLink() {
    const url = prompt('Enter URL')
    if (url) {
        editor.chain().focus().setLink({ href: url }).run()
    }
}

watchEffect(() => {
    if (post.value.title && !slugManuallyEdited.value)
        post.value.slug = slugify(post.value.title);
})

function handleSlugInput(event) {
    const titleDerivedSlug = slugify(post.value.title);
    slugManuallyEdited.value = post.value.slug !== titleDerivedSlug
}

const postStatus = computed(() => post.value.status)
const postStatusText = computed(() => {
    switch (post.value.status) {
        case 'draft': return 'Draft'
        case 'published': return 'Published'
        case 'cron': return 'Scheduled'
        default: return 'Draft'
    }
})

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
}

function goBack() {
    router.back()
}

const availableTags = computed(() => {
    return allTags.value.filter(tag => !post.value.tags.includes(tag.name));
});

function addTag() {
    if (newTag.value.trim() && !post.value.tags.includes(newTag.value.trim())) {
        post.value.tags.push(newTag.value.trim());
        newTag.value = '';
    }
}

function handleTagSelect(event) {
    const selectedValue = event.target.value.trim();
    if (selectedValue && !post.value.tags.includes(selectedValue)) {
        post.value.tags.push(selectedValue);
        newTag.value = '';
    }
}

function removeTag(index) {
    post.value.tags.splice(index, 1)
}

const featureCropModalOpen = ref(false)
const featureZoomLevel = ref(1)
const featureCropCanvas = ref(null)
const featureImageInput = ref(null)
const selectedFeatureImage = ref(null)
const featureCropContext = ref(null)
const isFeatureDragging = ref(false)
const featureDragStart = ref({ x: 0, y: 0 })
const featureImagePosition = ref({ x: 0, y: 0 })

function openMediaSelector() {
    mediaDialogType.value = 'all';

    mediaSelectCallback.value = (media) => {
        post.value.featureImage = media.url;
        post.value.featureImageAlt = media.alt || '';
        post.value.featureImageCaption = media.caption || '';
    };

    showMediaDialog.value = true;
}

function handleFeatureImageSelect(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        const img = new Image()
        img.crossOrigin = "Anonymous"

        img.onload = () => {
            selectedFeatureImage.value = img
            featureCropModalOpen.value = true

            setTimeout(() => {
                initFeatureCropCanvas()
            }, 100)
        }

        img.onerror = (err) => {
            console.error('Feature image loading error', err)
            showNotification('error', 'Failed to load feature image')
        }

        img.src = e.target.result
    }
    reader.readAsDataURL(file)

    event.target.value = ''
}

function initFeatureCropCanvas() {
    if (!featureCropCanvas.value || !selectedFeatureImage.value) return

    const canvas = featureCropCanvas.value
    const ctx = canvas.getContext('2d')
    featureCropContext.value = ctx

    canvas.width = 600
    canvas.height = 338

    featureZoomLevel.value = 1
    featureImagePosition.value = { x: 0, y: 0 }

    drawFeatureImageOnCanvas()
}

function drawFeatureImageOnCanvas() {
    if (!featureCropCanvas.value || !selectedFeatureImage.value || !featureCropContext.value) return

    const canvas = featureCropCanvas.value
    const ctx = featureCropContext.value
    const img = selectedFeatureImage.value

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * featureZoomLevel.value
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale

    const x = featureImagePosition.value.x + (canvas.width - scaledWidth) / 2
    const y = featureImagePosition.value.y + (canvas.height - scaledHeight) / 2

    ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(0, 0, canvas.width, 1) // Top edge indicator
    ctx.fillRect(0, canvas.height - 1, canvas.width, 1) // Bottom edge indicator
}

function startFeatureDrag(e) {
    isFeatureDragging.value = true

    if (e.type.includes('mouse'))
        featureDragStart.value = { x: e.clientX, y: e.clientY }
    else
        featureDragStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY }
}

function onFeatureDrag(e) {
    if (!isFeatureDragging.value) return

    e.preventDefault()

    let currentX, currentY
    if (e.type.includes('mouse')) {
        currentX = e.clientX
        currentY = e.clientY
    } else { // touch event
        currentX = e.touches[0].clientX
        currentY = e.touches[0].clientY
    }

    const deltaX = currentX - featureDragStart.value.x
    const deltaY = currentY - featureDragStart.value.y

    featureImagePosition.value = {
        x: featureImagePosition.value.x + deltaX,
        y: featureImagePosition.value.y + deltaY
    }

    featureDragStart.value = { x: currentX, y: currentY }
    drawFeatureImageOnCanvas()
}

function stopFeatureDrag() {
    isFeatureDragging.value = false
}

function adjustFeatureZoom(delta) {
    featureZoomLevel.value = Math.max(0.5, Math.min(3, featureZoomLevel.value + delta))
    drawFeatureImageOnCanvas()
}

function handleFeatureWheel(e) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    adjustFeatureZoom(delta)
}

function cropFeatureImage() {
    if (!featureCropCanvas.value || !selectedFeatureImage.value || !featureCropContext.value) return

    const canvas = featureCropCanvas.value
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')

    const outputWidth = 1200
    const outputHeight = 675 // 16:9 aspect ratio

    tempCanvas.width = outputWidth
    tempCanvas.height = outputHeight

    const scale = Math.max(canvas.width / selectedFeatureImage.value.width, canvas.height / selectedFeatureImage.value.height) * featureZoomLevel.value
    const scaledWidth = selectedFeatureImage.value.width * scale
    const scaledHeight = selectedFeatureImage.value.height * scale
    const x = featureImagePosition.value.x + (canvas.width - scaledWidth) / 2
    const y = featureImagePosition.value.y + (canvas.height - scaledHeight) / 2

    tempCtx.drawImage(
        selectedFeatureImage.value,
        -x / scale,
        -y / scale,
        canvas.width / scale,
        canvas.height / scale,
        0, 0,
        outputWidth, outputHeight
    )

    const base64Image = tempCanvas.toDataURL('image/jpeg', 0.85)
    post.value.featureImage = base64Image
    featureCropModalOpen.value = false
    showNotification('success', 'Feature image updated')
}

const showAddButton = ref(false)
const addButtonPos = ref({ top: 0, left: 0 })
const addButtonContainer = ref(null)

function toggleBlocks() {
    blocksOpen.value = !blocksOpen.value

    if (blocksOpen.value)
        hideAddButton()
}

const showPublishDialog = ref(false)
const publishLoading = ref(false)

function confirmPublish() {
    if (post.value.status === 'published') {
        fullPageLoading.value = true;
        loadingMessage.value = 'Updating post...';

        savePost()
            .finally(() => {
                fullPageLoading.value = false;
            });
    } else {
        // Verificar se a imagem precisa ser processada
        if (isFeatureImageUnprocessed()) {
            showImageProcessingDialog.value = true;
        } else {
            showPublishDialog.value = true;
        }
    }
}

function publishPost() {
    publishLoading.value = true;
    fullPageLoading.value = true;
    loadingMessage.value = 'Publishing post...';

    post.value.status = 'published';
    post.value.publishedAt = new Date().toISOString();

    adminClient.posts.save({
        post: post.value,
        meta: postMeta.value
    })
    .then(response => {
        if (response && response.id) {
            post.value.id = response.id;
            showNotification('success', 'Post published successfully');
        }
        else if(response.result){
            showNotification('success', 'Post published successfully');
        }
    })
    .catch(error => {
        console.error('Failed to publish post:', error);
        showNotification('error', error.message || 'Failed to publish post');
    })
    .finally(() => {
        // Always close the dialog and reset loading states, regardless of success or failure
        showPublishDialog.value = false;
        publishLoading.value = false;
        fullPageLoading.value = false;
    });
}

// Add the new savePost function before the publishPost function
function savePost() {
    fullPageLoading.value = true;

    if (post.value.status === 'cron') {
        loadingMessage.value = 'Saving scheduled post...';
    } else if (post.value.status === 'published') {
        loadingMessage.value = 'Publishing post...';
    } else {
        loadingMessage.value = 'Saving draft...';
        post.value.status = 'draft';
    }

    adminClient.posts.save({
        post: post.value,
        meta: postMeta.value
    })
    .then(response => {
        if (response && response.id) {
            post.value.id = response.id;
            showNotification('success', 'Post saved successfully');

            if (!route.params.id)
                router.push(`/post/${response.id}`);

            return response;
        }
        else if(response.result){
            showNotification('success', 'Post saved successfully');
        }
    })
    .catch(error => {
        console.error('Failed to save post:', error);
        showNotification('error', error.message || 'Failed to save post');
    })
    .finally(() => {
        fullPageLoading.value = false;
    });
}

function saveDraft() {
    fullPageLoading.value = true;

    // Set appropriate loading message based on post status
    if (post.value.status === 'cron') {
        loadingMessage.value = 'Saving scheduled post...';
        
        // Salvar próxima data quando o post for agendado
        try {
            if (scheduleDate.value) {
                const dateComponents = scheduleDate.value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
                if (dateComponents) {
                    const [_, year, month, day, hours, minutes] = dateComponents;
                    const currentScheduleDate = new Date(
                        parseInt(year), 
                        parseInt(month) - 1, 
                        parseInt(day), 
                        parseInt(hours), 
                        parseInt(minutes)
                    );
                    
                    if (!isNaN(currentScheduleDate.getTime())) {
                        // Calcular próxima data (+1h)
                        const nextScheduleDate = new Date(currentScheduleDate.getTime() + 60 * 60 * 1000);
                        
                        // Salvar para uso futuro
                        localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, currentScheduleDate.toISOString());
                        localStorage.setItem(LOCAL_STORAGE_NEXT_SCHEDULE_KEY, nextScheduleDate.toISOString());
                        
                    }
                }
            }
        } catch (error) {
            console.error('[PostView] Error saving next schedule date:', error);
        }
    } else if (post.value.status === 'published') {
        loadingMessage.value = 'Publishing post...';
    } else {
        loadingMessage.value = 'Saving draft...';
        post.value.status = 'draft';
    }

    let cleanContent = editor.getHTML();

    cleanContent = cleanContent
        .replace(/<div class="iframe-actions">.*?<\/div>/g, '')
        .replace(/<div class="tweet-embed-actions">.*?<\/div>/g, '')
        .replace(/<div class="reddit-embed-actions">.*?<\/div>/g, '')
        .replace(/<div class="audio-embed-actions">.*?<\/div>/g, ''); // Adicionado para audio

    const postData = {
        ...post.value,
        content: cleanContent
    };

    if (Array.isArray(postData.authors)) {
        postData.authors = postData.authors.map(author => {
            if (typeof author === 'object' && author !== null) {
                return author.user;
            } else {
                return author;
            }
        }).filter(Boolean);
    } else {
        if (postData.author)
            postData.authors = [postData.author];
    }

    if (post.value.status === 'cron' && scheduleDate.value) {
        // Garantir que o timestamp seja correto para o fuso horário do cliente

        const scheduleDateComponents = scheduleDate.value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);

        if (scheduleDateComponents) {
            const [_, year, month, day, hours, minutes] = scheduleDateComponents;
            // Criar a data baseada nos componentes (no fuso horário local)
            const dt = new Date();
            dt.setFullYear(parseInt(year));
            dt.setMonth(parseInt(month) - 1); // Mês é base 0 em JS
            dt.setDate(parseInt(day));
            dt.setHours(parseInt(hours));
            dt.setMinutes(parseInt(minutes));
            dt.setSeconds(0);
            dt.setMilliseconds(0);

            postData.autoPublishAt = dt.getTime();
        } else {
            // Fallback para o método anterior se o formato não corresponder
            const originalDate = new Date(scheduleDate.value);
            postData.autoPublishAt = originalDate.getTime();
        }
    }

    const payload = {
        post: postData,
        meta: postMeta.value
    };

    adminClient.posts.save(payload)
        .then(response => {
            if (response && response.id) {
                post.value.id = response.id;
                showNotification('success', 'Post saved successfully');

                if (!route.params.id)
                    router.push(`/post/${response.id}`);
            }
            else if(response.result){
                showNotification('success', 'Post saved successfully');
            }
        })
        .catch(error => {
            console.error('Failed to save post:', error);
            showNotification('error', error.message || 'Failed to save post');
        })
        .finally(() => {
            fullPageLoading.value = false;
        });
}

const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

function showNotification(type, message) {
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

async function loadPost(postId) {
    try {
        fullPageLoading.value = true; // Adicionado para cobrir o carregamento inicial
        loadingMessage.value = 'Loading post...'; // Mensagem de carregamento

        const response = await adminClient.posts.getById(postId)

        if (response) {
            let formattedCategories = response.categories || []

            if (Array.isArray(formattedCategories)) {
                if (formattedCategories.length > 0 && typeof formattedCategories[0] === 'object')
                    formattedCategories = formattedCategories.map(cat => cat.id || cat._id || cat)
            } else if (typeof formattedCategories === 'string') {
                formattedCategories = [formattedCategories]
            } else {
                formattedCategories = []
            }

            let formattedTags = response.tags || [];

            if (Array.isArray(formattedTags)) {
                if (formattedTags.length > 0)
                    formattedTags = response.tags.map(tag => tag.name)
            } else if (typeof formattedTags === 'string') {
                formattedTags = [formattedTags]
            } else {
                formattedTags = []
            }

            post.value = {
                ...post.value,
                ...response,
                tags: formattedTags,
                categories: formattedCategories
            }

            if (response.meta) {
                postMeta.value = {
                    ...postMeta.value,
                    ...response.meta
                }
            }

            if (post.value.content)
                editor.commands.setContent(post.value.content)

            if (post.value.status === 'cron' && post.value.autoPublishAt) {
                // Manter a data/hora original do post
                const date = new Date(post.value.autoPublishAt)
                // Formato ISO para datetime-local (YYYY-MM-DDTHH:MM)
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const hours = String(date.getHours()).padStart(2, '0')
                const minutes = String(date.getMinutes()).padStart(2, '0')

                scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`
            }

            nextTick(() => {
                autoResizeTitle()
            })

            // Processar scheduleTime da query após carregar o post
            if (route.query.scheduleTime) {
                const queryScheduleTime = new Date(route.query.scheduleTime);
                if (!isNaN(queryScheduleTime.getTime())) {
                    const year = queryScheduleTime.getFullYear();
                    const month = String(queryScheduleTime.getMonth() + 1).padStart(2, '0');
                    const day = String(queryScheduleTime.getDate()).padStart(2, '0');
                    const hours = String(queryScheduleTime.getHours()).padStart(2, '0');
                    const minutes = String(queryScheduleTime.getMinutes()).padStart(2, '0');
                    
                    scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
                    post.value.status = 'cron';
                    
                    // Opcional: Salvar imediatamente o post com o novo horário agendado
                    // await saveDraft(); // Descomente se desejar salvar automaticamente ao chegar

                    // Limpar o query param para não aplicar novamente em refresh/navegação
                    const currentQuery = { ...route.query };
                    delete currentQuery.scheduleTime;
                    // Usar router.replace para não adicionar ao histórico
                    router.replace({ query: currentQuery });
                }
            }

            return true
        }

        return false
    } catch (error) {
        console.error('Failed to load post:', error)
        showNotification('error', 'Failed to load post')
        return false
    } finally {
        fullPageLoading.value = false; // Garante que o loading é desativado
    }
}

watch(sidebarOpen, (newValue) => {
    localStorage.setItem('postEditor_sidebarOpen', JSON.stringify(newValue))
})

watch(blocksOpen, (newValue) => {
    localStorage.setItem('postEditor_blocksOpen', JSON.stringify(newValue))
})

watch(() => expandedSections.value.basic, (newValue) => {
    localStorage.setItem('postEditor_expandedBasic', JSON.stringify(newValue))
})

watch(() => expandedSections.value.tags, (newValue) => {
    localStorage.setItem('postEditor_expandedTags', JSON.stringify(newValue))
})

watch(() => expandedSections.value.image, (newValue) => {
    localStorage.setItem('postEditor_expandedImage', JSON.stringify(newValue))
})

watch(() => expandedSections.value.seo, (newValue) => {
    localStorage.setItem('postEditor_expandedSeo', JSON.stringify(newValue))
})

watch(() => expandedSections.value.social, (newValue) => {
    localStorage.setItem('postEditor_expandedSocial', JSON.stringify(newValue))
})

watch(() => expandedSections.value.advanced, (newValue) => {
    localStorage.setItem('postEditor_expandedAdvanced', JSON.stringify(newValue))
})

watch(scheduleDate, (newDate) => {
    if (newDate) {
        // Validar se a data é realmente uma data válida antes de salvar
        try {
            const dateObj = new Date(newDate);
            if (!isNaN(dateObj.getTime())) {
                const isoString = dateObj.toISOString();
                localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, isoString);
            } else {
                console.warn('[PostView] Invalid date, not saving to localStorage:', newDate);
                localStorage.removeItem(LOCAL_STORAGE_SCHEDULE_KEY);
            }
        } catch (error) {
            console.error('[PostView] Error saving date to localStorage:', error);
        }
    } else {
        localStorage.removeItem(LOCAL_STORAGE_SCHEDULE_KEY);
    }
}, { immediate: true }); // Usar immediate para salvar a data inicial se houver uma

// Observar mudanças no status do post
watch(() => post.value.status, (newStatus) => {
    // Quando o status mudar para "Scheduled" (cron) e não houver data definida
    if (newStatus === 'cron' && !scheduleDate.value) {
        loadSavedScheduleDate();
    }
});

function addOneHourToSchedule() {
    let currentDateObj;
    if (scheduleDate.value) {
        const parts = scheduleDate.value.match(/^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})$/);
        if (parts) {
            currentDateObj = new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]));
        } else {
            currentDateObj = new Date(scheduleDate.value); // Fallback, pode não ser ideal se o formato for inesperado
        }
    } else {
        currentDateObj = new Date(); // Usa a data/hora atual se não houver nada definido
    }

    if (isNaN(currentDateObj.getTime())) {
        currentDateObj = new Date(); // Se a data parseada for inválida, usa a atual
    }

    currentDateObj.setHours(currentDateObj.getHours() + 1);

    const year = currentDateObj.getFullYear();
    const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateObj.getDate()).padStart(2, '0');
    const hours = String(currentDateObj.getHours()).padStart(2, '0');
    const minutes = String(currentDateObj.getMinutes()).padStart(2, '0');

    scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    if (post.value.status !== 'cron') {
        post.value.status = 'cron'; // Garante que o status é agendado
    }
    showNotification('success', 'Scheduled time updated by +1 hour.');
}

function subtractOneHourFromSchedule() {
    let currentDateObj;
    if (scheduleDate.value) {
        const parts = scheduleDate.value.match(/^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})$/);
        if (parts) {
            currentDateObj = new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]));
        } else {
            currentDateObj = new Date(scheduleDate.value);
        }
    } else {
        currentDateObj = new Date();
    }

    if (isNaN(currentDateObj.getTime())) {
        currentDateObj = new Date();
    }

    currentDateObj.setHours(currentDateObj.getHours() - 1);

    const year = currentDateObj.getFullYear();
    const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateObj.getDate()).padStart(2, '0');
    const hours = String(currentDateObj.getHours()).padStart(2, '0');
    const minutes = String(currentDateObj.getMinutes()).padStart(2, '0');

    scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    if (post.value.status !== 'cron') {
        post.value.status = 'cron';
    }
    showNotification('success', 'Scheduled time updated by -1 hour.');
}

function addThirtyMinutesToSchedule() {
    let currentDateObj;
    if (scheduleDate.value) {
        const parts = scheduleDate.value.match(/^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})$/);
        if (parts) {
            currentDateObj = new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]));
        } else {
            currentDateObj = new Date(scheduleDate.value);
        }
    } else {
        currentDateObj = new Date();
    }

    if (isNaN(currentDateObj.getTime())) {
        currentDateObj = new Date();
    }

    currentDateObj.setMinutes(currentDateObj.getMinutes() + 30);

    const year = currentDateObj.getFullYear();
    const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateObj.getDate()).padStart(2, '0');
    const hours = String(currentDateObj.getHours()).padStart(2, '0');
    const minutes = String(currentDateObj.getMinutes()).padStart(2, '0');

    scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    if (post.value.status !== 'cron') {
        post.value.status = 'cron';
    }
    showNotification('success', 'Scheduled time updated by +30 minutes.');
}

function subtractThirtyMinutesFromSchedule() {
    let currentDateObj;
    if (scheduleDate.value) {
        const parts = scheduleDate.value.match(/^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})$/);
        if (parts) {
            currentDateObj = new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]));
        } else {
            currentDateObj = new Date(scheduleDate.value);
        }
    } else {
        currentDateObj = new Date();
    }

    if (isNaN(currentDateObj.getTime())) {
        currentDateObj = new Date();
    }

    currentDateObj.setMinutes(currentDateObj.getMinutes() - 30);

    const year = currentDateObj.getFullYear();
    const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateObj.getDate()).padStart(2, '0');
    const hours = String(currentDateObj.getHours()).padStart(2, '0');
    const minutes = String(currentDateObj.getMinutes()).padStart(2, '0');

    scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    if (post.value.status !== 'cron') {
        post.value.status = 'cron';
    }
    showNotification('success', 'Scheduled time updated by -30 minutes.');
}

function insertYouTubeVideo() {
    const input = prompt('Enter YouTube video URL or embed code:')
    if (!input) return

    let videoId = ''

    if (input.includes('iframe')) {
        const srcMatch = input.match(/src="https:\/\/www\.youtube\.com\/embed\/([^?]+)/)

        if (srcMatch && srcMatch[1])
            videoId = srcMatch[1]
    } else {
        const regexPatterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
        ]

        for (const pattern of regexPatterns) {
            const match = input.match(pattern)

            if (match && match[1]) {
                videoId = match[1]
                break
            }
        }
    }

    if (videoId) {
        const videoEmbed = `<div class="video-embed-container">
            <iframe
                src="https://www.youtube.com/embed/${videoId}"
                width="560"
                height="315"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>`;

        editor.chain().focus().insertContent(videoEmbed).run();
    } else {
        alert('Could not identify a valid YouTube video URL or embed code.')
    }
}

function insertVideo() {
    insertYouTubeVideo()
}

function insertAudio() {
    const url = prompt('Enter audio URL:');
    if (url) {
        editor.chain().focus().insertContent({
            type: 'audio',
            attrs: { src: url },
        }).run();
    }
}

const categoryFilter = ref('')
const filteredCategories = computed(() => {
    if (!categoryFilter.value.trim()) return categories.value

    return categories.value.filter(category =>
        category.name.toLowerCase().includes(categoryFilter.value.toLowerCase())
    )
})

function insertHtmlCode() {
    const code = prompt('Enter HTML code:')
    if (code) {
        editor.chain().focus().insertContent(code).run()
    }
}

function insertTable() {
    editor.chain().focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
}

function viewPost(id) {
    window.open(`${blogUrl.value}/preview/${id}`, '_blank')
}

const authors = ref([])
const loadingAuthors = ref(false)
const selectedCoAuthor = ref('')

const postAuthorIds = computed(() => {
    if (!post.value.authors) return []

    return Array.isArray(post.value.authors)
        ? post.value.authors.map(a => typeof a === 'object' ? a.user : a)
        : []
})

const availableCoAuthors = computed(() => {
    const currentAuthorIds = postAuthorIds.value
    return authors.value.filter(author => !currentAuthorIds.includes(author.user))
})

function getAuthorName(userId) {
    const author = authors.value.find(a => a.user === userId)
    return author ? author.name : 'Unknown Author'
}

function addCoAuthor() {
    if (!selectedCoAuthor.value) return;

    if (postAuthorIds.value.includes(selectedCoAuthor.value)) {
        selectedCoAuthor.value = '';
        return;
    }

    if (!post.value.authors)
        post.value.authors = [];

    const authorToAdd = authors.value.find(a => a.user === selectedCoAuthor.value);

    if (authorToAdd) {
        post.value.authors.push(authorToAdd);
        selectedCoAuthor.value = '';
    } else {
        console.warn("Could not find author object for user ID:", selectedCoAuthor.value);
    }
}

function removeCoAuthor(userId) {
    if (!post.value.authors || !Array.isArray(post.value.authors)) return

    post.value.authors = post.value.authors.filter(a =>
        (typeof a === 'object' ? a.user !== userId : a !== userId)
    )
}

async function loadAuthors() {
    try {
        loadingAuthors.value = true
        const response = await adminClient.authors.get({
            limit: 100,
            sort: 'asc',
            sortBy: 'name'
        })
        authors.value = response.data || []
        loadingAuthors.value = false
    } catch (error) {
        console.error('Failed to load authors:', error)
        loadingAuthors.value = false
    }
}

loadAuthors()

watch(() => post.value.author, (newAuthorId) => {
    if (!newAuthorId) return

    const currentAuthorIds = postAuthorIds.value
    if (!currentAuthorIds.includes(newAuthorId)) {
        const authorToAdd = authors.value.find(a => a.user === newAuthorId)

        if (authorToAdd) {
            if (!post.value.authors || !Array.isArray(post.value.authors))
                post.value.authors = []

            post.value.authors.push(authorToAdd)
        }
    }
})

const fullPageLoading = ref(false);
const loadingMessage = ref('Saving changes...');
const showMediaDialog = ref(false);
const mediaDialogType = ref('all');
const mediaSelectCallback = ref(null);

function handleMediaSelected(media) {
    if (mediaSelectCallback.value) {
        mediaSelectCallback.value(media);
    }
}

function handleImageClick(e) {
    const target = e.target;

    if (target.nodeName === 'IMG' && target.closest('.ProseMirror')) {
        const img = target;
        const rect = img.getBoundingClientRect();
        const deleteButtonArea = {
            top: rect.top - 22,
            left: rect.right - 22,
            bottom: rect.top,
            right: rect.right
        };

        if (e.clientX >= deleteButtonArea.left && e.clientX <= deleteButtonArea.right &&
            e.clientY >= deleteButtonArea.top && e.clientY <= deleteButtonArea.bottom) {
            editor.chain().focus().deleteSelection().run();
            e.preventDefault();
            e.stopPropagation();
        } else {
            const { state } = editor;
            let foundPos = -1;

            state.doc.nodesBetween(0, state.doc.content.size, (node, pos) => {
                if (foundPos > -1) return false;
                if (node.type.name === 'image' && node.attrs.src === img.src) {
                    foundPos = pos;
                    return false;
                }
                return true;
            });

            if (foundPos > -1) {
                editor.commands.setNodeSelection(foundPos);
            }
        }
    }

    if (target.classList.contains('tweet-delete-button') || target.closest('.tweet-delete-button')) {
        editor.chain().focus().deleteSelection().run();
        e.preventDefault();
        e.stopPropagation();
    } else if (target.closest('.tweet-embed') && !target.closest('iframe')) {
        const tweetElement = target.closest('.tweet-embed');
        const tweetId = tweetElement.getAttribute('data-tweet');

        if (tweetId) {
            const { state } = editor;
            let foundPos = -1;

            state.doc.nodesBetween(0, state.doc.content.size, (node, pos) => {
                if (foundPos > -1) return false;
                if (node.type.name === 'tweet' && node.attrs.tweetId === tweetId) {
                    foundPos = pos;
                    return false;
                }
                return true;
            });

            if (foundPos > -1) {
                editor.commands.setNodeSelection(foundPos);
                e.preventDefault();
            }
        }
    }

    if (target.classList.contains('reddit-delete-button') || target.closest('.reddit-delete-button')) {
        editor.chain().focus().deleteSelection().run();
        e.preventDefault();
        e.stopPropagation();
    } else if (target.closest('.reddit-embed') && !target.closest('iframe')) {
        const redditElement = target.closest('.reddit-embed');
        const postId = redditElement.getAttribute('data-reddit');

        if (postId) {
            const { state } = editor;
            let foundPos = -1;

            state.doc.nodesBetween(0, state.doc.content.size, (node, pos) => {
                if (foundPos > -1) return false;
                if (node.type.name === 'reddit' && node.attrs.postId === postId) {
                    foundPos = pos;
                    return false;
                }
                return true;
            });

            if (foundPos > -1) {
                editor.commands.setNodeSelection(foundPos);
                e.preventDefault();
            }
        }
    }

    if (target.classList.contains('iframe-delete-button') || target.closest('.iframe-delete-button')) {
        editor.chain().focus().deleteSelection().run();
        e.preventDefault();
        e.stopPropagation();
    } else if (target.closest('.iframe-wrapper') && !target.closest('iframe')) {
        const iframeElement = target.closest('.iframe-wrapper');

        if (iframeElement) {
            const { state } = editor;
            let foundPos = -1;

            state.doc.nodesBetween(0, state.doc.content.size, (node, pos) => {
                if (foundPos > -1) return false;
                if (node.type.name === 'iframe') {
                    const iframePos = editor.view.posAtDOM(iframeElement, 0);
                    if (Math.abs(pos - iframePos) < 10) {
                        foundPos = pos;
                        return false;
                    }
                }
                return true;
            });

            if (foundPos > -1) {
                editor.commands.setNodeSelection(foundPos);
                e.preventDefault();
            }
        }
    }

    if (target.classList.contains('audio-delete-button') || target.closest('.audio-delete-button')) {
        editor.chain().focus().deleteSelection().run();
        e.preventDefault();
        e.stopPropagation();
    } else if (target.closest('.audio-embed') && !target.closest('audio')) {
        const audioElement = target.closest('.audio-embed');
        const audioSrc = audioElement.getAttribute('data-audio-src');

        if (audioSrc) {
            const { state } = editor;
            let foundPos = -1;

            state.doc.nodesBetween(0, state.doc.content.size, (node, pos) => {
                if (foundPos > -1) return false;
                if (node.type.name === 'audio' && node.attrs.src === audioSrc) {
                    foundPos = pos;
                    return false;
                }
                return true;
            });

            if (foundPos > -1) {
                editor.commands.setNodeSelection(foundPos);
                e.preventDefault();
            }
        }
    }
}

const showImageProcessingDialog = ref(false)
const imageProcessingLoading = ref(false)

function isFeatureImageUnprocessed() {
    const featureImage = post.value.featureImage;

    if(!featureImage)
        return true;

    if(featureImage.startsWith("https://static") || featureImage.startsWith("https://cdn"))
        return false;

    if(!featureImage.includes(window.location.hostname) &&
        !featureImage.includes(settings.value["blog.url"]))
        return true;

    if (featureImage && (
        featureImage.startsWith('data:') ||
        (featureImage.startsWith('/') && !featureImage.includes('://')) ||
        featureImage.includes('imageProxy')
    )) {
        return true;
    }

    return false;
}

async function processFeatureImage() {
    imageProcessingLoading.value = true;

    try {
        if (post.value.featureImage.startsWith('data:')) {
            const formData = new FormData();

            const blob = await fetch(post.value.featureImage).then(r => r.blob());
            formData.append('file', blob, 'feature-image.jpg');

            const response = await adminClient.medias.upload(formData);

            if (response && response.url) {
                post.value.featureImage = response.url;
                showNotification('success', 'Imagem processada com sucesso');
                showImageProcessingDialog.value = false;
                showPublishDialog.value = true;
            } else {
                throw new Error('Falha ao fazer upload da imagem');
            }
        }
        else if (post.value.featureImage.includes('://')) {
            const response = await adminClient.medias.importFromUrl({
                url: post.value.featureImage,
                alt: post.value.featureImageAlt || '',
                caption: post.value.featureImageCaption || ''
            });

            if (response && response.url) {
                post.value.featureImage = response.url;
                showNotification('success', 'Imagem processada com sucesso');
                showImageProcessingDialog.value = false;
                saveDraft();
            } else {
                throw new Error('Falha ao processar a imagem');
            }
        }
    } catch (error) {
        console.error('Erro ao processar imagem:', error);
        showNotification('error', error.message || 'Falha ao processar a imagem');
    } finally {
        imageProcessingLoading.value = false;
    }
}

function proceedWithPublish() {
    showImageProcessingDialog.value = false;
    showPublishDialog.value = true;
}

function insertTweet() {
    const tweetUrl = prompt('Enter Twitter/X tweet URL:')
    if (!tweetUrl) return

    const tweetIdRegex = /\/status\/(\d+)/
    const match = tweetUrl.match(tweetIdRegex)

    if (match && match[1]) {
        const tweetId = match[1]

        editor.chain().focus().insertContent({
            type: 'tweet',
            attrs: {
                url: tweetUrl,
                tweetId: tweetId
            }
        }).run()
    } else {
        alert('Invalid tweet URL. Please enter a valid Twitter/X status URL.')
    }
}

function insertReddit() {
    const redditUrl = prompt('Enter Reddit post URL:')
    if (!redditUrl) return

    const redditRegex = /reddit\.com\/r\/([^\/]+)\/comments\/([^\/]+)/
    const match = redditUrl.match(redditRegex)

    if (match && match[1] && match[2]) {
        const subreddit = match[1]
        const postId = match[2]
        const embedId = `${subreddit}/comments/${postId}`

        editor.chain().focus().insertContent({
            type: 'reddit',
            attrs: {
                url: redditUrl,
                postId: embedId
            }
        }).run()
    } else {
        alert('Invalid Reddit URL. Please enter a valid Reddit post URL (e.g., https://www.reddit.com/r/subreddit/comments/postid/title).')
    }
}

const showAIGenerateDialog = ref(false)
const aiGenerateUrl = ref('')
const aiGenerateLoading = ref(false)
const aiGenerateJobId = ref('')
const aiGeneratePollingInterval = ref(null)

async function generateFromUrl() {
    if (!aiGenerateUrl.value) {
        showNotification('error', 'Please enter a valid URL')
        return
    }

    try {
        aiGenerateLoading.value = true

        // Start the job
        const response = await adminClient.posts.startGenerate({
            url: aiGenerateUrl.value
        })

        if (!response || !response.jobId) {
            throw new Error('Failed to start content generation job')
        }

        // Store the job ID
        aiGenerateJobId.value = response.jobId

        // Start polling for job status
        aiGeneratePollingInterval.value = setInterval(checkGenerateJobStatus, 2000)

        // Keep dialog open with loading state
        // The dialog will be closed once the job completes
    } catch (error) {
        console.error('Failed to start content generation:', error)
        showNotification('error', error.message || 'Failed to start content generation')
        aiGenerateLoading.value = false
    }
}

async function checkGenerateJobStatus() {
    if (!aiGenerateJobId.value) {
        clearInterval(aiGeneratePollingInterval.value)
        return
    }

    try {
        const statusResponse = await adminClient.posts.getGenerateStatus(aiGenerateJobId.value)

        if (statusResponse.status === 'completed') {
            // Job completed successfully, update the UI
            clearInterval(aiGeneratePollingInterval.value)

            const result = statusResponse.result

            // Update post data
            post.value.title = result.title || post.value.title
            post.value.excerpt = result.excerpt || post.value.excerpt

            if (result.suggestedTags && Array.isArray(result.suggestedTags)) {
                post.value.tags = result.suggestedTags
            }

            if (result.slug) {
                post.value.slug = result.slug
                slugManuallyEdited.value = true
            }

            if (result.featureImage) {
                post.value.featureImage = result.featureImage
            }

            if (result.content) {
                editor.commands.setContent(result.content)
                post.value.content = result.content
            }

            showNotification('success', 'Content generated successfully')
            showAIGenerateDialog.value = false
            aiGenerateUrl.value = ''
            aiGenerateJobId.value = ''
            aiGenerateLoading.value = false

            nextTick(() => {
                autoResizeTitle()
            })
        }
        else if (statusResponse.status === 'error') {
            // Job failed
            clearInterval(aiGeneratePollingInterval.value)
            throw new Error(statusResponse.error || 'Content generation failed')
        }
        // For 'pending' or 'processing' status, continue polling

    } catch (error) {
        clearInterval(aiGeneratePollingInterval.value)
        console.error('Error checking job status:', error)
        showNotification('error', error.message || 'Failed to generate content')
        aiGenerateLoading.value = false
    }
}

// Clean up polling on component unmount
onBeforeUnmount(() => {
    if (aiGeneratePollingInterval.value) {
        clearInterval(aiGeneratePollingInterval.value)
    }
})

// Add this function near the generateFromUrl function
function cancelGeneration() {
    if (aiGeneratePollingInterval.value) {
        clearInterval(aiGeneratePollingInterval.value);
    }
    aiGenerateJobId.value = '';
    aiGenerateLoading.value = false;
    showAIGenerateDialog.value = false;
}

const handleNextScheduledPostLoading = ref(false);
const hasDraftPosts = ref(true); // Novo estado para controlar disponibilidade de drafts

// Adicionar nova função aqui
async function handleNextScheduledPost() {
    if (!scheduleDate.value) {
        showNotification('error', 'Please set a schedule time first.');
        return;
    }
    if (post.value.status !== 'cron') {
        showNotification('warn', 'Post status must be "Scheduled" to use this feature.');
        return;
    }

    handleNextScheduledPostLoading.value = true;
    // fullPageLoading será gerenciado por saveDraft e explicitamente depois

    try {
        // 1. Salvar o post atual. saveDraft() atualiza autoPublishAt e retorna uma promessa.
        await saveDraft();
        // post.value.id deve ter sido atualizado por saveDraft se for um novo post.

        // 2. Buscar o próximo post draft
        fullPageLoading.value = true; // Ativar para a busca e navegação
        loadingMessage.value = 'Finding next draft post...';

        const draftPostsResponse = await adminClient.posts.get({
            limit: 5, // Pega alguns para ter mais chance de achar um diferente do atual
            sort: 'asc',
            sortBy: 'createdAt', 
            status: 'draft' // Modificado: Tentar passar o status diretamente
        });

        let nextPostToLoad = null;
        // Corrigir aqui para acessar a lista de posts corretamente
        const postsList = draftPostsResponse.posts || (draftPostsResponse.data && draftPostsResponse.data.posts); 

        if (postsList && postsList.length > 0) {
            // Tenta encontrar um post draft que NÃO seja o atual.
            nextPostToLoad = postsList.find(p => p.id !== post.value.id);

            if (!nextPostToLoad && postsList.length > 0) { // Se não encontrou um diferente, e ainda há posts
                if (postsList[0].id !== post.value.id) {
                    // Se o primeiro da lista já é diferente, usa ele
                    nextPostToLoad = postsList[0];
                } else if (postsList.length > 1) {
                    // Se o primeiro é o atual, mas há um segundo, usa o segundo
                    nextPostToLoad = postsList[1];
                }
            }
        }

        if (nextPostToLoad) {
            let currentScheduleDateObj;
            const scheduleDateComponents = scheduleDate.value.match(/^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})$/);
            if (scheduleDateComponents) {
                const [_, year, month, day, hours, minutes] = scheduleDateComponents;
                currentScheduleDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
            } else {
                currentScheduleDateObj = new Date(scheduleDate.value); // Fallback
            }

            if (isNaN(currentScheduleDateObj.getTime())) {
                 showNotification('error', 'Invalid current schedule date format.');
                 fullPageLoading.value = false;
                 handleNextScheduledPostLoading.value = false;
                 return;
            }

            const nextScheduleDateTime = new Date(currentScheduleDateObj.getTime() + (60 * 60 * 1000)); // Adiciona 1 hora

            loadingMessage.value = `Loading post: ${nextPostToLoad.title || nextPostToLoad.id}...`;
            router.push(`/post/${nextPostToLoad.id}?scheduleTime=${nextScheduleDateTime.toISOString()}`);
            // Não desativar fullPageLoading aqui, deixar a navegação cuidar.
        } else {
            // Atualizar o estado de disponibilidade de posts draft quando não há mais
            hasDraftPosts.value = false;
            showNotification('success', 'No more draft posts found. All posts have been scheduled!');
            fullPageLoading.value = false; // Desativa se não houver próximo post
        }

    } catch (error) {
        // Erros de saveDraft já devem ter sido mostrados e fullPageLoading tratado por ele.
        // Erros da busca de posts precisam desativar o fullPageLoading.
        console.error('Error in handleNextScheduledPost:', error);
        // Não mostrar notificação duplicada se saveDraft já mostrou.
        if (!(error.message && error.message.includes('Failed to save post'))) {
             showNotification('error', error.message || 'Failed to process next scheduled post.');
        }
        fullPageLoading.value = false;
    } finally {
        handleNextScheduledPostLoading.value = false;
        // fullPageLoading é desativado se não houver navegação ou em erro aqui.
        // Se houver navegação, o recarregamento do componente trata o fullPageLoading.
    }
}

watch(() => route.params.id, (newId, oldId) => {
    if (newId && newId !== oldId) {
        //console.log(`[PostView] Route param id changed from ${oldId} to ${newId}. Reloading post.`);
        // Limpar o estado do post antes de carregar um novo, se necessário
        // resetPostState(); // Você precisaria criar essa função se quiser limpar tudo
        editor.commands.setContent(''); // Limpa o editor
        post.value.title = ''; // Limpa o título do post anterior
        // Outras limpezas de estado do post podem ser necessárias aqui

        loadPost(newId);
    }
});

watch(() => route.query.scheduleTime, (newScheduleTime) => {
    if (newScheduleTime && post.value.id === route.params.id) { // Aplica apenas se o post já carregado for o da rota atual
        //console.log(`[PostView] scheduleTime query param changed to: ${newScheduleTime}. Applying to current post.`);
        const queryScheduleDate = new Date(newScheduleTime);
        if (!isNaN(queryScheduleDate.getTime())) {
            const year = queryScheduleDate.getFullYear();
            const month = String(queryScheduleDate.getMonth() + 1).padStart(2, '0');
            const day = String(queryScheduleDate.getDate()).padStart(2, '0');
            const hours = String(queryScheduleDate.getHours()).padStart(2, '0');
            const minutes = String(queryScheduleDate.getMinutes()).padStart(2, '0');
            
            scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            post.value.status = 'cron';

            // Limpar o query param para não aplicar novamente em refresh/navegação futura na mesma instância
            const currentQuery = { ...route.query };
            delete currentQuery.scheduleTime;
            router.replace({ query: currentQuery }); 
        } else {
            console.warn('[PostView] Invalid scheduleTime in query param during watch:', newScheduleTime);
        }
    }
}, { immediate: false }); // Não executar imediatamente na montagem inicial, pois loadPost já cuida disso

// Função para carregar a data salva no localStorage
function loadSavedScheduleDate() {
    try {
        // Primeiro tenta carregar a próxima data programada (para sequência)
        const savedNextScheduleDate = localStorage.getItem(LOCAL_STORAGE_NEXT_SCHEDULE_KEY);
        
        if (savedNextScheduleDate) {
            const dateObj = new Date(savedNextScheduleDate);
            if (!isNaN(dateObj.getTime())) {
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                
                scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
                
                // Calcular a próxima data (+1h) para uso futuro
                const nextDate = new Date(dateObj.getTime() + 60 * 60 * 1000);
                localStorage.setItem(LOCAL_STORAGE_NEXT_SCHEDULE_KEY, nextDate.toISOString());
                
                return true;
            }
        }
        
        // Se não encontrou próxima data, tenta a última data normal
        const savedScheduleDate = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_KEY);
        
        if (savedScheduleDate) {
            const dateObj = new Date(savedScheduleDate);
            if (!isNaN(dateObj.getTime())) {
                // Adicionar 1 hora à última data usada
                const nextDateObj = new Date(dateObj.getTime() + 60 * 60 * 1000);
                
                const year = nextDateObj.getFullYear();
                const month = String(nextDateObj.getMonth() + 1).padStart(2, '0');
                const day = String(nextDateObj.getDate()).padStart(2, '0');
                const hours = String(nextDateObj.getHours()).padStart(2, '0');
                const minutes = String(nextDateObj.getMinutes()).padStart(2, '0');
                
                scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
                
                // Salvar para uso futuro
                localStorage.setItem(LOCAL_STORAGE_NEXT_SCHEDULE_KEY, nextDateObj.toISOString());
                
                return true;
            }
        }
        
        // Se nenhuma data foi encontrada, criar uma baseada na hora atual + 1h
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 1);
        
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        
        scheduleDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        
        // Salvar para uso futuro
        localStorage.setItem(LOCAL_STORAGE_NEXT_SCHEDULE_KEY, currentDate.toISOString());
        localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, currentDate.toISOString());
        
        return true;
    } catch (error) {
        return false;
    }
}

// Verificar se há posts em draft disponíveis
async function checkDraftPostsAvailability() {
    try {
        const response = await adminClient.posts.get({
            limit: 1,
            status: 'draft'
        });
        
        hasDraftPosts.value = response.posts && response.posts.length > 0;
    } catch (error) {
        hasDraftPosts.value = true; // Em caso de erro, assumir que há drafts por segurança
    }
}
</script>

<style>
.ProseMirror {
    min-height: 300px;
    outline: none;
    color: #333;
}

.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    pointer-events: none;
    height: 0;
}

/* Estilos para imagens */
.ProseMirror img {
    max-width: 100%;
    height: auto;
    transition: all 0.3s ease;
    cursor: pointer;
}

.ProseMirror img.ProseMirror-selectednode {
    outline: 3px solid #4f46e5;
    border-radius: 2px;
}

/* Classe para controle de redimensionamento */
.resizable-image {
    display: inline-block;
    position: relative;
    margin: 1rem 0;
}

.ProseMirror-selectednode.resizable-image::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1;
}

/* Botões de controle que aparecem quando a imagem é selecionada */
.ProseMirror-selectednode.resizable-image::before {
    content: "⨯";
    position: absolute;
    top: -10px;
    right: -10px;
    width: 24px;
    height: 24px;
    background: #ff4444;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    z-index: 10;
}

/* Light theme styles for editor content */
.prose :where(h1):not(:where([class~="not-prose"] *)) {
    font-size: 2.25em;
    margin-top: 1em;
    margin-bottom: 0.5em;
    line-height: 1.1;
    color: #111827;
}

.prose :where(h2):not(:where([class~="not-prose"] *)) {
    font-size: 1.5em;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    line-height: 1.3;
    color: #111827;
}

.prose :where(p):not(:where([class~="not-prose"] *)) {
    margin-top: 1.25em;
    margin-bottom: 1.25em;
    line-height: 1.7;
    color: #374151;
}

.prose :where(a):not(:where([class~="not-prose"] *)) {
    color: #2563eb;
    text-decoration: underline;
    font-weight: 500;
}

.prose :where(blockquote):not(:where([class~="not-prose"] *)) {
    font-weight: 500;
    font-style: italic;
    color: #4b5563;
    border-left-width: 0.25rem;
    border-left-color: #e5e7eb;
    padding-left: 1em;
    background-color: #f9fafb;
    border-radius: 0.25rem;
}

.prose :where(ul):not(:where([class~="not-prose"] *)) {
    list-style-type: disc;
    padding-left: 1.625em;
}

.prose :where(ol):not(:where([class~="not-prose"] *)) {
    list-style-type: decimal;
    padding-left: 1.625em;
}

.prose :where(code):not(:where([class~="not-prose"] *)) {
    color: #111827;
    background-color: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-size: 0.875em;
}

.prose :where(pre):not(:where([class~="not-prose"] *)) {
    background-color: #1e293b;
    color: #e2e8f0;
    overflow-x: auto;
    border-radius: 0.375rem;
    padding: 1em;
}

/* Add these styles for the editor content */
.video-embed {
    position: relative;
    padding-bottom: 56.25%;  /* 16:9 aspect ratio */
    height: 0;
    margin: 1.5em 0;
    overflow: hidden;
}

.video-embed iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.375rem;
}

/* Make sure the editor properly renders the iframe */
.ProseMirror iframe {
    pointer-events: none; /* Prevents iframe interaction while editing */
    border: 1px solid #e5e7eb;
}

.columns-container {
    display: flex;
    gap: 1rem;
    margin: 1.5em 0;
}

.column {
    flex: 1;
    min-width: 0;
}

/* Rest of your existing styles */

/* Add this to the bottom of your style section */
.fixed-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 16px !important;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;
  max-width: 100vw;
}

/* Placeholder to prevent content jump */
.fixed-toolbar + * {
  padding-top: 47px; /* Match the height of your toolbar */
}

/* Adicionar ao bloco <style> no final do arquivo */
.ProseMirror iframe {
    min-width: 560px;
    min-height: 315px;
    border: none;
    display: block;
    margin: 1rem auto;
}

/* Adicionar estilo específico para contêiner de vídeo */
.video-embed-container {
    position: relative;
    overflow: hidden;
    min-width: 560px;
    min-height: 315px;
    padding-bottom: 56.25%;
    margin: 1.5rem auto;
}

.video-embed-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 315px;
}

/* Add Tweet embed styles */
.tweet-embed {
    margin: 1.5rem 0;
    width: 100%;
}

.tweet-embed-container {
    position: relative;
    width: 100%;
    max-width: 550px;
    margin: 0 auto;
    padding-bottom: min(500px, 120%); /* Aspect ratio container */
}

.tweet-embed-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}

.tweet-invalid {
    padding: 1rem;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    color: #ef4444;
    text-align: center;
    margin: 1rem 0;
}

/* Styles for selected tweet */
.ProseMirror-selectednode .tweet-embed {
    outline: 3px solid #4f46e5;
    border-radius: 4px;
}

/* Delete button for tweets */
.tweet-embed-actions {
    position: absolute;
    top: -12px;
    right: -12px;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ProseMirror-selectednode .tweet-embed-actions {
    opacity: 1;
}

.tweet-delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #ef4444;
    color: white;
    border-radius: 50%;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tweet-delete-button:hover {
    background-color: #dc2626;
}

/* Reddit embed styles */
.reddit-embed {
    margin: 1.5rem 0;
    width: 100%;
}

.reddit-embed-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: min(700px, 90%); /* Reduced aspect ratio container */
}

.reddit-embed-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}

/* Styles for selected reddit post */
.ProseMirror-selectednode .reddit-embed {
    outline: 3px solid #4f46e5;
    border-radius: 4px;
}

/* Delete button for reddit posts */
.reddit-embed-actions {
    position: absolute;
    top: -12px;
    right: -12px;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ProseMirror-selectednode .reddit-embed-actions {
    opacity: 1;
}

.reddit-delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #ef4444;
    color: white;
    border-radius: 50%;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.reddit-delete-button:hover {
    background-color: #dc2626;
}

.reddit-invalid {
    padding: 1rem;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    color: #ef4444;
    text-align: center;
    margin: 1rem 0;
}

/* Iframe wrapper styles */
.iframe-wrapper {
    position: relative;
    margin: 1.5rem 0;
    width: 100%;
}

.ProseMirror-selectednode .iframe-wrapper {
    outline: 3px solid #4f46e5;
    border-radius: 4px;
}

/* Delete button for iframes */
.iframe-actions {
    position: absolute;
    top: -12px;
    right: -12px;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ProseMirror-selectednode .iframe-actions {
    opacity: 1;
}

.iframe-delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #ef4444;
    color: white;
    border-radius: 50%;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.iframe-delete-button:hover {
    background-color: #dc2626;
}

/* Add these to your existing iframe styles */
.ProseMirror .iframe-wrapper iframe {
    pointer-events: none; /* disable pointer events when in editor */
    width: 100%;
    min-height: 315px;
    border: none;
}

.ProseMirror-selectednode .iframe-wrapper iframe {
    opacity: 0.7; /* dim the iframe when selected to show it's in edit mode */
}

/* Audio embed styles */
.audio-embed {
    position: relative;
    margin: 1.5rem 0;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.ProseMirror-selectednode .audio-embed {
    outline: 3px solid #4f46e5;
    border-radius: 4px;
}

.audio-embed-actions {
    position: absolute;
    top: -12px;
    right: -12px;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ProseMirror-selectednode .audio-embed-actions {
    opacity: 1;
}

.audio-delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #ef4444;
    color: white;
    border-radius: 50%;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.audio-delete-button:hover {
    background-color: #dc2626;
}

.audio-invalid {
    padding: 1rem;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    color: #ef4444;
    text-align: center;
    margin: 1rem 0;
}


/* Iframe wrapper styles */
.iframe-wrapper {
    position: relative;
    margin: 1.5rem 0;
    width: 100%;
}

.ProseMirror-selectednode .iframe-wrapper {
    outline: 3px solid #4f46e5;
    border-radius: 4px;
}

/* Delete button for iframes */
.iframe-actions {
    position: absolute;
    top: -12px;
    right: -12px;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.ProseMirror-selectednode .iframe-actions {
    opacity: 1;
}

.iframe-delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #ef4444;
    color: white;
    border-radius: 50%;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.iframe-delete-button:hover {
    background-color: #dc2626;
}

/* Add these to your existing iframe styles */
.ProseMirror .iframe-wrapper iframe {
    pointer-events: none; /* disable pointer events when in editor */
    width: 100%;
    min-height: 315px;
    border: none;
}

.ProseMirror-selectednode .iframe-wrapper iframe {
    opacity: 0.7; /* dim the iframe when selected to show it's in edit mode */
}
</style>
