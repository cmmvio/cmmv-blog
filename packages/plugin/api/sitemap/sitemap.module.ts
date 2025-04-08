import { Module } from '@cmmv/core';

import { SitemapController } from "./sitemap.controller";
import { SitemapService } from "./sitemap.service";

export const SitemapModule = new Module('sitemap', {
    controllers: [SitemapController],
    providers: [SitemapService]
});
