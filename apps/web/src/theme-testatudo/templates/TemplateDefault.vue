<template>
    <div class="flex flex-col min-h-screen bg-gray-100">
        <!-- Header -->
        <header class="bg-[#000] text-white sticky top-0 z-50 shadow-md w-full">

            <div class="mx-auto">
                <div class="max-w-[1200px] mx-auto px-4">
                    <div class="top-header flex justify-between items-center py-4">
                        <div class="logo flex items-center">
                            <a href="/" class="text-2xl font-bold text-white">
                                <img src="/TT_VER BRANCO.png" alt="TestaTudo Logo" class="h-auto w-56 max-h-12">
                            </a>
                        </div>
                        <!-- Desktop buttons -->
                        <div class="hidden md:flex items-center space-x-4">
                            <button @click="openSearchModal" class="search-icon bg-transparent text-white border-none text-xl cursor-pointer p-2 hover:text-[#ff0030] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <a href="#" class="text-gray-300 text-sm hover:text-[#ff0030] transition-colors">Entrar</a>
                            <a href="#" class="text-gray-300 text-sm hover:text-[#ff0030] transition-colors">Cadastrar</a>
                        </div>
                        
                        <!-- Mobile Menu Button -->
                        <div class="md:hidden flex items-center space-x-3">
                            <button @click="openSearchModal" class="text-white hover:text-[#ff0030] transition-colors" title="Search" aria-label="Search">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-white hover:text-[#ff0030] transition-colors" title="Menu" aria-label="Menu">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <nav class="main-nav bg-[#111] py-3 relative">
                <div class="max-w-[1200px] mx-auto px-4">
                    <div class="mx-auto">
                        <div class="nav-container flex justify-between items-center relative">
                            <!-- Desktop Navigation -->
                            <nav class="hidden md:flex items-center space-x-1">
                                <a href="/" class="text-white px-4 py-2 mr-1 font-medium text-sm md:text-base rounded hover:bg-[#ff0030] bg-[#ff0030] transition-colors whitespace-nowrap">Home</a>
                                <template v-for="category in mainNavCategories.rootCategories" :key="category.id">
                                    <div v-if="mainNavCategories.childrenMap[category.id]" class="relative">
                                        <button
                                            @click="(e) => toggleDropdown(category.id, e)"
                                            class="dropdown-toggle text-white hover:bg-[#2b2b2b] hover:text-[#ff0030] px-4 py-2 mr-1 rounded text-sm md:text-base flex items-center whitespace-nowrap transition-colors"
                                            :class="{'bg-[#2b2b2b] text-[#ff0030]': openDropdowns[category.id]}"
                                        >
                                            {{ category.name }}
                                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                        <div
                                            v-show="openDropdowns[category.id]"
                                            class="dropdown-menu absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-[#1a1a1a] ring-1 ring-black ring-opacity-5 z-10"
                                        >
                                            <a v-for="child in mainNavCategories.childrenMap[category.id]" :key="child.id"
                                                :href="`/category/${child.slug}`"
                                                class="block text-white hover:bg-[#2b2b2b] hover:text-[#ff0030] px-3 py-2 text-sm transition-colors"
                                            >
                                                {{ child.name }}
                                            </a>
                                        </div>
                                    </div>
                                    <a v-else
                                        :href="`/category/${category.slug}`"
                                        class="text-white hover:bg-[#2b2b2b] hover:text-[#ff0030] px-4 py-2 mr-1 rounded text-sm md:text-base whitespace-nowrap transition-colors"
                                    >
                                        {{ category.name }}
                                    </a>
                                </template>
                            </nav>

                            <!-- Ícones de redes sociais -->
                            <div class="hidden md:flex items-center space-x-4">
                                <a v-if="settings['blog.facebook']" :href="`https://facebook.com/${settings['blog.facebook']}`" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#ff0030] transition-colors text-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a v-if="settings['blog.twitter']" :href="`https://twitter.com/${settings['blog.twitter']}`" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#ff0030] transition-colors text-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a v-if="settings['blog.instagram']" :href="`https://instagram.com/${settings['blog.instagram']}`" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#ff0030] transition-colors text-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                    </svg>
                                </a>
                                <a v-if="settings['blog.youtube']" :href="`https://youtube.com/${settings['blog.youtube']}`" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#ff0030] transition-colors text-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                    </svg>
                                </a>
                            </div>

                            <!-- Indicador de rolagem em dispositivos móveis -->
                            <div class="absolute right-0 bottom-0 w-8 h-full bg-gradient-to-r from-transparent to-[#111] pointer-events-none md:hidden"></div>
                        </div>

                        <!-- Mobile Menu (expandable) -->
                        <div v-show="mobileMenuOpen" class="md:hidden py-3 border-t border-[#2b2b2b]">
                            <div class="flex flex-col gap-1">
                                <a 
                                    href="/" 
                                    class="block text-white hover:bg-[#2b2b2b] hover:text-[#ff0030] rounded px-3 py-2 text-sm font-medium"
                                    @click="mobileMenuOpen = false"
                                >
                                    Home
                                </a>
                                <template v-for="category in mainNavCategories.rootCategories" :key="category.id">
                                    <div v-if="mainNavCategories.childrenMap[category.id]" class="w-full">
                                        <button
                                            @click="(e) => toggleDropdown(category.id, e)"
                                            class="dropdown-toggle flex items-center justify-between w-full text-white hover:bg-[#2b2b2b] hover:text-[#ff0030] rounded px-3 py-2 text-sm"
                                            :class="{'bg-[#2b2b2b] text-[#ff0030]': openDropdowns[category.id]}"
                                        >
                                            {{ category.name }}
                                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                        <div v-show="openDropdowns[category.id]" class="pl-4 py-1 bg-[#2b2b2b] rounded mt-1">
                                            <a
                                                v-for="child in mainNavCategories.childrenMap[category.id]"
                                                :key="child.id"
                                                :href="`/category/${child.slug}`"
                                                class="block px-4 py-2 text-sm text-white hover:bg-[#111] hover:text-[#ff0030] rounded"
                                            >
                                                {{ child.name }}
                                            </a>
                                        </div>
                                    </div>
                                    <a
                                        v-else
                                        :href="`/category/${category.slug}`"
                                        class="block text-white hover:bg-[#2b2b2b] hover:text-[#ff0030] rounded px-3 py-2 text-sm"
                                        @click="mobileMenuOpen = false"
                                    >
                                        {{ category.name }}
                                    </a>
                                </template>
                            </div>
                        </div>

                        <!-- Redes sociais em dispositivos móveis -->
                        <div class="flex justify-center mt-3 md:hidden">
                            <div class="flex items-center space-x-6">
                                <a v-if="settings['blog.facebook']" :href="`https://facebook.com/${settings['blog.facebook']}`" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#ff0030] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a v-if="settings['blog.twitter']" :href="`https://twitter.com/${settings['blog.twitter']}`" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#ff0030] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a v-if="settings['blog.instagram']" :href="`https://instagram.com/${settings['blog.instagram']}`" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#ff0030] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                    </svg>
                                </a>
                                <a v-if="settings['blog.youtube']" :href="`https://youtube.com/${settings['blog.youtube']}`" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#ff0030] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <!-- Main Content -->
        <main class="flex-grow py-6 bg-[#f5f5f5]">
            <div class="container mx-auto">
                <router-view />
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-[#000] text-gray-300 py-10">
            <div class="container mx-auto">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 class="text-lg font-semibold text-white border-b-2 border-[#ff0030] pb-2 mb-4 inline-block">Sobre</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Quem Somos</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Nossa Equipe</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Trabalhe Conosco</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Contato</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white border-b-2 border-[#ff0030] pb-2 mb-4 inline-block">Categorias</h3>
                        <ul class="space-y-2">
                            <li v-for="category in footerRootCategories" :key="category.id">
                                <a :href="`/category/${category.slug}`" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">
                                    {{ category.name }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white border-b-2 border-[#ff0030] pb-2 mb-4 inline-block">Serviços</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Newsletter</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Podcasts</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Comparativos</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Reviews</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white border-b-2 border-[#ff0030] pb-2 mb-4 inline-block">Legal</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Termos de Uso</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Política de Privacidade</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Cookies</a></li>
                            <li><a href="#" class="text-gray-400 hover:text-[#ff0030] transition-colors text-sm">Direitos Autorais</a></li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-col items-center pt-6 border-t border-gray-800 text-sm text-gray-500">
                    <p>&copy; {{ new Date().getFullYear() }} TestaTudo. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>

        <!-- Search Modal -->
        <div v-if="searchModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="search-modal" role="dialog" aria-modal="true">
            <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" @click="closeSearchModal" style="backdrop-filter: blur(4px);"></div>

                <!-- Modal panel -->
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10">
                    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="w-full">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Pesquisar
                                    </h3>
                                    <button @click="closeSearchModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div class="mb-4 relative">
                                    <div class="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none">
                                        <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="search"
                                        v-model="searchQuery"
                                        @input="debouncedSearch"
                                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-[#ff0030] focus:border-[#ff0030]"
                                        placeholder="Pesquisar posts..."
                                        autocomplete="off"
                                        ref="searchInput"
                                    />
                                </div>

                                <div class="mt-4 max-h-[70vh] overflow-y-auto">
                                    <div v-if="isSearching" class="flex justify-center items-center py-8">
                                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff0030]"></div>
                                    </div>

                                    <div v-else-if="searchResults.length === 0 && searchQuery.length > 1" class="py-8 text-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>Nenhum resultado encontrado para "{{ searchQuery }}"</p>
                                    </div>

                                    <div v-else-if="searchQuery.length > 1" class="space-y-4">
                                        <p v-if="searchResults.length > 0" class="text-sm text-gray-500 mb-2">
                                            {{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }} encontrado{{ searchResults.length !== 1 ? 's' : '' }}
                                        </p>
                                        <a
                                            v-for="post in searchResults"
                                            :key="post.id"
                                            :href="`/post/${post.slug}`"
                                            class="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div class="flex flex-col sm:flex-row">
                                                <div class="p-4 flex-grow">
                                                    <h4 class="font-bold text-gray-900 mb-1">{{ post.title }}</h4>
                                                    <p v-if="post.excerpt" class="text-sm text-gray-600 line-clamp-2">
                                                        {{ post.excerpt }}
                                                    </p>
                                                    <div class="mt-2 text-xs text-gray-500 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {{ formatDate(post.publishedAt || post.updatedAt) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <CookieConsent />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { vue3 } from '@cmmv/blog/client';
import { useHead } from '@unhead/vue'
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';
import CookieConsent from '../../components/CookieConsent.vue';

const blogAPI = vue3.useBlog();
const categoriesStore = useCategoriesStore();
const settingsStore = useSettingsStore();

const settings = ref<any>(settingsStore.getSettings);

const scripts = computed(() => {
    const baseScripts = [];
    return [...baseScripts, ...settingsStore.googleAnalyticsScripts];
});

useHead({
    meta: computed(() => settingsStore.allMetaTags),

    link: [
        {
            rel: 'stylesheet',
            href: '/src/theme-testatudo/style.css'
        },
        {
            rel: 'icon',
            type: 'image/ico',
            href: '/src/theme-testatudo/favicon.ico?v=3'
        },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com/' },
        { rel: 'preconnect', href: 'https://www.google-analytics.com/' },
        { rel: 'preconnect', href: 'https://www.googletag.com/' },
        { rel: 'preconnect', href: 'https://connect.facebook.net/' },
        { rel: 'preconnect', href: 'https://securepubads.g.doubleclick.net/' },
        { rel: 'preconnect', href: 'https://tpc.googlesyndication.com/' },
        { rel: 'preconnect', href: 'https://www.googletag.com/' },
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com/' },
        { rel: 'dns-prefetch', href: 'https://securepubads.g.doubleclick.net' }
    ],

    script: scripts
})

const isDarkMode = ref(false);
const popularPosts = ref<any[]>([]);
const loadingPopularPosts = ref(true);

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    applyTheme();
};

const applyTheme = () => {
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const searchModalOpen = ref(false);
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const searchTimeout = ref<any>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const mobileMenuOpen = ref(false);

const categories = ref<any[]>(categoriesStore.getCategories || []);

const footerCategories = computed(() => {
    return categories.value.slice(0, 6);
});

const mainNavCategories = computed(() => {
    const navCategories = categories.value?.filter((category: any) => category.mainNav) || [];
    navCategories.sort((a: any, b: any) => (a.mainNavIndex ?? 999) - (b.mainNavIndex ?? 999));

    const rootCategories = navCategories.filter((cat: any) => !cat.parentCategory);
    const childCategories = navCategories.filter((cat: any) => cat.parentCategory);

    return {
        rootCategories,
        childrenMap: childCategories.reduce((map: Record<string, any[]>, child: any) => {
            if (!map[child.parentCategory]) {
                map[child.parentCategory] = [];
            }
            map[child.parentCategory].push(child);
            return map;
        }, {} as Record<string, any[]>),
    };
});

const openDropdowns = ref<Record<string, boolean>>({});

const toggleDropdown = (categoryId: string, event: Event) => {
    event.stopPropagation();
    if (openDropdowns.value[categoryId]) {
        openDropdowns.value = {
            ...openDropdowns.value,
            [categoryId]: false
        };
    } else {
        const newDropdownState: Record<string, boolean> = {};
        Object.keys(openDropdowns.value).forEach(key => {
            newDropdownState[key] = false;
        });
        newDropdownState[categoryId] = true;
        openDropdowns.value = newDropdownState;
    }
};

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

const openSearchModal = () => {
    searchModalOpen.value = true;
    setTimeout(() => {
        searchInput.value?.focus();
    }, 100);
};

const closeSearchModal = () => {
    searchModalOpen.value = false;
    searchQuery.value = '';
    searchResults.value = [];
};

const debouncedSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }

    searchTimeout.value = setTimeout(() => {
        performSearch();
    }, 300);
};

const performSearch = async () => {
    if (searchQuery.value.trim().length < 2) {
        searchResults.value = [];
        return;
    }

    isSearching.value = true;

    try {
        const response = await blogAPI.posts.search(searchQuery.value);

        if (Array.isArray(response)) {
            searchResults.value = response;
        } else if (response && typeof response === 'object') {
            const typedResponse = response as { posts?: any[] };
            searchResults.value = Array.isArray(typedResponse.posts) ? typedResponse.posts : [];
        } else {
            searchResults.value = [];
        }
    } catch (error) {
        console.error('Search error:', error);
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

const categoriesColumns = computed(() => {
    const allCategories = categories.value;
    const columnSize = Math.ceil(allCategories.length / 3);

    return [
        allCategories.slice(0, columnSize),
        allCategories.slice(columnSize, columnSize * 2),
        allCategories.slice(columnSize * 2)
    ];
});

const footerRootCategories = computed(() => {
    return categories.value.filter((category) => !category.parentCategory);
});

onMounted(async () => {
    await Promise.all([
        (async () => {
            if (!categories.value.length) {
                try {
                    const categoriesResponse = await blogAPI.categories.getAll();
                    if (categoriesResponse) {
                        categories.value = categoriesResponse;
                    }
                } catch (err) {
                    console.error('Failed to load categories:', err);
                }
            }
        })()
    ]);

    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    document.addEventListener('click', closeDropdownsOnClickOutside);
    
    // Close mobile menu on window resize (if screen becomes larger)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenuOpen.value) {
            mobileMenuOpen.value = false;
        }
    });
});

onBeforeUnmount(() => {
    document.removeEventListener('click', closeDropdownsOnClickOutside);
    window.removeEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenuOpen.value) {
            mobileMenuOpen.value = false;
        }
    });
});

const closeDropdownsOnClickOutside = (event: Event) => {
    const dropdownElements = document.querySelectorAll('.dropdown-menu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    let clickedInsideDropdown = false;

    dropdownElements.forEach(el => {
        if (el.contains(event.target as Node)) {
            clickedInsideDropdown = true;
        }
    });

    dropdownToggles.forEach(el => {
        if (el.contains(event.target as Node)) {
            clickedInsideDropdown = true;
        }
    });

    if (!clickedInsideDropdown) {
        openDropdowns.value = {};
    }
};

watch(isDarkMode, () => {
    applyTheme();
});
</script>
