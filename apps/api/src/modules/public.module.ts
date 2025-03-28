import { Module } from '@cmmv/core';

import { PostsController } from '../controllers/posts.controller';

export const ApiPublicModule = new Module('blog_public', {
    controllers: [PostsController],
});
