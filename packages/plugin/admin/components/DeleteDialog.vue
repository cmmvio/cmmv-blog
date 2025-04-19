<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
        <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div class="p-6 border-b border-neutral-700">
                <h3 class="text-lg font-medium text-white">{{ title }}</h3>
            </div>
            <div class="p-6">
                <p class="text-neutral-300 mb-4">
                    {{ message }} <span v-if="itemName" class="font-medium text-white">{{ itemName }}</span>?
                </p>

                <!-- Slot para conteúdo personalizado -->
                <slot name="content"></slot>

                <p class="text-sm text-neutral-400 mb-6">
                    {{ warningText || 'This action cannot be undone.' }}
                </p>

                <div class="flex justify-end space-x-3">
                    <button
                        @click="$emit('cancel')"
                        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                    >
                        {{ cancelText }}
                    </button>
                    <button
                        @click="$emit('confirm')"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        :disabled="loading"
                    >
                        <span v-if="loading" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ loadingText }}
                        </span>
                        <span v-else>{{ confirmText }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Confirm Deletion'
    },
    message: {
        type: String,
        default: 'Are you sure you want to delete'
    },
    itemName: {
        type: String,
        default: ''
    },
    warningText: {
        type: String,
        default: 'This action cannot be undone. All associated content may be affected.'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
    },
    confirmText: {
        type: String,
        default: 'Delete'
    },
    loadingText: {
        type: String,
        default: 'Deleting...'
    },
    loading: {
        type: Boolean,
        default: false
    }
});

defineEmits(['confirm', 'cancel']);
</script>
