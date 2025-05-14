<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Users</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button @click="refreshData" class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <!-- Add search button with dropdown -->
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
                        <div class="p-3 space-y-2">
                            <div class="relative">
                                <input
                                    v-model="filters.search"
                                    type="text"
                                    placeholder="Search users..."
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
                                    <option value="username">Username</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="openAddDialog" class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add User
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading users...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load users</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="users.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p class="text-neutral-300 mb-2">No users found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by creating your first user</p>
            <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Add User
            </button>
        </div>

        <!-- Users table -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                ID
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
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Groups
                            </th>
                            <th
                                @click="toggleSort('validated')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Validated
                                <span v-if="filters.sortBy === 'validated'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th
                                @click="toggleSort('blocked')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Status
                                <span v-if="filters.sortBy === 'blocked'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="user in users" :key="user.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="user.id">
                                {{ user.id.substring(0, 6) }}...
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ user.email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                <div class="flex flex-wrap gap-1">
                                    <template v-if="user.groups && user.groups.length > 0">
                                        <!-- If more than 5 groups, just show count -->
                                        <span v-if="user.groups.length > 5" class="px-3 py-1 bg-blue-900 text-blue-200 text-xs rounded-md">
                                            {{ user.groups.length }} groups
                                        </span>
                                        <!-- Otherwise show each group -->
                                        <template v-else>
                                            <span
                                                v-for="group in user.groups"
                                                :key="group"
                                                class="px-2 py-0.5 bg-blue-900 text-blue-200 text-xs rounded-full"
                                            >
                                                {{ getGroupName(group) }}
                                            </span>
                                        </template>
                                    </template>
                                    <span v-else>-</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                    class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="user.validated ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'"
                                >
                                    {{ user.validated ? 'Validated' : 'Not Validated' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                    class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="user.blocked ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'"
                                >
                                    {{ user.blocked ? 'Blocked' : 'Active' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        v-if="user.blocked"
                                        @click="unblockUser(user)"
                                        title="Unblock User"
                                        class="text-neutral-400 hover:text-green-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="openEditDialog(user)"
                                        title="Edit"
                                        class="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="confirmDelete(user)"
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
        <Pagination
            :pagination="pagination"
            itemName="users"
            @pageChange="handlePageChange"
        />

        <!-- Add/Edit User Dialog -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
                    <button @click="closeDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <form @submit.prevent="saveUser">
                        <div class="mb-4">
                            <label for="username" class="block text-sm font-medium text-neutral-300 mb-1">Username</label>
                            <input
                                id="username"
                                v-model="userForm.username"
                                :disabled="isEditing"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                placeholder="Username"
                                required
                            />
                            <p v-if="formErrors.username" class="mt-1 text-sm text-red-500">{{ formErrors.username }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="email" class="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                            <input
                                id="email"
                                v-model="userForm.email"
                                type="email"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="email@example.com"
                                required
                            />
                            <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">{{ formErrors.email }}</p>
                        </div>

                        <div v-if="!isEditing" class="mb-4">
                            <label for="password" class="block text-sm font-medium text-neutral-300 mb-1">Password</label>
                            <input
                                id="password"
                                v-model="userForm.password"
                                type="password"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="••••••••••••"
                                required
                            />
                            <p v-if="formErrors.password" class="mt-1 text-sm text-red-500">{{ formErrors.password }}</p>
                            <p class="mt-1 text-xs text-neutral-500">Password must be at least 8 characters and include lowercase, uppercase, number, and special character.</p>
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-neutral-300 mb-2">Groups</label>
                            <div class="max-h-60 overflow-y-auto bg-neutral-700 border border-neutral-600 rounded-md p-2">
                                <div v-if="loadingGroups" class="flex justify-center items-center py-4">
                                    <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                                    <span class="ml-2 text-sm text-neutral-400">Loading groups...</span>
                                </div>
                                <div v-else-if="!availableGroups.length" class="text-center py-2 text-sm text-neutral-400">
                                    No groups available
                                </div>
                                <div v-else class="space-y-1">
                                    <!-- Select All Groups checkbox -->
                                    <div class="flex items-center py-2 px-1 mb-2 border-b border-neutral-600">
                                        <input
                                            id="select-all-groups"
                                            type="checkbox"
                                            :checked="allGroupsSelected"
                                            :indeterminate.prop="someGroupsSelected && !allGroupsSelected"
                                            @change="toggleAllGroups"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-600"
                                        />
                                        <label for="select-all-groups" class="ml-2 font-medium text-sm text-white">
                                            Select All Groups
                                        </label>
                                    </div>

                                    <!-- Individual groups -->
                                    <div v-for="group in availableGroups" :key="group.id" class="flex items-center">
                                        <input
                                            :id="`group-${group.id}`"
                                            v-model="userForm.groups"
                                            :value="group.id"
                                            type="checkbox"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-600"
                                        />
                                        <label :for="`group-${group.id}`" class="ml-2 block text-sm text-neutral-300">
                                            {{ group.name }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="isEditing" class="mb-4 flex flex-col space-y-2">
                            <div class="flex items-center">
                                <input
                                    id="userValidated"
                                    v-model="userForm.validated"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                                />
                                <label for="userValidated" class="ml-2 block text-sm text-neutral-300">
                                    Email Validated
                                </label>
                            </div>
                            <div class="flex items-center">
                                <input
                                    id="userVerifyEmail"
                                    v-model="userForm.verifyEmail"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                                />
                                <label for="userVerifyEmail" class="ml-2 block text-sm text-neutral-300">
                                    Verify Email (Send verification)
                                </label>
                            </div>
                            <div class="flex items-center">
                                <input
                                    id="userRoot"
                                    v-model="userForm.root"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                                />
                                <label for="userRoot" class="ml-2 block text-sm text-neutral-300">
                                    Root User
                                </label>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
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
                    <h3 class="text-lg font-medium text-white">Delete User</h3>
                </div>
                <div class="p-6">
                    <div class="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-neutral-300 text-center">
                            Are you sure you want to delete the user <strong class="text-white">{{ userToDelete?.username }}</strong>?
                        </p>
                        <p class="text-neutral-400 text-sm text-center mt-2">
                            This action cannot be undone. All data associated with this user will be permanently deleted.
                        </p>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button
                            @click="closeDeleteDialog"
                            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="deleteUser"
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAccessControlClient } from '../client'
import Pagination from '@cmmv/blog/admin/components/Pagination.vue'

const client = useAccessControlClient()

const users = ref([])
const availableGroups = ref([])
const loading = ref(true)
const loadingGroups = ref(false)
const error = ref(null)

const showDialog = ref(false)
const isEditing = ref(false)
const userForm = ref({
    username: '',
    email: '',
    password: '',
    groups: [],
    validated: false,
    blocked: false,
    verifyEmail: false
})
const userToEdit = ref(null)
const formErrors = ref({})
const formLoading = ref(false)

const showDeleteDialog = ref(false)
const userToDelete = ref(null)
const deleteLoading = ref(false)

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
    searchField: 'username',
    sortBy: 'username',
    sortOrder: 'asc',
    page: 1
})

const showSearchDropdown = ref(false)
const searchInput = ref(null)

const loadUsers = async () => {
    try {
        loading.value = true
        error.value = null

        const response = await client.users.get()

        if (response.data && Array.isArray(response.data)) {
            users.value = response.data

            pagination.value = {
                current: 1,
                lastPage: Math.ceil(response.data.length / 10),
                perPage: 10,
                total: response.data.length,
                from: 1,
                to: Math.min(10, response.data.length)
            }
        } else {
            users.value = []
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
        loading.value = false
        error.value = err.message || 'Failed to load users'
        showNotification('error', 'Failed to load users')
    }
}

const loadGroups = async () => {
    try {
        loadingGroups.value = true;

        const response = await client.groups.get();

        if (response && Array.isArray(response.data)) {
            availableGroups.value = response.data;
        } else if (response && Array.isArray(response)) {
            availableGroups.value = response;
        } else {
            availableGroups.value = [];
        }

        loadingGroups.value = false;
    } catch (err) {
        loadingGroups.value = false;
        showNotification('error', 'Failed to load groups');
    }
};

const refreshData = () => {
    loadUsers()
}

const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.value.lastPage) return
    pagination.value.current = newPage
}

const openAddDialog = () => {
    isEditing.value = false
    userForm.value = {
        username: '',
        email: '',
        password: '',
        groups: [],
        validated: false,
        blocked: false,
        verifyEmail: false,
        root: false
    }
    formErrors.value = {}
    loadGroups()
    showDialog.value = true
}

const openEditDialog = (user) => {
    isEditing.value = true
    userToEdit.value = user
    userForm.value = {
        username: user.username,
        email: user.email,
        password: '',
        groups: user.groups || [],
        validated: user.validated !== undefined ? user.validated : false,
        blocked: user.blocked !== undefined ? user.blocked : false,
        verifyEmail: false,
        root: user.root !== undefined ? user.root : false
    }
    formErrors.value = {}
    loadGroups()
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    userForm.value = {
        username: '',
        email: '',
        password: '',
        groups: [],
        validated: false,
        blocked: false,
        verifyEmail: false,
        root: false
    }
    formErrors.value = {}
    userToEdit.value = null
}

const saveUser = async () => {
    try {
        formLoading.value = true;
        formErrors.value = {};

        if (!userForm.value.username.trim()) {
            formErrors.value.username = 'Username is required';
            formLoading.value = false;
            return;
        }

        if (!userForm.value.email.trim()) {
            formErrors.value.email = 'Email is required';
            formLoading.value = false;
            return;
        }

        if (!isEditing.value && !userForm.value.password.trim()) {
            formErrors.value.password = 'Password is required';
            formLoading.value = false;
            return;
        }

        const userData = {
            username: userForm.value.username.trim(),
            email: userForm.value.email.trim(),
            validated: userForm.value.validated,
            blocked: userForm.value.blocked,
            verifyEmail: userForm.value.verifyEmail,
            root: userForm.value.root,
            groups: userForm.value.groups || []
        };

        if (!isEditing.value)
            userData.password = userForm.value.password.trim();

        if (isEditing.value) {
            const updateResponse = await client.users.update(userToEdit.value.id, userData);

            if (userForm.value.verifyEmail)
                showNotification('success', 'User updated and verification email sent');
            else
                showNotification('success', 'User updated successfully');
        } else {
            const createResponse = await client.users.create(userData);
            showNotification('success', 'User created successfully');
        }

        formLoading.value = false;
        closeDialog();
        refreshData();
    } catch (err) {
        formLoading.value = false;

        if (err.response?.data?.errors) {
            formErrors.value = err.response.data.errors;
        } else {
            showNotification('error', err.message || 'Failed to save user');
        }
    }
};

const blockUser = async (user) => {
    try {
        await client.users.block(user.id)
        showNotification('success', `User ${user.username} blocked successfully`)
        refreshData()
    } catch (err) {
        showNotification('error', err.message || 'Failed to block user')
    }
}

const unblockUser = async (user) => {
    try {
        await client.users.unblock(user.id)
        showNotification('success', `User ${user.username} unblocked successfully`)
        refreshData()
    } catch (err) {
        showNotification('error', err.message || 'Failed to unblock user')
    }
}

const confirmDelete = (user) => {
    userToDelete.value = user
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    userToDelete.value = null
}

const deleteUser = async () => {
    if (!userToDelete.value) return;

    try {
        deleteLoading.value = true;
        await client.users.delete(userToDelete.value.id);
        deleteLoading.value = false;
        closeDeleteDialog();
        showNotification('success', 'User deleted successfully');
        refreshData();
    } catch (err) {
        deleteLoading.value = false;
        showNotification('error', err.message || 'Failed to delete user')
    }
}

const showNotification = (type, message) => {
    notification.value = {
        show: true,
        type,
        message,
        duration: 3000
    };

    setTimeout(() => {
        notification.value.show = false
    }, notification.value.duration);
}

const toggleSort = (column) => {
    if (filters.value.sortBy === column) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
        filters.value.sortBy = column
        filters.value.sortOrder = 'asc'
    }
}

// Add helper function to get group name from ID
const getGroupName = (groupId) => {
    if (!groupId) return '';

    // First check if this is already a name (backward compatibility)
    if (typeof groupId === 'string' && !groupId.includes('-')) {
        return groupId;
    }

    // Try to find the group by ID
    const group = availableGroups.value.find(g => g.id === groupId);
    return group ? group.name : groupId;
};

// Add computed properties and methods for group selection
const allGroupsSelected = computed(() => {
    return availableGroups.value.length > 0 &&
           availableGroups.value.every(group => userForm.value.groups.includes(group.id));
});

const someGroupsSelected = computed(() => {
    return availableGroups.value.length > 0 &&
           availableGroups.value.some(group => userForm.value.groups.includes(group.id)) &&
           !availableGroups.value.every(group => userForm.value.groups.includes(group.id));
});

const toggleAllGroups = (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
        // Select all groups
        userForm.value.groups = availableGroups.value.map(group => group.id);
    } else {
        // Deselect all groups
        userForm.value.groups = [];
    }
};

// Toggle search dropdown
const toggleSearchDropdown = () => {
    showSearchDropdown.value = !showSearchDropdown.value

    // Focus the search input when dropdown opens
    if (showSearchDropdown.value) {
        nextTick(() => {
            searchInput.value?.focus()
        })
    }
}

// Clear search
const clearSearch = () => {
    filters.value.search = ''
    filters.value.page = 1
    loadUsers()
    showSearchDropdown.value = false
}

onMounted(() => {
    loadGroups();
    loadUsers();

    // Close search dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (showSearchDropdown.value &&
            !e.target.closest('[data-search-toggle]') &&
            !e.target.closest('.absolute')) {
            showSearchDropdown.value = false;
        }
    });
})
</script>
