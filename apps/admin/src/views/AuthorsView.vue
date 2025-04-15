<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Authors</h1>
            <div class="flex space-x-3 mt-2 sm:mt-0">
                <button @click="refreshData" class="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <button @click="openAddDialog" class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Author
                </button>
            </div>
        </div>

        <!-- Filters and Search -->
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
                            placeholder="Search authors..."
                            class="bg-neutral-700 border h-10 border-neutral-800 text-white pl-10 pr-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-0"
                        >
                    </div>
                    <select
                        v-model="filters.searchField"
                        class="bg-neutral-700 w-56 h-10 border border-neutral-800 text-white px-3 py-2 rounded-r-md focus:outline-none focus:ring-0  border-l-0"
                    >
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading authors...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load authors</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="authors.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p class="text-neutral-300 mb-2">No authors found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by creating your first author</p>
            <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Add Author
            </button>
        </div>

        <!-- Authors table -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                ID
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                Avatar
                            </th>
                            <th
                                @click="toggleSort('name')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Name
                                <span v-if="filters.sortBy === 'name'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th
                                @click="toggleSort('email')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Email
                                <span v-if="filters.sortBy === 'email'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th
                                @click="toggleSort('location')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Location
                                <span v-if="filters.sortBy === 'location'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Last Seen
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="author in authors" :key="author.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="author.id">
                                {{ author.id.substring(0, 6) }}...
                            </td>
                            <td class="px-2 py-4">
                                <div class="w-10 h-10 rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center">
                                    <img v-if="author.image" :src="author.image" alt="Author avatar" class="w-full h-full object-cover" />
                                    <span v-else class="text-white font-medium">{{ getAuthorInitials(author.name) }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {{ author.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                <a :href="`mailto:${author.email}`" class="text-blue-400 hover:text-blue-300 hover:underline">
                                    {{ author.email }}
                                </a>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ author.location || '—' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ formatDate(author.lastSeenAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="openEditDialog(author)"
                                        title="Edit"
                                        class="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="confirmDelete(author)"
                                        title="Delete"
                                        class="text-neutral-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between">
            <div class="text-sm text-neutral-400">
                Showing <span class="font-medium text-white">{{ pagination.from }}</span> to
                <span class="font-medium text-white">{{ pagination.to }}</span> of
                <span class="font-medium text-white">{{ pagination.total }}</span> authors
            </div>
            <div class="flex items-center space-x-2">
                <button
                    @click="prevPage"
                    :disabled="pagination.current === 1"
                    :class="{'opacity-50 cursor-not-allowed': pagination.current === 1}"
                    class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
                >
                    Previous
                </button>
                <div class="flex items-center">
                    <div v-for="page in paginationPages" :key="page"
                        @click="goToPage(page)"
                        class="w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer transition-colors duration-200"
                        :class="page === pagination.current ? 'bg-blue-600 text-white' : 'text-white hover:bg-neutral-700'"
                    >
                        {{ page }}
                    </div>
                </div>
                <button
                    @click="nextPage"
                    :disabled="pagination.current === pagination.lastPage"
                    :class="{'opacity-50 cursor-not-allowed': pagination.current === pagination.lastPage}"
                    class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
                >
                    Next
                </button>
            </div>
        </div>

        <!-- Add/Edit Author Dialog -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Edit Author' : 'Add Author' }}</h3>
                    <button @click="closeDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div>
                    <!-- Tab Navigation -->
                    <div class="border-b border-neutral-700 mb-5 px-4 pt-2">
                        <div class="flex space-x-4">
                            <button
                                @click="activeTab = 'information'"
                                :class="activeTab === 'information' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-neutral-400 hover:text-neutral-300'"
                                class="pb-2 px-1 font-medium text-sm transition-colors"
                            >
                                Information
                            </button>
                            <button
                                @click="activeTab = 'social'"
                                :class="activeTab === 'social' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-neutral-400 hover:text-neutral-300'"
                                class="pb-2 px-1 font-medium text-sm transition-colors"
                            >
                                Social
                            </button>
                            <button
                                @click="activeTab = 'others'"
                                :class="activeTab === 'others' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-neutral-400 hover:text-neutral-300'"
                                class="pb-2 px-1 font-medium text-sm transition-colors"
                            >
                                Others
                            </button>
                            <button
                                @click="activeTab = 'notifications'"
                                :class="activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-neutral-400 hover:text-neutral-300'"
                                class="pb-2 px-1 font-medium text-sm transition-colors"
                            >
                                Notifications
                            </button>
                        </div>
                    </div>

                    <form @submit.prevent="saveAuthor($event)">
                        <div class="px-4">
                            <!-- Information Tab -->
                            <div v-show="activeTab === 'information'">
                                <div class="mb-4">
                                    <label for="authorName" class="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                                    <input
                                        id="authorName"
                                        v-model="authorForm.name"
                                        @input="updateSlug"
                                        type="text"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Author name"
                                        required
                                    />
                                    <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
                                </div>

                                <div class="mb-4">
                                    <label for="authorSlug" class="block text-sm font-medium text-neutral-300 mb-1">URL Slug</label>
                                    <input
                                        id="authorSlug"
                                        v-model="authorForm.slug"
                                        type="text"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="author-slug"
                                    />
                                    <p class="mt-1 text-xs text-neutral-500">{{ blogUrl }}/author/{{ authorForm.slug || 'your-slug' }}</p>
                                    <p v-if="formErrors.slug" class="mt-1 text-sm text-red-500">{{ formErrors.slug }}</p>
                                </div>

                                <div class="mb-4">
                                    <label for="authorEmail" class="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                                    <input
                                        id="authorEmail"
                                        v-model="authorForm.email"
                                        type="email"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="author@example.com"
                                        required
                                    />
                                    <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">{{ formErrors.email }}</p>
                                </div>

                                <div class="mb-4">
                                    <label for="authorBio" class="block text-sm font-medium text-neutral-300 mb-1">Bio</label>
                                    <textarea
                                        id="authorBio"
                                        v-model="authorForm.bio"
                                        rows="3"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Author biography"
                                    ></textarea>
                                </div>

                                <!-- Cover and Avatar images -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-neutral-300 mb-1">Cover Image</label>
                                    <div class="relative h-32 bg-neutral-700 border border-neutral-600 rounded-md overflow-hidden mb-2">
                                        <div v-if="authorForm.coverImage" class="w-full h-full">
                                            <img :src="authorForm.coverImage" alt="Cover image" class="w-full h-full object-cover" />
                                        </div>
                                        <div v-else class="w-full h-full bg-gradient-to-r from-blue-800 to-neutral-900"></div>

                                        <button
                                            @click.stop.prevent="openAuthorCoverImageUpload($event)"
                                            class="absolute bottom-2 right-2 bg-neutral-800/80 hover:bg-neutral-700 text-white p-1.5 rounded-full transition-colors"
                                            title="Change cover image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div class="mb-4 flex items-center">
                                    <div class="w-16 h-16 rounded-full relative bg-neutral-700 border-2 border-neutral-600 overflow-hidden group mr-3">
                                        <img v-if="authorForm.image" :src="authorForm.image" alt="Author avatar" class="w-full h-full object-cover" />
                                        <div v-else class="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                                            {{ authorInitials }}
                                        </div>
                                        <button
                                            @click.stop.prevent="openAuthorImageUpload($event)"
                                            class="absolute bottom-0 right-0 left-0 bg-black/50 hover:bg-black/70 text-white py-1 text-xs transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            title="Change avatar"
                                        >
                                            Change
                                        </button>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-neutral-300 mb-1">Author Avatar</label>
                                        <p class="text-xs text-neutral-500">Upload a square image for the author avatar</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Social Tab -->
                            <div v-show="activeTab === 'social'">
                                <div class="mb-4">
                                    <label for="authorWebsite" class="block text-sm font-medium text-neutral-300 mb-1">Website</label>
                                    <input
                                        id="authorWebsite"
                                        v-model="authorForm.website"
                                        type="url"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div class="mb-4">
                                    <label for="authorFacebook" class="block text-sm font-medium text-neutral-300 mb-1">Facebook</label>
                                    <div class="flex">
                                        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-600 bg-neutral-800 text-neutral-400 text-sm">
                                            facebook.com/
                                        </span>
                                        <input
                                            id="authorFacebook"
                                            v-model="authorForm.facebook"
                                            type="text"
                                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label for="authorTwitter" class="block text-sm font-medium text-neutral-300 mb-1">Twitter</label>
                                    <div class="flex">
                                        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-600 bg-neutral-800 text-neutral-400 text-sm">
                                            twitter.com/
                                        </span>
                                        <input
                                            id="authorTwitter"
                                            v-model="authorForm.twitter"
                                            type="text"
                                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Others Tab -->
                            <div v-show="activeTab === 'others'">
                                <div class="mb-4">
                                    <label for="authorLocation" class="block text-sm font-medium text-neutral-300 mb-1">Location</label>
                                    <input
                                        id="authorLocation"
                                        v-model="authorForm.location"
                                        type="text"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="City, Country"
                                    />
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label for="authorLocale" class="block text-sm font-medium text-neutral-300 mb-1">Language</label>
                                        <select
                                            id="authorLocale"
                                            v-model="authorForm.locale"
                                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="pt">Portuguese</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="authorVisibility" class="block text-sm font-medium text-neutral-300 mb-1">Profile Visibility</label>
                                        <select
                                            id="authorVisibility"
                                            v-model="authorForm.visibility"
                                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label for="metaTitle" class="block text-sm font-medium text-neutral-300 mb-1">SEO Title</label>
                                    <input
                                        id="metaTitle"
                                        v-model="authorForm.metaTitle"
                                        type="text"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Custom SEO title (defaults to author name)"
                                    />
                                </div>

                                <div class="mb-4">
                                    <label for="metaDescription" class="block text-sm font-medium text-neutral-300 mb-1">SEO Description</label>
                                    <textarea
                                        id="metaDescription"
                                        v-model="authorForm.metaDescription"
                                        rows="2"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Custom SEO description (defaults to bio)"
                                    ></textarea>
                                </div>
                            </div>

                            <!-- Notifications Tab -->
                            <div v-show="activeTab === 'notifications'">
                                <div class="space-y-3">
                                    <div class="flex items-center">
                                        <input
                                            id="commentNotifications"
                                            v-model="authorForm.commentNotifications"
                                            type="checkbox"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                                        />
                                        <label for="commentNotifications" class="ml-2 block text-sm text-neutral-300">
                                            Comment Notifications
                                        </label>
                                        <p class="ml-6 text-xs text-neutral-400">Receive notifications when someone comments on your posts</p>
                                    </div>

                                    <div class="flex items-center">
                                        <input
                                            id="mentionNotifications"
                                            v-model="authorForm.mentionNotifications"
                                            type="checkbox"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                                        />
                                        <label for="mentionNotifications" class="ml-2 block text-sm text-neutral-300">
                                            Mention Notifications
                                        </label>
                                        <p class="ml-6 text-xs text-neutral-400">Receive notifications when someone mentions you</p>
                                    </div>

                                    <div class="flex items-center">
                                        <input
                                            id="recommendationNotifications"
                                            v-model="authorForm.recommendationNotifications"
                                            type="checkbox"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                                        />
                                        <label for="recommendationNotifications" class="ml-2 block text-sm text-neutral-300">
                                            Recommendation Notifications
                                        </label>
                                        <p class="ml-6 text-xs text-neutral-400">Receive notifications about content recommendations</p>
                                    </div>

                                    <div class="flex items-center pt-4 border-t border-neutral-700 mt-4">
                                        <input
                                            id="emailDisabled"
                                            v-model="authorForm.emailDisabled"
                                            type="checkbox"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                                        />
                                        <label for="emailDisabled" class="ml-2 block text-sm text-neutral-300 font-medium">
                                            Disable all email notifications
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons (Always visible) -->
                        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-neutral-700 p-4">
                            <button
                                type="button"
                                @click="closeDialog"
                                class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                :disabled="formLoading"
                            >
                                <span v-if="formLoading" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                                <span v-else>
                                    {{ isEditing ? 'Update' : 'Create' }}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Confirm Deletion</h3>
                </div>
                <div class="p-6">
                    <p class="text-neutral-300 mb-4">
                        Are you sure you want to delete the author <span class="font-medium text-white">{{ authorToDelete?.name }}</span>?
                    </p>
                    <p class="text-sm text-neutral-400 mb-6">
                        This action cannot be undone. All content associated with this author may be affected.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button
                            @click="closeDeleteDialog"
                            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="deleteAuthor"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            :disabled="deleteLoading"
                        >
                            <span v-if="deleteLoading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </span>
                            <span v-else>Delete</span>
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

        <!-- Add file input for avatar image -->
        <input
            type="file"
            ref="authorImageInput"
            @change="handleAuthorImageSelect"
            accept="image/*"
            class="hidden"
        />

        <!-- Add file input for cover image -->
        <input
            type="file"
            ref="authorCoverImageInput"
            @change="handleAuthorCoverImageSelect"
            accept="image/*"
            class="hidden"
        />

        <!-- Add the crop modal dialog for avatar -->
        <div v-if="cropModalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div class="bg-neutral-800 rounded-lg max-w-md w-full p-6">
                <h3 class="text-lg font-medium text-white mb-4">Crop Author Avatar</h3>

                <div class="relative mb-4">
                    <div class="w-full aspect-square relative overflow-hidden rounded-lg border-2 border-neutral-600">
                        <canvas
                            ref="cropCanvas"
                            class="absolute inset-0 w-full h-full"
                            @mousedown="startDrag"
                            @mousemove="onDrag"
                            @mouseup="stopDrag"
                            @mouseleave="stopDrag"
                            @wheel="handleWheel"
                            @touchstart="startDrag"
                            @touchmove="onDrag"
                            @touchend="stopDrag"
                        ></canvas>
                    </div>

                    <!-- Zoom controls -->
                    <div class="flex items-center justify-center mt-4">
                        <button
                            @click="adjustZoom(-0.1)"
                            class="p-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-l-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <div class="px-4 py-2 bg-neutral-700 text-white text-sm font-medium">
                            Zoom: {{ Math.round(zoomLevel * 100) }}%
                        </div>
                        <button
                            @click="adjustZoom(0.1)"
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
                        @click="cropModalOpen = false"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        @click="cropImage"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>

        <!-- Add cover image crop modal -->
        <div v-if="coverCropModalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div class="bg-neutral-800 rounded-lg max-w-2xl w-full p-6">
                <h3 class="text-lg font-medium text-white mb-4">Crop Cover Image</h3>

                <div class="relative mb-4">
                    <div class="w-full aspect-[3/1] relative overflow-hidden rounded-lg border-2 border-neutral-600">
                        <!-- Canvas for crop preview -->
                        <canvas
                            ref="coverCropCanvas"
                            class="absolute inset-0 w-full h-full"
                            @mousedown="startCoverDrag"
                            @mousemove="onCoverDrag"
                            @mouseup="stopCoverDrag"
                            @mouseleave="stopCoverDrag"
                            @wheel="handleCoverWheel"
                            @touchstart="startCoverDrag"
                            @touchmove="onCoverDrag"
                            @touchend="stopCoverDrag"
                        ></canvas>
                    </div>

                    <!-- Zoom controls -->
                    <div class="flex items-center justify-center mt-4">
                        <button
                            @click="adjustCoverZoom(-0.1)"
                            class="p-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-l-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <div class="px-4 py-2 bg-neutral-700 text-white text-sm font-medium">
                            Zoom: {{ Math.round(coverZoomLevel * 100) }}%
                        </div>
                        <button
                            @click="adjustCoverZoom(0.1)"
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
                        @click="coverCropModalOpen = false"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        @click="cropCoverImage"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUtils } from "../composables/useUtils";
import { useAdminClient } from '@cmmv/blog/admin/client'

const adminClient = useAdminClient()
const { slugify } = useUtils()

// State
const authors = ref([])
const loading = ref(true)
const error = ref(null)
const blogUrl = ref('')

// Author form
const showDialog = ref(false)
const isEditing = ref(false)
const authorForm = ref({
    name: '',
    slug: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    facebook: '',
    twitter: '',
    locale: 'en',
    visibility: 'public',
    metaTitle: '',
    metaDescription: '',
    note: '',
    emailDisabled: false,
    commentNotifications: true,
    mentionNotifications: true,
    recommendationNotifications: true,
    image: '',
    coverImage: ''
})
const authorToEdit = ref(null)
const formErrors = ref({})
const formLoading = ref(false)

// Delete confirmation
const showDeleteDialog = ref(false)
const authorToDelete = ref(null)
const deleteLoading = ref(false)

// Notification
const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

// Pagination
const pagination = ref({
    current: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 1,
    to: 10
})

// Filtering & Sorting
const filters = ref({
    search: '',
    searchField: 'name',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1
})

// Add active tab state
const activeTab = ref('information')

// Computed
const paginationPages = computed(() => {
    const totalPages = pagination.value.lastPage

    if (totalPages <= 5)
        return Array.from({ length: totalPages }, (_, i) => i + 1)

    const current = pagination.value.current
    const pages = [1]

    if (current > 2) pages.push('...')

    if (current > 1 && current < totalPages) pages.push(current)

    if (current < totalPages - 1) pages.push('...')

    if (totalPages > 1) pages.push(totalPages)

    return pages
})

// Load authors
const loadAuthors = async () => {
    try {
        loading.value = true
        error.value = null

        // Create filter object from current filters
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

        const response = await adminClient.authors.get(apiFilters)

        if (response && response.data) {
            authors.value = response.data || []

            const paginationData = response.pagination || {}
            const totalCount = response.count || 0
            const currentOffset = paginationData.offset || 0
            const currentLimit = paginationData.limit || 10

            // Calculate current page from offset and limit
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
            authors.value = []
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
        console.error('Failed to load authors:', err)
        loading.value = false
        error.value = err.message || 'Failed to load authors'
        showNotification('error', 'Failed to load authors')
    }
}

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

const refreshData = () => {
    loadAuthors()
}

const goToPage = (page) => {
    if (page === '...') return
    filters.value.page = page
}

const prevPage = () => {
    if (pagination.value.current > 1) {
        filters.value.page = pagination.value.current - 1
    }
}

const nextPage = () => {
    if (pagination.value.current < pagination.value.lastPage) {
        filters.value.page = pagination.value.current + 1
    }
}

// Watch for filter changes
watch(filters, () => {
    loadAuthors()
}, { deep: true })

// Dialog methods
const openAddDialog = () => {
    isEditing.value = false
    activeTab.value = 'information'
    authorForm.value = {
        name: '',
        slug: '',
        email: '',
        bio: '',
        location: '',
        website: '',
        facebook: '',
        twitter: '',
        locale: 'en',
        visibility: 'public',
        metaTitle: '',
        metaDescription: '',
        note: '',
        emailDisabled: false,
        commentNotifications: true,
        mentionNotifications: true,
        recommendationNotifications: true,
        image: '',
        coverImage: ''
    }
    formErrors.value = {}
    showDialog.value = true
}

const openEditDialog = (author) => {
    isEditing.value = true
    activeTab.value = 'information'
    authorToEdit.value = author
    authorForm.value = {
        name: author.name,
        slug: author.slug || generateSlug(author.name),
        email: author.email,
        bio: author.bio || '',
        location: author.getLocation || author.location || '',
        website: author.website || '',
        facebook: author.facebook || '',
        twitter: author.twitter || '',
        locale: author.locale || 'en',
        visibility: author.visibility || 'public',
        metaTitle: author.metaTitle || '',
        metaDescription: author.metaDescription || '',
        note: author.note || '',
        emailDisabled: author.emailDisabled || false,
        commentNotifications: author.commentNotifications !== false,
        mentionNotifications: author.mentionNotifications !== false,
        recommendationNotifications: author.recommendationNotifications !== false,
        image: author.image || '',
        coverImage: author.coverImage || ''
    }
    formErrors.value = {}
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    authorForm.value = {
        name: '',
        slug: '',
        email: '',
        bio: '',
        location: '',
        website: '',
        facebook: '',
        twitter: '',
        locale: 'en',
        visibility: 'public',
        metaTitle: '',
        metaDescription: '',
        note: '',
        emailDisabled: false,
        commentNotifications: true,
        mentionNotifications: true,
        recommendationNotifications: true,
        image: '',
        coverImage: ''
    }
    formErrors.value = {}
    authorToEdit.value = null
}

// Save author
const saveAuthor = async (e) => {
    if (e) {
        e.preventDefault();
    }

    try {
        formLoading.value = true;
        formErrors.value = {};

        // Validate
        if (!authorForm.value.name.trim()) {
            formErrors.value.name = 'Author name is required';
            formLoading.value = false;
            return;
        }

        if (!authorForm.value.email.trim()) {
            formErrors.value.email = 'Email is required';
            formLoading.value = false;
            return;
        }

        if (!authorForm.value.slug.trim()) {
            authorForm.value.slug = generateSlug(authorForm.value.name);
        }

        // Prepare data with all fields
        const authorData = {
            name: authorForm.value.name.trim(),
            slug: authorForm.value.slug.trim(),
            email: authorForm.value.email.trim(),
            bio: authorForm.value.bio.trim() || null,
            getLocation: authorForm.value.location.trim() || null,
            location: authorForm.value.location.trim() || null,
            website: authorForm.value.website.trim() || null,
            facebook: authorForm.value.facebook.trim() || null,
            twitter: authorForm.value.twitter.trim() || null,
            locale: authorForm.value.locale,
            visibility: authorForm.value.visibility,
            metaTitle: authorForm.value.metaTitle.trim() || null,
            metaDescription: authorForm.value.metaDescription.trim() || null,
            note: authorForm.value.note.trim() || null,
            emailDisabled: authorForm.value.emailDisabled,
            commentNotifications: authorForm.value.commentNotifications,
            mentionNotifications: authorForm.value.mentionNotifications,
            recommendationNotifications: authorForm.value.recommendationNotifications,
            image: authorForm.value.image,
            coverImage: authorForm.value.coverImage
        };

        if (isEditing.value) {
            await adminClient.authors.update(authorToEdit.value.id, authorData);
            showNotification('success', 'Author updated successfully');
        } else {
            await adminClient.authors.create(authorData);
            showNotification('success', 'Author created successfully');
        }

        formLoading.value = false;
        closeDialog();
        refreshData();
    } catch (error) {
        formLoading.value = false;
        console.error('Failed to save author:', error);

        if (error.response?.data?.errors) {
            formErrors.value = error.response.data.errors;
        } else {
            showNotification('error', error.message || 'Failed to save author');
        }
    }
}

// Delete methods
const confirmDelete = (author) => {
    authorToDelete.value = author
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    authorToDelete.value = null
}

const deleteAuthor = async () => {
    if (!authorToDelete.value) return

    try {
        deleteLoading.value = true
        await adminClient.authors.delete(authorToDelete.value.id)
        deleteLoading.value = false
        closeDeleteDialog()
        showNotification('success', 'Author deleted successfully')
        refreshData()
    } catch (err) {
        deleteLoading.value = false
        console.error('Failed to delete author:', err)
        showNotification('error', err.message || 'Failed to delete author')
    }
}

// Notification
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

// Format date
const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';

    try {
        const date = new Date(timestamp)
        if (isNaN(date.getTime())) return 'Never'
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch (err) {
        console.error('Date formatting error:', err, timestamp)
        return 'Never'
    }
}

// Sort toggle
const toggleSort = (column) => {
    if (filters.value.sortBy === column) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
        filters.value.sortBy = column
        filters.value.sortOrder = 'asc'
    }
}

// Add function to update slug when name changes
const updateSlug = () => {
    authorForm.value.slug = slugify(authorForm.value.name);
}

// Adicionar as variáveis para manipulação de imagens
// Crop state para avatar
const cropModalOpen = ref(false)
const zoomLevel = ref(1)
const cropCanvas = ref(null)
const authorImageInput = ref(null)
const selectedImage = ref(null)
const cropContext = ref(null)

// Variáveis para drag do avatar
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imagePosition = ref({ x: 0, y: 0 })

// Cover image crop state
const coverCropModalOpen = ref(false)
const coverZoomLevel = ref(1)
const coverCropCanvas = ref(null)
const authorCoverImageInput = ref(null)
const selectedCoverImage = ref(null)
const coverCropContext = ref(null)
const isCoverDragging = ref(false)
const coverDragStart = ref({ x: 0, y: 0 })
const coverImagePosition = ref({ x: 0, y: 0 })

// Adicionar iniciais do autor computadas
const authorInitials = computed(() => {
    if (!authorForm.value.name) return '?';

    const nameParts = authorForm.value.name.split(' ');
    if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
    }

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

// Funções para manipulação do avatar
function openAuthorImageUpload(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    authorImageInput.value.click();
}

function handleAuthorImageSelect(event) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = () => {
            selectedImage.value = img;
            cropModalOpen.value = true;

            setTimeout(() => {
                initCropCanvas();
            }, 100);
        };

        img.onerror = (err) => {
            console.error('Image loading error', err);
            showNotification('error', 'Failed to load image');
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
    event.target.value = '';
}

function initCropCanvas() {
    if (!cropCanvas.value || !selectedImage.value) return;

    const canvas = cropCanvas.value;
    const ctx = canvas.getContext('2d');
    cropContext.value = ctx;

    // Set fixed dimensions for the canvas
    canvas.width = 300;
    canvas.height = 300;

    // Reset zoom and position
    zoomLevel.value = 1;
    imagePosition.value = { x: 0, y: 0 };

    // Draw initial image
    drawImageOnCanvas();
}

function drawImageOnCanvas() {
    if (!cropCanvas.value || !selectedImage.value || !cropContext.value) return;

    const canvas = cropCanvas.value;
    const ctx = cropContext.value;
    const img = selectedImage.value;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions for centered, zoomed image
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * zoomLevel.value;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Use imagePosition for x,y coordinates (for dragging)
    const x = imagePosition.value.x + (canvas.width - scaledWidth) / 2;
    const y = imagePosition.value.y + (canvas.height - scaledHeight) / 2;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.375;

    // First draw the image at full opacity
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

    // Create clipping region (save current state)
    ctx.save();

    // Create inverted circular mask (everything OUTSIDE the circle)
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true); // true = counterclockwise
    ctx.clip();

    // Draw darkened overlay for outside the circle
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Restore to remove clipping
    ctx.restore();

    // Draw circle outline
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
}

// Funções de drag do avatar
function startDrag(e) {
    isDragging.value = true;

    // Get initial position
    if (e.type.includes('mouse')) {
        dragStart.value = { x: e.clientX, y: e.clientY };
    } else { // touch event
        dragStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
}

function onDrag(e) {
    if (!isDragging.value) return;

    // Prevent default to avoid scrolling on touch devices
    e.preventDefault();

    let currentX, currentY;
    if (e.type.includes('mouse')) {
        currentX = e.clientX;
        currentY = e.clientY;
    } else { // touch event
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    }

    // Calculate the distance moved
    const deltaX = currentX - dragStart.value.x;
    const deltaY = currentY - dragStart.value.y;

    // Update image position
    imagePosition.value = {
        x: imagePosition.value.x + deltaX,
        y: imagePosition.value.y + deltaY
    };

    // Update drag start for next movement
    dragStart.value = { x: currentX, y: currentY };

    // Redraw canvas
    drawImageOnCanvas();
}

function stopDrag() {
    isDragging.value = false;
}

function adjustZoom(delta) {
    zoomLevel.value = Math.max(0.5, Math.min(3, zoomLevel.value + delta));
    drawImageOnCanvas();
}

function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    adjustZoom(delta);
}

function cropImage() {
    if (!cropCanvas.value || !cropContext.value) return;

    const canvas = cropCanvas.value;

    // Calculate the circle center and radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.375; // 3/4 of half the canvas (as per overlay)

    // Create a temporary canvas for the circular crop
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Set dimensions for output (reasonable size for avatar)
    tempCanvas.width = 400;
    tempCanvas.height = 400;

    // Draw circular mask
    tempCtx.beginPath();
    tempCtx.arc(tempCanvas.width / 2, tempCanvas.height / 2, tempCanvas.width / 2, 0, Math.PI * 2);
    tempCtx.closePath();
    tempCtx.clip();

    // Scale the source canvas to fit the temp canvas
    const scale = tempCanvas.width / (radius * 2);

    // Draw the source canvas onto the temp canvas
    tempCtx.drawImage(
        canvas,
        centerX - radius, centerY - radius, radius * 2, radius * 2,
        0, 0, tempCanvas.width, tempCanvas.height
    );

    // Convert to base64
    const base64Image = tempCanvas.toDataURL('image/jpeg', 0.9);

    // Update form only, don't save or close the edit dialog
    authorForm.value.image = base64Image;

    // Close just the crop modal, not the main edit modal
    cropModalOpen.value = false;

    // Show confirmation
    showNotification('success', 'Author avatar updated');
}

// Funções para manipulação da imagem de capa
function openAuthorCoverImageUpload(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    authorCoverImageInput.value.click();
}

function handleAuthorCoverImageSelect(event) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = () => {
            selectedCoverImage.value = img;
            coverCropModalOpen.value = true;

            setTimeout(() => {
                initCoverCropCanvas();
            }, 100);
        };

        img.onerror = (err) => {
            console.error('Cover image loading error', err);
            showNotification('error', 'Failed to load cover image');
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
    event.target.value = '';
}

function initCoverCropCanvas() {
    if (!coverCropCanvas.value || !selectedCoverImage.value) return;

    const canvas = coverCropCanvas.value;
    const ctx = canvas.getContext('2d');
    coverCropContext.value = ctx;

    // Set fixed dimensions for the canvas
    canvas.width = 600;
    canvas.height = 200;

    // Reset zoom and position
    coverZoomLevel.value = 1;
    coverImagePosition.value = { x: 0, y: 0 };

    // Draw initial image
    drawCoverImageOnCanvas();
}

function drawCoverImageOnCanvas() {
    if (!coverCropCanvas.value || !selectedCoverImage.value || !coverCropContext.value) return;

    const canvas = coverCropCanvas.value;
    const ctx = coverCropContext.value;
    const img = selectedCoverImage.value;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions for centered, zoomed image
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * coverZoomLevel.value;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = coverImagePosition.value.x + (canvas.width - scaledWidth) / 2;
    const y = coverImagePosition.value.y + (canvas.height - scaledHeight) / 2;

    // Draw image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

    // Optional light shading at top and bottom to show boundaries
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, 1); // Top edge indicator
    ctx.fillRect(0, canvas.height - 1, canvas.width, 1); // Bottom edge indicator
}

// Funções de drag para a imagem de capa
function startCoverDrag(e) {
    isCoverDragging.value = true;

    // Get initial position
    if (e.type.includes('mouse')) {
        coverDragStart.value = { x: e.clientX, y: e.clientY };
    } else { // touch event
        coverDragStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
}

function onCoverDrag(e) {
    if (!isCoverDragging.value) return;

    // Prevent default to avoid scrolling on touch devices
    e.preventDefault();

    let currentX, currentY;
    if (e.type.includes('mouse')) {
        currentX = e.clientX;
        currentY = e.clientY;
    } else { // touch event
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    }

    // Calculate the distance moved
    const deltaX = currentX - coverDragStart.value.x;
    const deltaY = currentY - coverDragStart.value.y;

    // Update image position
    coverImagePosition.value = {
        x: coverImagePosition.value.x + deltaX,
        y: coverImagePosition.value.y + deltaY
    };

    // Update drag start for next movement
    coverDragStart.value = { x: currentX, y: currentY };

    // Redraw canvas
    drawCoverImageOnCanvas();
}

function stopCoverDrag() {
    isCoverDragging.value = false;
}

function adjustCoverZoom(delta) {
    coverZoomLevel.value = Math.max(0.5, Math.min(3, coverZoomLevel.value + delta));
    drawCoverImageOnCanvas();
}

function handleCoverWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    adjustCoverZoom(delta);
}

function cropCoverImage() {
    if (!coverCropCanvas.value || !selectedCoverImage.value || !coverCropContext.value) return;

    const canvas = coverCropCanvas.value;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Set output dimensions (use reasonable size for web display)
    const outputWidth = 1200;
    const outputHeight = 400;

    // Set temp canvas size
    tempCanvas.width = outputWidth;
    tempCanvas.height = outputHeight;

    // Calculate dimensions for centered, zoomed image
    const scale = Math.max(canvas.width / selectedCoverImage.value.width, canvas.height / selectedCoverImage.value.height) * coverZoomLevel.value;
    const scaledWidth = selectedCoverImage.value.width * scale;
    const scaledHeight = selectedCoverImage.value.height * scale;
    const x = coverImagePosition.value.x + (canvas.width - scaledWidth) / 2;
    const y = coverImagePosition.value.y + (canvas.height - scaledHeight) / 2;

    // Draw only the visible portion of the image directly to the temp canvas
    tempCtx.drawImage(
        selectedCoverImage.value,
        -x / scale,
        -y / scale,
        canvas.width / scale,
        canvas.height / scale,
        0, 0,
        outputWidth, outputHeight
    );

    // Convert to base64 with compression
    const base64Image = tempCanvas.toDataURL('image/jpeg', 0.8);

    // Update form only, don't save or close the edit dialog
    authorForm.value.coverImage = base64Image;

    // Close just the crop modal, not the main edit modal
    coverCropModalOpen.value = false;

    // Show confirmation
    showNotification('success', 'Author cover image updated');
}

// Adicionar função para obter iniciais do autor na tabela
function getAuthorInitials(name) {
    if (!name) return '?';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
    }

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
}

// Initial load
onMounted(() => {
    loadAuthors()
    loadBlogUrl()
})
</script>
