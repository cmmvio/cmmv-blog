<template>
    <div>
        <h1>Home</h1>

        <pre>{{ posts }}</pre>
    </div>
</template>

<script setup lang="ts">
import { useFetch } from '../composables/useFetch';
const { data: posts } = await useFetch("http://localhost:3001/api/posts", 'posts')
</script>