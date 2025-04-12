import { Module } from '@cmmv/core';

import {
    CommentsContract,
    CommentsLikesContract
} from '../../contracts';

import {
    CommentsAdminController,
    CommentsPublicController
} from './comments.controller';

import {
    CommentsPublicService
} from './comments.service';

export const CommentsModule = new Module('blog_comments', {
    contracts: [
        CommentsContract,
        CommentsLikesContract
    ],
    controllers: [
        CommentsAdminController,
        CommentsPublicController
    ],
    providers: [CommentsPublicService]
});
