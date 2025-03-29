import { Module } from '@cmmv/core';

import { CategoriesContract } from '../contracts';

export const CategoriesModule = new Module('blog_categories', {
    contracts: [
        CategoriesContract
    ],
});
