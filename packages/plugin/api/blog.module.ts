import { Module } from '@cmmv/core';

import { BlogConfig } from "./blog.config";
import { AuthorsModule } from './authors.module';
import { PostsModule } from './posts.module';
import { CategoriesModule } from './categories.modules';
import { CommentsModule } from './comments.module';
import { MembersModule } from './members.module';
import { BlogSettingsModule } from './settings.module';
import { ProfileModule } from './profile.module';
import { MediasModule } from './medias.module';

export const BlogModule = new Module('blog', {
    configs: [BlogConfig],
    submodules: [
        AuthorsModule,
        PostsModule,
        CategoriesModule,
        CommentsModule,
        MembersModule,
        BlogSettingsModule,
        ProfileModule,
        MediasModule
    ]
});
