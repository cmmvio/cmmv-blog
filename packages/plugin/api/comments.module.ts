import { Module } from '@cmmv/core';

import {
    CommentsContract,
    CommentsLikesContract
} from '../contracts';

export const CommentsModule = new Module('blog_comments', {
    contracts: [
        CommentsContract,
        CommentsLikesContract
    ],
});
