<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Imports</h1>
        </div>

        <!-- Import Options -->
        <div class="bg-neutral-800 rounded-lg shadow-md">
            <div class="p-6 border-b border-neutral-700">
                <h2 class="text-lg font-medium text-white">Import Content</h2>
                <p class="text-sm text-neutral-400 mt-1">Import your content from other platforms to CMMV Blog</p>
            </div>

            <div class="p-6 space-y-8">
                <!-- WordPress Import -->
                <div class="border-b border-neutral-700 pb-8">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full flex items-center justify-center bg-white" style="width: 56px; height: 56px;">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Wordpress-Logo.svg/512px-Wordpress-Logo.svg.png?20210511042647"
                                    alt="WordPress Logo"
                                    class="h-8 w-auto text-white"
                                />
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-medium text-white">WordPress</h3>
                                <p class="text-sm text-neutral-400">Import content from your WordPress site</p>
                            </div>
                        </div>
                        <button @click="importFrom('wordpress')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">Import</button>
                    </div>
                    <div v-if="activeImporter === 'wordpress'" class="mt-6 bg-neutral-700/30 p-4 rounded-lg">
                        <p class="text-sm text-neutral-300 mb-4">
                            Export your WordPress content using the WordPress export tool, then upload the XML file below.
                        </p>
                        <div class="flex items-start space-x-4">
                            <div class="flex-grow">
                                <div class="flex items-center justify-center w-full">
                                    <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600 transition-colors">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg class="w-8 h-8 mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                            <p class="mb-2 text-sm text-neutral-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p class="text-xs text-neutral-500">WordPress XML export file (MAX. 10MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            class="hidden"
                                            accept=".xml"
                                            ref="wordpressFileInput"
                                            @change="handleFileUpload('wordpress')"
                                        />
                                    </label>
                                </div>
                                <div v-if="files.wordpress" class="flex items-center mt-2">
                                    <div class="text-sm text-neutral-400">{{ files.wordpress.name }}</div>
                                    <button @click="removeFile('wordpress')" class="ml-2 text-red-400 hover:text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button
                                @click="uploadFile('wordpress')"
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex-shrink-0 self-end"
                                :disabled="!files.wordpress || importing.wordpress"
                                :class="{ 'opacity-50 cursor-not-allowed': !files.wordpress || importing.wordpress }"
                            >
                                <span v-if="!importing.wordpress">Start Import</span>
                                <span v-else class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Importing...
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Ghost Import -->
                <!--div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="bg-white p-3 rounded-full flex items-center justify-center" style="width: 56px; height: 56px;">
                                <img
                                    src="https://ghost.org/images/logos/ghost-logo-orb.png"
                                    alt="Ghost Logo"
                                    class="h-8 w-auto"
                                />
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-medium text-white">Ghost</h3>
                                <p class="text-sm text-neutral-400">Import content from your Ghost site</p>
                            </div>
                        </div>
                        <button @click="importFrom('ghost')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">Import</button>
                    </div>
                    <div v-if="activeImporter === 'ghost'" class="mt-6 bg-neutral-700/30 p-4 rounded-lg">
                        <p class="text-sm text-neutral-300 mb-4">
                            Export your Ghost content using the Ghost export tool, then upload the JSON file below.
                        </p>
                        <div class="flex items-start space-x-4">
                            <div class="flex-grow">
                                <div class="flex items-center justify-center w-full">
                                    <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600 transition-colors">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg class="w-8 h-8 mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                            <p class="mb-2 text-sm text-neutral-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p class="text-xs text-neutral-500">Ghost JSON export file (MAX. 10MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            class="hidden"
                                            accept=".json"
                                            ref="ghostFileInput"
                                            @change="handleFileUpload('ghost')"
                                        />
                                    </label>
                                </div>
                                <div v-if="files.ghost" class="flex items-center mt-2">
                                    <div class="text-sm text-neutral-400">{{ files.ghost.name }}</div>
                                    <button @click="removeFile('ghost')" class="ml-2 text-red-400 hover:text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button
                                @click="uploadFile('ghost')"
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex-shrink-0 self-end"
                                :disabled="!files.ghost || importing.ghost"
                                :class="{ 'opacity-50 cursor-not-allowed': !files.ghost || importing.ghost }"
                            >
                                <span v-if="!importing.ghost">Start Import</span>
                                <span v-else class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Importing...
                                </span>
                            </button>
                        </div>
                    </div>
                </div>-->
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
</template>

<script setup>
import { ref } from 'vue';
import { useAdminClient } from '@cmmv/blog/admin/client';

const adminClient = useAdminClient();

const activeImporter = ref(null);
const files = ref({
    wordpress: null,
    ghost: null
});
const importing = ref({
    wordpress: false,
    ghost: false
});

const wordpressFileInput = ref(null);
const ghostFileInput = ref(null);

// Notification system
const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 5000
});

const showNotification = (type, message) => {
    notification.value = {
        show: true,
        type,
        message,
        duration: 5000
    };

    setTimeout(() => {
        notification.value.show = false;
    }, notification.value.duration);
};

const importFrom = (type) => {
    if (activeImporter.value === type) {
        activeImporter.value = null;
    } else {
        activeImporter.value = type;
        // Use a nextTick to ensure the file input is available after the UI updates
        setTimeout(() => {
            if (type === 'wordpress' && wordpressFileInput.value) {
                wordpressFileInput.value.click();
            } else if (type === 'ghost' && ghostFileInput.value) {
                ghostFileInput.value.click();
            }
        }, 100);
    }
};

const handleFileUpload = (type) => {
    const fileInput = type === 'wordpress' ? wordpressFileInput.value : ghostFileInput.value;
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;

    const file = fileInput.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
        showNotification('error', `File is too large. Maximum size is 10MB.`);
        fileInput.value = '';
        return;
    }

    files.value[type] = file;
};

const removeFile = (type) => {
    files.value[type] = null;
    if (type === 'wordpress' && wordpressFileInput.value) {
        wordpressFileInput.value.value = '';
    } else if (type === 'ghost' && ghostFileInput.value) {
        ghostFileInput.value.value = '';
    }
};

const uploadFile = async (type) => {
    if (!files.value[type]) return;

    importing.value[type] = true;

    try {
        const formData = new FormData();
        formData.append('file', files.value[type]);

        let response;

        // Direct API calls to the correct endpoints
        if (type === 'wordpress') {
            // WordPress uses XML format
            response = await fetch('/api/import/wordpress', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                    // DO NOT set Content-Type for FormData - browser will set it with proper boundary
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${await response.text()}`);
            }
        } else if (type === 'ghost') {
            // Ghost uses JSON format
            response = await fetch('/api/import/ghost', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${await response.text()}`);
            }
        }

        showNotification('success', `${type === 'wordpress' ? 'WordPress' : 'Ghost'} import started successfully! You'll be notified when the import is complete.`);

        // Reset the file input
        removeFile(type);
        activeImporter.value = null;
    } catch (error) {
        console.error(`Error importing from ${type}:`, error);
        showNotification('error', `Error importing from ${type}: ${error.message || 'Unknown error'}`);
    } finally {
        importing.value[type] = false;
    }
};
</script>
