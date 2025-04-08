import { Module } from '@cmmv/core';

import {
    PostsContract,
    PostsHistoryContract,
    PostsMetaContract,
    PostsTagsContract
} from '../../contracts';

import { PostsController } from "./posts.controller";
import { PostsPublicService } from "./posts.service";

export const PostsModule = new Module('blog_posts', {
    controllers: [PostsController],
    providers: [PostsPublicService],
    contracts: [
        PostsContract,
        PostsHistoryContract,
        PostsMetaContract,
        PostsTagsContract
    ]
});
