import { Module } from '@cmmv/core';

import { PostsContract } from '../contracts';
import { PostsController } from "./posts.controller";

export const PostsModule = new Module('blog_posts', {
    configs: [],
    providers: [PostsController],
    contracts: [PostsContract],
});
