import { Module } from '@cmmv/core';

import { BlogConfig } from "./blog.config";
import { PostsModule } from './posts.module';
import { CategoriesModule } from './categories.modules';
import { CommentsModule } from './comments.module';
import { MembersModule } from './members.module';

export const BlogModule = new Module('blog', {
    configs: [BlogConfig],
    submodules: [
        PostsModule,
        CategoriesModule,
        CommentsModule,
        MembersModule
    ]
});
