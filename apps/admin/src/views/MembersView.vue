<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Members</h1>
            <div class="flex space-x-3 mt-2 sm:mt-0">
                <button @click="loadMembers" class="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <button @click="openAddMemberModal" class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Member
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
                            placeholder="Search members..."
                            class="bg-neutral-700 h-10 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-0"
                        />
                    </div>
                    <select
                        v-model="filters.searchField"
                        class="bg-neutral-700 w-56 h-10 border border-neutral-800 text-white px-3 py-2 rounded-r-md focus:outline-none focus:ring-0 border-l-0"
                    >
                        <option value="name,email">Name & Email</option>
                        <option value="name">Name Only</option>
                        <option value="email">Email Only</option>
                    </select>
                </div>
                <div>
                    <select
                        v-model="filters.emailStatus"
                        class="bg-neutral-700 h-10 border border-neutral-800 text-white px-3 py-2 rounded-md w-full focus:outline-none focus:ring-0"
                    >
                        <option value="">All Members</option>
                        <option value="enabled">Email Enabled</option>
                        <option value="disabled">Email Disabled</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading members...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load members</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="loadMembers" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="members.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p class="text-neutral-300 mb-2">No members found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by creating your first member</p>
            <button @click="openAddMemberModal" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Add Member
            </button>
        </div>

        <!-- Members Table -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th
                                scope="col"
                                @click="sortBy('name')"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                <div class="flex items-center">
                                    <span>Name</span>
                                    <span v-if="sortField === 'name'" class="ml-1">
                                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                    </span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                @click="sortBy('email')"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                <div class="flex items-center">
                                    <span>Email</span>
                                    <span v-if="sortField === 'email'" class="ml-1">
                                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                    </span>
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                <div class="flex items-center">
                                    <span>Email Stats</span>
                                </div>
                            </th>
                            <th
                                scope="col"
                                @click="sortBy('lastSeenAt')"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                <div class="flex items-center">
                                    <span>Last Seen</span>
                                    <span v-if="sortField === 'lastSeenAt'" class="ml-1">
                                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                    </span>
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="member in members" :key="member.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center text-white font-semibold">
                                        {{ getInitials(member.name) }}
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-white">{{ member.name }}</div>
                                        <div v-if="member.note" class="text-sm text-neutral-400 truncate max-w-xs">{{ member.note }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-white">{{ member.email }}</div>
                                <div v-if="member.getLocation" class="text-xs text-neutral-400">{{ member.getLocation }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-white">
                                    <span v-if="member.emailDisabled" class="px-2 py-1 text-xs rounded-full bg-red-900 text-red-200">Email Disabled</span>
                                    <span v-else>
                                        <span v-if="member.emailOpenRate !== undefined" class="font-semibold">{{ formatPercentage(member.emailOpenRate) }}</span>
                                        <span v-if="member.emailOpenedCount !== undefined && member.emailCount !== undefined" class="text-neutral-400 text-xs ml-1">
                                            ({{ member.emailOpenedCount }}/{{ member.emailCount }})
                                        </span>
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-white">{{ formatDate(member.lastSeenAt) }}</div>
                                <div v-if="member.lastCommentedAt" class="text-xs text-neutral-400">Commented: {{ formatDate(member.lastCommentedAt) }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="editMember(member)"
                                        title="Edit"
                                        class="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="confirmDelete(member)"
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
                Showing <span class="font-medium text-white">{{ paginationStart }}</span> to
                <span class="font-medium text-white">{{ paginationEnd }}</span> of
                <span class="font-medium text-white">{{ totalItems }}</span> members
            </div>
            <div class="flex items-center space-x-2">
                <button
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                    class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
                >
                    Previous
                </button>
                <div class="flex items-center">
                    <div v-for="page in paginationPages" :key="page"
                        @click="changePage(page)"
                        class="w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer transition-colors duration-200"
                        :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-white hover:bg-neutral-700'"
                    >
                        {{ page }}
                    </div>
                </div>
                <button
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
                    class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
                >
                    Next
                </button>
            </div>
        </div>

        <!-- Add/Edit Member Modal -->
        <div v-if="showMemberModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Edit Member' : 'Add Member' }}</h3>
                    <button @click="closeMemberModal" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <form @submit.prevent="saveMember">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left Column -->
                            <div>
                                <div class="mb-4">
                                    <label for="memberName" class="block text-sm font-medium text-neutral-300 mb-1">Name *</label>
                                    <input
                                        id="memberName"
                                        v-model="memberForm.name"
                                        type="text"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Member name"
                                        required
                                    />
                                    <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
                                </div>

                                <div class="mb-4">
                                    <label for="memberEmail" class="block text-sm font-medium text-neutral-300 mb-1">Email *</label>
                                    <input
                                        id="memberEmail"
                                        v-model="memberForm.email"
                                        type="email"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="member@example.com"
                                        required
                                    />
                                    <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">{{ formErrors.email }}</p>
                                </div>

                                <div class="mb-4 flex items-center">
                                    <input
                                        id="memberEmailDisabled"
                                        v-model="memberForm.emailDisabled"
                                        type="checkbox"
                                        class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                                    />
                                    <label for="memberEmailDisabled" class="ml-2 block text-sm text-neutral-300">
                                        Disable email notifications
                                    </label>
                                </div>

                                <div class="mb-4">
                                    <label for="memberLabels" class="block text-sm font-medium text-neutral-300 mb-1">Labels</label>
                                    <input
                                        id="memberLabels"
                                        v-model="memberForm.labels"
                                        type="text"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Comma-separated labels"
                                    />
                                    <p class="mt-1 text-sm text-neutral-500">Enter labels separated by commas</p>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div>
                                <div class="mb-4">
                                    <label for="memberNote" class="block text-sm font-medium text-neutral-300 mb-1">Notes</label>
                                    <textarea
                                        id="memberNote"
                                        v-model="memberForm.note"
                                        rows="3"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Additional notes about this member"
                                    ></textarea>
                                </div>

                                <div v-if="isEditing">
                                    <div class="text-sm text-neutral-400 mb-2">Member Information</div>
                                    <div class="bg-neutral-750 rounded-md p-3 mb-4">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-sm text-neutral-400">Created:</span>
                                            <span class="text-sm text-white">{{ formatDate(memberForm.createdAt) }}</span>
                                        </div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-sm text-neutral-400">Last Seen:</span>
                                            <span class="text-sm text-white">{{ formatDate(memberForm.lastSeenAt) }}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-neutral-400">Email Stats:</span>
                                            <span class="text-sm text-white">
                                                {{ memberForm.emailCount || 0 }} sent /
                                                {{ memberForm.emailOpenedCount || 0 }} opened
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                @click="closeMemberModal"
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

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Confirm Deletion</h3>
                </div>
                <div class="p-6">
                    <p class="text-neutral-300 mb-4">
                        Are you sure you want to delete the member <span class="font-medium text-white">{{ memberToDelete?.name }}</span>?
                    </p>
                    <p class="text-sm text-neutral-400 mb-6">
                        This action cannot be undone. The member will lose access to all member-only content and their data will be removed.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button
                            @click="closeDeleteModal"
                            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="deleteMember"
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAdminClient } from '@cmmv/blog/admin';

const adminAPI = useAdminClient();
const { members: membersAPI } = adminAPI;

// Data
const members = ref([]);
const loading = ref(true);
const error = ref(null);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortField = ref('lastSeenAt');
const sortOrder = ref('desc');
const filters = ref({
    search: '',
    searchField: 'name,email',
    emailStatus: ''
});

// Member modal state
const showMemberModal = ref(false);
const isEditing = ref(false);
const memberToEdit = ref(null);
const formErrors = ref({});
const formLoading = ref(false);

// Delete modal state
const showDeleteModal = ref(false);
const memberToDelete = ref(null);
const deleteLoading = ref(false);

// Member form
const memberForm = ref({
    name: '',
    email: '',
    note: '',
    labels: '',
    emailDisabled: false,
    createdAt: null,
    lastSeenAt: null,
    emailCount: 0,
    emailOpenedCount: 0
});

// Notification system
const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
});

// Computed properties
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

const paginationStart = computed(() => {
    if (totalItems.value === 0) return 0;
    return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
    const end = currentPage.value * itemsPerPage.value;
    return end > totalItems.value ? totalItems.value : end;
});

const paginationPages = computed(() => {
    const totalPagesCount = totalPages.value;

    if (totalPagesCount <= 5) {
        return Array.from({ length: totalPagesCount }, (_, i) => i + 1);
    }

    const current = currentPage.value;
    const pages = [1];

    if (current > 2) pages.push('...');

    if (current > 1 && current < totalPagesCount) pages.push(current);

    if (current < totalPagesCount - 1) pages.push('...');

    if (totalPagesCount > 1) pages.push(totalPagesCount);

    return pages;
});

// Methods
const loadMembers = async () => {
    loading.value = true;
    error.value = null;

    try {
        const queryParams = {
            offset: (currentPage.value - 1) * itemsPerPage.value,
            limit: itemsPerPage.value,
            sortBy: sortField.value,
            sort: sortOrder.value
        };

        // Add search filter if provided
        if (filters.value.search) {
            queryParams.search = filters.value.search;
            queryParams.searchField = filters.value.searchField;
        }

        // Add email status filter if selected
        if (filters.value.emailStatus === 'disabled') {
            queryParams.emailDisabled = true;
        } else if (filters.value.emailStatus === 'enabled') {
            queryParams.emailDisabled = false;
        }

        const response = await membersAPI.get(queryParams);

        members.value = response.data || [];
        totalItems.value = response.count || 0;
        loading.value = false;
    } catch (err) {
        console.error('Error loading members:', err);
        loading.value = false;
        error.value = err.message || 'Failed to load members';
        showNotification('error', 'Failed to load members');
    }
};

const changePage = (page) => {
    if (page === '...') return;
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        loadMembers();
    }
};

const sortBy = (field) => {
    if (sortField.value === field) {
        // Toggle sort order if clicking the same field
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        // Default to ascending order for a new field
        sortField.value = field;
        sortOrder.value = 'asc';
    }

    loadMembers();
};

const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';

    // Check if it's today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Check if it's yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Format date
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
};

const formatPercentage = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
};

// Member Form Methods
const openAddMemberModal = () => {
    isEditing.value = false;
    memberToEdit.value = null;
    memberForm.value = {
        name: '',
        email: '',
        note: '',
        labels: '',
        emailDisabled: false
    };
    formErrors.value = {};
    showMemberModal.value = true;
};

const editMember = (member) => {
    isEditing.value = true;
    memberToEdit.value = member;

    // Transform labels array to comma-separated string if needed
    const labels = Array.isArray(member.labels) ? member.labels.join(', ') : (member.labels || '');

    memberForm.value = {
        name: member.name || '',
        email: member.email || '',
        note: member.note || '',
        labels: labels,
        emailDisabled: member.emailDisabled || false,
        createdAt: member.createdAt,
        lastSeenAt: member.lastSeenAt,
        emailCount: member.emailCount,
        emailOpenedCount: member.emailOpenedCount
    };

    formErrors.value = {};
    showMemberModal.value = true;
};

const closeMemberModal = () => {
    showMemberModal.value = false;
    memberForm.value = {
        name: '',
        email: '',
        note: '',
        labels: '',
        emailDisabled: false
    };
    formErrors.value = {};
    memberToEdit.value = null;
};

const saveMember = async () => {
    try {
        formLoading.value = true;
        formErrors.value = {};

        // Validate form
        if (!memberForm.value.name?.trim()) {
            formErrors.value.name = 'Name is required';
            formLoading.value = false;
            return;
        }

        if (!memberForm.value.email?.trim()) {
            formErrors.value.email = 'Email is required';
            formLoading.value = false;
            return;
        }

        // Transform comma-separated labels to array
        const labelsArray = memberForm.value.labels
            ? memberForm.value.labels.split(',').map(label => label.trim()).filter(Boolean)
            : [];

        // Prepare data for API
        const memberData = {
            name: memberForm.value.name.trim(),
            email: memberForm.value.email.trim(),
            note: memberForm.value.note?.trim() || null,
            labels: labelsArray,
            emailDisabled: memberForm.value.emailDisabled
        };

        if (isEditing.value && memberToEdit.value) {
            await membersAPI.update(memberToEdit.value.id, memberData);
            showNotification('success', 'Member updated successfully');
        } else {
            await membersAPI.insert(memberData);
            showNotification('success', 'Member created successfully');
        }

        // Close modal and refresh
        closeMemberModal();
        loadMembers();
    } catch (err) {
        console.error('Error saving member:', err);
        formLoading.value = false;

        if (err.response?.data?.errors) {
            formErrors.value = err.response.data.errors;
        } else {
            showNotification('error', err.message || 'Failed to save member');
        }
    } finally {
        formLoading.value = false;
    }
};

// Delete Member Methods
const confirmDelete = (member) => {
    memberToDelete.value = member;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    memberToDelete.value = null;
};

const deleteMember = async () => {
    if (!memberToDelete.value) return;

    try {
        deleteLoading.value = true;
        await membersAPI.delete(memberToDelete.value.id);
        showNotification('success', 'Member deleted successfully');
        closeDeleteModal();
        loadMembers();
    } catch (err) {
        console.error('Error deleting member:', err);
        showNotification('error', err.message || 'Failed to delete member');
    } finally {
        deleteLoading.value = false;
    }
};

const showNotification = (type, message) => {
    notification.value = {
        show: true,
        type: type === 'info' ? 'success' : type, // Map info to success for styling
        message,
        duration: 3000
    };

    setTimeout(() => {
        notification.value.show = false;
    }, notification.value.duration);
};

// Watch for filter changes
watch(filters, () => {
    loadMembers();
}, { deep: true });

// Load members on component mount
onMounted(() => {
    loadMembers();
});
</script>
