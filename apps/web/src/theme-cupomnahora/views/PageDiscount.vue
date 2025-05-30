<template>
    <div class="w-full relative">
        <div class="w-full max-w-[1200px] mx-auto px-4 py-8">
            <div class="bg-white rounded-lg p-6">
                <h1 class="text-3xl font-bold text-gray-800 mb-8">Encontre cupons de desconto em nossas principais lojas</h1>

                <!-- Lojas mais populares -->
                <div v-if="!isSearching && searchQuery.length < 2">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Lojas mais populares</h2>
                    
                    <div v-if="loading" class="flex justify-center items-center py-10">
                        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
                    </div>

                    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                        <a v-for="campaign in featuredCampaigns.slice(0, 18)" :key="campaign.id" :href="`/desconto/${campaign.slug}`"
                            class="store-card bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-all"
                            :class="{'border-indigo-200 bg-indigo-50': campaign.highlight}">
                            <div class="text-center">
                                <div class="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                                    <img v-if="campaign.logo" :src="campaign.logo" :alt="campaign.name" class="max-w-full max-h-full">
                                    <div v-else class="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 class="text-sm font-medium text-gray-800">{{ campaign.name }}</h3>
                            </div>
                        </a>
                    </div>

                    <!-- Listagem alfabética -->
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Nossas principais lojas, em ordem alfabética</h2>
                    
                    <div class="bg-purple-500 text-white py-3 px-4 rounded-md flex flex-wrap justify-center gap-2 mb-6">
                        <a 
                            v-for="letter in alphabet" 
                            :key="letter" 
                            href="#"
                            @click.prevent="scrollToLetter(letter)"
                            class="px-2 hover:bg-purple-600 rounded transition-colors">
                            {{ letter }}
                        </a>
                    </div>

                    <div v-for="letter in filteredLetters" :key="letter" :id="`letter-${letter}`" class="mb-10">
                        <h3 class="text-2xl font-bold text-purple-600 mb-4">{{ letter }}</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <a 
                                v-for="campaign in getCampaignsByLetter(letter)" 
                                :key="campaign.id" 
                                :href="`/desconto/${campaign.slug}`"
                                class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition-colors">
                                <span class="text-sm">{{ campaign.name }}</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Resultados da busca -->
                <div v-else-if="isSearching" class="flex justify-center items-center py-10">
                    <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
                </div>

                <div v-else-if="searchQuery.length >= 2">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Resultados da busca para "{{ searchQuery }}"</h2>
                    
                    <div v-if="searchResults.length === 0" class="text-center py-10">
                        <p class="text-lg text-gray-600">Nenhuma loja encontrada para sua busca.</p>
                        <p class="text-gray-500 mt-2">Tente buscar com outros termos ou navegue pelas lojas populares.</p>
                    </div>
                    
                    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <a v-for="result in searchResults" :key="result.id" :href="`/desconto/${result.slug}`"
                            class="store-card bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-all"
                            :class="{'border-indigo-200 bg-indigo-50': result.highlight}">
                            <div class="text-center">
                                <div class="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                                    <img v-if="result.logo" :src="result.logo" :alt="result.name" class="max-w-full max-h-full">
                                    <div v-else class="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 class="text-sm font-medium text-gray-800">{{ result.name }}</h3>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { vue3 } from '@cmmv/blog/client';
import { vue3 as affiliateVue3 } from '@cmmv/affiliate/client';
import { useSettingsStore } from '../../store/settings';
import { useCampaignsStore } from '../../store/campaigns';

const blogAPI = vue3.useBlog();
const affiliateAPI = affiliateVue3.useAffiliate();
const settingsStore = useSettingsStore();
const campaignsStore = useCampaignsStore();

const settings = ref<any>(settingsStore.getSettings);
const campaigns = ref<any[]>(campaignsStore.getCampaigns || []);
const loading = ref(true);
const error = ref(null);
const isSSR = typeof window === 'undefined';

// Busca
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);

// Alfabeto para navegação
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

// Agrupar campanhas por letra inicial
const campaignsByLetter = computed(() => {
    const grouped: Record<string, any[]> = {};
    
    alphabet.forEach(letter => {
        grouped[letter] = [];
    });
    
    if (campaigns.value && campaigns.value.length > 0) {
        campaigns.value.forEach(campaign => {
            if (campaign.name) {
                const firstLetter = campaign.name.trim().charAt(0).toUpperCase();
                if (alphabet.includes(firstLetter)) {
                    grouped[firstLetter].push(campaign);
                }
            }
        });
    }
    
    return grouped;
});

// Letras que têm campanhas
const filteredLetters = computed(() => {
    return alphabet.filter(letter => campaignsByLetter.value[letter].length > 0);
});

// Obter campanhas por letra
const getCampaignsByLetter = (letter: string) => {
    return campaignsByLetter.value[letter] || [];
};

// Sort campaigns to prioritize highlighted ones
const featuredCampaigns = computed(() => {
    if (!campaigns.value || campaigns.value.length === 0) return [];
    
    // Ordenar campanhas com highlight primeiro
    return [...campaigns.value]
        .filter(campaign => campaign.couponCount > 0)
        .sort((a, b) => {
            // Primeiro critério: highlighted vai primeiro
            if (a.highlight && !b.highlight) return -1;
            if (!a.highlight && b.highlight) return 1;
            
            // Segundo critério: mais cupons vai primeiro
            return (b.couponCount || 0) - (a.couponCount || 0);
        });
});

// SEO
const headData = computed(() => ({
    title: 'Cupons de Desconto das Melhores Lojas | ' + (settings.value?.['blog.title'] || 'Site de Cupons'),
    meta: [
        { name: 'description', content: 'Encontre cupons de desconto e ofertas das melhores lojas online. Economize em suas compras com nossos códigos promocionais.' },
        { property: 'og:title', content: 'Cupons de Desconto das Melhores Lojas | ' + (settings.value?.['blog.title'] || 'Site de Cupons') },
        { property: 'og:description', content: 'Encontre cupons de desconto e ofertas das melhores lojas online. Economize em suas compras com nossos códigos promocionais.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${settings.value?.['blog.url'] || 'https://cupomnahora.com.br'}/desconto` }
    ]
}));

useHead(headData);

// Função para buscar
const performSearch = () => {
    if (searchQuery.value.trim().length < 2) {
        searchResults.value = [];
        return;
    }

    isSearching.value = true;

    try {
        const query = searchQuery.value.toLowerCase().trim();
        
        // Filtragem de campanhas
        const filtered = campaigns.value.filter(campaign => {
            if (!campaign || !campaign.name) return false;
            
            const campName = campaign.name.toLowerCase();
            const campSlug = campaign.slug ? campaign.slug.toLowerCase() : '';
            const campDescription = campaign.description ? campaign.description.toLowerCase() : '';
            
            return campName.includes(query) || campSlug.includes(query) || campDescription.includes(query);
        });
        
        searchResults.value = filtered;
    } catch (error) {
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
};

// Função para navegar para uma letra
const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

const loadData = async () => {
    try {
        loading.value = true;
        error.value = null;

        // Carregar campanhas se ainda não foram carregadas
        if (!campaigns.value || campaigns.value.length === 0) {
            const campaignsData = await affiliateAPI.campaigns.getAllWithCouponCounts();
            
            if (campaignsData && campaignsData.length > 0) {
                campaigns.value = campaignsData;
                campaignsStore.setCampaigns(campaignsData);
            } else {
                campaigns.value = [];
            }
        }
    } catch (err: any) {
        error.value = err;
        console.error("Erro ao carregar campanhas:", err);
    } finally {
        loading.value = false;
    }
};

// Carregar dados ao montar o componente
onMounted(() => {
    loadData();
});

// Observar mudanças na consulta de pesquisa
watch(searchQuery, () => {
    if (searchQuery.value.trim().length >= 2) {
        performSearch();
    }
});
</script>

<style scoped>
.store-card:hover {
    transform: translateY(-2px);
}
</style> 