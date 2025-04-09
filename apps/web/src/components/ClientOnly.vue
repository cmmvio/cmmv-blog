<template>
    <slot v-if="isClient"></slot>
    <template v-else>
        <!--vue-ssr-slot-content--><slot></slot><!--/vue-ssr-slot-content-->
    </template>
</template>

<script>
export default {
    name: 'ClientOnly',
    data() {
        return {
            isClient: false
        }
    },
    mounted() {
        this.isClient = true
    }
}
</script>