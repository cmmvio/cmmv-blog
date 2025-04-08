import {
    Get, Controller,
    ContentType, Raw,
    CacheControl
} from "@cmmv/http";

import {
    SitemapService
} from "./sitemap.service";

@Controller()
export class SitemapController {
    constructor(private readonly sitemapService: SitemapService) {}

    @Get('sitemap')
    @ContentType('text/xml')
    @CacheControl({ maxAge: 2592000, public: true })
    async getSitemapHandler() {
        return this.getSitemap();
    }

    @Get('sitemap.xml')
    @ContentType('text/xml')
    @CacheControl({ maxAge: 86400, public: true })
    async getSitemap() {
        return this.sitemapService.generateSitemapIndex();
    }

    @Get('post-sitemap.xml')
    @ContentType('text/xml')
    @CacheControl({ maxAge: 86400, public: true })
    async getSitemapIndex() {
        return this.sitemapService.getPostSitemap();
    }

    @Get('page-sitemap.xml')
    @ContentType('text/xml')
    @CacheControl({ maxAge: 86400, public: true })
    async getPageSitemap() {
        return this.sitemapService.getPostSitemap("page");
    }

    @Get('category-sitemap.xml')
    @ContentType('text/xml')
    @CacheControl({ maxAge: 86400, public: true })
    async getCategorySitemap() {
        return this.sitemapService.getCategorySitemap();
    }

    @Get('tag-sitemap.xml')
    @ContentType('text/xml')
    @CacheControl({ maxAge: 86400, public: true })
    async getTagSitemap() {
        return this.sitemapService.getTagsSitemap();
    }
}
