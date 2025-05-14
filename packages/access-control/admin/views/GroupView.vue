<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Groups</h1>
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
                                    placeholder="Search groups..."
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
                        </div>
                    </div>
                </div>
                <button @click="openAddDialog" class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Group
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading groups...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load groups</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="groups.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">No groups found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by creating your first group</p>
            <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Add Group
            </button>
        </div>

        <!-- Groups table -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                ID
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
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Roles
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="group in groups" :key="group.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="group.id">
                                {{ group.id.substring(0, 6) }}...
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {{ group.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                <div class="flex flex-wrap gap-1">
                                    <template v-if="group.roles && group.roles.length > 0">
                                        <!-- If more than 5 roles, just show count -->
                                        <span v-if="group.roles.length > 5" class="px-3 py-1 bg-blue-900 text-blue-200 text-xs rounded-md">
                                            {{ group.roles.length }} roles
                                        </span>
                                        <!-- Otherwise show each role -->
                                        <template v-else>
                                            <span
                                                v-for="role in group.roles"
                                                :key="role"
                                                class="px-2 py-0.5 bg-purple-900 text-purple-200 text-xs rounded-full"
                                            >
                                                {{ formatRoleName(role) }}
                                            </span>
                                        </template>
                                    </template>
                                    <span v-else>-</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="openEditDialog(group)"
                                        title="Edit"
                                        class="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="confirmDelete(group)"
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
            itemName="groups"
            @pageChange="handlePageChange"
        />

        <!-- Add/Edit Group Dialog -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Edit Group' : 'Add Group' }}</h3>
                    <button @click="closeDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <form @submit.prevent="saveGroup">
                        <div class="mb-4">
                            <label for="name" class="block text-sm font-medium text-neutral-300 mb-1">Group Name</label>
                            <input
                                id="name"
                                v-model="groupForm.name"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Group name"
                                required
                            />
                            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-neutral-300 mb-2">Roles</label>
                            <div class="max-h-[400px] overflow-y-auto bg-neutral-700 border border-neutral-600 rounded-md p-4">
                                <div v-if="loadingRoles" class="flex justify-center items-center py-4">
                                    <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                                    <span class="ml-2 text-sm text-neutral-400">Loading roles...</span>
                                </div>
                                <div v-else-if="!availableRoles.length" class="text-center py-2 text-sm text-neutral-400">
                                    No roles available
                                </div>
                                <div v-else>
                                    <!-- Master "Select All" checkbox -->
                                    <div class="flex items-center py-2 px-1 mb-4 border-b border-neutral-600">
                                        <input
                                            id="select-all-roles"
                                            type="checkbox"
                                            :checked="allRolesSelected"
                                            :indeterminate.prop="someRolesSelected && !allRolesSelected"
                                            @change="toggleAllRoles"
                                            class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-600"
                                        />
                                        <label for="select-all-roles" class="ml-2 font-medium text-sm text-white">
                                            Select All Roles
                                        </label>
                                    </div>

                                    <!-- Group roles by their contract -->
                                    <div v-for="(contractGroup, contractName) in groupedRoles" :key="contractName" class="mb-6 last:mb-0">
                                        <!-- Contract Header with "Select All" for this contract -->
                                        <div class="flex items-center font-medium text-sm text-purple-300 border-b border-neutral-600 pb-1 mb-3">
                                            <input
                                                :id="`select-all-${contractName.toLowerCase()}`"
                                                type="checkbox"
                                                :checked="isContractFullySelected(contractName)"
                                                :indeterminate.prop="isContractPartiallySelected(contractName)"
                                                @change="toggleContractRoles(contractName)"
                                                class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-600 mr-2"
                                            />
                                            <label :for="`select-all-${contractName.toLowerCase()}`" class="cursor-pointer">
                                                {{ contractName }}
                                            </label>
                                        </div>

                                        <!-- Roles Grid -->
                                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            <div v-for="role in contractGroup" :key="role.id" class="flex items-center py-1 px-1">
                                                <input
                                                    :id="`role-${role.id}`"
                                                    v-model="groupForm.roles"
                                                    :value="role.id"
                                                    type="checkbox"
                                                    class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-600"
                                                />
                                                <label :for="`role-${role.id}`" class="ml-2 block text-sm text-neutral-300 truncate">
                                                    {{ role.name }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-neutral-400 mt-1">Select the roles that will be assigned to this group</p>
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
                    <h3 class="text-lg font-medium text-white">Delete Group</h3>
                </div>
                <div class="p-6">
                    <div class="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-neutral-300 text-center">
                            Are you sure you want to delete the group <strong class="text-white">{{ groupToDelete?.name }}</strong>?
                        </p>
                        <p class="text-neutral-400 text-sm text-center mt-2">
                            This action cannot be undone. All users assigned to this group will lose these permissions.
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
                            @click="deleteGroup"
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

const groups = ref([])
const availableRoles = ref([])
const loading = ref(true)
const loadingRoles = ref(false)
const error = ref(null)

const showDialog = ref(false)
const isEditing = ref(false)
const groupForm = ref({
    name: '',
    roles: []
})
const groupToEdit = ref(null)
const formErrors = ref({})
const formLoading = ref(false)

const showDeleteDialog = ref(false)
const groupToDelete = ref(null)
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
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1
})

const showSearchDropdown = ref(false)
const searchInput = ref(null)

const loadGroups = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response = await client.groups.get();

        if (response && Array.isArray(response.data)) {
            groups.value = response.data;

            const total = response.count || response.data.length;
            const limit = response.pagination?.limit || 10;

            pagination.value = {
                current: 1,
                lastPage: Math.ceil(total / limit),
                perPage: limit,
                total: total,
                from: 1,
                to: Math.min(limit, total)
            };
        } else if (response && Array.isArray(response)) {
            // Handle direct array response
            groups.value = response;

            pagination.value = {
                current: 1,
                lastPage: Math.ceil(response.length / 10),
                perPage: 10,
                total: response.length,
                from: 1,
                to: Math.min(10, response.length)
            };
        } else {
            // Fallback if no valid data is found
            groups.value = [];
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
    } catch (err) {
        loading.value = false;
        error.value = err.message || 'Failed to load groups';
        showNotification('error', 'Failed to load groups');
    }
};

const loadRoles = async () => {
    try {
        loadingRoles.value = true;

        const response = await client.roles.get();

        availableRoles.value = [];

        if (response && response.data) {
            const contractsData = response.data;

            Object.entries(contractsData).forEach(([contractName, contractData]) => {
                if (contractData.roles && contractData.roles.length) {
                    availableRoles.value.push({
                        id: `header-${contractName.toLowerCase()}`,
                        name: contractName,
                        isHeader: true,
                        rootOnly: contractData.rootOnly
                    });

                    contractData.roles.forEach(role => {
                        availableRoles.value.push({
                            id: role,
                            name: formatRoleName(role),
                            contract: contractName,
                            rootOnly: contractData.rootOnly
                        });
                    });
                }
            });
        } else if (response && response.contracts) {
            const contractsData = response.contracts;

            Object.entries(contractsData).forEach(([contractName, contractData]) => {
                if (contractData.roles && contractData.roles.length) {
                    availableRoles.value.push({
                        id: `header-${contractName.toLowerCase()}`,
                        name: contractName,
                        isHeader: true,
                        rootOnly: contractData.rootOnly
                    });

                    contractData.roles.forEach(role => {
                        availableRoles.value.push({
                            id: role,
                            name: formatRoleName(role),
                            contract: contractName,
                            rootOnly: contractData.rootOnly
                        });
                    });
                }
            });
        } else if (response && Array.isArray(response)) {
            response.forEach(role => {
                if (typeof role === 'string') {
                    availableRoles.value.push({
                        id: role,
                        name: formatRoleName(role),
                        rootOnly: false
                    });
                } else if (role && role.id) {
                    availableRoles.value.push({
                        id: role.id,
                        name: role.name || formatRoleName(role.id),
                        rootOnly: !!role.rootOnly
                    });
                }
            });
        } else if (response && typeof response === 'object') {
            const extractRoles = (obj, path = '') => {
                if (!obj || typeof obj !== 'object') return;

                if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string' && obj[0].includes(':')) {
                    // This looks like a roles array
                    const contractName = path || 'Roles';
                    availableRoles.value.push({
                        id: `header-${contractName.toLowerCase()}`,
                        name: contractName,
                        isHeader: true,
                        rootOnly: false
                    });

                    obj.forEach(role => {
                        availableRoles.value.push({
                            id: role,
                            name: formatRoleName(role),
                            contract: contractName,
                            rootOnly: false
                        });
                    });
                } else {
                    // Recurse into object properties
                    Object.entries(obj).forEach(([key, value]) => {
                        extractRoles(value, key);
                    });
                }
            };

            extractRoles(response);
        }

        if (availableRoles.value.length === 0) {
            const mockContracts = ['Posts', 'Users', 'Comments'];
            const mockActions = ['get', 'insert', 'update', 'delete'];

            mockContracts.forEach(contract => {
                availableRoles.value.push({
                    id: `header-${contract.toLowerCase()}`,
                    name: contract,
                    isHeader: true,
                    rootOnly: false
                });

                mockActions.forEach(action => {
                    const roleId = `${contract.toLowerCase()}:${action}`;
                    availableRoles.value.push({
                        id: roleId,
                        name: action.charAt(0).toUpperCase() + action.slice(1),
                        contract: contract,
                        rootOnly: false
                    });
                });
            });
        }

        loadingRoles.value = false;
    } catch (err) {
        loadingRoles.value = false;
        showNotification('error', 'Failed to load roles: ' + (err.message || 'Unknown error'));
    }
};

const formatRoleName = (role) => {
    if (!role) return '';

    const parts = role.split(':');
    if (parts.length < 2) return role;

    const action = parts[1];
    return action.charAt(0).toUpperCase() + action.slice(1);
};

// Refresh data
const refreshData = () => {
    loadGroups()
}

// Pagination methods
const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.value.lastPage) return
    pagination.value.current = newPage
    // In a real implementation, you would fetch the data for the new page
}

// Watch for filter changes
watch(filters, () => {
    // In a real implementation, you would fetch filtered data
}, { deep: true })

// Dialog methods
const openAddDialog = () => {
    isEditing.value = false
    groupForm.value = {
        name: '',
        roles: []
    }
    formErrors.value = {}
    loadRoles()
    showDialog.value = true
}

const openEditDialog = (group) => {
    isEditing.value = true
    groupToEdit.value = group
    groupForm.value = {
        name: group.name,
        roles: Array.isArray(group.roles) ? [...group.roles] : []
    }
    formErrors.value = {}
    loadRoles()
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    groupForm.value = {
        name: '',
        roles: []
    }
    formErrors.value = {}
    groupToEdit.value = null
}

// Save group
const saveGroup = async () => {
    try {
        formLoading.value = true;
        formErrors.value = {};

        // Validate
        if (!groupForm.value.name.trim()) {
            formErrors.value.name = 'Group name is required';
            formLoading.value = false;
            return;
        }

        // Include roles directly in the group data
        const groupData = {
            name: groupForm.value.name.trim(),
            roles: groupForm.value.roles || []
        };

        if (isEditing.value) {
            const updateResponse = await client.groups.update(groupToEdit.value.id, groupData);
            showNotification('success', 'Group updated successfully');
        } else {
            const createResponse = await client.groups.create(groupData);
            showNotification('success', 'Group created successfully');
        }

        formLoading.value = false;
        closeDialog();
        refreshData();
    } catch (err) {
        formLoading.value = false;

        if (err.response?.data?.errors) {
            formErrors.value = err.response.data.errors;
        } else {
            showNotification('error', err.message || 'Failed to save group');
        }
    }
};

const confirmDelete = (group) => {
    groupToDelete.value = group
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    groupToDelete.value = null
}

const deleteGroup = async () => {
    if (!groupToDelete.value) return;

    try {
        deleteLoading.value = true;
        const response = await client.groups.delete(groupToDelete.value.id);

        // Handle response - check for success status
        const isSuccess = response &&
            (response.status === 200 ||
             response.status === 204 ||
             (response.result && (response.result.success || response.result.status === 'success')));

        if (!isSuccess) {
            throw new Error('Delete operation failed');
        }

        deleteLoading.value = false;
        closeDeleteDialog();
        showNotification('success', 'Group deleted successfully');
        refreshData();
    } catch (err) {
        deleteLoading.value = false;
        showNotification('error', err.message || 'Failed to delete group');
    }
};

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

const toggleSort = (column) => {
    if (filters.value.sortBy === column) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
        filters.value.sortBy = column
        filters.value.sortOrder = 'asc'
    }
}

// Add computed property to group roles by contract
const groupedRoles = computed(() => {
    const groups = {};

    // Process each role and group by contract
    availableRoles.value.forEach(role => {
        if (role.isHeader) {
            // Create a new group for this contract if it doesn't exist
            if (!groups[role.name]) {
                groups[role.name] = [];
            }
        } else {
            // Add the role to its contract group
            const contractName = role.contract || 'Other';
            if (!groups[contractName]) {
                groups[contractName] = [];
            }
            groups[contractName].push(role);
        }
    });

    return groups;
});

// Computed properties for role selection states
const allRolesSelected = computed(() => {
    // Get flat list of all role IDs
    const allRoleIds = getAllRoleIds();
    // Check if all are selected
    return allRoleIds.length > 0 &&
           allRoleIds.every(roleId => groupForm.value.roles.includes(roleId));
});

const someRolesSelected = computed(() => {
    // Get flat list of all role IDs
    const allRoleIds = getAllRoleIds();
    // Check if some but not all are selected
    return allRoleIds.length > 0 &&
           allRoleIds.some(roleId => groupForm.value.roles.includes(roleId)) &&
           !allRoleIds.every(roleId => groupForm.value.roles.includes(roleId));
});

// Methods for "Select All" functionality
const getAllRoleIds = () => {
    // Collect all non-header role IDs
    const roleIds = [];
    availableRoles.value.forEach(role => {
        if (!role.isHeader) {
            roleIds.push(role.id);
        }
    });
    return roleIds;
};

const getContractRoleIds = (contractName) => {
    // Get all role IDs for a specific contract
    return groupedRoles.value[contractName]?.map(role => role.id) || [];
};

const isContractFullySelected = (contractName) => {
    const contractRoleIds = getContractRoleIds(contractName);
    return contractRoleIds.length > 0 &&
           contractRoleIds.every(roleId => groupForm.value.roles.includes(roleId));
};

const isContractPartiallySelected = (contractName) => {
    const contractRoleIds = getContractRoleIds(contractName);
    return contractRoleIds.length > 0 &&
           contractRoleIds.some(roleId => groupForm.value.roles.includes(roleId)) &&
           !contractRoleIds.every(roleId => groupForm.value.roles.includes(roleId));
};

const toggleAllRoles = (event) => {
    const isChecked = event.target.checked;
    const allRoleIds = getAllRoleIds();

    if (isChecked) {
        // Select all roles
        groupForm.value.roles = [...new Set([...groupForm.value.roles, ...allRoleIds])];
    } else {
        // Deselect all roles
        groupForm.value.roles = groupForm.value.roles.filter(roleId => !allRoleIds.includes(roleId));
    }
};

const toggleContractRoles = (contractName) => {
    const contractRoleIds = getContractRoleIds(contractName);
    const isFullySelected = isContractFullySelected(contractName);

    if (isFullySelected) {
        // Deselect all roles in this contract
        groupForm.value.roles = groupForm.value.roles.filter(roleId => !contractRoleIds.includes(roleId));
    } else {
        // Select all roles in this contract
        groupForm.value.roles = [...new Set([...groupForm.value.roles, ...contractRoleIds])];
    }
};

const toggleSearchDropdown = () => {
    showSearchDropdown.value = !showSearchDropdown.value

    // Focus the search input when dropdown opens
    if (showSearchDropdown.value) {
        nextTick(() => {
            searchInput.value?.focus()
        })
    }
}

const clearSearch = () => {
    filters.value.search = ''
    filters.value.page = 1
    loadGroups()
    showSearchDropdown.value = false
}

onMounted(() => {
    loadGroups();

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
