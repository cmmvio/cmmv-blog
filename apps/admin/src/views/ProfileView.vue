<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Profile Settings</h1>
            <div class="flex space-x-3 mt-2 sm:mt-0">
                <button @click="saveProfile" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading profile...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load profile</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="loadProfile" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Profile content -->
        <div v-else class="space-y-6">
            <!-- Cover Image Section -->
            <div class="bg-neutral-800 rounded-lg overflow-hidden">
                <div class="relative h-48">
                    <div v-if="profile.coverImage" class="w-full h-full">
                        <img :src="profile.coverImage" alt="Cover image" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-full h-full bg-gradient-to-r from-blue-800 to-neutral-900"></div>

                    <button
                        @click="openCoverImageUpload"
                        class="absolute bottom-4 right-4 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full transition-colors"
                        title="Change cover image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>

                <div class="p-6 relative">
                    <div class="absolute -top-16 left-6">
                        <div class="w-24 h-24 rounded-full relative bg-neutral-700 border-4 border-neutral-800 overflow-hidden group">
                            <img v-if="profile.image" :src="profile.image" alt="Profile image" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                                {{ profileInitial }}
                            </div>
                            <button
                                @click="openProfileImageUpload"
                                class="absolute bottom-0 right-0 left-0 bg-black/50 hover:bg-black/70 text-white py-1 text-xs transition-all duration-200 opacity-0 group-hover:opacity-100"
                                title="Change profile image"
                            >
                                Change
                            </button>
                        </div>
                    </div>

                    <div class="mt-12">
                        <h2 class="text-lg font-medium text-white mb-1">{{ profile.name || 'Your Name' }}</h2>
                        <div class="text-sm text-neutral-400">
                            <span class="mr-4">{{ userEmail }}</span>
                            <span v-if="profile.location">• {{ profile.location }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Basic Information -->
            <div class="bg-neutral-800 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Basic Information</h3>

                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                            <input
                                id="name"
                                v-model="profile.name"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                placeholder="Your full name"
                                required
                            />
                            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
                        </div>

                        <div>
                            <label for="slug" class="block text-sm font-medium text-neutral-300 mb-1">URL Slug</label>
                            <input
                                id="slug"
                                v-model="profile.slug"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                placeholder="your-name"
                                required
                            />
                            <p class="mt-1 text-xs text-neutral-500">{{ websiteUrl }}/author/{{ profile.slug || 'your-name' }}</p>
                            <p v-if="errors.slug" class="mt-1 text-sm text-red-500">{{ errors.slug }}</p>
                        </div>
                    </div>

                    <div>
                        <label for="bio" class="block text-sm font-medium text-neutral-300 mb-1">Bio</label>
                        <textarea
                            id="bio"
                            v-model="profile.bio"
                            rows="4"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                            placeholder="Write a short bio about yourself"
                        ></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="website" class="block text-sm font-medium text-neutral-300 mb-1">Website</label>
                            <input
                                id="website"
                                v-model="profile.website"
                                type="url"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                placeholder="https://yourwebsite.com"
                            />
                        </div>

                        <div>
                            <label for="location" class="block text-sm font-medium text-neutral-300 mb-1">Location</label>
                            <input
                                id="location"
                                v-model="profile.location"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Social Media -->
            <div class="bg-neutral-800 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Social Media</h3>

                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="facebook" class="block text-sm font-medium text-neutral-300 mb-1">Facebook</label>
                            <div class="flex">
                                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-600 bg-neutral-800 text-neutral-400 text-sm">
                                    facebook.com/
                                </span>
                                <input
                                    id="facebook"
                                    v-model="profile.facebook"
                                    type="text"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="twitter" class="block text-sm font-medium text-neutral-300 mb-1">Twitter</label>
                            <div class="flex">
                                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-600 bg-neutral-800 text-neutral-400 text-sm">
                                    twitter.com/
                                </span>
                                <input
                                    id="twitter"
                                    v-model="profile.twitter"
                                    type="text"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="instagram" class="block text-sm font-medium text-neutral-300 mb-1">Instagram</label>
                            <div class="flex">
                                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-600 bg-neutral-800 text-neutral-400 text-sm">
                                    instagram.com/
                                </span>
                                <input
                                    id="instagram"
                                    v-model="profile.instagram"
                                    type="text"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="linkedin" class="block text-sm font-medium text-neutral-300 mb-1">LinkedIn</label>
                            <div class="flex">
                                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-600 bg-neutral-800 text-neutral-400 text-sm">
                                    linkedin.com/in/
                                </span>
                                <input
                                    id="linkedin"
                                    v-model="profile.linkedin"
                                    type="text"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="github" class="block text-sm font-medium text-neutral-300 mb-1">Github</label>
                            <div class="flex">
                                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-600 bg-neutral-800 text-neutral-400 text-sm">
                                    github.com/
                                </span>
                                <input
                                    id="github"
                                    v-model="profile.github"
                                    type="text"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                    placeholder="username"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Preferences & SEO -->
            <div class="bg-neutral-800 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Preferences & SEO</h3>

                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="locale" class="block text-sm font-medium text-neutral-300 mb-1">Language</label>
                            <select
                                id="locale"
                                v-model="profile.locale"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="pt">Portuguese</option>
                            </select>
                        </div>

                        <div>
                            <label for="visibility" class="block text-sm font-medium text-neutral-300 mb-1">Profile Visibility</label>
                            <select
                                id="visibility"
                                v-model="profile.visibility"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="metaTitle" class="block text-sm font-medium text-neutral-300 mb-1">SEO Title</label>
                        <input
                            id="metaTitle"
                            v-model="profile.metaTitle"
                            type="text"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                            placeholder="Custom SEO title (defaults to your name)"
                        />
                    </div>

                    <div>
                        <label for="metaDescription" class="block text-sm font-medium text-neutral-300 mb-1">SEO Description</label>
                        <textarea
                            id="metaDescription"
                            v-model="profile.metaDescription"
                            rows="2"
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                            placeholder="Custom SEO description (defaults to your bio)"
                        ></textarea>
                    </div>
                </div>
            </div>

            <!-- Notification Preferences -->
            <div class="bg-neutral-800 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Notification Preferences</h3>

                <div class="space-y-3">
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input
                                id="commentNotifications"
                                v-model="profile.commentNotifications"
                                type="checkbox"
                                class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                            />
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="commentNotifications" class="font-medium text-neutral-300">Comment Notifications</label>
                            <p class="text-neutral-400">Receive notifications when someone comments on your posts</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input
                                id="mentionNotifications"
                                v-model="profile.mentionNotifications"
                                type="checkbox"
                                class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                            />
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="mentionNotifications" class="font-medium text-neutral-300">Mention Notifications</label>
                            <p class="text-neutral-400">Receive notifications when someone mentions you</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input
                                id="recommendationNotifications"
                                v-model="profile.recommendationNotifications"
                                type="checkbox"
                                class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                            />
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="recommendationNotifications" class="font-medium text-neutral-300">Recommendation Notifications</label>
                            <p class="text-neutral-400">Receive notifications about content recommendations</p>
                        </div>
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

        <!-- Add the file input (hidden) -->
        <input
            type="file"
            ref="profileImageInput"
            @change="handleProfileImageSelect"
            accept="image/*"
            class="hidden"
        />

        <!-- Add the crop modal dialog -->
        <div v-if="cropModalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div class="bg-neutral-800 rounded-lg max-w-md w-full p-6">
                <h3 class="text-lg font-medium text-white mb-4">Crop Profile Image</h3>

                <div class="relative mb-4">
                    <div class="w-full aspect-square relative overflow-hidden rounded-lg border-2 border-neutral-600">
                        <!-- Just keep the canvas, we'll draw the overlay in JavaScript -->
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

        <!-- Add file input for cover image -->
        <input
            type="file"
            ref="coverImageInput"
            @change="handleCoverImageSelect"
            accept="image/*"
            class="hidden"
        />

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
import { ref, computed, onMounted } from 'vue'
import { useAdminClient } from '@cmmv/blog/admin/client'

const adminClient = useAdminClient()

// State
const profile = ref({
    name: '',
    slug: '',
    image: '',
    coverImage: '',
    bio: '',
    website: '',
    location: '',
    facebook: '',
    twitter: '',
    locale: 'en',
    visibility: 'public',
    metaTitle: '',
    metaDescription: '',
    commentNotifications: true,
    mentionNotifications: true,
    recommendationNotifications: true
})

const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const userEmail = ref('')
const websiteUrl = ref('https://yourblog.com')
const errors = ref({})

// Notification
const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

// Crop state
const cropModalOpen = ref(false)
const zoomLevel = ref(1)
const cropCanvas = ref(null)
const profileImageInput = ref(null)
const selectedImage = ref(null)
const cropContext = ref(null)

// Add these variables for drag functionality
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imagePosition = ref({ x: 0, y: 0 })

// Cover image crop state
const coverCropModalOpen = ref(false)
const coverZoomLevel = ref(1)
const coverCropCanvas = ref(null)
const coverImageInput = ref(null)
const selectedCoverImage = ref(null)
const coverCropContext = ref(null)
const isCoverDragging = ref(false)
const coverDragStart = ref({ x: 0, y: 0 })
const coverImagePosition = ref({ x: 0, y: 0 })

// Computed values
const profileInitial = computed(() => {
    if (profile.value.name) {
        return profile.value.name.charAt(0).toUpperCase()
    }
    return userEmail.value.charAt(0).toUpperCase()
})

// Load profile
const loadProfile = async () => {
    try {
        loading.value = true
        error.value = null

        const response = await adminClient.profile.get()

        if (response) {
            userEmail.value = response.email || ''

            if (response.profile) {
                profile.value = {
                    ...profile.value,
                    ...response.profile
                }
            } else {
                generateDefaultSlug()
            }
        }

        loading.value = false
    } catch (err) {
        console.error('Failed to load profile:', err)
        loading.value = false
        error.value = err.message || 'Failed to load profile'
        showNotification('error', 'Failed to load profile')
    }
}

// Generate a slug from the name
const generateDefaultSlug = () => {
    if (profile.value.name) {
        profile.value.slug = profile.value.name
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
    } else if (userEmail.value) {
        // Use email username as fallback
        const username = userEmail.value.split('@')[0]
        profile.value.slug = username
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
    }
}

// Save profile
const saveProfile = async () => {
    if (validateForm()) {
        try {
            saving.value = true
            errors.value = {}

            await adminClient.profile.update(profile.value)

            saving.value = false
            showNotification('success', 'Profile updated successfully')
        } catch (err) {
            saving.value = false
            console.error('Failed to save profile:', err)

            if (err.response?.data?.errors)
                errors.value = err.response.data.errors
            else
                showNotification('error', err.message || 'Failed to save profile')
        }
    }
}

const openProfileImageUpload = () => {
    profileImageInput.value.click()
}

const handleProfileImageSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        const img = new Image()
        img.crossOrigin = "Anonymous"

        img.onload = () => {
            console.log('Image loaded', { width: img.width, height: img.height })
            selectedImage.value = img
            cropModalOpen.value = true

            setTimeout(() => {
                initCropCanvas()
            }, 100)
        }

        img.onerror = (err) => {
            console.error('Image loading error', err)
            showNotification('error', 'Failed to load image')
        }

        img.src = e.target.result
    }

    reader.readAsDataURL(file)
    event.target.value = ''
}

const drawImageOnCanvas = () => {
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

// Initialize dragging
const startDrag = (e) => {
    isDragging.value = true

    // Get initial position
    if (e.type.includes('mouse')) {
        dragStart.value = { x: e.clientX, y: e.clientY }
    } else { // touch event
        dragStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
}

// Handle drag movement
const onDrag = (e) => {
    if (!isDragging.value) return

    // Prevent default to avoid scrolling on touch devices
    e.preventDefault()

    let currentX, currentY
    if (e.type.includes('mouse')) {
        currentX = e.clientX
        currentY = e.clientY
    } else { // touch event
        currentX = e.touches[0].clientX
        currentY = e.touches[0].clientY
    }

    // Calculate the distance moved
    const deltaX = currentX - dragStart.value.x
    const deltaY = currentY - dragStart.value.y

    // Update image position
    imagePosition.value = {
        x: imagePosition.value.x + deltaX,
        y: imagePosition.value.y + deltaY
    }

    // Update drag start for next movement
    dragStart.value = { x: currentX, y: currentY }

    // Redraw canvas
    drawImageOnCanvas()
}

// Stop dragging
const stopDrag = () => {
    isDragging.value = false
}

// Initialize crop canvas
const initCropCanvas = () => {
    if (!cropCanvas.value || !selectedImage.value) return

    const canvas = cropCanvas.value
    const ctx = canvas.getContext('2d')
    cropContext.value = ctx

    // Set fixed dimensions for the canvas
    canvas.width = 300
    canvas.height = 300

    // Reset zoom and position
    zoomLevel.value = 1
    imagePosition.value = { x: 0, y: 0 }

    // Draw initial image
    drawImageOnCanvas()
}

// Adjust zoom level
const adjustZoom = (delta) => {
    zoomLevel.value = Math.max(0.5, Math.min(3, zoomLevel.value + delta))
    drawImageOnCanvas()
}

// Crop the image and convert to base64
const cropImage = () => {
    if (!cropCanvas.value || !cropContext.value) return

    const canvas = cropCanvas.value

    // Calculate the circle center and radius
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.375 // 3/4 of half the canvas (as per overlay)

    // Create a temporary canvas for the circular crop
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')

    // Set dimensions for output (reasonable size for avatar)
    tempCanvas.width = 400
    tempCanvas.height = 400

    // Draw circular mask
    tempCtx.beginPath()
    tempCtx.arc(tempCanvas.width / 2, tempCanvas.height / 2, tempCanvas.width / 2, 0, Math.PI * 2)
    tempCtx.closePath()
    tempCtx.clip()

    // Scale the source canvas to fit the temp canvas
    const scale = tempCanvas.width / (radius * 2)

    // Draw the source canvas onto the temp canvas
    tempCtx.drawImage(
        canvas,
        centerX - radius, centerY - radius, radius * 2, radius * 2,
        0, 0, tempCanvas.width, tempCanvas.height
    )

    // Convert to base64
    const base64Image = tempCanvas.toDataURL('image/jpeg', 0.9)

    // Update profile
    profile.value.image = base64Image

    // Close modal
    cropModalOpen.value = false

    // Show confirmation
    showNotification('success', 'Profile image updated')
}

// Form validation
const validateForm = () => {
    errors.value = {}
    let isValid = true

    // Required fields
    if (!profile.value.name) {
        errors.value.name = 'Name is required'
        isValid = false
    }

    return isValid
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

// Add wheel event for mouse zoom
const handleWheel = (e) => {
    e.preventDefault();

    // Determine zoom direction and amount
    const delta = e.deltaY > 0 ? -0.1 : 0.1;

    // Apply zoom
    adjustZoom(delta);
}

// Crop state for cover image
const startCoverDrag = (e) => {
    isCoverDragging.value = true

    // Get initial position
    if (e.type.includes('mouse')) {
        coverDragStart.value = { x: e.clientX, y: e.clientY }
    } else { // touch event
        coverDragStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
}

// Handle drag movement for cover image
const onCoverDrag = (e) => {
    if (!isCoverDragging.value) return

    // Prevent default to avoid scrolling on touch devices
    e.preventDefault()

    let currentX, currentY
    if (e.type.includes('mouse')) {
        currentX = e.clientX
        currentY = e.clientY
    } else { // touch event
        currentX = e.touches[0].clientX
        currentY = e.touches[0].clientY
    }

    // Calculate the distance moved
    const deltaX = currentX - coverDragStart.value.x
    const deltaY = currentY - coverDragStart.value.y

    // Update image position
    coverImagePosition.value = {
        x: coverImagePosition.value.x + deltaX,
        y: coverImagePosition.value.y + deltaY
    }

    // Update drag start for next movement
    coverDragStart.value = { x: currentX, y: currentY }

    // Redraw canvas
    drawCoverImageOnCanvas()
}

// Stop dragging for cover image
const stopCoverDrag = () => {
    isCoverDragging.value = false
}

// Draw cover image on canvas
const drawCoverImage = () => {
    if (!coverCropCanvas.value || !profile.value.coverImage) return;

    const canvas = coverCropCanvas.value;
    const ctx = coverContext.value;
    const img = new Image();

    img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate dimensions for centered, zoomed image
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * coverZoomLevel.value;
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Use imagePosition for x,y coordinates (for dragging)
        const x = coverImagePosition.value.x + (canvas.width - scaledWidth) / 2;
        const y = coverImagePosition.value.y + (canvas.height - scaledHeight) / 2;

        // Draw the image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    };

    img.src = profile.value.coverImage;
}

// Adjust zoom level for cover image
const adjustCoverZoom = (delta) => {
    coverZoomLevel.value = Math.max(0.5, Math.min(3, coverZoomLevel.value + delta))
    drawCoverImage()
}

// Crop cover image and update profile
const cropCoverImage = () => {
    if (!coverCropCanvas.value || !selectedCoverImage.value || !coverCropContext.value) return

    const canvas = coverCropCanvas.value
    const ctx = coverCropContext.value
    const img = selectedCoverImage.value

    // Create a temporary canvas for the crop
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')

    // Set output dimensions (use reasonable size for web display)
    const outputWidth = 1200
    const outputHeight = 400

    // Set temp canvas size
    tempCanvas.width = outputWidth
    tempCanvas.height = outputHeight

    // Calculate dimensions for centered, zoomed image (same as in drawCoverImageOnCanvas)
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * coverZoomLevel.value
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale
    const x = coverImagePosition.value.x + (canvas.width - scaledWidth) / 2
    const y = coverImagePosition.value.y + (canvas.height - scaledHeight) / 2

    // Draw only the visible portion of the image directly to the temp canvas
    tempCtx.drawImage(
        img,                         // source image
        -x / scale,                  // source x (adjust for position)
        -y / scale,                  // source y (adjust for position)
        canvas.width / scale,        // source width
        canvas.height / scale,       // source height
        0, 0,                        // destination x, y
        outputWidth, outputHeight    // destination width, height
    )

    // Convert to base64 with compression
    const base64Image = tempCanvas.toDataURL('image/jpeg', 0.8) // 0.8 quality for compression

    // Update profile
    profile.value.coverImage = base64Image

    // Close modal
    coverCropModalOpen.value = false

    // Show confirmation
    showNotification('success', 'Cover image updated')
}

// Update cover image button handler
const openCoverImageUpload = () => {
    // Trigger file input click
    coverImageInput.value.click()
}

// Handle cover image file selection
const handleCoverImageSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Read the selected file
    const reader = new FileReader()
    reader.onload = (e) => {
        // Create an image object to get dimensions
        const img = new Image()
        img.crossOrigin = "Anonymous"

        img.onload = () => {
            console.log('Cover image loaded', { width: img.width, height: img.height })
            selectedCoverImage.value = img
            coverCropModalOpen.value = true

            // Initialize canvas after modal is open
            setTimeout(() => {
                initCoverCropCanvas()
            }, 100)
        }

        img.onerror = (err) => {
            console.error('Cover image loading error', err)
            showNotification('error', 'Failed to load cover image')
        }

        img.src = e.target.result
    }
    reader.readAsDataURL(file)

    // Reset file input
    event.target.value = ''
}

// Initialize cover crop canvas
const initCoverCropCanvas = () => {
    if (!coverCropCanvas.value || !selectedCoverImage.value) return

    const canvas = coverCropCanvas.value
    const ctx = canvas.getContext('2d')
    coverCropContext.value = ctx

    // Set fixed dimensions for the canvas
    canvas.width = 600
    canvas.height = 200

    // Reset zoom and position
    coverZoomLevel.value = 1
    coverImagePosition.value = { x: 0, y: 0 }

    // Draw initial image
    drawCoverImageOnCanvas()
}

// Draw cover image on canvas with current zoom level
const drawCoverImageOnCanvas = () => {
    if (!coverCropCanvas.value || !selectedCoverImage.value || !coverCropContext.value) return

    const canvas = coverCropCanvas.value
    const ctx = coverCropContext.value
    const img = selectedCoverImage.value

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate dimensions for centered, zoomed image
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * coverZoomLevel.value
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale

    // Use position for x,y coordinates (for dragging)
    const x = coverImagePosition.value.x + (canvas.width - scaledWidth) / 2
    const y = coverImagePosition.value.y + (canvas.height - scaledHeight) / 2

    // Draw image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

    // Optional light shading at top and bottom to show boundaries
    // without adding an actual border
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(0, 0, canvas.width, 1) // Top edge indicator
    ctx.fillRect(0, canvas.height - 1, canvas.width, 1) // Bottom edge indicator
}

// Handle wheel zoom for cover image
const handleCoverWheel = (e) => {
    e.preventDefault()

    // Determine zoom direction and amount
    const delta = e.deltaY > 0 ? -0.1 : 0.1

    // Apply zoom
    adjustCoverZoom(delta)
}

// Initial load
onMounted(() => {
    loadProfile()
})
</script>
