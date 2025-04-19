<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Medias</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button @click="openAddDialog" class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Upload
                </button>

                <div class="relative group">
                    <button class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        Maintenance
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="absolute right-0 z-10 mt-1 min-w-[200px] origin-top-right rounded-md bg-neutral-800 shadow-lg border border-neutral-700 hidden group-hover:block">
                        <div class="py-1">
                            <button @click="refreshData" class="w-full text-left px-3 py-2 text-xs text-white hover:bg-neutral-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh List
                            </button>
                            <button @click="openReprocessDialog" class="w-full text-left px-3 py-2 text-xs text-white hover:bg-neutral-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reprocess Images
                            </button>
                            <button @click="openCleanupDialog" class="w-full text-left px-3 py-2 text-xs text-white hover:bg-neutral-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clean Orphaned Records
                            </button>
                            <button @click="openDuplicatesDialog" class="w-full text-left px-3 py-2 text-xs text-white hover:bg-neutral-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove Duplicates
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-neutral-800 rounded-lg p-4 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="relative flex-1 flex items-center">
                    <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            v-model="filters.search"
                            type="text"
                            placeholder="Search medias..."
                            class="bg-neutral-700 h-10 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-0"
                        >
                    </div>
                    <select
                        v-model="filters.searchField"
                        class="bg-neutral-700 w-56 h-10 border border-neutral-800 text-white px-3 py-2 rounded-r-md focus:outline-none focus:ring-0 border-l-0"
                    >
                        <option value="alt">Alt Text</option>
                        <option value="caption">Caption</option>
                        <option value="format">Format</option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading medias...</span>
        </div>

        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load medias</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <div v-else-if="medias.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            <p class="text-neutral-300 mb-2">No medias found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by uploading your first media</p>
            <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Upload Media
            </button>
        </div>

        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                ID
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                Preview
                            </th>
                            <th
                                @click="handleSort('format')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Format
                                <span v-if="filters.sortBy === 'format'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Dimensions
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Size
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="media in medias" :key="media.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="media.id">
                                {{ media.id.substring(0, 6) }}...
                            </td>
                            <td class="px-6 py-4">
                                <div class="h-14 w-24 overflow-hidden rounded bg-neutral-700 flex items-center justify-center">
                                    <img :src="media.url" :alt="media.alt || ''" class="object-cover w-full h-full" />
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white uppercase">
                                {{ media.format }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ media.width }} × {{ media.height }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ formatFileSize(media.size) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="openEditDialog(media)"
                                        title="Edit media"
                                        class="text-neutral-400 hover:text-yellow-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="openInNewTab(media)"
                                        title="Open in new tab"
                                        class="text-neutral-400 hover:text-blue-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="copyUrl(media)"
                                        title="Copy URL"
                                        class="text-neutral-400 hover:text-green-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    </button>
                                    <button @click="confirmDelete(media)" class="text-neutral-400 hover:text-red-500 p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Pagination
            :pagination="pagination"
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

        <!-- Adicionar o diálogo de confirmação para deletar mídia -->
        <DeleteDialog
            :show="showDeleteDialog"
            :loading="false"
            message="Are you sure you want to delete this media?"
            warning-text="This action cannot be undone."
            @confirm="deleteMedia"
            @cancel="showDeleteDialog = false"
        />

        <!-- Media Library Dialog -->
        <MediaDialog
            v-model="showMediaDialog"
            :type="mediaDialogType"
            @select="handleMediaSelected"
        />

        <!-- Reprocess Images Dialog -->
        <div v-if="showReprocessDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Reprocess Images</h3>
                </div>
                <div class="p-6">
                    <div v-if="!isReprocessing">
                        <p class="text-neutral-300 mb-4">
                            This will reprocess all image files in your media directory:
                        </p>
                        <ul class="list-disc pl-5 mb-4 text-neutral-300 space-y-1">
                            <li>Remove database records for files that no longer exist</li>
                            <li>Add records for images that exist but aren't in the database</li>
                            <li>Optimize images for better performance</li>
                            <li>Update file paths for existing records</li>
                        </ul>
                        <p class="text-yellow-500 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            This process may take a while if you have many images.
                        </p>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button @click="showReprocessDialog = false"
                                class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                                Cancel
                            </button>
                            <button @click="startReprocessing"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                                Start Reprocessing
                            </button>
                        </div>
                    </div>

                    <div v-else>
                        <div class="mb-4">
                            <p class="text-white mb-2">{{ reprocessStatus.message }}</p>

                            <div class="w-full bg-neutral-700 rounded-full h-4 mb-2">
                                <div class="bg-blue-600 h-4 rounded-full"
                                    :style="{ width: `${reprocessStatus.percentage || 0}%` }"></div>
                            </div>

                            <p class="text-neutral-400 text-sm">
                                {{ reprocessStatus.processed || 0 }} de {{ reprocessStatus.total || 0 }} processados ({{ reprocessStatus.percentage || 0 }}%)
                            </p>
                        </div>

                        <div class="bg-neutral-700 rounded-md p-3 mb-4">
                            <h4 class="text-white mb-2 font-medium">Progress Details:</h4>
                            <ul class="text-neutral-300 text-sm space-y-1">
                                <li>Optimized: {{ reprocessStatus.details?.optimized || 0 }}</li>
                                <li>Added to DB: {{ reprocessStatus.details?.added || 0 }}</li>
                                <li>Removed from DB: {{ reprocessStatus.details?.removed || 0 }}</li>
                                <li>Failed: {{ reprocessStatus.details?.failed || 0 }}</li>
                                <li v-if="reprocessStatus.details?.bytes_saved > 0">
                                    Space saved: {{ formatFileSize(reprocessStatus.details.bytes_saved) }}
                                </li>
                            </ul>
                        </div>

                        <div class="flex justify-end">
                            <button
                                @click="closeReprocessDialog"
                                :disabled="reprocessStatus.status === 'processing'"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 text-white rounded-md transition-colors">
                                {{ reprocessStatus.status === 'processing' ? 'Processing...' : 'Close' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cleanup Orphaned Records Dialog -->
        <div v-if="showCleanupDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Clean Orphaned Records</h3>
                </div>
                <div class="p-6">
                    <div v-if="!isProcessing">
                        <p class="text-neutral-300 mb-4">
                            This will scan the database for media records that don't have corresponding files:
                        </p>
                        <ul class="list-disc pl-5 mb-4 text-neutral-300 space-y-1">
                            <li>Check if each record has a valid file</li>
                            <li>Attempt to locate missing files in multiple formats</li>
                            <li>Update file paths for files that were found</li>
                            <li>Remove records that don't have corresponding files</li>
                        </ul>
                        <p class="text-yellow-500 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            This action will permanently delete orphaned database records.
                        </p>

                        <div class="bg-neutral-700 p-4 rounded-md mb-4">
                            <div class="flex items-center mb-2">
                                <input type="checkbox" id="forceCleanup" v-model="forceCleanup" class="mr-2 h-4 w-4 text-blue-600 rounded">
                                <label for="forceCleanup" class="text-white font-medium">Force Delete Orphaned Records</label>
                            </div>
                            <p class="text-neutral-400 text-sm" :class="{'text-red-400': forceCleanup}">
                                <span v-if="forceCleanup">
                                    <strong>Warning:</strong> This will aggressively remove any record that doesn't have an exact matching file.
                                    Only use this option if your database has many orphaned records.
                                </span>
                                <span v-else>
                                    Normal mode tries to find alternative files for each record before removing it.
                                </span>
                            </p>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button @click="showCleanupDialog = false"
                                class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                                Cancel
                            </button>
                            <button @click="startCleanup"
                                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                                Start Cleanup
                            </button>
                        </div>
                    </div>

                    <div v-else>
                        <div class="mb-4">
                            <p class="text-white mb-2">{{ reprocessStatus.message }}</p>

                            <div class="w-full bg-neutral-700 rounded-full h-4 mb-2">
                                <div class="bg-purple-600 h-4 rounded-full"
                                    :style="{ width: `${reprocessStatus.percentage || 0}%` }"></div>
                            </div>

                            <p class="text-neutral-400 text-sm">
                                {{ reprocessStatus.processed || 0 }} of {{ reprocessStatus.total || 0 }} records checked ({{ reprocessStatus.percentage || 0 }}%)
                            </p>
                        </div>

                        <div class="bg-neutral-700 rounded-md p-3 mb-4" v-if="reprocessStatus.details?.removed > 0">
                            <h4 class="text-white mb-2 font-medium">Cleanup Results:</h4>
                            <p class="text-neutral-300 text-sm">
                                Removed {{ reprocessStatus.details?.removed || 0 }} orphaned database records.
                            </p>
                            <p v-if="cleanupResult && cleanupResult.valid !== undefined" class="text-neutral-300 text-sm mt-1">
                                Kept {{ cleanupResult.valid }} valid records out of {{ cleanupResult.total }} total.
                            </p>
                        </div>

                        <div class="flex justify-end">
                            <button
                                @click="closeCleanupDialog"
                                :disabled="reprocessStatus.status === 'processing'"
                                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-600 text-white rounded-md transition-colors">
                                {{ reprocessStatus.status === 'processing' ? 'Processing...' : 'Close' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Remove Duplicates Dialog -->
        <div v-if="showDuplicatesDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Remove Duplicate Images</h3>
                </div>
                <div class="p-6">
                    <div v-if="!isDuplicatesProcessing">
                        <p class="text-neutral-300 mb-4">
                            This will scan for duplicate images with numeric suffixes (e.g., image-1.jpg, image-2.png):
                        </p>
                        <ul class="list-disc pl-5 mb-4 text-neutral-300 space-y-1">
                            <li>Find all images with -1, -2, etc. suffixes</li>
                            <li>Check if the original file without suffix exists</li>
                            <li>Update database records to point to the original file</li>
                            <li>Remove the duplicate files</li>
                        </ul>
                        <p class="text-yellow-500 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            This action will permanently delete duplicate files.
                        </p>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button @click="showDuplicatesDialog = false"
                                class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                                Cancel
                            </button>
                            <button @click="startRemoveDuplicates"
                                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                                Remove Duplicates
                            </button>
                        </div>
                    </div>

                    <div v-else>
                        <div class="mb-4">
                            <p class="text-white mb-2">{{ reprocessStatus.message }}</p>

                            <div class="w-full bg-neutral-700 rounded-full h-4 mb-2">
                                <div class="bg-red-600 h-4 rounded-full"
                                    :style="{ width: `${reprocessStatus.percentage || 0}%` }"></div>
                            </div>

                            <p class="text-neutral-400 text-sm">
                                {{ reprocessStatus.processed || 0 }} of {{ reprocessStatus.total || 0 }} files checked ({{ reprocessStatus.percentage || 0 }}%)
                            </p>
                        </div>

                        <div class="bg-neutral-700 rounded-md p-3 mb-4" v-if="duplicatesResult">
                            <h4 class="text-white mb-2 font-medium">Cleanup Results:</h4>
                            <p class="text-neutral-300 text-sm">
                                Removed {{ duplicatesResult.removed || 0 }} duplicate files from {{ duplicatesResult.identified || 0 }} identified.
                            </p>
                        </div>

                        <div class="flex justify-end">
                            <button
                                @click="closeDuplicatesDialog"
                                :disabled="reprocessStatus.status === 'processing'"
                                class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-600 text-white rounded-md transition-colors">
                                {{ reprocessStatus.status === 'processing' ? 'Processing...' : 'Close' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Adicionar diálogo de edição de mídia -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Edit Media Details</h3>
                </div>
                <div class="p-6">
                    <div v-if="mediaToEdit" class="space-y-4">
                        <div class="mb-4">
                            <div class="aspect-video overflow-hidden bg-neutral-700 rounded-lg mb-4">
                                <img :src="mediaToEdit.url" :alt="mediaToEdit.alt || ''" class="object-contain w-full h-full" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-300 mb-1">Alt Text</label>
                            <input
                                v-model="mediaForm.alt"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Image description for accessibility"
                            />
                            <p v-if="formErrors.alt" class="mt-1 text-sm text-red-500">{{ formErrors.alt }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-neutral-300 mb-1">Caption</label>
                            <textarea
                                v-model="mediaForm.caption"
                                rows="3"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                placeholder="Image caption (optional)"
                            ></textarea>
                            <p v-if="formErrors.caption" class="mt-1 text-sm text-red-500">{{ formErrors.caption }}</p>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 mt-6">
                        <button @click="showDialog = false"
                            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                            Cancel
                        </button>
                        <button @click="saveMedia"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useAdminClient } from '@cmmv/blog/admin/client'
import MediaDialog from '../components/MediaDialog.vue'
import Pagination from '../components/Pagination.vue'
import DeleteDialog from '../components/DeleteDialog.vue'
import ToastNotification from '../components/ToastNotification.vue'
import { useRouter, useRoute } from 'vue-router'

const adminClient = useAdminClient()
const router = useRouter()
const route = useRoute()

const medias = ref([])
const loading = ref(true)
const error = ref(null)

const showDialog = ref(false)
const isEditing = ref(false)
const mediaForm = ref({
    alt: '',
    caption: '',
    active: true
})
const mediaToEdit = ref(null)
const formErrors = ref({})

const showDeleteDialog = ref(false)
const mediaToDelete = ref(null)

const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

const pagination = ref({
    current: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 1,
    to: 10
})

const filters = ref({
    search: '',
    searchField: 'alt',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1
})

const showMediaDialog = ref(false)
const mediaDialogType = ref('all')

const showReprocessDialog = ref(false)
const showCleanupDialog = ref(false)
const showDuplicatesDialog = ref(false)
const isReprocessing = ref(false)
const isProcessing = ref(false)
const isDuplicatesProcessing = ref(false)
const forceCleanup = ref(false)
const reprocessStatus = ref({
    total: 0,
    processed: 0,
    percentage: 0,
    status: 'idle',
    message: '',
    details: {
        scanned: 0,
        added: 0,
        removed: 0,
        optimized: 0,
        failed: 0,
        bytes_saved: 0
    }
})
const duplicatesResult = ref(null)
const cleanupResult = ref(null)
let progressInterval = null

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

const loadMedias = async () => {
    try {
        loading.value = true
        error.value = null

        const apiFilters = {
            limit: pagination.value.perPage,
            offset: (filters.value.page - 1) * pagination.value.perPage,
            sortBy: filters.value.sortBy,
            sort: filters.value.sortOrder,
        }

        if (filters.value.search) {
            apiFilters.search = filters.value.search
            apiFilters.searchField = filters.value.searchField
        }

        const response = await adminClient.medias.get(apiFilters)

        if (response && response.data) {
            medias.value = response.data || []

            const paginationData = response.pagination || {}
            const totalCount = response.count || 0
            const currentOffset = paginationData.offset || 0
            const currentLimit = paginationData.limit || 10

            const currentPage = Math.floor(currentOffset / currentLimit) + 1
            const lastPage = Math.ceil(totalCount / currentLimit)

            pagination.value = {
                current: currentPage,
                lastPage: lastPage,
                perPage: currentLimit,
                total: totalCount,
                from: currentOffset + 1,
                to: Math.min(currentOffset + currentLimit, totalCount)
            }
        } else {
            medias.value = []

            pagination.value = {
                current: 1,
                lastPage: 1,
                perPage: 10,
                total: 0,
                from: 0,
                to: 0
            }
        }

        loading.value = false
    } catch (err) {
        console.error('Failed to load medias:', err)
        loading.value = false
        error.value = err.message || 'Failed to load medias'
        showNotification('error', 'Failed to load medias')
    }
}

const refreshData = () => {
    loadMedias()
}

const openAddDialog = () => {
    mediaDialogType.value = 'all'
    showMediaDialog.value = true
}

const openEditDialog = (media) => {
    isEditing.value = true
    mediaToEdit.value = media
    mediaForm.value = {
        alt: media.alt || '',
        caption: media.caption || '',
        active: true
    }
    formErrors.value = {}
    showDialog.value = true
}

const confirmDelete = (media) => {
    mediaToDelete.value = media
    showDeleteDialog.value = true
}

const handleSort = (field) => {
    if (filters.value.sortBy === field) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        filters.value.sortBy = field;
        filters.value.sortOrder = 'desc';
    }
    filters.value.page = 1; // Reset to first page when sorting changes
}

const showNotification = (type, message, duration = 3000) => {
    notification.value = {
        show: true,
        type,
        message,
        duration
    }

    setTimeout(() => {
        notification.value.show = false
    }, duration)
}

const getMediaUrl = (media) => {
    return media.url;
}

const openInNewTab = (media) => {
    const url = getMediaUrl(media);
    window.open(url, '_blank');
}

const copyUrl = (media) => {
    const url = getMediaUrl(media);
    navigator.clipboard.writeText(url)
        .then(() => {
            showNotification('success', 'URL copied to clipboard');
        })
        .catch(() => {
            showNotification('error', 'Failed to copy URL');
        });
}

const deleteMedia = async () => {
    if (!mediaToDelete.value) return;

    try {
        // Mostrar estado de carregamento se necessário
        showDeleteDialog.value = false;

        // Chamar a API para excluir a mídia
        await adminClient.medias.delete(mediaToDelete.value.id);

        // Mostrar notificação de sucesso
        showNotification('success', 'Media deleted successfully');

        // Atualizar a lista de mídias
        refreshData();
    } catch (err) {
        console.error('Failed to delete media:', err);
        showNotification('error', err.message || 'Failed to delete media');
    } finally {
        mediaToDelete.value = null;
    }
};

const handleMediaSelected = (media) => {
    refreshData();
    showNotification('success', 'Media added successfully');
}

const saveMedia = async () => {
    if (!mediaToEdit.value) return;

    try {
        // Validar
        const errors = {};
        if (!mediaForm.value.alt.trim()) {
            errors.alt = 'Alt text is required';
        }

        if (Object.keys(errors).length > 0) {
            formErrors.value = errors;
            return;
        }

        // Limpar erros
        formErrors.value = {};

        // Chamar a API para atualizar a mídia
        await adminClient.medias.update(mediaToEdit.value.id, {
            alt: mediaForm.value.alt.trim(),
            caption: mediaForm.value.caption.trim()
        });

        // Atualizar mídia na lista
        const index = medias.value.findIndex(m => m.id === mediaToEdit.value.id);
        if (index !== -1) {
            medias.value[index] = {
                ...medias.value[index],
                alt: mediaForm.value.alt.trim(),
                caption: mediaForm.value.caption.trim()
            };
        }

        // Mostrar notificação de sucesso
        showNotification('success', 'Media updated successfully');

        // Fechar diálogo
        showDialog.value = false;
    } catch (err) {
        console.error('Failed to update media:', err);
        showNotification('error', err.message || 'Failed to update media');
    }
};

const handlePageChange = (newPage) => {
    filters.value.page = newPage
    updateUrlParams()
}

const updateUrlParams = () => {
    const query = {}
    if (filters.value.page !== 1) query.page = filters.value.page.toString()
    if (filters.value.search) query.search = filters.value.search
    if (filters.value.sortBy !== 'createdAt') query.sortBy = filters.value.sortBy
    if (filters.value.sortOrder !== 'desc') query.sortOrder = filters.value.sortOrder

    router.replace({ query })
}

const initializeFromUrl = () => {
    const { query } = route

    if (query.page) filters.value.page = parseInt(query.page) || 1
    if (query.search) filters.value.search = query.search
    if (query.sortBy) filters.value.sortBy = query.sortBy
    if (query.sortOrder) filters.value.sortOrder = query.sortOrder
}

watch(filters, () => {
    loadMedias()
    updateUrlParams()
}, { deep: true })

watch(() => route.query, (newQuery) => {
    // Only update from URL if there's actually a change to prevent loops
    const currentPage = filters.value.page
    const urlPage = newQuery.page ? parseInt(newQuery.page) : 1

    if (
        currentPage !== urlPage ||
        filters.value.search !== (newQuery.search || '') ||
        filters.value.sortBy !== (newQuery.sortBy || 'createdAt') ||
        filters.value.sortOrder !== (newQuery.sortOrder || 'desc')
    ) {
        initializeFromUrl()
        loadMedias()
    }
}, { deep: true })

const openReprocessDialog = () => {
    showReprocessDialog.value = true
    isReprocessing.value = false
    reprocessStatus.value = {
        total: 0,
        processed: 0,
        percentage: 0,
        status: 'idle',
        message: '',
        details: {
            scanned: 0,
            added: 0,
            removed: 0,
            optimized: 0,
            failed: 0,
            bytes_saved: 0
        }
    }
}

const openCleanupDialog = () => {
    showCleanupDialog.value = true
    isProcessing.value = false
    forceCleanup.value = false
    cleanupResult.value = null
    reprocessStatus.value = {
        total: 0,
        processed: 0,
        percentage: 0,
        status: 'idle',
        message: '',
        details: {
            scanned: 0,
            added: 0,
            removed: 0,
            optimized: 0,
            failed: 0,
            bytes_saved: 0
        }
    }
}

const startReprocessing = async () => {
    try {
        isReprocessing.value = true
        reprocessStatus.value.status = 'processing'
        reprocessStatus.value.message = 'Starting reprocessing...'
        reprocessStatus.value.processed = 0
        reprocessStatus.value.total = 0
        reprocessStatus.value.percentage = 0
        reprocessStatus.value.details = {
            scanned: 0,
            added: 0,
            removed: 0,
            optimized: 0,
            failed: 0,
            bytes_saved: 0
        }

        // Limpar qualquer intervalo anterior
        if (progressInterval) {
            clearInterval(progressInterval)
        }

        console.log('Starting progress polling for reprocessing...')

        // Iniciar o polling imediatamente e a cada 1 segundo depois
        const checkProgress = async () => {
            try {
                console.log('Checking reprocess progress...')
                const progress = await adminClient.imports.getReprocessProgress()
                console.log('Progress update:', progress)

                // Atualizar o estado apenas se tivermos dados válidos
                if (progress && typeof progress === 'object') {
                    reprocessStatus.value = {
                        ...reprocessStatus.value,
                        ...progress
                    }

                    // Log para debug
                    console.log(`Progress: ${progress.processed}/${progress.total} (${progress.percentage}%)`)

                    // Verificar se o processo foi concluído
                    if (progress.status === 'completed' || progress.status === 'error') {
                        console.log('Process completed with status:', progress.status)
                        if (progressInterval) {
                            clearInterval(progressInterval)
                            progressInterval = null
                        }
                    }
                }
            } catch (err) {
                console.error('Error getting reprocess progress:', err)
            }
        }

        // Verificar o progresso imediatamente
        await checkProgress()

        // Configurar o intervalo para verificações regulares
        progressInterval = setInterval(checkProgress, 1000)

        // Iniciar o reprocessamento
        console.log('Starting image reprocessing...')
        adminClient.imports.reprocessImages()
            .then(result => {
                console.log('Reprocessing completed:', result)
            })
            .catch(err => {
                console.error('Error reprocessing images:', err)
                reprocessStatus.value.status = 'error'
                reprocessStatus.value.message = `Error: ${err.message || 'Failed to reprocess images'}`
                if (progressInterval) {
                    clearInterval(progressInterval)
                    progressInterval = null
                }
            })

    } catch (err) {
        console.error('Failed to start reprocessing:', err)
        reprocessStatus.value.status = 'error'
        reprocessStatus.value.message = err.message || 'Failed to start reprocessing'

        if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
        }
    }
}

const startCleanup = async () => {
    try {
        isProcessing.value = true
        reprocessStatus.value.status = 'processing'
        reprocessStatus.value.message = 'Starting cleanup of orphaned records...'
        reprocessStatus.value.processed = 0
        reprocessStatus.value.total = 0
        reprocessStatus.value.percentage = 0
        reprocessStatus.value.details.removed = 0
        cleanupResult.value = null

        // Limpar qualquer intervalo anterior
        if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
        }

        console.log('Initializing progress tracker...')

        // Inicializar o rastreador de progresso no servidor
        await adminClient.imports.initCleanupProgress()

        console.log('Starting progress polling for cleanup...')

        // Função para verificar o progresso
        const checkProgress = async () => {
            try {
                console.log('Checking cleanup progress...')
                const progress = await adminClient.imports.getCleanupProgress()
                console.log('Cleanup progress update:', progress)

                // Atualizar o estado apenas se tivermos dados válidos
                if (progress && typeof progress === 'object') {
                    reprocessStatus.value = {
                        ...reprocessStatus.value,
                        ...progress
                    }

                    // Log para debug
                    console.log(`Cleanup progress: ${progress.processed}/${progress.total} (${progress.percentage}%)`)

                    // Verificar se o processo foi concluído
                    if (progress.status === 'completed' || progress.status === 'error') {
                        console.log('Cleanup process completed with status:', progress.status)
                        if (progressInterval) {
                            clearInterval(progressInterval)
                            progressInterval = null
                        }

                        if (progress.status === 'completed') {
                            showNotification('success', `Limpeza concluída: ${progress.details.removed} registros órfãos removidos.`)
                        }
                    }
                }
            } catch (err) {
                console.error('Error getting cleanup progress:', err)
            }
        }

        // Verificar o progresso imediatamente
        await checkProgress()

        // Configurar o intervalo para verificações regulares
        progressInterval = setInterval(checkProgress, 1000)

        // Iniciar a limpeza
        console.log(`Starting orphaned records cleanup... Force mode: ${forceCleanup.value}`)
        try {
            const result = await adminClient.imports.cleanupOrphanedMedia(forceCleanup.value)
            console.log('Cleanup completed:', result)

            // Armazenar o resultado para exibição
            cleanupResult.value = result

            // Verificar o progresso final após a conclusão
            await checkProgress()
        } catch (err) {
            console.error('Error during cleanup:', err)
            reprocessStatus.value.status = 'error'
            reprocessStatus.value.message = `Error: ${err.message || 'Failed to clean up orphaned records'}`

            if (progressInterval) {
                clearInterval(progressInterval)
                progressInterval = null
            }

            showNotification('error', err.message || 'Falha ao limpar registros órfãos')
        }
    } catch (err) {
        console.error('Failed to start cleanup:', err)
        reprocessStatus.value.status = 'error'
        reprocessStatus.value.message = err.message || 'Falha ao iniciar a limpeza'

        if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
        }

        showNotification('error', err.message || 'Falha ao limpar registros órfãos')
    }
}

const closeReprocessDialog = () => {
    if (reprocessStatus.value.status !== 'processing') {
        showReprocessDialog.value = false

        // Garantir que o intervalo de verificação seja limpo
        if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
        }

        // Refresh the media list if reprocessing completed
        if (reprocessStatus.value.status === 'completed') {
            refreshData()
        }
    }
}

const closeCleanupDialog = () => {
    if (reprocessStatus.value.status !== 'processing') {
        showCleanupDialog.value = false

        // Garantir que o intervalo de verificação seja limpo
        if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
        }

        // Refresh the media list if cleanup completed
        if (reprocessStatus.value.status === 'completed') {
            refreshData()
        }
    }
}

const openDuplicatesDialog = () => {
    showDuplicatesDialog.value = true
    isDuplicatesProcessing.value = false
    duplicatesResult.value = null
    reprocessStatus.value = {
        total: 0,
        processed: 0,
        percentage: 0,
        status: 'idle',
        message: '',
        details: {
            scanned: 0,
            added: 0,
            removed: 0,
            optimized: 0,
            failed: 0,
            bytes_saved: 0
        }
    }
}

const startRemoveDuplicates = async () => {
    try {
        isDuplicatesProcessing.value = true
        reprocessStatus.value.status = 'processing'
        reprocessStatus.value.message = 'Starting to scan for duplicate images...'
        reprocessStatus.value.processed = 0
        reprocessStatus.value.total = 0
        reprocessStatus.value.percentage = 0
        duplicatesResult.value = null

        // Limpar qualquer intervalo anterior
        if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
        }

        console.log('Initializing progress tracker...')

        // Inicializar o rastreador de progresso no servidor
        await adminClient.imports.initCleanupProgress()

        console.log('Starting progress polling for duplicate removal...')

        // Função para verificar o progresso
        const checkProgress = async () => {
            try {
                console.log('Checking cleanup progress...')
                const progress = await adminClient.imports.getCleanupProgress()
                console.log('Cleanup progress update:', progress)

                // Atualizar o estado apenas se tivermos dados válidos
                if (progress && typeof progress === 'object') {
                    reprocessStatus.value = {
                        ...reprocessStatus.value,
                        ...progress
                    }

                    // Log para debug
                    console.log(`Cleanup progress: ${progress.processed}/${progress.total} (${progress.percentage}%)`)

                    // Verificar se o processo foi concluído
                    if (progress.status === 'completed' || progress.status === 'error') {
                        console.log('Cleanup process completed with status:', progress.status)
                        if (progressInterval) {
                            clearInterval(progressInterval)
                            progressInterval = null
                        }

                        if (progress.status === 'completed') {
                            showNotification('success', `Cleanup completed: ${progress.details.removed || 0} duplicate files removed.`)
                        }
                    }
                }
            } catch (err) {
                console.error('Error getting cleanup progress:', err)
            }
        }

        // Verificar o progresso imediatamente
        await checkProgress()

        // Configurar o intervalo para verificações regulares
        progressInterval = setInterval(checkProgress, 1000)

        // Iniciar a limpeza
        console.log('Starting duplicate images removal...')
        try {
            const result = await adminClient.imports.cleanupDuplicatedImages()
            console.log('Duplicates removal completed:', result)

            // Armazenar o resultado para exibição
            duplicatesResult.value = result

            // Verificar o progresso final após a conclusão
            await checkProgress()
        } catch (err) {
            console.error('Error during duplicates removal:', err)
            reprocessStatus.value.status = 'error'
            reprocessStatus.value.message = `Error: ${err.message || 'Failed to remove duplicate images'}`

            if (progressInterval) {
                clearInterval(progressInterval)
                progressInterval = null
            }

            showNotification('error', err.message || 'Failed to remove duplicate images')
        }
    } catch (err) {
        console.error('Failed to start duplicates removal:', err)
        reprocessStatus.value.status = 'error'
        reprocessStatus.value.message = err.message || 'Failed to start duplicates removal'

        if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
        }

        showNotification('error', err.message || 'Failed to remove duplicate images')
    }
}

const closeDuplicatesDialog = () => {
    if (reprocessStatus.value.status !== 'processing') {
        showDuplicatesDialog.value = false

        // Garantir que o intervalo de verificação seja limpo
        if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
        }

        // Refresh the media list if cleanup completed
        if (reprocessStatus.value.status === 'completed') {
            refreshData()
        }
    }
}

onMounted(() => {
    initializeFromUrl()
    loadMedias()
})

onUnmounted(() => {
    console.log('Component unmounted, cleaning up intervals')
    if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
    }
})
</script>
