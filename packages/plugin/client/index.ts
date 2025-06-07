import * as vue3Composable from './client.vue3';
import { useProfile } from './profile.client';
export const vue3 = vue3Composable;

export default {
    vue3
}

export type {
    ICategory,
    ITag,
    IUserProfile
} from './interfaces';

export { useProfile };

