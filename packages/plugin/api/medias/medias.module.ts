import { Module } from '@cmmv/core';

import {
    MediasContract
} from '../../contracts';

import {
    MediasService
} from './medias.service';

import {
    MediasController
} from './medias.controller';

export const MediasModule = new Module('blog_medias_public', {
    contracts: [MediasContract],
    providers: [MediasService],
    controllers: [MediasController]
});
