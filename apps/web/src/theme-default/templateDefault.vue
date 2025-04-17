<template>
    <Navbar v-cloak />

    <div class="bg-neutral-50 dark:bg-neutral-900 z-10 relative">
        <div class="mx-auto z-10">
            <div class="flex">
                <router-view />
            </div>
        </div>
    </div>

    <!-- Banner de consentimento de cookies -->
    <CookieConsent />
</template>

<script setup lang="ts">
import Navbar from './navbar.vue'
import CookieConsent from '../components/CookieConsent.vue'
</script>
