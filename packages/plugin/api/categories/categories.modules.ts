import { Module } from '@cmmv/core';

import { CategoriesContract } from '../../contracts';
import { CategoriesPublicController } from './categories.controller';
import { CategoriesPublicService } from "./categories.service";

export const CategoriesModule = new Module('blog_categories', {
    contracts: [CategoriesContract],
    controllers: [CategoriesPublicController],
    providers: [CategoriesPublicService]
});
