import * as vue3Composable from './client.vue3';
import * as reactHooks from './client.react';
import * as angularService from './client.angular';

export const vue3 = vue3Composable;
export const react = reactHooks;
export const angular = angularService;

export default {
    vue3,
    react,
    angular
}

export type {
    ICategory
} from './interfaces';

