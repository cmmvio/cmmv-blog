<template>
    <div class="w-full relative">
        <div class="w-full max-w-[1200px] mx-auto px-4 py-8">
            <div v-if="loading" class="flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
                <span class="ml-3 text-gray-500">Carregando cupons...</span>
            </div>

            <div v-else-if="error" class="text-center py-10 bg-white rounded-lg p-6">
                <p class="text-lg text-red-500">{{ error }}</p>
                <p class="text-gray-500 mt-2">Não foi possível carregar os cupons. Tente novamente mais tarde.</p>
            </div>

            <div v-else-if="!campaign" class="text-center py-10 bg-white rounded-lg p-6">
                <p class="text-lg text-gray-600">Campanha não encontrada</p>
                <p class="text-gray-500 mt-2">A loja ou campanha que você está procurando não existe.</p>
                <a href="/desconto" class="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
                    Ver todas as lojas
                </a>
            </div>

            <div v-else class="bg-white rounded-lg p-6">
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                    <div class="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        <img v-if="campaign.logo" :src="campaign.logo" :alt="campaign.name" class="w-full h-full object-cover">
                        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex flex-col text-center md:text-left">
                            <h1 class="text-3xl font-bold text-gray-800 mb-2">Cupons de desconto {{ campaign.name }}</h1>
                            <p class="text-gray-500 mb-2">Atualizado em {{ formatDate(new Date()) }}</p>
                            <p class="text-gray-700">Encontramos {{ coupons.length }} cupons de desconto para {{ campaign.name }} →</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-sm font-medium">Termina em: 02:03:31</span>
                    </div>
                </div>

                <!-- Filtro -->
                <div class="border-t border-b border-gray-200 py-4 mb-8">
                    <div class="flex flex-wrap gap-2">
                        <div class="text-gray-700 font-medium mr-2 flex items-center">Filtrar por:</div>
                        <button 
                            @click="setFilter('all')" 
                            class="px-3 py-1.5 rounded-md text-sm font-medium"
                            :class="activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                        >
                            Todos ({{ coupons.length }})
                        </button>
                        <button 
                            @click="setFilter('codes')" 
                            :disabled="codesCount === 0"
                            class="px-3 py-1.5 rounded-md text-sm font-medium"
                            :class="[
                                activeFilter === 'codes' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                codesCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            ]"
                        >
                            Códigos ({{ codesCount }})
                        </button>
                        <button 
                            @click="setFilter('offers')" 
                            :disabled="offersCount === 0"
                            class="px-3 py-1.5 rounded-md text-sm font-medium"
                            :class="[
                                activeFilter === 'offers' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                offersCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            ]"
                        >
                            Ofertas ({{ offersCount }})
                        </button>
                        <button 
                            @click="setFilter('expired')" 
                            :disabled="expiredCount === 0"
                            class="px-3 py-1.5 rounded-md text-sm font-medium"
                            :class="[
                                activeFilter === 'expired' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                expiredCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            ]"
                        >
                            Expirados ({{ expiredCount }})
                        </button>
                    </div>
                </div>

                <!-- Lista de Cupons -->
                <div v-if="filteredCoupons.length === 0" class="text-center py-10">
                    <p class="text-lg text-gray-600">Nenhum cupom encontrado para este filtro.</p>
                    <p class="text-gray-500 mt-2">Tente outro filtro ou volte mais tarde.</p>
                </div>
                
                <div v-else class="space-y-6">
                    <div v-for="coupon in filteredCoupons" :key="coupon.id" 
                        class="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow duration-300 bg-white relative"
                        :class="{'expired-coupon': new Date(coupon.expiration) < new Date()}">
                        
                        <!-- Etiqueta de desconto ou etiqueta de expirado -->
                        <div v-if="new Date(coupon.expiration) < new Date()" 
                            class="absolute top-0 left-0 bg-gray-500 text-white px-4 py-2 rounded-tr-lg rounded-bl-lg font-bold">
                            Expirado
                        </div>
                        <div v-else
                            class="absolute top-0 left-0 bg-indigo-600 text-white px-4 py-2 rounded-tr-lg rounded-bl-lg font-bold">
                            <template v-if="isCurrencyDiscount(coupon.title)">
                                {{ extractDiscountValue(coupon.title) + ' OFF' }}
                            </template>
                            <template v-else-if="extractDiscountPercentage(coupon.title)">
                                {{ extractDiscountPercentage(coupon.title) }} OFF
                            </template>
                            <template v-else>
                                Produto
                            </template>
                        </div>
                        
                        <div class="mt-6 md:ml-6">
                            <div class="flex flex-col md:flex-row">
                                <div class="flex-grow md:pr-6">
                                    <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-2">{{ coupon.title }}</h3>
                                    
                                    <!-- Cashback info -->
                                    <div v-if="coupon.cashbackPercentage" class="text-sm text-indigo-600 font-medium mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        + {{ coupon.cashbackPercentage }}% de cashback 
                                        <span v-if="coupon.oldCashbackPercentage" class="text-gray-500 line-through ml-1">(era {{coupon.oldCashbackPercentage}}%)</span>
                                    </div>
                                    
                                    <p class="text-gray-600 text-sm mb-3">{{ coupon.description }}</p>
                                    
                                    <!-- Validade e verificação -->
                                    <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mb-4">
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Verificado hoje</span>
                                        </div>
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span v-if="new Date(coupon.expiration) < new Date()" class="text-red-500 font-medium">Expirado em {{ formatDate(coupon.expiration) }}</span>
                                            <span v-else>Válido até {{ formatDate(coupon.expiration) }}</span>
                                        </div>
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>{{ 100 + Math.floor(Math.random() * 500) }} usados hoje</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="md:w-48 flex-shrink-0 flex justify-center mt-4 md:mt-0">
                                    <button v-if="coupon.code"
                                        @click="openCouponModal(coupon)"
                                        class="w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center flex flex-col items-center"
                                        :class="[new Date(coupon.expiration) < new Date() ? 
                                            'bg-gray-700 hover:bg-gray-800 text-white' : 
                                            'bg-indigo-600 hover:bg-indigo-700 text-white']">
                                        <span class="block mb-1">VER CUPOM</span>
                                        <span class="text-xs">···{{ coupon.code.slice(-3) }}</span>
                                    </button>
                                    <a v-else
                                        :href="coupon.link || coupon.linkRef || '#'"
                                        target="_blank"
                                        class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center">
                                        VER OFERTA
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <CouponScratchModal 
        :visible="isScratchModalOpen" 
        :coupon="selectedCouponForScratch"
        @close="closeCouponModal" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';
import { vue3 } from '@cmmv/blog/client';
import { vue3 as affiliateVue3 } from '@cmmv/affiliate/client';
import { useSettingsStore } from '../../store/settings';
import CouponScratchModal from '../components/CouponScratchModal.vue';

const route = useRoute();
const blogAPI = vue3.useBlog();
const affiliateAPI = affiliateVue3.useAffiliate();
const settingsStore = useSettingsStore();

const settings = ref<any>(settingsStore.getSettings);
const campaign = ref<any>(null);
const coupons = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Estado para filtros
const activeFilter = ref('all'); // 'all', 'codes', 'offers', 'expired'

// Estado para modal de cupom (usaremos o CouponScratchModal)
const isScratchModalOpen = ref(false); // Novo estado para o CouponScratchModal
const selectedCouponForScratch = ref<any | null>(null); // Novo estado

// Contadores para os filtros
const codesCount = computed(() => coupons.value.filter(coupon => coupon.code).length);
const offersCount = computed(() => coupons.value.filter(coupon => !coupon.code).length);
const expiredCount = computed(() => coupons.value.filter(coupon => new Date(coupon.expiration) < new Date()).length);

// Filtrar cupons baseado no filtro ativo
const filteredCoupons = computed(() => {
    if (activeFilter.value === 'all') return coupons.value;
    if (activeFilter.value === 'codes') return coupons.value.filter(coupon => coupon.code);
    if (activeFilter.value === 'offers') return coupons.value.filter(coupon => !coupon.code);
    if (activeFilter.value === 'expired') return coupons.value.filter(coupon => new Date(coupon.expiration) < new Date());
    return coupons.value;
});

// SEO
const headData = computed(() => ({
    title: `Cupons de Desconto ${campaign.value?.name || ''} | ${settings.value?.['blog.title'] || 'Site de Cupons'}`,
    meta: [
        { 
            name: 'description', 
            content: `Economize com ${coupons.value.length} cupons de desconto ${campaign.value?.name || ''} válidos. Códigos verificados e funcionando.` 
        },
        { 
            property: 'og:title', 
            content: `Cupons de Desconto ${campaign.value?.name || ''} | ${settings.value?.['blog.title'] || 'Site de Cupons'}` 
        },
        { 
            property: 'og:description', 
            content: `Economize com ${coupons.value.length} cupons de desconto ${campaign.value?.name || ''} válidos. Códigos verificados e funcionando.` 
        },
        { property: 'og:type', content: 'website' },
        { 
            property: 'og:url', 
            content: `${settings.value?.['blog.url'] || 'https://cupomnahora.com.br'}/desconto/${route.params.slug}` 
        }
    ]
}));

useHead(headData);

// Carregar dados da campanha e cupons
const loadData = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        // Pegar o slug da rota
        const slug = route.params.slug;
        
        if (!slug) {
            error.value = 'Loja não encontrada';
            loading.value = false;
            return;
        }
        
        // Carregar todas as campanhas
        const campaignsData = await affiliateAPI.campaigns.getAllWithCouponCounts();
        
        if (!campaignsData || campaignsData.length === 0) {
            error.value = 'Não foi possível carregar as lojas';
            loading.value = false;
            return;
        }
        
        // Encontrar a campanha pelo slug
        const foundCampaign = campaignsData.find((c: any) => c.slug === slug);
        
        if (!foundCampaign) {
            error.value = 'Loja não encontrada';
            loading.value = false;
            return;
        }
        
        campaign.value = foundCampaign;
        
        // Carregar cupons reais da API
        try {
            const realCoupons = await affiliateAPI.coupons.getByCampaignId(campaign.value.id);
            if (realCoupons && realCoupons.length > 0) {
                //console.log("Cupons reais carregados:", realCoupons.length);
                coupons.value = realCoupons;
            }
        } catch (couponError) {
            console.error("Erro ao carregar cupons reais:", couponError);
        }
        
        loading.value = false;
    } catch (err: any) {
        console.error('Erro ao carregar campanha:', err);
        error.value = err.message || 'Erro ao carregar a loja e seus cupons';
        loading.value = false;
    }
};

// Formatar data para exibição
const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Alterar filtro ativo
const setFilter = (filter: string) => {
    activeFilter.value = filter;
};

const openCouponModal = (coupon: any) => {
    // Atribuir dados ao cupom selecionado para o modal, incluindo infos da campanha
    selectedCouponForScratch.value = {
        ...coupon, 
        campaignName: campaign.value?.name,
        campaignLogo: campaign.value?.logo
    };
    isScratchModalOpen.value = true; // Mostrar o modal

    // Abrir o deeplink em uma nova aba e tentar manter o foco (lógica de PageHome.vue)
    if (coupon && coupon.deeplink) {
        // Atrasar a abertura para garantir que o modal esteja visível e melhorar a chance de foco
        setTimeout(() => {
            const activeElement = document.activeElement as HTMLElement; // Guardar elemento com foco
            
            const newWindow = window.open(coupon.deeplink, '_blank'); // Abrir deeplink
            
            window.focus(); // Retornar foco para a janela atual
            
            // Tentar restaurar o foco para o elemento que estava ativo antes da abertura da nova aba
            if (activeElement && typeof activeElement.focus === 'function') {
                try {
                    activeElement.focus();
                } catch (e) {
                    console.error('[PageCampaignDetail] Erro ao tentar restaurar foco para activeElement:', e);
                }
            }
            
            // Fallback para focar no body se o elemento ativo não puder ser focado
            setTimeout(() => {
                window.focus();
                document.body.focus();
            }, 100); // Pequeno atraso para garantir que o foco seja aplicado

        }, 200); // Atraso de 200ms como em PageHome.vue
    } else {
        // Opcional: Logar apenas se houver uma falha inesperada de dados, mas não para cada caso sem deeplink
        // if (!coupon || !coupon.deeplink) {
        //     console.warn('[PageCampaignDetail] Tentativa de abrir deeplink falhou: dados do cupom incompletos.', coupon);
        // }
    }
};

const closeCouponModal = () => {
    isScratchModalOpen.value = false;        // Fechar o CouponScratchModal
    selectedCouponForScratch.value = null;
};

// Função para extrair percentual de desconto do título
const extractDiscountPercentage = (title: string) => {
    if (!title) return null;
    
    // Procura por padrões como "10%" ou "10 %" ou "10 por cento" ou "10 porcento"
    const percentRegex = /(\d+)(\s*)(%|\spor\scento|\sporcento)/i;
    const match = title.match(percentRegex);
    
    if (match && match[1]) {
        return match[1] + '%';
    }
    
    // Procura por padrões como "10 de desconto" ou "desconto de 10"
    const discountRegex = /(\d+)(\s*)(de\sdesconto|desconto)/i;
    const discountMatch = title.match(discountRegex);
    
    if (discountMatch && discountMatch[1]) {
        return discountMatch[1] + '%';
    }
    
    return null;
};

// Função para verificar se o desconto é em valor monetário
const isCurrencyDiscount = (title: string) => {
    if (!title) return false;
    
    // Procura por padrões como "R$49,99" ou "R$ 49,99"
    const currencyRegex = /R\$\s*\d+[\.,]?\d*/i;
    return currencyRegex.test(title);
};

// Função para extrair valor monetário do título
const extractDiscountValue = (title: string) => {
    if (!title) return 'Oferta';
    
    // Procura por padrões como "R$49,99" ou "R$ 49,99"
    const currencyRegex = /(R\$\s*\d+[\.,]?\d*)/i;
    const match = title.match(currencyRegex);
    
    if (match && match[1]) {
        return match[1];
    }
    
    return 'Oferta';
};

// Carregar dados quando a página é montada ou o slug muda
onMounted(() => {
    loadData();
});

watch(() => route.params.slug, (newSlug, oldSlug) => {
    if (newSlug !== oldSlug) {
        loadData();
    }
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
.expired-coupon {
    background-color: #f8f8f8;
    opacity: 0.8;
    border-color: #ddd;
}

.expired-coupon h3,
.expired-coupon p {
    color: #999;
}

.expired-coupon button,
.expired-coupon a {
    opacity: 0.7;
}
</style> 