import { Module } from '@cmmv/core';

import { BlogConfig } from "./blog.config";
import { AuthorsModule } from './authors/authors.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.modules';
import { CommentsModule } from './comments/comments.module';
import { MembersModule } from './members/members.module';
import { BlogSettingsModule } from './settings/settings.module';
import { ProfileModule } from './profile/profile.module';
import { MediasModule } from './medias/medias.module';
import { SitemapModule } from './sitemap/sitemap.module';

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
        MediasModule,
        SitemapModule
    ]
});
