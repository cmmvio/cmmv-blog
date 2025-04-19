<template>
    <div v-if="show"
        class="fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg flex items-center z-50"
        :class="type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
        <span v-if="type === 'success'" class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
        </span>
        <span v-else class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
        </span>
        <span>{{ message }}</span>
        <button @click="handleClose" class="ml-4 text-white hover:text-neutral-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, watchEffect, ref } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'success',
        validator: (value) => ['success', 'error'].includes(value)
    },
    duration: {
        type: Number,
        default: 3000
    },
    autoClose: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['close']);

const handleClose = () => {
    emit('close');
};

let timer = null;

watchEffect(() => {
    if (props.show && props.autoClose && props.duration > 0) {
        // Clear any existing timer
        if (timer) clearTimeout(timer);

        // Set new timer
        timer = setTimeout(() => {
            emit('close');
        }, props.duration);
    }
});

// Clean up timer on component unmount
onMounted(() => {
    return () => {
        if (timer) clearTimeout(timer);
    };
});
</script>