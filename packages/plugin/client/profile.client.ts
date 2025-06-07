import { useApi } from './client.vue3';
import { ref } from 'vue';

/**
 * Interface para o perfil do usuário
 */
export interface IUserProfile {
    id: string;
    name: string;
    slug: string;
    email: string;
    image: string;
    coverImage: string;
    bio: string;
    website: string;
    location: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
    locale: string;
    visibility: string;
    metaTitle: string;
    metaDescription: string;
    lastSeen: number;
    commentNotifications: boolean;
    mentionNotifications: boolean;
    recommendationNotifications: boolean;
}

/**
 * Hook para gerenciar o perfil do usuário
 * Inclui cache para evitar regeneração de imagens a cada acesso
 */
export const useProfile = () => {
    const profileData = ref<IUserProfile | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const api = useApi();
    
    // Cache para URLs de imagens para evitar regeneração constante
    const imageCache = new Map<string, string>();
    
    /**
     * Obtém o perfil do usuário atual
     * @returns Dados do perfil do usuário
     */
    const getProfile = async () => {
        try {
            isLoading.value = true;
            error.value = null;
            
            // Usando getAuth para obter o perfil autenticado
            const { data } = await api.getAuth('profile', 'current-profile');
            
            if (data.value) {
                // Se temos uma imagem e ela não está no cache, armazenamos
                if (data.value.profile && data.value.profile.image) {
                    imageCache.set('profile-image', data.value.profile.image);
                }
                
                // Se temos uma imagem de capa e ela não está no cache, armazenamos
                if (data.value.profile && data.value.profile.coverImage) {
                    imageCache.set('profile-cover-image', data.value.profile.coverImage);
                }
                
                profileData.value = data.value.profile;
            }
            
            return data.value;
        } catch (err: any) {
            error.value = err.message || 'Erro ao carregar perfil';
            console.error('Erro ao carregar perfil:', err);
            return null;
        } finally {
            isLoading.value = false;
        }
    };
    
    /**
     * Atualiza o perfil do usuário
     * @param profile Dados do perfil a serem atualizados
     * @returns Resultado da operação
     */
    const updateProfile = async (profile: Partial<IUserProfile>) => {
        try {
            isLoading.value = true;
            error.value = null;
            
            // Se estamos atualizando a imagem e já temos ela em cache, a reutilizamos
            if (profile.image && imageCache.has('profile-image') && profile.image === profileData.value?.image) {
                profile.image = imageCache.get('profile-image') || profile.image;
            }
            
            // Se estamos atualizando a imagem de capa e já temos ela em cache, a reutilizamos
            if (profile.coverImage && imageCache.has('profile-cover-image') && profile.coverImage === profileData.value?.coverImage) {
                profile.coverImage = imageCache.get('profile-cover-image') || profile.coverImage;
            }
            
            const result = await api.put('profile', profile);
            
            // Após atualizar, atualizamos o cache com as novas imagens
            if (result && profile.image) {
                imageCache.set('profile-image', profile.image);
            }
            
            if (result && profile.coverImage) {
                imageCache.set('profile-cover-image', profile.coverImage);
            }
            
            return result;
        } catch (err: any) {
            error.value = err.message || 'Erro ao atualizar perfil';
            console.error('Erro ao atualizar perfil:', err);
            return null;
        } finally {
            isLoading.value = false;
        }
    };
    
    return {
        profileData,
        isLoading,
        error,
        getProfile,
        updateProfile
    };
}; 