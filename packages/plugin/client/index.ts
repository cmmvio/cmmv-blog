import * as vue3Composable from './client.vue3';
import * as reactHooks from './client.react';
import * as angularService from './client.angular';
import * as vanillaJs from './client.vanilla';

export const vue3 = vue3Composable;
export const react = reactHooks;
export const angular = angularService;
export const vanilla = vanillaJs;

export default {
    vue3,
    react,
    angular,
    vanilla
}

export type {
    ICategory,
    ITag
} from './interfaces';

