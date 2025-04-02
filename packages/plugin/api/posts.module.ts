import { Module } from '@cmmv/core';

import {
    PostsContract,
    PostsHistoryContract,
    PostsMetaContract,
    PostsTagsContract
} from '../contracts';

import { PostsController } from "./posts.controller";

export const PostsModule = new Module('blog_posts', {
    providers: [PostsController],
    contracts: [
        PostsContract,
        PostsHistoryContract,
        PostsMetaContract,
        PostsTagsContract
    ]
});
