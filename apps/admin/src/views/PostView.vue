<template>
    <div class="flex h-screen bg-neutral-900 text-white overflow-hidden">

        <!-- Main Editor Area -->
        <div class="flex-1 flex flex-col h-screen overflow-hidden" :class="{ 'mr-80': sidebarOpen }">
            <!-- Top Toolbar -->
            <div class="bg-neutral-900 border-b border-neutral-900 p-2 flex justify-between items-center">
                <div class="flex items-center space-x-4">
                    <a href="/posts" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
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
                        Save Draft
                    </button>
                    <button
                        @click="viewPost(post.id)"
                        class="px-3 py-1.5 rounded-md text-sm font-medium border border-neutral-600 hover:border-neutral-500 transition-colors cursor-pointer">
                        Preview
                    </button>
                    <button
                        class="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                        @click="confirmPublish">
                        {{ postStatus === 'published' ? 'Update' : 'Publish' }}
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

            <!-- Add this right after the top toolbar and before the Editor Area div -->
            <!-- Fixed Editor Toolbar - make it more compact -->
            <div class="bg-white border-b border-neutral-200 py-1 px-3 flex flex-wrap items-center space-x-0.5 sticky top-0 z-10 shadow-sm">
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
                        <span class="font-bold text-neutral-600">B</span>
                    </button>
                    <button @click="editor.chain().focus().toggleItalic().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('italic') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Italic">
                        <span class="italic text-neutral-600">I</span>
                    </button>
                    <button @click="setLink"
                        :class="{ 'bg-neutral-100': editor.isActive('link') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Link">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </button>
                </div>

                <div class="flex items-center mr-1.5 border-r border-neutral-200 pr-1.5">
                    <button @click="editor.chain().focus().toggleBulletList().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('bulletList') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Bullet List">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                    <button @click="editor.chain().focus().toggleOrderedList().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('orderedList') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Numbered List">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h6M11 11h6M11 15h6" />
                        </svg>
                    </button>
                </div>

                <div class="flex items-center mr-1.5 border-r border-neutral-200 pr-1.5">
                    <button @click="editor.chain().focus().toggleCodeBlock().run()"
                        :class="{ 'bg-neutral-100': editor.isActive('codeBlock') }"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Code Block">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </button>
                    <button @click="insertHtmlCode"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="HTML Code">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-neutral-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div class="flex items-center">
                    <button @click="insertYouTubeVideo"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="YouTube Video">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                        </svg>
                    </button>
                    <button @click="insertImage"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Image">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button @click="insertTable"
                        class="p-1.5 rounded hover:bg-neutral-100 transition-colors w-8 h-8 flex items-center justify-center" title="Table">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
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
                                class="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-neutral-400 resize-none overflow-hidden"
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
                            <div class="flex items-center space-x-2">
                                <div class="flex -space-x-2">
                                    <div class="h-8 w-8 rounded-full bg-neutral-600 border-2 border-neutral-800"></div>
                                </div>
                                <button class="text-sm text-blue-500 hover:text-blue-400">Add another</button>
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
                                        <input type="radio" v-model="post.status" value="scheduled"
                                            class="rounded-full bg-neutral-700 border-neutral-600 text-blue-600" />
                                        <span class="ml-2 text-sm">Scheduled</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div v-if="post.status === 'scheduled'">
                            <label class="block text-sm font-medium text-neutral-400 mb-1">Schedule for</label>
                            <input v-model="scheduleDate" type="datetime-local"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>

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
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        <span>Paragraph</span>
                    </div>
                    <div @click="insertHeading"
                        class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 5h14M5 12h14M5 19h14" />
                        </svg>
                        <span>Heading</span>
                    </div>
                    <div @click="insertList" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <span>List</span>
                    </div>

                    <div class="text-xs font-semibold text-neutral-400 px-2 py-1 mt-4">Media</div>
                    <div @click="insertImage" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Image</span>
                    </div>
                    <div @click="insertVideo" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Video</span>
                    </div>

                    <div class="text-xs font-semibold text-neutral-400 px-2 py-1 mt-4">Layout</div>
                    <div @click="insertColumns"
                        class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        <span>Columns</span>
                    </div>
                    <div @click="insertQuote" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span>Quote</span>
                    </div>
                    <div @click="insertDivider"
                        class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
                        </svg>
                        <span>Divider</span>
                    </div>
                    <div @click="insertYouTubeVideo" class="flex items-center p-2 rounded hover:bg-neutral-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                        </svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </button>
                    <button @click="editor.chain().focus().toggleCode().run()"
                        :class="{ 'bg-neutral-700': editor.isActive('code') }"
                        class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </button>
                    <button @click="editor.chain().focus().toggleBulletList().run()"
                        :class="{ 'bg-neutral-700': editor.isActive('bulletList') }"
                        class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </button>
                <!-- Add YouTube video button -->
                <button @click="insertYouTubeVideo" class="p-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                    </svg>
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

        <!-- Empty Line Add Button -->
        <div v-if="showAddButton" ref="addButtonContainer"
            class="absolute bg-blue-600 rounded-full z-50 w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
            :style="{ top: addButtonPos.top + 'px', left: addButtonPos.left + 'px' }" @click="toggleBlocks">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
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
    <div v-if="notification.show"
        class="fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg flex items-center z-50"
        :class="notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
        <span v-if="notification.type === 'success'" class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
        </span>
        <span v-else class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
        </span>
        <span>{{ notification.message }}</span>
        <button @click="notification.show = false" class="ml-4 text-white hover:text-neutral-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>

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
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchEffect, nextTick, watch } from 'vue'
import { useUtils } from "../composables/useUtils";
import { useRouter, useRoute } from 'vue-router'
import { Editor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import { default as TiptapImage } from '@tiptap/extension-image'
import { useAdminClient } from '@cmmv/blog/admin/client'

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
    canonicalUrl: ''
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
        StarterKit,
        Placeholder.configure({
            placeholder: 'Click to write or press + for commands...',
        }),
        Link.configure({
            openOnClick: false,
        }),
        TiptapImage,
        Youtube.configure({
            controls: true,
            nocookie: true,
        }),
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
    const url = prompt('Enter image URL')
    if (url) {
        editor.chain().focus().setImage({ src: url }).run()
    }
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

function autoResizeTitle() {
    const textarea = titleTextarea.value
    if (!textarea) return

    textarea.style.height = 'auto'

    textarea.style.height = textarea.scrollHeight + 'px'
}

onMounted(async () => {
    const postId = route.params.id

    if (postId) {
        const loaded = await loadPost(postId)

        if (!loaded) {
            showNotification('error', 'Could not find the requested post')
            return
        }
    }

    loadCategories()
    loadTags()
    loadBlogUrl();
    document.addEventListener('click', handleGlobalClick)

    nextTick(() => {
        autoResizeTitle()
    })
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleGlobalClick)
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
        case 'scheduled': return 'Scheduled'
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

// Feature image crop state
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
    featureImageInput.value.click()
}

function handleFeatureImageSelect(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        const img = new Image()
        img.crossOrigin = "Anonymous"

        img.onload = () => {
            console.log('Feature image loaded', { width: img.width, height: img.height })
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

    // Set output dimensions (use reasonable size for web display)
    const outputWidth = 1200
    const outputHeight = 675 // 16:9 aspect ratio

    // Set temp canvas size
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
        savePost()
    } else {
        showPublishDialog.value = true
    }
}

function publishPost() {
    publishLoading.value = true
    post.value.status = 'published'
    post.value.publishedAt = new Date().toISOString()

    savePost()
        .then(() => {
            showPublishDialog.value = false
            publishLoading.value = false
        })
        .catch(error => {
            console.error('Failed to publish post:', error)
            publishLoading.value = false
        })
}

async function savePost() {
    try {
        const postData = {
            ...post.value,
            content: editor.getHTML()
        }

        if (post.value.status === 'scheduled' && scheduleDate.value)
            postData.autoPublishAt = new Date(scheduleDate.value).toISOString()

        const payload = {
            post: postData,
            meta: postMeta.value
        }

        const response = await adminClient.posts.save(payload)

        if (response && response.id) {
            showNotification('success', 'Post saved successfully')

            if (!post.value.id)
                router.push(`/post/${response.id}`)

            return response
        }
        else if(response.result){
            showNotification('success', 'Post saved successfully')
        }
    } catch (error) {
        console.error('Failed to save post:', error)
        showNotification('error', error.message || 'Failed to save post')
        throw error
    }
}

function saveDraft() {
    post.value.status = 'draft'
    savePost()
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

            if (post.value.status === 'scheduled' && post.value.autoPublishAt) {
                const date = new Date(post.value.autoPublishAt)
                scheduleDate.value = date.toISOString().slice(0, 16)
            }

            nextTick(() => {
                autoResizeTitle()
            })

            return true
        }

        return false
    } catch (error) {
        console.error('Failed to load post:', error)
        showNotification('error', 'Failed to load post')
        return false
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

function insertYouTubeVideo() {
    const input = prompt('Enter YouTube video URL or embed code:')
    if (!input) return

    let videoId = ''

    // Check if it's an embed code
    if (input.includes('iframe')) {
        // Extract video ID from src attribute in the iframe tag
        const srcMatch = input.match(/src="https:\/\/www\.youtube\.com\/embed\/([^?]+)/)
        if (srcMatch && srcMatch[1]) {
            videoId = srcMatch[1]
        }
    } else {
        // Try to extract video ID from various YouTube URL formats
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
        editor.commands.setYoutubeVideo({
            src: input
        })
    } else {
        alert('Could not identify a valid YouTube video URL or embed code.')
    }
}

// You can keep the old insertVideo function or replace it with the above one
function insertVideo() {
    insertYouTubeVideo()
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
</style>
