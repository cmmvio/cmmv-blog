<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" :class="visible ? 'opacity-100' : 'opacity-0 pointer-events-none'">
        <div class="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md relative transform transition-all duration-300 ease-in-out" :class="visible ? 'scale-100' : 'scale-95'">
            <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors z-30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div v-if="coupon" class="text-center">
                <div class="w-24 h-24 mx-auto mb-4 flex items-center justify-center border border-gray-200 rounded-md p-2">
                    <img v-if="coupon.campaignLogo" :src="coupon.campaignLogo" :alt="coupon.campaignName" class="max-w-full max-h-full object-contain">
                    <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center rounded-sm text-gray-400 text-sm">Sem logo</div>
                </div>
                <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ coupon.campaignName }}</h2>
                <p class="text-lg font-bold text-indigo-600 mb-4">{{ coupon.title }}</p>

                <div v-if="coupon.code" class="bg-yellow-300 p-4 rounded-md mb-4">
                    <p class="text-2xl font-bold text-gray-800 tracking-widest">{{ coupon.code }}</p>
                </div>
                <p v-else class="text-gray-600 mb-4">Este cupom não possui código.</p>

                <button 
                    v-if="coupon.code"
                    @click="copyCode"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                    {{ copyButtonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    visible: Boolean,
    coupon: Object as () => any | null
});

const emit = defineEmits(['close']);
const copyButtonText = ref('Copiar Código');

const closeModal = () => {
    emit('close');
};

const copyCode = async () => {
    if (!props.coupon || !props.coupon.code) return;
    try {
        await navigator.clipboard.writeText(props.coupon.code);
        copyButtonText.value = 'Copiado!';
        setTimeout(() => {
            copyButtonText.value = 'Copiar Código';
        }, 2000);
    } catch (err) {
        copyButtonText.value = 'Falhou!';
        setTimeout(() => {
            copyButtonText.value = 'Copiar Código';
        }, 2000);
    }
};
</script>

<style scoped>
/* Estilos gerais para o modal */
</style> 