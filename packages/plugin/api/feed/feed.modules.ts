import { Module } from '@cmmv/core';

import { FeedController } from './feed.controller';
import { FeedService } from "./feed.service";

export const FeedModule = new Module('blog_feed', {
    controllers: [FeedController],
    providers: [FeedService]
});
