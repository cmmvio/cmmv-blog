import { Module } from '@cmmv/core';

import { PostsContract } from '../contracts';

export const PostsModule = new Module('blog_posts', {
    configs: [],
    providers: [],
    contracts: [PostsContract],
});
