import { Module } from '@cmmv/core';

import { BlogConfig } from "./blog.config";
import { PostsModule } from './posts.module';

export const BlogModule = new Module('blog', {
    configs: [BlogConfig],
    submodules: [PostsModule]
});
