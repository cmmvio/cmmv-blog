<template>
    <div class="w-full relative">
        <div class="w-full max-w-[1200px] mx-auto px-4 py-8">
            <div class="bg-white rounded-lg p-6">
                <h1 class="text-3xl font-bold text-gray-800 mb-8">Encontre cupons de desconto em nossas principais categorias</h1>

                <!-- Barra de Busca 
                <div class="mb-10 w-full max-w-2xl mx-auto">
                    <div class="relative">
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            @input="performSearch" 
                            placeholder="Buscar por categoria, produto ou serviço..." 
                            class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                -->
                <!-- Top 20 Categorias -->
                <div v-if="!isSearching && searchQuery.length < 2">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Top 20 Categorias</h2>
                    
                    <div v-if="loading" class="flex justify-center items-center py-10">
                        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
                    </div>

                    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
                        <a v-for="category in topCategories" :key="category.id" :href="`/categoria/${category.slug}`"
                            class="category-card bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-all">
                            <div class="text-center">
                                <div class="w-12 h-12 mx-auto mb-2 flex items-center justify-center text-purple-600">
                                    <i v-if="category.icon" :class="[category.icon, 'text-2xl']"></i>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <h3 class="text-sm font-medium text-gray-800">{{ category.name }}</h3>
                            </div>
                        </a>
                    </div>

                    <!-- Lojas mais populares -->
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Lojas mais populares</h2>
                    
                    <div v-if="loadingCampaigns" class="flex justify-center items-center py-10">
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
                                <p class="text-xs text-gray-500">{{ campaign.couponCount }} cupons</p>
                            </div>
                        </a>
                    </div>

                    <!-- Cupons de desconto por categorias -->
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Cupons de desconto por categorias</h2>
                    
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
                                v-for="category in getCategoriesByLetter(letter)" 
                                :key="category.id" 
                                :href="`/categoria/${category.slug}`"
                                class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition-colors">
                                <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center text-purple-600">
                                    <i v-if="category.icon" :class="[category.icon, 'text-xl']"></i>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <span class="text-sm">{{ category.name }}</span>
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
                        <p class="text-lg text-gray-600">Nenhuma categoria encontrada para sua busca.</p>
                        <p class="text-gray-500 mt-2">Tente buscar com outros termos ou navegue pelas categorias populares.</p>
                    </div>
                    
                    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <a v-for="result in searchResults" :key="result.id" :href="`/categoria/${result.slug}`"
                            class="category-card bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-all">
                            <div class="text-center">
                                <div class="w-12 h-12 mx-auto mb-2 flex items-center justify-center text-purple-600">
                                    <i v-if="result.icon" :class="[result.icon, 'text-2xl']"></i>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
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
const categories = ref<any[]>([]);
const campaigns = ref<any[]>(campaignsStore.getCampaigns || []);
const loading = ref(true);
const loadingCampaigns = ref(true);
const error = ref(null);
const isSSR = typeof window === 'undefined';

// Busca
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);

// Alfabeto para navegação
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

// Top 20 categorias (as mais relevantes)
const topCategories = computed(() => {
    if (!categories.value || categories.value.length === 0) return [];
    
    return categories.value.slice(0, 20);
});

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

// Agrupar categorias por letra inicial
const categoriesByLetter = computed(() => {
    const grouped: Record<string, any[]> = {};
    
    alphabet.forEach(letter => {
        grouped[letter] = [];
    });
    
    if (categories.value && categories.value.length > 0) {
        categories.value.forEach(category => {
            if (category.name) {
                const firstLetter = category.name.trim().charAt(0).toUpperCase();
                if (alphabet.includes(firstLetter)) {
                    grouped[firstLetter].push(category);
                }
            }
        });
    }
    
    return grouped;
});

// Letras que têm categorias
const filteredLetters = computed(() => {
    return alphabet.filter(letter => categoriesByLetter.value[letter].length > 0);
});

// Obter categorias por letra
const getCategoriesByLetter = (letter: string) => {
    return categoriesByLetter.value[letter] || [];
};

// SEO
const headData = computed(() => ({
    title: 'Cupons de Desconto por Categorias | ' + (settings.value?.['blog.title'] || 'Site de Cupons'),
    meta: [
        { name: 'description', content: 'Encontre cupons de desconto e ofertas por categorias. Economize em suas compras com nossos códigos promocionais organizados por tipo de produto ou serviço.' },
        { property: 'og:title', content: 'Cupons de Desconto por Categorias | ' + (settings.value?.['blog.title'] || 'Site de Cupons') },
        { property: 'og:description', content: 'Encontre cupons de desconto e ofertas por categorias. Economize em suas compras com nossos códigos promocionais organizados por tipo de produto ou serviço.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${settings.value?.['blog.url'] || 'https://cupomnahora.com.br'}/cupom` }
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
        
        // Filtragem de categorias
        const filtered = categories.value.filter(category => {
            if (!category || !category.name) return false;
            
            const catName = category.name.toLowerCase();
            const catSlug = category.slug ? category.slug.toLowerCase() : '';
            
            return catName.includes(query) || catSlug.includes(query);
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
        // Carregar categorias
        loading.value = true;
        error.value = null;
        const categoriesData = await affiliateAPI.categories.getAll();
        
        if (categoriesData && categoriesData.length > 0) {
            // Ordenar categorias por nome
            categories.value = categoriesData.sort((a, b) => {
                return a.name.localeCompare(b.name, 'pt-BR');
            });
        } else {
            categories.value = [];
        }
        loading.value = false;

        // Carregar campanhas se ainda não foram carregadas
        loadingCampaigns.value = true;
        if (!campaigns.value || campaigns.value.length === 0) {
            const campaignsData = await affiliateAPI.campaigns.getAllWithCouponCounts();
            
            if (campaignsData && campaignsData.length > 0) {
                campaigns.value = campaignsData;
                campaignsStore.setCampaigns(campaignsData);
            } else {
                campaigns.value = [];
            }
        }
        loadingCampaigns.value = false;
    } catch (err: any) {
        error.value = err;
        console.error("Erro ao carregar dados:", err);
        loading.value = false;
        loadingCampaigns.value = false;
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
.category-card:hover, .store-card:hover {
    transform: translateY(-2px);
}
</style> 