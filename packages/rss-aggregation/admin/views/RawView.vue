<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Feed Raws</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <!-- Add search dropdown button -->
                <div class="relative">
                    <button @click="toggleSearchDropdown" data-search-toggle
                        class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center relative">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                        <!-- Indicator dot for active search -->
                        <span
                            v-if="filters.search.trim()"
                            class="absolute -top-1 -right-1 h-2.5 w-2.5 bg-blue-500 rounded-full"
                            title="Search filter active">
                        </span>
                    </button>
                    <!-- Search dropdown -->
                    <div v-if="showSearchDropdown" class="absolute right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10">
                        <div class="p-3 space-y-3">
                            <div class="relative">
                                <input
                                    v-model="filters.search"
                                    type="text"
                                    placeholder="Search feed items..."
                                    class="bg-neutral-700 h-9 border border-neutral-600 text-white pl-3 pr-8 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    @keydown.esc="showSearchDropdown = false"
                                    ref="searchInput"
                                >
                                <!-- Clear button -->
                                <button
                                    v-if="filters.search.trim()"
                                    @click="clearSearch"
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                                    title="Clear search">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Search in field:</label>
                                <select
                                    v-model="filters.searchField"
                                    class="bg-neutral-700 w-full h-8 border border-neutral-600 text-white px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="title">Title</option>
                                    <option value="content">Content</option>
                                    <option value="category">Category</option>
                                </select>
                            </div>
                            <!-- Add Channel filter -->
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Channel:</label>
                                <select
                                    v-model="filters.channelFilter"
                                    class="bg-neutral-700 w-full h-8 border border-neutral-600 text-white px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">All Channels</option>
                                    <option v-for="channel in channels" :key="channel.id" :value="channel.id">
                                        {{ channel.name }}
                                    </option>
                                </select>
                            </div>
                            <!-- Add Processed filter -->
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Status:</label>
                                <select
                                    v-model="filters.processedFilter"
                                    class="bg-neutral-700 w-full h-8 border border-neutral-600 text-white px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="unprocessed">Unprocessed Only</option>
                                    <option value="processed">Processed Only</option>
                                    <option value="all">All Items</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="classifyWithAI" class="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors flex items-center" :disabled="classifyLoading">
                    <svg v-if="classifyLoading" class="animate-spin h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {{ classifyLoading ? 'Classifying...' : 'Classify with AI' }}
                </button>
                <button @click="refreshData" class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <!-- More actions dropdown -->
                <div class="relative" data-more-actions-toggle>
                    <button
                        @click="toggleMoreActionsDropdown"
                        class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        More
                    </button>
                    <!-- More actions dropdown menu -->
                    <div v-if="showMoreActionsDropdown" class="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10">
                        <div class="py-1">
                            <button
                                @click="openBulkReprocessDialog"
                                class="w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                Bulk Reprocess
                            </button>
                            <button
                                @click="openBulkDeleteDialog"
                                class="w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Mass Exclusion
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading feed items...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load feed items</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="feedItems.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">No feed items found</p>
            <p class="text-neutral-400 text-sm mb-4">Try adjusting your filters or processing some RSS feeds first</p>
        </div>

        <!-- Feed Items List -->
        <div v-else>
            <div v-for="item in feedItems" :key="item.id" class="bg-neutral-800 rounded-lg mb-4 overflow-hidden">
                <div class="flex flex-col md:flex-row h-48">
                    <!-- Feature Image -->
                    <div v-if="item.featureImage" class="w-full md:w-64 h-full flex-shrink-0 bg-neutral-900 flex items-center justify-center overflow-hidden relative group">
                        <img
                            :src="item.featureImage"
                            alt="Feature image"
                            class="w-full h-full object-cover"
                        />
                    </div>

                    <!-- Content -->
                    <div class="p-6 flex-grow flex flex-col h-full overflow-hidden">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <div class="flex items-center space-x-2 text-sm text-neutral-400 mb-1">
                                    <span class="bg-blue-900 text-blue-200 px-2 py-0.5 rounded text-xs">
                                        {{ getChannelName(item.channel) }}
                                    </span>
                                    <span v-if="item.category" class="bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded text-xs">
                                        {{ item.category }}
                                    </span>
                                    <span v-if="item.postRef" class="bg-green-900 text-green-200 px-2 py-0.5 rounded text-xs flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Published
                                    </span>
                                    <span v-if="typeof item.relevance === 'number'"
                                        :class="getRelevanceClass(item.relevance)"
                                        class="px-2 py-0.5 rounded text-xs flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        {{ getRelevanceLabel(item.relevance) }}
                                    </span>
                                    <span>{{ formatDate(item.pubDate) }}</span>
                                </div>
                                <h2 class="text-xl font-semibold text-white mb-2 line-clamp-1">{{ item.title }}</h2>
                            </div>
                            <div class="flex space-x-2">
                                <a :href="item.link" target="_blank" class="text-blue-400 hover:text-blue-300" title="Open original link">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                                <button v-if="!item.postRef" @click="rejectItem(item)" class="text-red-400 hover:text-red-300" title="Reject this item">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <a v-else :href="`/admin/posts/edit/${item.postRef}`" class="text-green-400 hover:text-green-300" title="View created post">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div class="prose prose-sm prose-invert max-w-none flex-grow h-16 overflow-hidden mb-2 text-neutral-300" v-html="sanitizeHtml(item.content)"></div>

                        <div class="flex justify-end">
                            <button
                                @click="reprocessItem(item)"
                                class="text-sm text-green-400 hover:text-green-300 flex items-center mr-3"
                                title="Reprocess content with current parser"
                                :disabled="processingItems[item.id]"
                            >
                                <svg v-if="processingItems[item.id]" class="animate-spin h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {{ processingItems[item.id] ? 'Processing...' : 'Reprocess' }}
                            </button>
                            <button
                                @click="openPreview(item)"
                                class="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                                title="Preview full content"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <Pagination
            :pagination="pagination"
            itemName="feed items"
            @pageChange="handlePageChange"
        />

        <!-- Toast notifications -->
        <ToastNotification
            :show="notification.show"
            :message="notification.message"
            :type="notification.type"
            :duration="notification.duration"
            @close="notification.show = false"
        />

        <!-- Preview Dialog -->
        <div
            v-if="showPreview"
            class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 overflow-hidden"
            style="backdrop-filter: blur(4px);"
            @click.self="closePreview"
        >
            <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div class="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div class="flex items-center space-x-4">
                        <!-- Prompt selector dropdown -->
                        <div class="w-64">
                            <label class="block text-xs text-gray-500 mb-1">AI Prompt Template:</label>
                            <div v-if="loadingPrompts" class="flex items-center py-1">
                                <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500 mr-2"></div>
                                <span class="text-gray-500 text-sm">Loading prompts...</span>
                            </div>
                            <select
                                v-else
                                v-model="selectedPrompt"
                                class="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="default">Default</option>
                                <option v-for="prompt in promptsList" :key="prompt.id" :value="prompt.id">
                                    {{ prompt.name || 'Unnamed Prompt' }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">

                        <button
                            v-if="!aiContent && !editMode"
                            @click="generateAIContent"
                            class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors flex items-center"
                            :disabled="aiLoading"
                        >
                            <svg v-if="aiLoading" class="animate-spin h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {{ aiLoading ? 'Generating...' : 'Generate AI Version' }}
                        </button>
                        <button
                            @click="toggleEditMode"
                            class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-md transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            {{ editMode ? 'Exit Edit' : 'Edit' }}
                        </button>
                        <a
                            v-if="previewItem"
                            :href="previewItem.link"
                            target="_blank"
                            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Read
                        </a>
                        <button
                            v-if="previewItem"
                            @click="confirmReject"
                            class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                        </button>
                        <button @click="closePreview" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200 overflow-y-auto">
                    <!-- Original Content -->
                    <div class="p-6 lg:w-1/2" :class="{ 'lg:w-full': !aiContent }">
                        <div v-if="previewItem">
                            <!-- Preview header -->
                            <div class="mb-6">
                                <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                    <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                                        {{ getChannelName(previewItem.channel) }}
                                    </span>
                                    <span v-if="previewItem.category" class="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                                        {{ previewItem.category }}
                                    </span>
                                    <span v-if="typeof previewItem.relevance === 'number'"
                                        :class="getPreviewRelevanceClass(previewItem.relevance)"
                                        class="px-2 py-0.5 rounded text-xs flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        {{ getRelevanceLabel(previewItem.relevance) }}
                                    </span>
                                    <span>{{ formatDate(previewItem.pubDate) }}</span>
                                </div>
                                <div class="flex items-start justify-between">
                                    <h1 class="text-2xl font-bold text-gray-900 mb-4">
                                        {{ aiContent ? 'Original: ' : '' }}{{ previewItem.title }}
                                    </h1>
                                    <div v-if="editMode" class="flex">
                                        <button
                                            @click="saveEditedContent"
                                            class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors ml-2"
                                        >
                                            Apply Changes
                                        </button>
                                    </div>
                                </div>

                                <!-- Feature image -->
                                <div v-if="previewItem.featureImage" class="mb-6">
                                    <img
                                        :src="previewItem.featureImage"
                                        alt="Feature image"
                                        class="w-full max-h-96 object-contain rounded-lg"
                                    />
                                </div>
                            </div>

                            <!-- Content -->
                            <div v-if="!editMode" class="prose prose-lg max-w-none text-gray-800" v-html="removeLeadingImages(editedContent || previewItem.content)"></div>

                            <!-- Editable Content -->
                            <div v-else class="w-full">
                                <textarea
                                    v-model="editedContent"
                                    class="w-full min-h-[400px] p-4 border border-gray-300 rounded-lg text-gray-800 font-mono text-sm"
                                    placeholder="Edit the content here..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- AI Generated Content -->
                    <div v-if="aiContent || aiLoading" class="p-6 lg:w-1/2">
                        <div v-if="aiLoading" class="flex flex-col items-center justify-center h-64">
                            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                            <p class="text-gray-600 text-center">Generating AI content...</p>
                            <p class="text-gray-500 text-sm text-center mt-2">This may take a few moments</p>
                        </div>

                        <div v-else-if="aiError" class="bg-red-50 border border-red-200 rounded-md p-4">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 class="text-red-800 font-medium">Error generating AI content</h3>
                                    <p class="text-red-700 text-sm mt-1">{{ aiError }}</p>
                                    <button
                                        @click="generateAIContent"
                                        class="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="aiContent">
                            <!-- AI Preview header -->
                            <div class="mb-6">
                                <div class="flex justify-between items-start">
                                    <h1 class="text-2xl font-bold text-gray-900 mb-4">AI Version: {{ aiContent.title }}</h1>
                                    <div class="flex">
                                        <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                                            AI Generated
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Cover Image Section -->
                            <div class="mb-6">
                                <div v-if="coverImage" class="relative bg-gray-100 rounded-lg overflow-hidden">
                                    <img :src="coverImage" alt="Cover Image" class="w-full h-auto" />
                                </div>
                                <div v-else class="w-full py-12 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 flex flex-col items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>No Cover Image Available</span>
                                </div>
                            </div>

                            <!-- AI Content -->
                            <div class="prose prose-lg max-w-none text-gray-800" v-html="aiContent.content"></div>

                            <!-- AI Suggested Tags -->
                            <div v-if="aiContent.suggestedTags && aiContent.suggestedTags.length > 0" class="mt-6 mb-8">
                                <h3 class="text-lg font-semibold text-gray-800 mb-3">Suggested Tags</h3>
                                <div class="flex flex-wrap gap-2">
                                    <div
                                        v-for="(tag, index) in aiContent.suggestedTags"
                                        :key="index"
                                        class="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm flex items-center cursor-pointer hover:bg-purple-200 transition-colors"
                                        :class="{'bg-green-100 text-green-800': selectedTags.includes(tag)}"
                                        @click="toggleTagSelection(tag)"
                                    >
                                        <span>{{ tag }}</span>
                                        <svg v-if="selectedTags.includes(tag)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- AI Suggested Categories -->
                            <div v-if="aiContent.suggestedCategories && aiContent.suggestedCategories.length > 0" class="mt-6 mb-8">
                                <h3 class="text-lg font-semibold text-gray-800 mb-3">AI Suggested Categories</h3>
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <div
                                        v-for="(suggestedCategory, index) in aiContent.suggestedCategories"
                                        :key="index"
                                        class="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm flex items-center"
                                    >
                                        <span>{{ suggestedCategory }}</span>
                                        <button
                                            v-if="!categoryExists(suggestedCategory)"
                                            @click="openCreateCategoryDialog(suggestedCategory)"
                                            class="ml-2 text-orange-600 hover:text-orange-800 transition-colors"
                                            title="Create this category"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Categories -->
                            <div class="mt-8">
                                <h3 class="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div v-if="loadingCategories" class="flex justify-center py-4">
                                        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                    <div v-else-if="categories.length === 0" class="text-center py-4 text-gray-500">
                                        No categories found
                                    </div>
                                    <div v-else class="grid grid-cols-2 gap-3">
                                        <div v-for="category in categories" :key="category.id" class="flex items-center">
                                            <input
                                                :id="'cat-' + category.id"
                                                type="checkbox"
                                                :value="category.id"
                                                v-model="selectedCategories"
                                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            >
                                            <label :for="'cat-' + category.id" class="ml-2 text-sm text-gray-700">{{ category.name }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="mt-8 pt-4 border-t border-gray-200 flex justify-between">
                                <button
                                    @click="createPostFromAI"
                                    class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create Post from AI Version
                                </button>

                                <button
                                    @click="regenerateAIContent"
                                    class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Regenerate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add the Rejection Confirmation Dialog after existing dialogs -->
        <div v-if="showRejectDialog" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-gray-800">Confirm Rejection</h3>
                    <button @click="showRejectDialog = false" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-6">
                    <p class="text-gray-700 mb-3">Are you sure you want to reject this feed item?</p>
                    <p class="text-red-600 text-sm">This action will mark the item as rejected and it will no longer appear in the feed list.</p>
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        @click="showRejectDialog = false"
                        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="rejectRawItem"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        :disabled="rejectLoading"
                    >
                        <span v-if="rejectLoading" class="flex items-center">
                            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Rejecting...
                        </span>
                        <span v-else>Confirm Rejection</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- List Reject Confirmation Dialog -->
        <div v-if="showListRejectDialog" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-gray-800">Confirm Rejection</h3>
                    <button @click="showListRejectDialog = false" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-6">
                    <p class="text-gray-700 mb-3">Are you sure you want to reject this feed item?</p>
                    <p class="text-red-600 text-sm">This action will mark the item as rejected and it will no longer appear in the feed list.</p>
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        @click="showListRejectDialog = false"
                        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="confirmListReject"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        :disabled="listRejectLoading"
                    >
                        <span v-if="listRejectLoading" class="flex items-center">
                            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Rejecting...
                        </span>
                        <span v-else>Confirm Rejection</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Clean All Dialog -->
        <div v-if="showCleanAllDialog" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-white">Clean All Raw Items</h3>
                    <button @click="showCleanAllDialog = false" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-6">
                    <p class="text-neutral-300 mb-3">This will clean all raw feed items that have been processed or rejected.</p>
                    <p class="text-red-400 text-sm mb-4">This action cannot be undone.</p>
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        @click="showCleanAllDialog = false"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="confirmCleanAll"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        :disabled="cleanAllLoading"
                    >
                        <span v-if="cleanAllLoading" class="flex items-center">
                            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cleaning...
                        </span>
                        <span v-else>Clean All Items</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Clean By Channel Dialog -->
        <div v-if="showCleanByChannelDialog" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-white">Clean By Channel</h3>
                    <button @click="showCleanByChannelDialog = false" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-6">
                    <p class="text-neutral-300 mb-3">Select channels to clean:</p>
                    <p class="text-red-400 text-sm mb-4">This action cannot be undone.</p>

                    <div class="max-h-60 overflow-y-auto border border-neutral-700 rounded-md p-2 bg-neutral-900">
                        <div v-if="channels.length === 0" class="py-3 text-center text-neutral-400">
                            No channels available
                        </div>
                        <div v-else>
                            <div v-for="channel in channels" :key="channel.id" class="flex items-center py-2 border-b border-neutral-700">
                                <input
                                    :id="'channel-' + channel.id"
                                    type="checkbox"
                                    :value="channel.id"
                                    v-model="selectedChannelsToClean"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-neutral-700 border-neutral-600 rounded"
                                />
                                <label :for="'channel-' + channel.id" class="ml-2 text-neutral-300">{{ channel.name }}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        @click="showCleanByChannelDialog = false"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="confirmCleanByChannel"
                        class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
                        :disabled="cleanChannelLoading || selectedChannelsToClean.length === 0"
                    >
                        <span v-if="cleanChannelLoading" class="flex items-center">
                            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cleaning...
                        </span>
                        <span v-else>Clean Selected Channels</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Bulk Reprocess Dialog -->
        <div v-if="showBulkReprocessDialog" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
                <div class="flex justify-between items-center mb-4 border-b border-neutral-700 pb-3">
                    <h3 class="text-xl font-semibold text-white">Bulk Reprocess Feed Items</h3>
                    <button @click="closeBulkReprocessDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-4">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="text-md font-medium text-white">Select Items to Reprocess</h4>
                        <div class="flex items-center">
                            <input type="checkbox" id="selectAllItemsForReprocess" v-model="selectAllForReprocess" @change="toggleSelectAllForReprocess" class="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-600 bg-neutral-700">
                            <label for="selectAllItemsForReprocess" class="text-sm text-neutral-300">Select All Visible</label>
                        </div>
                    </div>
                    <div v-if="loading" class="py-4 flex justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    <div v-else-if="feedItems.length === 0" class="py-4 text-center text-neutral-400">
                        No feed items to reprocess.
                    </div>
                    <div v-else class="max-h-80 overflow-y-auto border border-neutral-700 rounded-md">
                        <div class="divide-y divide-neutral-700">
                            <div v-for="item in feedItems" :key="item.id" class="flex items-center p-3 hover:bg-neutral-750">
                                <input
                                    type="checkbox"
                                    :id="'reprocess-item-' + item.id"
                                    v-model="selectedItemsForReprocess"
                                    :value="item.id"
                                    class="mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-600 bg-neutral-700"
                                >
                                <label :for="'reprocess-item-' + item.id" class="text-sm text-white cursor-pointer flex-1 truncate mr-3">
                                    {{ item.title }}
                                </label>
                                <span class="text-xs text-neutral-400">{{ getChannelName(item.channel) }}</span>
                            </div>
                        </div>
                    </div>
                     <p class="text-xs text-neutral-500 mt-2">Only items currently visible in the main list are shown here. Use the main page filters to refine the selection if needed.</p>
                </div>

                <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-neutral-700">
                    <button
                        @click="closeBulkReprocessDialog"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                        :disabled="bulkReprocessLoading"
                    >
                        Cancel
                    </button>
                    <button
                        @click="startBulkReprocess"
                        class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                        :disabled="selectedItemsForReprocess.length === 0 || bulkReprocessLoading"
                    >
                        <span v-if="bulkReprocessLoading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Reprocessing...
                        </span>
                        <span v-else>Reprocess {{ selectedItemsForReprocess.length }} Items</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Bulk Reprocess Progress Overlay -->
        <div v-if="bulkReprocessLoading" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="text-center mb-4">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-3"></div>
                    <h3 class="text-lg font-medium text-white">Reprocessing Feed Items</h3>
                    <p class="text-neutral-400 mt-1">Please wait...</p>
                </div>

                <div class="w-full bg-neutral-700 rounded-full h-4 mb-3">
                    <div
                        class="bg-orange-600 h-4 rounded-full transition-all duration-300 ease-out"
                        :style="{ width: `${(bulkReprocessProgress.completed / bulkReprocessProgress.total) * 100}%` }"
                    ></div>
                </div>

                <div class="text-center text-sm text-neutral-300 mb-4">
                    <span>{{ bulkReprocessProgress.completed }} of {{ bulkReprocessProgress.total }} items reprocessed</span>
                </div>

                <div v-if="bulkReprocessProgress.currentItem" class="mb-4">
                    <p class="text-sm text-neutral-400">Currently reprocessing:</p>
                    <p class="text-sm font-medium text-white truncate">{{ bulkReprocessProgress.currentItem }}</p>
                </div>

                <div v-if="bulkReprocessProgress.processedItems.length > 0" class="mt-4">
                    <p class="text-sm text-neutral-400 mb-2">Recently reprocessed:</p>
                    <div class="max-h-32 overflow-y-auto">
                        <div v-for="(item, index) in bulkReprocessProgress.processedItems.slice().reverse().slice(0, 5)" :key="index"
                            class="flex items-center py-1 border-b border-neutral-700 last:border-b-0">
                            <div :class="item.success ? 'text-green-500' : 'text-red-500'" class="mr-2">
                                <svg v-if="item.success" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div class="flex-1 truncate text-sm">
                                <span v-if="item.success" class="text-neutral-300">{{ item.title }}</span>
                                <span v-else class="text-red-400">{{ item.title }} - {{ item.error }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Category Dialog -->
        <div v-if="showCreateCategoryDialog" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-gray-800">Create New Category</h3>
                    <button @click="closeCreateCategoryDialog" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="createCategory">
                    <div class="mb-4">
                        <label for="newCategoryName" class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                            id="newCategoryName"
                            v-model="newCategoryForm.name"
                            @input="updateCategorySlug"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Category name"
                            required
                        />
                        <p v-if="categoryFormErrors.name" class="mt-1 text-sm text-red-500">{{ categoryFormErrors.name }}</p>
                    </div>

                    <div class="mb-4">
                        <label for="newCategorySlug" class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            id="newCategorySlug"
                            v-model="newCategoryForm.slug"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="category-slug"
                            required
                        />
                        <p class="mt-1 text-sm text-gray-500">URL: /category/<span class="text-blue-600">{{ newCategoryForm.slug || 'your-slug' }}</span></p>
                        <p v-if="categoryFormErrors.slug" class="mt-1 text-sm text-red-500">{{ categoryFormErrors.slug }}</p>
                    </div>

                    <div class="mb-4">
                        <label for="newCategoryParent" class="block text-sm font-medium text-gray-700 mb-1">Parent Category (optional)</label>
                        <select
                            id="newCategoryParent"
                            v-model="newCategoryForm.parentCategory"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">None</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                v-model="newCategoryForm.active"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span class="ml-2 text-sm text-gray-700">Active category</span>
                        </label>
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button
                            type="button"
                            @click="closeCreateCategoryDialog"
                            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                            :disabled="createCategoryLoading"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            :disabled="createCategoryLoading"
                        >
                            <span v-if="createCategoryLoading" class="flex items-center">
                                <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </span>
                            <span v-else>Create Category</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Bulk Delete Dialog -->
        <div v-if="showBulkDeleteDialog" class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
                <div class="flex justify-between items-center mb-4 border-b border-neutral-700 pb-3">
                    <h3 class="text-xl font-semibold text-white">Mass Exclusion</h3>
                    <button @click="closeBulkDeleteDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-4">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="text-md font-medium text-white">Select items to delete</h4>
                        <div class="flex items-center">
                            <input type="checkbox" id="selectAllItemsForDelete" v-model="selectAllForDelete" @change="toggleSelectAllForDelete" class="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-600 bg-neutral-700">
                            <label for="selectAllItemsForDelete" class="text-sm text-neutral-300">Selecionar Todos Visíveis</label>
                        </div>
                    </div>
                    <div v-if="loading" class="py-4 flex justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    <div v-else-if="feedItems.length === 0" class="py-4 text-center text-neutral-400">
                        No items to delete.
                    </div>
                    <div v-else class="max-h-80 overflow-y-auto border border-neutral-700 rounded-md">
                        <div class="divide-y divide-neutral-700">
                            <div v-for="item in feedItems" :key="item.id" class="flex items-center p-3 hover:bg-neutral-750">
                                <input
                                    type="checkbox"
                                    :id="'delete-item-' + item.id"
                                    v-model="selectedItemsForDelete"
                                    :value="item.id"
                                    class="mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-600 bg-neutral-700"
                                >
                                <label :for="'delete-item-' + item.id" class="text-sm text-white cursor-pointer flex-1 truncate mr-3">
                                    {{ item.title }}
                                </label>
                                <span class="text-xs text-neutral-400">{{ getChannelName(item.channel) }}</span>
                            </div>
                        </div>
                    </div>
                    <p class="text-xs text-neutral-500 mt-2">Only items currently visible in the main list are shown here. Use the filters on the main page to refine the selection if needed.</p>
                </div>

                <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-neutral-700">
                    <button
                        @click="closeBulkDeleteDialog"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                        :disabled="bulkDeleteLoading"
                    >
                        Cancelar
                    </button>
                    <button
                        @click="confirmBulkDelete"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        :disabled="selectedItemsForDelete.length === 0 || bulkDeleteLoading"
                    >
                        <span v-if="bulkDeleteLoading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                        </span>
                        <span v-else>Delete {{ selectedItemsForDelete.length }} Items</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Bulk Delete Confirmation Dialog -->
        <div v-if="showBulkDeleteConfirmation" class="fixed inset-0 bg-black/75 flex items-center justify-center z-[60] p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-white">Confirm Delete</h3>
                    <button @click="showBulkDeleteConfirmation = false" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-6">
                    <p class="text-neutral-300 mb-3">Are you sure you want to delete <strong>{{ selectedItemsForDelete.length }}</strong> items?</p>
                    <p class="text-red-400 text-sm mb-4">This action cannot be undone.</p>
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        @click="showBulkDeleteConfirmation = false"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                        :disabled="bulkDeleteLoading"
                    >
                        Cancel
                    </button>
                    <button
                        @click="startBulkDelete"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        :disabled="bulkDeleteLoading"
                    >
                        <span v-if="bulkDeleteLoading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Excluindo...
                        </span>
                        <span v-else>Confirmar Exclusão</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Bulk Delete Progress Overlay -->
        <div v-if="bulkDeleteLoading" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="text-center mb-4">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-3"></div>
                    <h3 class="text-lg font-medium text-white">Deleting Items</h3>
                    <p class="text-neutral-400 mt-1">Please wait...</p>
                </div>

                <div class="w-full bg-neutral-700 rounded-full h-4 mb-3">
                    <div
                        class="bg-red-600 h-4 rounded-full transition-all duration-300 ease-out"
                        :style="{ width: `${(bulkDeleteProgress.completed / bulkDeleteProgress.total) * 100}%` }"
                    ></div>
                </div>

                <div class="text-center text-sm text-neutral-300 mb-4">
                    <span>{{ bulkDeleteProgress.completed }} of {{ bulkDeleteProgress.total }} items deleted</span>
                </div>

                <div v-if="bulkDeleteProgress.currentItem" class="mb-4">
                    <p class="text-sm text-neutral-400">Deleting currently:</p>
                    <p class="text-sm font-medium text-white truncate">{{ bulkDeleteProgress.currentItem }}</p>
                </div>

                <div v-if="bulkDeleteProgress.processedItems.length > 0" class="mt-4">
                    <p class="text-sm text-neutral-400 mb-2">Recently deleted:</p>
                    <div class="max-h-32 overflow-y-auto">
                        <div v-for="(item, index) in bulkDeleteProgress.processedItems.slice().reverse().slice(0, 5)" :key="index"
                            class="flex items-center py-1 border-b border-neutral-700 last:border-b-0">
                            <div :class="item.success ? 'text-green-500' : 'text-red-500'" class="mr-2">
                                <svg v-if="item.success" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div class="flex-1 truncate text-sm">
                                <span v-if="item.success" class="text-neutral-300">{{ item.title }}</span>
                                <span v-else class="text-red-400">{{ item.title }} - {{ item.error }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
// @ts-ignore
import { useFeedClient } from '@cmmv/rss-aggregation/admin/client'
// @ts-ignore
import { useAdminClient } from '@cmmv/blog/admin/client';

// @ts-ignore
import Pagination from '@cmmv/blog/admin/components/Pagination.vue'
// @ts-ignore
import ToastNotification from '@cmmv/blog/admin/components/ToastNotification.vue'

const feedClient = useFeedClient();
const adminClient = useAdminClient();

interface FeedItem {
    id: string;
    title: string;
    content: string;
    link: string;
    featureImage?: string;
    pubDate: string;
    category?: string;
    channel: string;
    postRef?: string;
    suggestedTags?: string[];
    suggestedCategories?: string[];
    relevance?: number;
}

interface Category {
    id: string;
    name: string;
}

interface Channel {
    id: string;
    name: string;
    url: string;
    rss: string;
}

interface PaginationData {
    current: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
}

interface NotificationData {
    show: boolean;
    type: string;
    message: string;
    duration: number;
}

interface Filters {
    search: string;
    searchField: string;
    channelFilter: string;
    processedFilter: string;
    sortBy: string;
    sortOrder: string;
    page: number;
}

const feedItems = ref<FeedItem[]>([]);
const channels = ref<Channel[]>([]);
const categories = ref<Category[]>([]);
const loadingCategories = ref<boolean>(false);
const selectedCategories = ref<string[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const showPreview = ref<boolean>(false);
const previewItem = ref<FeedItem | null>(null);
const aiContent = ref<FeedItem | null>(null);
const aiLoading = ref<boolean>(false);
const aiError = ref<string | null>(null);
const selectedTags = ref<string[]>([]);
const coverImage = ref<string | null>(null);
const editMode = ref<boolean>(false);
const editedContent = ref<string | null>(null);
const promptsList = ref<any[]>([]);
const selectedPrompt = ref<string>('default');
const loadingPrompts = ref<boolean>(false);

// Helper function to remove accents
const removeAccents = (str: string): string => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const notification = ref<NotificationData>({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
});

const pagination = ref<PaginationData>({
    current: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 1,
    to: 10
});

const filters = ref<Filters>({
    search: '',
    searchField: 'title',
    channelFilter: '',
    processedFilter: 'unprocessed',
    sortBy: 'pubDate',
    sortOrder: 'desc',
    page: 1
});

const processingItems = ref<Record<string, boolean>>({});

const loadFeedItems = async (): Promise<void> => {
    try {
        loading.value = true;
        error.value = null;

        const queryParams: any = {
            limit: pagination.value.perPage,
            offset: (filters.value.page - 1) * pagination.value.perPage,
            sortBy: filters.value.sortBy,
            sort: filters.value.sortOrder,
        };

        if (filters.value.search) {
            queryParams.search = filters.value.search;
            queryParams.searchField = filters.value.searchField;
        }

        if (filters.value.channelFilter)
            queryParams.channel = filters.value.channelFilter;

        if (filters.value.processedFilter === 'unprocessed')
            queryParams.postRef = null;
        else if (filters.value.processedFilter === 'processed')
            queryParams.hasPostRef = true;

        const response = await feedClient.raw.get(queryParams);

        if (response && response.data) {
            feedItems.value = response.data || [];

            const paginationData = response.pagination || {};
            const totalCount = response.count || 0;
            const currentOffset = paginationData.offset || 0;
            const currentLimit = paginationData.limit || 10;
            const currentPage = Math.floor(currentOffset / currentLimit) + 1;
            const lastPage = Math.ceil(totalCount / currentLimit);

            pagination.value = {
                current: currentPage,
                lastPage: lastPage,
                perPage: currentLimit,
                total: totalCount,
                from: currentOffset + 1,
                to: Math.min(currentOffset + currentLimit, totalCount)
            };
        } else {
            feedItems.value = [];

            pagination.value = {
                current: 1,
                lastPage: 1,
                perPage: 10,
                total: 0,
                from: 0,
                to: 0
            };
        }

        loading.value = false;
    } catch (err: unknown) {
        console.error('Failed to load feed items:', err);
        loading.value = false;
        error.value = err instanceof Error ? err.message : 'Failed to load feed items';
        showNotification('error', 'Failed to load feed items');
    }
};

const loadChannels = async (): Promise<void> => {
    try {
        const response = await feedClient.channels.get({
            limit: 100,
            sortBy: 'name',
            sort: 'asc'
        });

        if (response && response.data) {
            channels.value = response.data || [];
            //console.log(`Loaded ${channels.value.length} channels`);
        }
    } catch (err: unknown) {
        console.error('Failed to load channels:', err);
    }
};

const loadCategories = async (): Promise<void> => {
    try {
        loadingCategories.value = true;
        const response = await adminClient.categories.get({
            limit: 100,
            sortBy: 'name',
            sort: 'asc'
        });

        if (response && response.data) {
            categories.value = response.data || [];
            //console.log(`Loaded ${categories.value.length} categories`);
        }
        loadingCategories.value = false;
    } catch (err: unknown) {
        console.error('Failed to load categories:', err);
        loadingCategories.value = false;
    }
};

const refreshData = async (): Promise<void> => {
    await loadChannels();
    await loadFeedItems();
};

const handlePageChange = (newPage: number): void => {
    filters.value.page = newPage;
};

watch(filters, () => {
    loadFeedItems();
}, { deep: true });


const openPreview = (item: FeedItem): void => {
    previewItem.value = item;
    showPreview.value = true;
    aiContent.value = null;
    aiError.value = null;
    selectedTags.value = [];
    coverImage.value = null;
    selectedCategories.value = [];
    selectedPrompt.value = 'default';
    editMode.value = false;
    editedContent.value = null;
    document.body.style.overflow = 'hidden';

    // Load prompts when opening the preview
    loadPrompts();
};

const closePreview = (): void => {
    showPreview.value = false;
    previewItem.value = null;
    aiContent.value = null;
    aiError.value = null;
    selectedTags.value = [];
    coverImage.value = null;
    selectedCategories.value = [];
    editMode.value = false;
    editedContent.value = null;
    document.body.style.overflow = '';
};

const toggleEditMode = (): void => {
    editMode.value = !editMode.value;

    if (editMode.value && editedContent.value === null && previewItem.value)
        editedContent.value = previewItem.value.content;
};

const saveEditedContent = (): void => {
    editMode.value = false;
    showNotification('success', 'Content updated! Use "Generate AI Version" to process the edited content.');
};

const generateAIContent = async (): Promise<void> => {
    if (!previewItem.value || aiLoading.value) return;

    try {
        aiLoading.value = true;
        aiError.value = null;

        const contentToProcess = editedContent.value || previewItem.value.content;

        const itemToProcess = {
            ...previewItem.value,
            content: contentToProcess
        };

        const jobStartResponse = await feedClient.raw.startAIJob(previewItem.value.id, {
            content: contentToProcess,
            promptId: selectedPrompt.value
        });
        const jobId = jobStartResponse.jobId;

        if (!jobId) {
            throw new Error('Failed to start AI job');
        }

        showNotification('info', 'AI processing started. This may take a moment...');

        const checkJobStatus = async () => {
            try {
                const jobStatus = await feedClient.raw.getAIJobStatus(jobId);

                if (jobStatus.status === 'completed') {
                    const response = jobStatus.result;

                    if (response && response.title && response.content && previewItem.value) {
                        aiContent.value = {
                            ...previewItem.value,
                            title: response.title,
                            content: response.content,
                            suggestedTags: response.suggestedTags || [],
                            suggestedCategories: response.suggestedCategories || []
                        };

                        if (response.suggestedTags && response.suggestedTags.length > 0) {
                            selectedTags.value = [...response.suggestedTags];
                        }

                        // Auto-select categories based on AI suggestion
                        if (response.suggestedCategories && response.suggestedCategories.length > 0 && categories.value.length > 0) {
                            const suggestedCategoryNames = response.suggestedCategories.map((cat: string) => cat.toLowerCase());
                            //console.log('[DEBUG] Suggested Category Names (AI):', suggestedCategoryNames);
                            //console.log('[DEBUG] Available Categories (System):', JSON.parse(JSON.stringify(categories.value)));

                            const matchingCategoryIds = categories.value
                                .filter(category => {
                                    const systemCategoryNameLower = removeAccents(category.name.toLowerCase());
                                    const normalizedSuggestedCategories = suggestedCategoryNames.map((sc: string) => removeAccents(sc));

                                    // Check if the exact system category name is included in any AI suggestion string
                                    let isMatch = normalizedSuggestedCategories.some((aiSuggest: string) => aiSuggest.includes(systemCategoryNameLower));

                                    // If not, check if any word from the system category name is in any AI suggestion word list
                                    if (!isMatch) {
                                        const systemWords = systemCategoryNameLower.split(/\s+/);
                                        isMatch = normalizedSuggestedCategories.some((aiSuggest: string) => {
                                            const aiWords = aiSuggest.split(/\s+/);
                                            // Check for partial matches between individual words
                                            return systemWords.some(sysWord => 
                                                aiWords.some(aiWord => {
                                                    let partMatch = false;
                                                    if (sysWord.length < 3 || aiWord.length < 3) {
                                                        partMatch = sysWord === aiWord;
                                                    } else {
                                                        partMatch = sysWord.includes(aiWord) || aiWord.includes(sysWord);
                                                    }
                                                    
                                                    //if (partMatch) {
                                                    //    console.log(`[DEBUG] Word match: sysWord="${sysWord}", aiWord="${aiWord}" from aiSuggest="${aiSuggest}"`);
                                                    //}
                                                    return partMatch;
                                                })
                                            );
                                        });
                                    }
                                    
                                    // Also check if any AI suggested category name is included in the system category name (for shorter AI suggestions)
                                    if (!isMatch) {
                                        isMatch = normalizedSuggestedCategories.some((aiSuggest: string) => systemCategoryNameLower.includes(aiSuggest));
                                    }

                                    //if (isMatch) {
                                    //    console.log(`[DEBUG] Match found: AI Suggs: "${normalizedSuggestedCategories.join(", ")}" vs System-"${category.name}" (Normalized: "${systemCategoryNameLower}") (ID: ${category.id})`);
                                    //}
                                    return isMatch;
                                })
                                .map(category => category.id);

                            //console.log('[DEBUG] Matching Category IDs for auto-selection:', matchingCategoryIds);
                            selectedCategories.value = [...new Set([...selectedCategories.value, ...matchingCategoryIds])];
                        }

                        if (previewItem.value.featureImage) {
                            try {
                                showNotification('info', 'Processing image from original content...');
                                const imageResponse = await adminClient.medias.processImage({
                                    image: previewItem.value.featureImage,
                                    format: 'webp',
                                    maxWidth: 1060,
                                    alt: response.title || 'Feature image',
                                    caption: ''
                                });

                                if (imageResponse && imageResponse.url) {
                                    coverImage.value = imageResponse.url;
                                    showNotification('success', 'Image processed for use in AI content');
                                }
                            } catch (imgErr) {
                                console.error('Error processing image for AI:', imgErr);
                                coverImage.value = null;
                            }
                        } else {
                            coverImage.value = null;
                        }

                        aiLoading.value = false;
                    } else {
                        throw new Error('Invalid response format from AI service');
                    }
                } else if (jobStatus.status === 'error') {
                    throw new Error(jobStatus.error || 'AI processing failed');
                } else {
                    setTimeout(checkJobStatus, 2000);
                }
            } catch (err) {
                aiLoading.value = false;
                aiError.value = err instanceof Error ? err.message : 'Error checking job status';
                showNotification('error', aiError.value);
            }
        };

        checkJobStatus();

    } catch (err: unknown) {
        console.error('Failed to generate AI content:', err);
        aiLoading.value = false;
        aiError.value = err instanceof Error ? err.message : 'Failed to generate AI content';
        showNotification('error', 'Failed to generate AI content');
    }
};

const regenerateAIContent = (): void => {
    aiContent.value = null;
    generateAIContent();
};

const createPostFromAI = async (): Promise<void> => {
    if (!aiContent.value) return;

    try {
        showNotification('info', 'Creating post from AI content...');

        let processedImage = null;
        const sourceImage = coverImage.value || aiContent.value.featureImage;

        if (sourceImage) {
            try {
                showNotification('info', 'Processando imagem para o post...');

                const response = await adminClient.medias.processImage({
                    image: sourceImage,
                    format: 'webp',
                    maxWidth: 1060,
                    alt: aiContent.value.title || 'Feature image',
                    caption: ''
                });

                if (response && response.url) {
                    processedImage = response.url;
                    showNotification('success', 'Imagem processada com sucesso');
                }
            } catch (imgErr) {
                console.error('Erro ao processar imagem:', imgErr);
                showNotification('warning', 'Não foi possível processar a imagem, criando post sem imagem');
            }
        }

        const slug = aiContent.value.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const sourceAttribution = `
            <p class="source-attribution">
                <strong>Com informações do:</strong> <a href="${aiContent.value.link}" target="_blank" rel="noopener noreferrer">${getChannelName(aiContent.value.channel)}</a>
            </p>
        `;

        const content = aiContent.value.content + sourceAttribution;

        const tags = selectedTags.value.length > 0
            ? selectedTags.value
            : [getChannelName(aiContent.value.channel), 'AI Generated'];

        const postData = {
            post: {
                title: aiContent.value.title,
                slug: slug,
                content: content,
                status: 'draft',
                excerpt: aiContent.value.content.substring(0, 200).replace(/<\/?[^>]+(>|$)/g, "") + '...',
                featureImage: processedImage, // Usar a imagem processada
                tags: tags,
                categories: selectedCategories.value
            },
            meta: {
                metaTitle: aiContent.value.title,
                metacontent: aiContent.value.content.substring(0, 155).replace(/<\/?[^>]+(>|$)/g, "") + '...',
                ogTitle: aiContent.value.title,
                ogcontent: aiContent.value.content.substring(0, 155).replace(/<\/?[^>]+(>|$)/g, "") + '...',
                ogImage: processedImage, // Usar a imagem processada
                twitterTitle: aiContent.value.title,
                twittercontent: aiContent.value.content.substring(0, 155).replace(/<\/?[^>]+(>|$)/g, "") + '...',
                twitterImage: processedImage // Usar a imagem processada
            }
        };

        const saveResponse = await adminClient.posts.save(postData);

        if (!saveResponse || !saveResponse.id)
            throw new Error("Failed to create post");

        await feedClient.raw.updateRaw(aiContent.value.id, {
            postRef: saveResponse.id
        });

        showNotification('success', 'Post created successfully!');
        closePreview();

        await refreshData();

        setTimeout(() => {
            //window.location.href = `/post/${saveResponse.id}`;
        }, 1000);

    } catch (err: unknown) {
        console.error('Failed to create post:', err);
        aiError.value = err instanceof Error ? err.message : 'Failed to create post';
        showNotification('error', 'Failed to create post: ' + aiError.value);
    }
};

const sanitizeHtml = (html: string | undefined): string => {
    if (!html) return '';

    const htmlString = String(html);

    let result = htmlString
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
        .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

    result = result.replace(/<[^>]*>?/gm, '');
    result = result.replace(/\s+/g, ' ').trim();

    return result;
};

const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (err) {
        console.error('Date formatting error:', err, dateString);
        return 'N/A';
    }
};

const getChannelName = (channelId: string): string => {
    if (!channelId) return 'No Channel';

    const channel = channels.value.find(c => c.id === channelId);
    if (channel) return channel.name;

    const partialMatch = channels.value.find(c =>
        channelId.includes(c.id) || c.id.includes(channelId)
    );

    if (partialMatch) return partialMatch.name;

    return channelId.substring(0, 8) + '...';
};

const handleImageError = (event: Event): void => {
    const target = event.target as HTMLImageElement;
    const originalSrc = target.src;

    if (!originalSrc.includes('/feed/raw/imageProxy')) {
        const proxyUrl = `/feed/raw/imageProxy?url=${encodeURIComponent(originalSrc)}`;
        //console.log('Tentando carregar imagem via proxy:', proxyUrl);

        target.onerror = () => {
            console.error('Falha ao carregar imagem mesmo usando proxy:', originalSrc);
            target.src = '';
            target.classList.add('hidden');
            if (target.parentElement) {
                target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                const placeholder = document.createElement('div');
                placeholder.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                `;
                target.parentElement.appendChild(placeholder.firstElementChild!);
            }
        };

        target.src = proxyUrl;
    } else {
        console.error('Falha ao carregar imagem, mesmo usando proxy:', originalSrc);
        target.src = '';
        target.classList.add('hidden');
        if (target.parentElement) {
            target.parentElement.classList.add('flex', 'items-center', 'justify-center');
            const placeholder = document.createElement('div');
            placeholder.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            `;
            target.parentElement.appendChild(placeholder.firstElementChild!);
        }
    }
};

const createPost = (item: FeedItem): void => {
    showNotification('info', 'Post creation not implemented yet');
};

const showNotification = (type: string, message: string): void => {
    notification.value = {
        show: true,
        type,
        message,
        duration: 3000
    };

    setTimeout(() => {
        notification.value.show = false;
    }, notification.value.duration);
};

const toggleTagSelection = (tag: string): void => {
    const index = selectedTags.value.indexOf(tag);
    if (index !== -1) {
        selectedTags.value.splice(index, 1);
    } else {
        selectedTags.value.push(tag);
    }
};

const showRejectDialog = ref<boolean>(false);
const rejectLoading = ref<boolean>(false);

const confirmReject = (): void => {
    showRejectDialog.value = true;
};

const rejectRawItem = async (): Promise<void> => {
    if (!previewItem.value) return;

    try {
        rejectLoading.value = true;

        await feedClient.raw.updateRaw(previewItem.value.id, {
            rejected: true
        });

        showNotification('success', 'Feed item rejected successfully');

        showRejectDialog.value = false;
        closePreview();
        refreshData();
    } catch (err: unknown) {
        console.error('Failed to reject feed item:', err);
        showNotification('error', err instanceof Error ? err.message : 'Failed to reject feed item');
    } finally {
        rejectLoading.value = false;
    }
};

const showListRejectDialog = ref<boolean>(false);
const listRejectLoading = ref<boolean>(false);
const itemToReject = ref<FeedItem | null>(null);

const rejectItem = (item: FeedItem): void => {
    itemToReject.value = item;
    showListRejectDialog.value = true;
};

const confirmListReject = async (): Promise<void> => {
    if (!itemToReject.value) return;

    try {
        listRejectLoading.value = true;

        await feedClient.raw.updateRaw(itemToReject.value.id, {
            rejected: true
        });

        showNotification('success', 'Feed item rejected successfully');

        showListRejectDialog.value = false;
        refreshData();
    } catch (err: unknown) {
        console.error('Failed to reject feed item:', err);
        showNotification('error', err instanceof Error ? err.message : 'Failed to reject feed item');
    } finally {
        listRejectLoading.value = false;
        itemToReject.value = null;
    }
};

const removeLeadingImages = (html: string | undefined): string => {
    if (!html) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html.trim(), 'text/html');
    const body = doc.body;
    const processedBody = cleanupHtml(body);

    return processedBody.innerHTML;
};

const cleanupHtml = (element: HTMLElement): HTMLElement => {
    const processed = element.cloneNode(true) as HTMLElement;
    const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'meta', 'link', 'noscript'];
    dangerousTags.forEach(tag => {
        const elements = processed.getElementsByTagName(tag);
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    });

    const handleLeadingImages = (parentElement: HTMLElement): void => {
        let imageCount = 0;
        const MAX_IMAGES_TO_REMOVE = 3;

        for (let i = 0; i < parentElement.childNodes.length && imageCount < MAX_IMAGES_TO_REMOVE;) {
            const node = parentElement.childNodes[i];

            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;

                if (element.tagName === 'IMG') {
                    parentElement.removeChild(element);
                    imageCount++;
                    continue;
                }

                if (['P', 'DIV', 'FIGURE'].includes(element.tagName)) {
                    if (element.childNodes.length === 1 &&
                        element.firstChild?.nodeType === Node.ELEMENT_NODE &&
                        (element.firstChild as HTMLElement).tagName === 'IMG') {
                        parentElement.removeChild(element);
                        imageCount++;
                        continue;
                    }

                    if (element.firstChild?.nodeType === Node.ELEMENT_NODE &&
                        (element.firstChild as HTMLElement).tagName === 'IMG' &&
                        [...element.childNodes].slice(1).every(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim() === '')) {
                        parentElement.removeChild(element);
                        imageCount++;
                        continue;
                    }

                    if (element.querySelector('img'))
                        handleLeadingImages(element);
                }

                if (element.tagName === 'A' && element.querySelector('img') &&
                    element.textContent?.trim() === '') {
                    parentElement.removeChild(element);
                    imageCount++;
                    continue;
                }
            }

            i++;
        }
    };

    handleLeadingImages(processed);

    const removeEmptyElements = (parentElement: HTMLElement): void => {
        for (let i = 0; i < parentElement.children.length;) {
            const child = parentElement.children[i];

            if (child.children.length > 0)
                removeEmptyElements(child as HTMLElement);

            const isEmpty = child.textContent?.trim() === '' && !['BR', 'HR'].includes(child.tagName);

            if (isEmpty) {
                parentElement.removeChild(child);
                continue;
            }

            i++;
        }
    };

    removeEmptyElements(processed);

    return processed;
};

const showCleanAllDialog = ref<boolean>(false);
const showCleanByChannelDialog = ref<boolean>(false);
const cleanAllLoading = ref<boolean>(false);
const cleanChannelLoading = ref<boolean>(false);
const selectedChannelsToClean = ref<string[]>([]);
const classifyLoading = ref<boolean>(false);

const openCleanAllDialog = (): void => {
    showCleanAllDialog.value = true;
};

const openCleanByChannelDialog = (): void => {
    selectedChannelsToClean.value = [];
    showCleanByChannelDialog.value = true;
};

const confirmCleanAll = async (): Promise<void> => {
    try {
        cleanAllLoading.value = true;

        const response = await feedClient.raw.cleanAllRaws();

        showNotification('success', `Successfully cleaned ${response.deletedCount} raw items`);
        showCleanAllDialog.value = false;
        await refreshData();
    } catch (err: unknown) {
        console.error('Failed to clean all raw items:', err);
        showNotification('error', err instanceof Error ? err.message : 'Failed to clean all raw items');
    } finally {
        cleanAllLoading.value = false;
    }
};

const confirmCleanByChannel = async (): Promise<void> => {
    if (selectedChannelsToClean.value.length === 0) {
        showNotification('error', 'Please select at least one channel to clean');
        return;
    }

    try {
        cleanChannelLoading.value = true;
        const results = [];

        for (const channelId of selectedChannelsToClean.value) {
            const response = await feedClient.raw.cleanChannelRaws(channelId);
            results.push({
                channelId,
                channelName: getChannelName(channelId),
                deletedCount: response.deletedCount
            });
        }

        const totalDeleted = results.reduce((total, result) => total + result.deletedCount, 0);
        showNotification('success', `Successfully cleaned ${totalDeleted} raw items from ${results.length} channels`);

        showCleanByChannelDialog.value = false;
        await refreshData();
    } catch (err: unknown) {
        console.error('Failed to clean raw items by channel:', err);
        showNotification('error', err instanceof Error ? err.message : 'Failed to clean raw items by channel');
    } finally {
        cleanChannelLoading.value = false;
    }
};

const reprocessItem = async (item: FeedItem): Promise<void> => {
    try {
        processingItems.value[item.id] = true;

        showNotification('info', 'Reprocessing feed item...');

        const response = await feedClient.raw.reprocessRaw(item.id);

        if (response && response.success) {
            showNotification('success', 'Feed item reprocessed successfully');
            await refreshData();
        } else {
            throw new Error('Failed to reprocess feed item');
        }
    } catch (err: unknown) {
        console.error('Failed to reprocess feed item:', err);
        showNotification('error', err instanceof Error ? err.message : 'Failed to reprocess feed item');
    } finally {
        processingItems.value[item.id] = false;
    }
};

const classifyWithAI = async (): Promise<void> => {
    try {
        classifyLoading.value = true;
        showNotification('info', 'Starting AI classification of feed items...');

        const response = await feedClient.raw.classifyRawsWithAI();

        if (response && response.success) {
            showNotification('success', `Classification complete: ${response.classified} items classified, ${response.rejected} items rejected`);
            await refreshData();
        } else {
            throw new Error('Classification failed');
        }
    } catch (err: unknown) {
        console.error('Error during AI classification:', err);
        showNotification('error', err instanceof Error ? err.message : 'Error during AI classification');
    } finally {
        classifyLoading.value = false;
    }
};

onMounted(() => {
    // Add click-outside handling for search dropdown
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-search-toggle]') && !target.closest('.absolute') && showSearchDropdown.value) {
            showSearchDropdown.value = false;
        }

        // Add click-outside handling for more actions dropdown
        if (!target.closest('[data-more-actions-toggle]') && showMoreActionsDropdown.value) {
            showMoreActionsDropdown.value = false;
        }
    });

    // Load initial data
    loadChannels();
    loadFeedItems();
    loadCategories();
});

const getRelevanceClass = (relevance: number): string => {
    if (relevance >= 80) return "bg-green-900 text-green-200";
    if (relevance >= 40) return "bg-yellow-800 text-yellow-200";
    return "bg-red-900 text-red-200";
};

const getRelevanceLabel = (relevance: number): string => {
    if (relevance >= 80) return `High (${relevance})`;
    if (relevance >= 40) return `Medium (${relevance})`;
    return `Low (${relevance})`;
};

const getPreviewRelevanceClass = (relevance: number): string => {
    if (relevance >= 80) return "bg-green-100 text-green-800";
    if (relevance >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
};

// Add new ref for search dropdown
const showSearchDropdown = ref<boolean>(false);
const searchInput = ref<HTMLInputElement | null>(null);

// Add new functions for search dropdown
const toggleSearchDropdown = (): void => {
    showSearchDropdown.value = !showSearchDropdown.value;
    if (showSearchDropdown.value) {
        nextTick(() => {
            searchInput.value?.focus();
        });
    }
};

const clearSearch = (): void => {
    filters.value.search = '';
    refreshData();
};

// Close search dropdown when clicking outside
onMounted(() => {
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-search-toggle]') && !target.closest('.absolute') && showSearchDropdown.value) {
            showSearchDropdown.value = false;
        }
    });

    // Load initial data
    loadChannels();
    loadFeedItems();
    loadCategories();
});

// Add a function to load prompts
const loadPrompts = async (): Promise<void> => {
    try {
        loadingPrompts.value = true;

        const response = await adminClient.prompts.get({
            limit: 1000,
            sortBy: 'name',
            sort: 'asc'
        });

        if (response && response.data) {
            promptsList.value = response.data || [];

            // If there are no prompts, ensure we have at least the default option
            if (promptsList.value.length === 0) {
                promptsList.value = [{ id: 'default', name: 'Default' }];
            }
        } else {
            promptsList.value = [];
        }

        loadingPrompts.value = false;
    } catch (err: unknown) {
        console.error('Failed to load prompts:', err);
        loadingPrompts.value = false;
        promptsList.value = [];
    }
};

// New refs for bulk reprocess
const showBulkReprocessDialog = ref<boolean>(false);
const selectedItemsForReprocess = ref<string[]>([]);
const selectAllForReprocess = ref<boolean>(false);
const bulkReprocessLoading = ref<boolean>(false);
const bulkReprocessProgress = ref({
    total: 0,
    completed: 0,
    currentItem: null as string | null, // Correção aqui
    processedItems: [] as { id: string; title: string; success: boolean; error?: string }[]
});

// New refs for category creation
const showCreateCategoryDialog = ref<boolean>(false);
const createCategoryLoading = ref<boolean>(false);
const newCategoryForm = ref({
    name: '',
    slug: '',
    parentCategory: '',
    active: true
});
const categoryFormErrors = ref<Record<string, string>>({});

const openBulkReprocessDialog = (): void => {
    selectedItemsForReprocess.value = [];
    selectAllForReprocess.value = false;
    // Items for the dialog will be the current `feedItems`, already filtered by the main view
    showBulkReprocessDialog.value = true;
};

const closeBulkReprocessDialog = (): void => {
    showBulkReprocessDialog.value = false;
};

const toggleSelectAllForReprocess = (): void => {
    if (selectAllForReprocess.value) {
        selectedItemsForReprocess.value = feedItems.value.map(item => item.id);
    } else {
        selectedItemsForReprocess.value = [];
    }
};

watch(selectedItemsForReprocess, (newVal) => {
    selectAllForReprocess.value = newVal.length > 0 && newVal.length === feedItems.value.length;
});

const startBulkReprocess = async (): Promise<void> => {
    if (selectedItemsForReprocess.value.length === 0) return;

    bulkReprocessLoading.value = true;
    bulkReprocessProgress.value = {
        total: selectedItemsForReprocess.value.length,
        completed: 0,
        currentItem: null,
        processedItems: []
    };

    const itemsToProcess = [...selectedItemsForReprocess.value]; // Criar uma cópia

    for (const itemId of itemsToProcess) {
        const item = feedItems.value.find(i => i.id === itemId);
        if (!item) continue;

        bulkReprocessProgress.value.currentItem = item.title;

        try {
            // Reutilizar a função reprocessItem existente
            processingItems.value[item.id] = true; // Para compatibilidade com o spinner individual se visível
            const response = await feedClient.raw.reprocessRaw(item.id);
            processingItems.value[item.id] = false;

            if (response && response.success) {
                bulkReprocessProgress.value.processedItems.push({
                    id: item.id,
                    title: item.title,
                    success: true
                });
            } else {
                throw new Error(response?.message || 'Failed to reprocess feed item');
            }
        } catch (err: unknown) {
            processingItems.value[item.id] = false;
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            bulkReprocessProgress.value.processedItems.push({
                id: item.id,
                title: item.title,
                success: false,
                error: errorMsg
            });
            console.error(`Failed to reprocess item ${item.id}:`, err);
        }
        bulkReprocessProgress.value.completed++;
    }

    const successCount = bulkReprocessProgress.value.processedItems.filter(r => r.success).length;
    if (successCount === bulkReprocessProgress.value.total) {
        showNotification('success', `All ${successCount} items were reprocessed successfully.`);
    } else {
        showNotification('warning', `${successCount} of ${bulkReprocessProgress.value.total} items reprocessed successfully. Check console for errors.`);
    }

    bulkReprocessLoading.value = false;
    closeBulkReprocessDialog();
    await refreshData(); // Atualizar a lista principal
};

// Category creation functions
const categoryExists = (categoryName: string): boolean => {
    return categories.value.some(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
    );
};

const openCreateCategoryDialog = (suggestedName: string): void => {
    newCategoryForm.value = {
        name: suggestedName,
        slug: generateCategorySlug(suggestedName),
        parentCategory: '',
        active: true
    };
    categoryFormErrors.value = {};
    showCreateCategoryDialog.value = true;
};

const closeCreateCategoryDialog = (): void => {
    showCreateCategoryDialog.value = false;
    newCategoryForm.value = {
        name: '',
        slug: '',
        parentCategory: '',
        active: true
    };
    categoryFormErrors.value = {};
};

const updateCategorySlug = (): void => {
    newCategoryForm.value.slug = generateCategorySlug(newCategoryForm.value.name);
};

const generateCategorySlug = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/&/g, '-and-')      // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
};

const createCategory = async (): Promise<void> => {
    try {
        createCategoryLoading.value = true;
        categoryFormErrors.value = {};

        // Validate
        if (!newCategoryForm.value.name.trim()) {
            categoryFormErrors.value.name = 'Category name is required';
            createCategoryLoading.value = false;
            return;
        }

        if (!newCategoryForm.value.slug.trim()) {
            categoryFormErrors.value.slug = 'Category slug is required';
            createCategoryLoading.value = false;
            return;
        }

        const categoryData = {
            name: newCategoryForm.value.name.trim(),
            slug: newCategoryForm.value.slug.trim(),
            active: newCategoryForm.value.active,
            parentCategory: newCategoryForm.value.parentCategory || null,
            navigationLabel: newCategoryForm.value.name.trim(),
            mainNav: false,
            mainNavGroup: null,
            mainNavIndex: 0
        };

        await adminClient.categories.insert(categoryData);
        
        showNotification('success', 'Category created successfully!');
        closeCreateCategoryDialog();
        
        // Reload categories to update the list
        await loadCategories();
        
        // Auto-select the newly created category
        const newCategory = categories.value.find(cat => 
            cat.name.toLowerCase() === categoryData.name.toLowerCase()
        );
        if (newCategory && !selectedCategories.value.includes(newCategory.id)) {
            selectedCategories.value.push(newCategory.id);
        }
        
    } catch (err: unknown) {
        createCategoryLoading.value = false;
        
        if (err && typeof err === 'object' && 'response' in err) {
            const errorResponse = err as any;
            if (errorResponse.response?.data?.errors) {
                categoryFormErrors.value = errorResponse.response.data.errors;
            } else {
                showNotification('error', errorResponse.message || 'Failed to create category');
            }
        } else {
            showNotification('error', err instanceof Error ? err.message : 'Failed to create category');
        }
    } finally {
        createCategoryLoading.value = false;
    }
};

const showBulkDeleteDialog = ref<boolean>(false);
const selectAllForDelete = ref<boolean>(false);
const selectedItemsForDelete = ref<string[]>([]);
const bulkDeleteLoading = ref<boolean>(false);
const bulkDeleteProgress = ref({
    total: 0,
    completed: 0,
    currentItem: null as string | null, // Correção aqui
    processedItems: [] as { id: string; title: string; success: boolean; error?: string }[]
});

const showBulkDeleteConfirmation = ref<boolean>(false);

const openBulkDeleteDialog = (): void => {
    showBulkDeleteDialog.value = true;
};

const closeBulkDeleteDialog = (): void => {
    showBulkDeleteDialog.value = false;
};

const toggleSelectAllForDelete = (): void => {
    if (selectAllForDelete.value) {
        selectedItemsForDelete.value = feedItems.value.map(item => item.id);
    } else {
        selectedItemsForDelete.value = [];
    }
};

watch(selectedItemsForDelete, (newVal) => {
    selectAllForDelete.value = newVal.length > 0 && newVal.length === feedItems.value.length;
});

const confirmBulkDelete = async (): Promise<void> => {
    if (selectedItemsForDelete.value.length === 0) return;
    
    // Mostrar diálogo de confirmação
    showBulkDeleteConfirmation.value = true;
};

const startBulkDelete = async (): Promise<void> => {
    if (selectedItemsForDelete.value.length === 0) return;

    try {
        bulkDeleteLoading.value = true;
        bulkDeleteProgress.value = {
            total: selectedItemsForDelete.value.length,
            completed: 0,
            currentItem: null,
            processedItems: []
        };

        const itemsToDelete = [...selectedItemsForDelete.value]; // Criar uma cópia

        for (const itemId of itemsToDelete) {
            const item = feedItems.value.find(i => i.id === itemId);
            if (!item) continue;

            bulkDeleteProgress.value.currentItem = item.title;

            try {
                // Chamar a API para excluir o item
                await feedClient.raw.deleteRaw(itemId);
                
                bulkDeleteProgress.value.processedItems.push({
                    id: item.id,
                    title: item.title,
                    success: true
                });
            } catch (err: unknown) {
                const errorMsg = err instanceof Error ? err.message : 'Unknown error';
                bulkDeleteProgress.value.processedItems.push({
                    id: item.id,
                    title: item.title,
                    success: false,
                    error: errorMsg
                });
                console.error(`Falha ao excluir item ${item.id}:`, err);
            }
            bulkDeleteProgress.value.completed++;
        }

        const successCount = bulkDeleteProgress.value.processedItems.filter(r => r.success).length;
        if (successCount === bulkDeleteProgress.value.total) {
            showNotification('success', `${successCount} itens foram excluídos com sucesso.`);
        } else {
            showNotification('warning', `${successCount} de ${bulkDeleteProgress.value.total} itens foram excluídos. Verifique o console para erros.`);
        }

        showBulkDeleteConfirmation.value = false;
        selectedItemsForDelete.value = [];
        await refreshData();
    } catch (err: unknown) {
        console.error('Falha ao excluir itens:', err);
        showNotification('error', err instanceof Error ? err.message : 'Falha ao excluir itens');
    } finally {
        bulkDeleteLoading.value = false;
        showBulkDeleteConfirmation.value = false;
        closeBulkDeleteDialog();
    }
};

const showMoreActionsDropdown = ref<boolean>(false);

const toggleMoreActionsDropdown = (): void => {
    showMoreActionsDropdown.value = !showMoreActionsDropdown.value;
};
</script>

<style>
.line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>
