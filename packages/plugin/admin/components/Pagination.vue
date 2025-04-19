<template>
    <div class="flex items-center justify-between">
        <!-- Item count summary -->
        <div class="text-sm text-neutral-400">
            Showing <span class="font-medium text-white">{{ from }}</span> to
            <span class="font-medium text-white">{{ to }}</span> of
            <span class="font-medium text-white">{{ total }}</span> {{ itemName }}
        </div>

        <!-- Pagination controls -->
        <div class="flex items-center space-x-2">
            <button
                @click="prevPage"
                :disabled="currentPage === 1"
                :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
                class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
            >
                Previous
            </button>

            <div class="flex items-center">
                <div v-for="page in paginationPages" :key="page"
                    @click="goToPage(page)"
                    class="w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer transition-colors duration-200"
                    :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-white hover:bg-neutral-700'"
                >
                    {{ page }}
                </div>
            </div>

            <button
                @click="nextPage"
                :disabled="currentPage === lastPage"
                :class="{'opacity-50 cursor-not-allowed': currentPage === lastPage}"
                class="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
            >
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Add router functionality
const route = useRoute();
const router = useRouter();

// Define the props
const props = defineProps({
    // Full pagination object
    pagination: {
        type: Object,
        required: true
    },
    // Name of the items being paginated (e.g., "posts", "medias")
    itemName: {
        type: String,
        default: 'items'
    },
    // Whether to update URL when page changes
    updateUrl: {
        type: Boolean,
        default: true
    },
    // Query parameter name for page
    pageParamName: {
        type: String,
        default: 'page'
    }
});

// Define events
const emit = defineEmits(['pageChange']);

// Extract pagination values
const currentPage = computed(() => props.pagination.current);
const lastPage = computed(() => props.pagination.lastPage);
const total = computed(() => props.pagination.total);
const from = computed(() => props.pagination.from);
const to = computed(() => props.pagination.to);

// Calculate visible pagination pages
const paginationPages = computed(() => {
    const totalPages = lastPage.value;

    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const current = currentPage.value;

    // Logic for showing page numbers (1, ..., current-1, current, current+1, ..., lastPage)
    let startPage = Math.max(2, current - 1);
    let endPage = Math.min(totalPages - 1, current + 1);

    // Adjust if we're near the beginning or end
    if (current <= 3) {
        endPage = Math.min(4, totalPages - 1);
    } else if (current >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2);
    }

    const pages = [1];

    // Add ellipsis if needed before startPage
    if (startPage > 2) {
        pages.push('...');
    }

    // Add page numbers between start and end
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    // Add ellipsis if needed after endPage
    if (endPage < totalPages - 1) {
        pages.push('...');
    }

    // Add last page if more than 1 page
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
});

// Handle URL updates
const updateUrlPage = (page) => {
    if (!props.updateUrl) return;

    const query = { ...route.query };

    if (page === 1) {
        // Remove page parameter if it's page 1 (default)
        delete query[props.pageParamName];
    } else {
        // Set page parameter
        query[props.pageParamName] = page.toString();
    }

    // Replace URL without navigating
    router.replace({ query });
};

// Go to a specific page
const goToPage = (page) => {
    if (page === '...') return;
    emit('pageChange', page);
    updateUrlPage(page);
};

// Go to the previous page
const prevPage = () => {
    if (currentPage.value > 1) {
        const newPage = currentPage.value - 1;
        emit('pageChange', newPage);
        updateUrlPage(newPage);
    }
};

// Go to the next page
const nextPage = () => {
    if (currentPage.value < lastPage.value) {
        const newPage = currentPage.value + 1;
        emit('pageChange', newPage);
        updateUrlPage(newPage);
    }
};

// Initialize from URL on load
onMounted(() => {
    if (props.updateUrl && route.query[props.pageParamName]) {
        const urlPage = parseInt(route.query[props.pageParamName]);
        if (urlPage && urlPage !== currentPage.value) {
            emit('pageChange', urlPage);
        }
    }
});
</script>
