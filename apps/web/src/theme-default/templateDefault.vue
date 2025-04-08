<template>
    <Navbar />

    <div class="bg-neutral-50 dark:bg-neutral-900 z-10 relative">
        <div class="container mx-auto px-4 py-8 z-10">
            <div class="flex">
                <main class="flex-1">
                    <router-view />
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Navbar from './navbar.vue';
</script>
